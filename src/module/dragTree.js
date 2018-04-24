define(function(require, exports, module) {
  var kity = require('../core/kity');
  var utils = require('../core/utils');
  var DesignerNode = require('../core/node');
  var Command = require('../core/command');
  var Module = require('../core/module');

  //for redo undo
  var MoveToParentCommand = kity.createClass('MoveToParentCommand', {
    base: Command,
    execute: function (designer, nodes, parent) {
      // redo
      if (this._nodes) {
        parent = this._parent;
        nodes = this._nodes;
      } else {
        var parents = [];
        nodes.forEach(function(node){
          parents.push(node.parent);
        });
        this._parents = parents;
      }
      nodes.forEach(function(node){
        if (node.parent) {
          node.parent.removeChild(node).render().updateLine();
          parent.appendChild(node).render().updateLine();
          node.getRenderContainer().bringTop();
        }
      });
      designer.fire('viewchange');
      // designer.select(nodes, true);

      this._nodes = nodes;
      this._parent = parent;
      this._designer = designer;
      this._state = Command.STATE_ACTIVE;
    },

    // undo
    unexecute: function () {
      var parents = this._parents;
      var parent;
      this._nodes.forEach(function(node, i){
        parent = parents[i];
        if (parent) {
          node.parent.removeChild(node).render().updateLine();
          parent.appendChild(node).render().updateLine();
        }
      });
      this._state = Command.STATE_NORMAL;
      this._designer.fire('viewchange');
    },

    queryState: function (designer) {
      return this._state;
    }
  });

  var DropHinter = kity.createClass('DropHinter', {
    base: kity.Group,

    constructor: function() {
      this.callBase();
      this._shape = new kity.Path();
      this.addShape(this._shape);
    },

    render: function(target) {
      this.setVisible(!!target);
      if (target) {
        var outline = target.getRenderer('OutlineRenderer');

        if(outline){
          var outlineShape = outline.getRenderShape();
          if(outlineShape.getType() === 'Group'){
            outlineShape = outlineShape.getFirstItem();
          }
          this._shape
            .setTranslate(target.getLayoutOffset())
            .setPathData(outlineShape.getPathData())
            .stroke(
              target.getStyle('drop-hint-color') || 'yellow',
              target.getStyle('drop-hint-width') || 2
            );
          this.bringTop();
        }
      }
    }
  });
  //
  // var OrderHinter = kity.createClass('OrderHinter', {
  //   base: kity.Group,
  //
  //   constructor: function() {
  //     this.callBase();
  //     this.area = new kity.Rect();
  //     this.path = new kity.Path();
  //     this.addShapes([this.area, this.path]);
  //   },
  //
  //   render: function(hint) {
  //     this.setVisible(!!hint);
  //     if (hint) {
  //       this.area.setBox(hint.area);
  //       this.area.fill(hint.node.getStyle('order-hint-area-color') ||
  //         'rgba(0, 255, 0, .5)');
  //       this.path.setPathData(hint.path);
  //       this.path.stroke(
  //         hint.node.getStyle('order-hint-path-color') || '#0f0',
  //         hint.node.getStyle('order-hint-path-width') || 1);
  //     }
  //   }
  // });

  // 对拖动对象的一个替代盒子，控制整个拖放的逻辑，包括：
  //    1. 从节点列表计算出拖动部分
  //    2. 计算可以 drop 的节点，产生 drop 交互提示
  var TreeDragger = kity.createClass('TreeDragger', {

    constructor: function(designer) {
      this._designer = designer;
      this._dropHinter = new DropHinter();
      // this._orderHinter = new OrderHinter();
      designer.getRenderContainer().addShape(this._dropHinter);
    },

    dragStart: function(position, sources, enterDragMode) {
      if(sources){
        this._notNode = true;
        if(!utils.isArray(sources)){
          sources = [sources];
        }
        this._dragSources = sources;
      } else {
        this._notNode = false;
      }
      if(enterDragMode){
        this._enterDragMode();
      }
      // 这个位置同时是拖放范围收缩时的焦点位置（中心）
      this._startPosition = position;
    },

    dragMove: function(position, setPosition) {
      if (!this._startPosition) return;
      setPosition = setPosition || this._setPosition;

      // 启动拖放模式需要最小的移动距离
      var DRAG_MOVE_THRESHOLD = 10;

      var movement = kity.Vector.fromPoints(this._dragPosition || this._startPosition, position);

      this._dragPosition = position;

      if (!this._dragMode) {
        // 判断拖放模式是否该启动
        if (kity.Vector.fromPoints(this._dragPosition, this._startPosition).length() < DRAG_MOVE_THRESHOLD) {
          return;
        }
        if (!this._enterDragMode()) {
          return;
        }
      }

      this._dragSources.forEach(function(source){
        setPosition.call(this, source, movement);
      }, this);

      this._dropTest();
    },

    dragEnd: function(pos) {
      if (!this._dragMode) {
        utils.reset(this, ['_startPosition','_dragPosition']);
        return;
      }

      // this._fadeDragSources(1);

      var sources = this._dragSources;
      if(this._notNode !== true){
        if(this._dropSucceedTarget){
          this._designer.executeCommand('MoveToParent', sources, this._dropSucceedTarget);
        } else {
          sources.forEach(function(source, i){
            source.setLayoutOffset(this._originOffsets[i]);
            this._designer.applyLayoutResult(source).updateLine(source);
          }, this);
        }
      }

      this._designer.setStatus('normal');

      utils.reset(this, ['_startPosition', '_dragPosition', '_dragSources', '_dragMode', '_originOffsets']);
      this._renderDropHint(null);
      if(this._notNode === true) return this._dropSucceedTarget;

      this._designer.fire('viewchange');
    },

    // 进入拖放模式：
    //    1. 计算拖放源和允许的拖放目标
    //    2. 标记已启动
    _enterDragMode: function() {
      if(utils.isNil(this._dragSources)){
        this._calcDragSources();
      }
      if (!this._dragSources.length) {
        utils.reset(this, ['_startPosition','_dragPosition', '_dragSources']);
        return false;
      }
      if(this._notNode !== true){
        this._originOffsets = this._dragSources.map(function(source){
          return source.getLayoutOffset();
        });
        this._dragSources.forEach(function(source){
          source.getRenderContainer().bringTop();
        });
      }
      this._calcDropTargets();
      // this._calcOrderHints();
      this._dragMode = true;
      this._designer.setStatus('dragtree');
      return true;
    },

    // 从选中的节点计算拖放源
    //    并不是所有选中的节点都作为拖放源，如果选中节点中存在 A 和 B，
    //    并且 A 是 B 的祖先，则 B 不作为拖放源
    //
    //    计算过程：
    //       1. 将节点按照树高排序，排序后只可能是前面节点是后面节点的祖先
    //       2. 从后往前枚举排序的结果，如果发现枚举目标之前存在其祖先，
    //          则排除枚举目标作为拖放源，否则加入拖放源
    _calcDragSources: function() {
      this._dragSources = this._designer.getSelectedAncestors();
    },

    // 计算拖放目标可以释放的节点列表（释放意味着成为其子树），存在这条限制规则：
    //    - 不能拖放到拖放目标的子树上（允许拖放到自身，因为多选的情况下可以把其它节点加入）
    //
    //    1. 加入当前节点（初始为根节点）到允许列表
    //    2. 对于当前节点的每一个子节点：
    //       (1) 如果是拖放目标的其中一个节点，忽略（整棵子树被剪枝）
    //       (2) 如果不是拖放目标之一，以当前子节点为当前节点，回到 1 计算
    //    3. 返回允许列表
    //
    _calcDropTargets: function() {
      function findAvailableParents(roots) {
        var availables = [];
        roots.forEach(function(root) {
          if(root.getData('outlineType') === 'userTask'){
            availables.push(root);
          }
        });
        return availables;
      }

      this._dropTargets = findAvailableParents(this._designer.getRoots());
      this._dropTargetBoxes = this._dropTargets.map(function(source) {
        return source.getLayoutBox();
      });
    },

    _boxTest: function(targets, targetBoxMapper, judge) {
      var sourceBoxes;
      if(this._notNode === true){
        sourceBoxes = this._dragSources.map(function(source) {
          return source.getRenderBox();
        });
      } else {
        sourceBoxes = this._dragSources.map(function(source) {
          return source.getLayoutBox();
        });
      }

      var i, j, target, sourceBox, targetBox;

      judge = judge || function(intersectBox, sourceBox, targetBox) {
        return intersectBox && !intersectBox.isEmpty();
      };

      for (i = 0; i < targets.length; i++) {

        target = targets[i];
        targetBox = targetBoxMapper.call(this, target, i);

        for (j = 0; j < sourceBoxes.length; j++) {
          sourceBox = sourceBoxes[j];

          var intersectBox = sourceBox.intersect(targetBox);
          if (judge(intersectBox, sourceBox, targetBox)) {
            return target;
          }
        }
      }

      return null;
    },

    _dropTest: function() {
      this._dropSucceedTarget = this._boxTest(this._dropTargets,
        function(target, i) {
          return this._dropTargetBoxes[i];
        },
        // 相交的部分超过一半
        function(intersectBox, sourceBox, targetBox) {
          function area(box) {
            return box.width * box.height;
          }
          if (!intersectBox) return false;
          // 面积判断
          if (area(intersectBox) > 0.5 * Math.min(area(sourceBox),
              area(targetBox))) return true;
          if (intersectBox.width + 1 >= Math.min(sourceBox.width,
              targetBox.width)) return true;
          if (intersectBox.height + 1 >= Math.min(sourceBox.height,
              targetBox.height)) return true;
          return false;
        });
      this._renderDropHint(this._dropSucceedTarget);
      return !!this._dropSucceedTarget;
    },

    _renderDropHint: function(target) {
      this._dropHinter.render(target);
    },

    isDragging: function(){
      return this._dragMode;
    },

    _setPosition: function(target, movement){
      target.move(movement);
      target.updateLine();
    },
  });

  Module.register('DragTree', function() {
    var dragger;

    return {
      init: function() {
        dragger = new TreeDragger(this);
        window.addEventListener('mouseup', function() {
          dragger.dragEnd();
        });
      },
      events: {
        'normal.mousedown inputready.mousedown': function(e) {
          if (e.originEvent.button) return;
          var node = e.getTargetNode();
          // 只能拖拽非根节点
          if (node && !node.isRoot()) {
            // 画线时不进入拖拽模式
            var targetShape = e.kityEvent && e.kityEvent.targetShape;
            if (targetShape && targetShape.getId && ~targetShape.getId()
              .indexOf('lpoint')) {
              return;
            }
            dragger.dragStart(e.getPosition().round());
          }
        },
        'normal.mousemove dragtree.mousemove': function(e) {
          dragger.dragMove(e.getPosition().round());
        },
        'normal.mouseup dragtree.beforemouseup': function(e) {
          dragger.dragEnd();
          //e.stopPropagation();
          e.preventDefault();
        },
      },
      commands: {
        'MoveToParent': MoveToParentCommand
      }
    };
  });

  module.exports = TreeDragger;
});
