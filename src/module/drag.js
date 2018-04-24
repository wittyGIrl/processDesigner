/**
 * @fileOverview
 *
 * 定义拖拽模块
 *
 */
define(function (require, exports, module) {
  var kity = require('../core/kity');
  var utils = require('../core/utils');

  var Designer = require('../core/designer');
  var Module = require('../core/module');
  var Command = require('../core/command');

  function setOffset(designer, nodes, movement){
    nodes.forEach(function(source){
      source.setLayoutOffset(source.getLayoutOffset().offset(movement));
      designer.applyLayoutResult(source);

      source.preTraverse(function(node){
        node.updateLine();
      });
    });
    //线的位置会改变。需要隐藏选中线的locker
    if(designer.getSelectedLine()){
      designer.removeAllSelectedLines();
    }
  }

  //for redo undo
  var DragNodeCommand = kity.createClass('DragNodeCommand', {
    base: Command,
    execute: function (designer, nodes, startPos, endPos) {
      if (this._nodes) {
        setOffset(designer, this._nodes, kity.Vector.fromPoints(this._startPos, this._endPos));
        return this._state = Command.STATE_ACTIVE;
      }

      this._nodes = nodes;
      this._startPos = startPos;
      this._endPos = endPos;
      this._designer = designer;
      this._state = Command.STATE_ACTIVE;
    },

    //撤销
    unexecute: function () {
      setOffset(this._designer, this._nodes, kity.Vector.fromPoints(this._endPos, this._startPos));
      this._state = Command.STATE_NORMAL;
    },

    queryState: function (designer) {
      return this._state;
    }
  });

  var Dragger = kity.createClass('Dragger', {
    constructor: function (designer) {
      this._designer = designer;
    },
    /*
    * @param enterDragMode 是否立即进入拖拽模式
    */
    dragStart: function (pos, sources, enterDragMode) {
      if(sources){
        this._notNode = true;
        if(!utils.isArray(sources)){
          sources = [sources];
        }
        this._dragSources = sources;
      }
      if(enterDragMode){
        this._enterDragMode();
      }
      this._startPos = pos;
    },
    dragMove: function (pos, setPosition) {
      if (!this._startPos) return;
      setPosition = setPosition || this._setPosition;

      //最小启动拖拽模式的距离
      var DRAG_MOVE_THRESHOLD = 10;

      var movement = kity.Vector.fromPoints(this._dragPos || this._startPos, pos);

      this._dragPos = pos;

      if (!this._dragMode) {
        // 判断拖放模式是否该启动
        if (kity.Vector.fromPoints(this._dragPos, this._startPos).length() <
          DRAG_MOVE_THRESHOLD) {
          return;
        }
        if (!this._enterDragMode()) {
          return;
        }
      }

      this._dragSources.forEach(function(source){
        setPosition.call(this, source, movement);
      }, this);
    },
    dragEnd: function () {
      if (!this._dragMode) {
        utils.reset(this, ['_startPos','_dragPos']);
        return;
      }

      var sources = this._dragSources;
      if(this._notNode !== true){
        this._designer.executeCommand('DragNode', sources, this._startPos, this._dragPos);
      }

      this._designer.setStatus('normal');

      utils.reset(this, ['_startPos', '_dragPos', '_dragSources', '_dragMode']);

      if(this._notNode === true) return;

      // var matrix;
      // sources.forEach(function(source){
      //   matrix = source.getLayoutOffset();
      //   // 将当前的 offset 存储到 data 中
      //   source.setX(matrix.x).setY(matrix.y);
      // });

      this._designer.fire('viewchange');
    },

    isDragging: function(){
      return this._dragMode;
    },

    _enterDragMode: function () {
      if(utils.isNil(this._dragSources)){
        this._dragSources = this._designer.getSelectedNodes().filter(function(node){
          return node.isRoot();
        });
      }
      if (this._dragSources.length === 0) {
        utils.reset(this, ['_startPos','_dragPos', '_dragSources']);
        return false;
      }
      this._dragMode = true;
      this._designer.setStatus('dragnode');
      return true;
    },
    _setPosition: function(target, movement){
      target.move(movement);
      target.updateLine();
    }
  });

  Module.register('DragNode', function () {
    var dragger;

    return {
      init: function () {
        dragger = new Dragger(this);
        this._nodeDragger = dragger;
        window.addEventListener('mouseup', function () {
          dragger.dragEnd();
        });
      },
      commands: {
        'DragNode': DragNodeCommand
      },
      events: {
        'normal.mousedown': function (e) {
          if (e.originEvent.button) return;
          //画线时不进入拖拽模式
          var node = e.getTargetNode();
          // 只能拖拽根节点
          if (node && node.isRoot()) {
            var targetShape = e.kityEvent && e.kityEvent.targetShape;
            if (targetShape && targetShape.getId && ~targetShape.getId()
              .indexOf('lpoint')) {
              return;
            }

            dragger.dragStart(e.getPosition().round());
          }
        },
        'normal.mousemove dragnode.mousemove': function (e) {
          dragger.dragMove(e.getPosition().round());
        },
        'normal.mouseup dragnode.premouseup': function (e) {
          dragger.dragEnd();
          //e.stopPropagation();
          e.preventDefault();
        }
      }
    };
  });

  module.exports = Dragger;
});
