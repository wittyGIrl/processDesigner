/**
 * @fileOverview
 *
 * 定义布局类
 */
define(function(require, exports, module) {
  var kity = require('./kity');
  var utils = require('./utils');
  var Designer = require('./designer');
  var DesignerNode = require('./node');
  var DesignerEvent = require('./event');

  var _layouts = {};
  var _defaultLayout;

  function register(name, layout) {
    _layouts[name] = layout;
    _defaultLayout = _defaultLayout || name;
  }

  var Layout = kity.createClass('Layout', {
    doLayout: function(parent, children) {
      throw new Error('Not Implement: Layout.doLayout');
    },
    /**
     * 对一组节点沿某个方向进行对齐
     *
     * @param {Array<DesignerNode>} nodes 节点数组
     * @param {String}{'left'|'right'|'top'|'bottom'} border 对齐方向
     * @param {Number} offset 偏移量
     */
    align: function(nodes, border, offset) {
      var me = this;
      offset = offset || 0;
      nodes.forEach(function(node) {
        var treeBox = me.getTreeBox([node]);
        var matrix = node.getLayoutTransform();
        switch (border) {
          case 'left':
            return matrix.translate(offset - treeBox.left, 0);
          case 'right':
            return matrix.translate(offset - treeBox.right, 0);
          case 'top':
            return matrix.translate(0, offset - treeBox.top);
          case 'bottom':
            return matrix.translate(0, offset - treeBox.bottom);
        }
      });
    },
    /**
     *
     * 把一组节点堆叠成一列或者一行
     * @param {Array<DesignerNode>} nodes 节点数组
     * @param {String}{'x'|'y'} axis 堆叠方向
     * @param {Function} distance 计算当前节点与下一节点的间距
     *
     * @return
     */
    stack: function(nodes, axis, defaultOffset, distance) {
      if (!nodes || nodes.length === 0) return;
      var me = this;
      var position = 0;
      defaultOffset = defaultOffset || {x: 0, y: 0};
      distance = distance || function(node, next, axis) {
        return node.getStyle({
            x: 'margin-right',
            y: 'margin-bottom'
          }[axis]) + next.getStyle({
            x: 'margin-left',
            y: 'margin-top'
          }[axis]);
      };

      nodes.forEach(function(node, index, nodes) {
        var tbox = me.getTreeBox([node]);
        var size = {x: tbox.width, y: tbox.height}[axis];
        var offset = {x: tbox.left, y: tbox.top}[axis];

        if (axis === 'x') {
          node.setLayoutOffset({
            x: position - offset + defaultOffset.x,
            y: 0 + defaultOffset.y
          });
        } else {
          node.setLayoutOffset({
            x: 0 + defaultOffset.x,
            y: position - offset + defaultOffset.y
          });
        }

        position += size;
        if (nodes[index + 1]) {
          position += distance(node, nodes[index + 1], axis);
        }
      });
      return position;
    },

    move: function(nodes, dx, dy) {
      nodes.forEach(function(node) {
        node.getLayoutTransform().translate(dx, dy);
      });
    },

    getBranchBox: function(nodes) {
      var box = new kity.Box();
      var i,
        l,
        node;
      //不能用forEach,防止异步陷阱
      for (i = 0, l = nodes.length; i < l; i++) {
        node = nodes[i];
        box = box.merge(node.getLayoutTransform().transformBox(node.getContentBox()));
      }
      return box;
    },

    getTreeBox: function(nodes) {

      var i,
        node,
        matrix,
        treeBox;

      var box = new kity.Box();

      if (!(nodes instanceof Array))
        nodes = [nodes];

      for (i = 0; i < nodes.length; i++) {
        node = nodes[i];
        matrix = node.getLayoutTransform();

        treeBox = node.getContentBox();
        // node.isExpanded() &&
        if (node.children.length) {
          treeBox = treeBox.merge(this.getTreeBox(node.children));
        }

        box = box.merge(matrix.transformBox(treeBox));
      }

      return box;
    },

    getOrderHint: function(node) {
      return [];
    }
  });

  Layout.register = register;

  Designer.registerInitHook(function() {
    this.refresh();
  });

  utils.extend(Designer, {
    getLayoutList: function() {
      return _layouts;
    },

    getLayoutInstance: function(name) {
      var LayoutClass = _layouts[name];
      if (!LayoutClass) {
        throw new Error('Missing Layout: ' + name);
      }
      return new LayoutClass();
    },
  });

  kity.extendClass(DesignerNode, {
    getLayout: function() {
      var layout = this.getData('layout');
      layout = layout || (
      this.isRoot() ? _defaultLayout : this.parent.getLayout()
      );
      return layout || 'default';
    },

    setLayout: function(name) {
      if (name) {
        if (name === 'inherit') {
          this.setData('layout');
        } else {
          this.setData('layout', name);
        }
      }
      return this;
    },

    layout: function(offset) {
      var layout = Designer.getLayoutInstance(this.getLayout());
      layout.doLayout(this, offset);
      this.getDesigner().applyLayoutResult(this);
      return this;
    },

    getLayoutInstance: function() {
      return Designer.getLayoutInstance(this.getLayout());
    },

    getLayoutTransform: function() {
      if (this._layoutTransform) {
        return this._layoutTransform;
      }
      return this._layoutTransform = new kity.Matrix();
    },

    //预览
    getGlobalLayoutTransformPreview: function() {
      var pMatrix = this.parent ? this.parent.getGlobalLayoutTransformPreview().clone() : new kity.Matrix();
      var matrix = this.getLayoutTransform();
      var offset = this.getLayoutOffset();
      if (offset) {
        matrix = matrix.clone().translate(offset.x, offset.y);
      }
      return pMatrix.merge(matrix);
    },

    getLayoutPointPreview: function() {
      return this.getGlobalLayoutTransformPreview().transformPoint(new kity.Point());
    },

    getGlobalLayoutTransform: function() {
      if (this._globalLayoutTransform) {
        return this._globalLayoutTransform;
      } else if (this.parent) {
        return this.parent.getGlobalLayoutTransform();
      } else {
        return new kity.Matrix();
      }
    },

    setLayoutTransform: function(matrix) {
      this._layoutTransform = matrix;
      return this;
    },
    /**
     * Group.setMatrix真正修改transform属性
     * _layoutTransform是相对于父节点的tranform
     * _globalLayoutTransform是相对于Paper的transform
     *
     * 每次计算的时候只修改当前节点的_layoutTransform，
     * 但是在Group.setMatrix的时候需要的是相对于Paper的transform。
     * 所以要找到任意一个节点的相对于Paper的transform，
     * 需要递归将各个祖先节点的_layoutTransform合并。
     */
    setGlobalLayoutTransform: function(matrix) {
      this.getRenderContainer().setMatrix(this._globalLayoutTransform = matrix);
    },

    getLayoutBox: function() {
      var matrix = this.getGlobalLayoutTransform();
      return matrix.transformBox(this.getContentBox());
    },

    getLayoutPoint: function() {
      var matrix = this.getGlobalLayoutTransform();
      return matrix.transformPoint(new kity.Point());
    },

    getLayoutOffset: function() {
      //if (!this.parent) return new kity.Point();
      var layout = this.parent ? this.parent.getLayout() : this.getLayout();
      // 影响当前节点位置的是父节点的布局
      var data = this.getData('layout_' + layout + '_offset');

      if (data) return new kity.Point(data.x, data.y);

      return new kity.Point();
    },

    setLayoutOffset: function(p) {
      // if (!this.parent) return this;
      var layout = this.parent ? this.parent.getLayout() : this.getLayout();

      this.setData('layout_' + layout + '_offset', p ? {
        x: p.x,
        y: p.y
      } : undefined);

      return this;
    },

    hasLayoutOffset: function() {
      var layout = this.parent ? this.parent.getLayout() : this.getLayout();
      return !!this.getData('layout_' + layout + '_offset');
    },

    resetLayoutOffset: function() {
      return this.setLayoutOffset(null);
    },

    getLayoutRoot: function() {
      if (this.isLayoutRoot()) {
        return this;
      }
      return this.parent.getLayoutRoot();
    },

    isLayoutRoot: function() {
      return this.getData('layout') || this.isRoot();
    },

    move: function(x, y){
      if(!utils.isNumber(x)){
        y = x.y;
        x = x.x;
      }
      this.setLayoutOffset(this.getLayoutOffset().offset(x, y));
      this.getDesigner().applyLayoutResult(this);
    },
  });

  kity.extendClass(Designer, {
    /**
     *
     * @method align()
     * @param nodes {Array<DesignerNode>}
     * @param axis {String} 开始点的发出方向
     * @param offset {Point}
     * @for Designer
     * @description
     *   对齐：
     *       竖直方向的对齐：因为不同的node，paddingLeft是不同的。
     *           如果单纯只是把node的offset.x设置成统一值，
     *           那么这些node的图形中心并没有对齐。
     *           因为offset一样的时候，真正对齐的是node不包含padding的矩形，
     *           而且是左对齐。
     *
     *       关于node图形的说明，详见 doc/contentBox.png
     *          黄色矩形：不包含padding区域
     *          最大的矩形：包含padding的区域，即node._contentBox
     *          蓝色的圆形：当边线为圆形，node图形的显示。
     *              因为不论节点的边线是什么形状，
     *              node.contentBox都是始终为矩形。
     *              边线是根据node.contentBox来进行绘制。
    */
    align: function(nodes, axis, offset) {
      if (!nodes || nodes.length === 0) return;
      var nodeOffset,
        contentBox;
      var modelBox = nodes[0].getContentBox();
      var modelPaddingLeft = nodes[0].getStyle('padding-left') || 0;
      nodes.forEach(function(node, i) {
        var paddingLeft = node.getStyle('padding-left') || 0;
        nodeOffset = node.getLayoutOffset();
        if (axis === 'x' && i !== 0) {
          contentBox = node.getContentBox();
          nodeOffset[axis] = offset - (contentBox.width / 2 - paddingLeft - (modelBox.width / 2 - modelPaddingLeft));
        } else {
          nodeOffset[axis] = offset;
        }
        node.setLayoutOffset(nodeOffset);
      });
      this.applyLayoutResult(nodes);
      var designer = this;
      nodes.forEach(function(node) {
        designer.updateLine(node);
      });
    },
    layout: function() {
      var roots = this.getRoots();
      if (roots.length === 0) return;

      var layout = Designer.getLayoutInstance('default');
      roots.forEach(function(root) {
        layout.doLayout(root);
      });

      var designer = this;
      this.applyLayoutResult(roots, 0);
      this.fire('layoutallfinish');
      return this.fire('layout');
    },
    refresh: function() {
      var roots = this.getRoots();
      if (roots.length > 0) {
        this.getRoots().forEach(function(root) {
          root.render();
        });
        this.applyLayoutResult(roots).updateAllLines().fire('contentchange')._interactChange();
      }
      return this;
    },

    //真正变换位置的函数
    applyLayoutResult: function(roots, duration, callback) {
      roots = roots || this.getRoots();
      var me = this;
      if (!roots.length) {
        roots = [roots];
      }
      var root;
      for (var i = 0, l = roots.length; i < l; i++) {
        root = roots[i];
        //获取子树中节点的数量
        var complex = root.getComplex();

        // 节点复杂度大于 100，关闭动画
        if (complex > 200)
          duration = 0;
        apply(root, root.parent ? root.parent.getGlobalLayoutTransform() : new kity.Matrix());
      }

      return this;

      function consume() {
        if (!--complex) {
          if (callback) {
            callback();
          }
        }
      }

      function applyMatrix(node, matrix) {
        node.setGlobalLayoutTransform(matrix);

        me.fire('layoutapply', {
          node: node,
          matrix: matrix
        });
      }

      function apply(node, pMatrix) {
        var matrix = node.getLayoutTransform().merge(pMatrix.clone());
        //var lastMatrix = node.getGlobalLayoutTransform() || new kity.Matrix();

        var offset = node.getLayoutOffset();
        matrix.translate(offset.x, offset.y);

        matrix.m.e = Math.round(matrix.m.e);
        matrix.m.f = Math.round(matrix.m.f);

        applyMatrix(node, matrix);
        me.fire('layoutfinish', {
          node: node,
          matrix: matrix
        });
        consume();

        for (var i = 0; i < node.children.length; i++) {
          apply(node.children[i], matrix);
        }
      }
    }
  });

  module.exports = Layout;
});
