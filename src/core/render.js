/**
 * @fileOverview
 *
 * 定义Renderer类
 */
define(function(require, exports, module) {
  var kity = require('./kity');
  var utils = require('./utils');
  var Designer = require('./designer');
  var DesignerNode = require('./node');

  var Renderer = kity.createClass('Renderer', {
    constructor: function(node) {
      this.node = node;
    },
    create: function() {
      throw new Error('Not Implement:Renderer.create');
    },
    shouldRender: function() {
      return true;
    },
    watchChange: function(data) {
      var changed = false;
      if (this.watchingData === undefined || this.watchingData === data) {
        changed = true;
      } else {
        changed = false;
      }
      this.watchingData = data;
      return changed;
    },
    shouldDraw: function(node) {
      return true;
    },
    update: function(shape, node, box) {
      if (this.shouldDraw()) {
        this.draw(shape, node);
      }
      return this.place(shape, node, box);
    },
    draw: function(shape, node) {
      throw new Error('Not Implement:Renderer.draw');
    },
    place: function(shape, node, box) {
      throw new Error('Not Implement:Renderer.place');
    },
    getRenderShape: function() {
      return this._renderShape || null;
    },
    setRenderShape: function(shape) {
      this._renderShape = shape;
    }
  });

  function createDesignerExtention() {
    function createRenderers(node, registered, types) {
      var renderers = [];

      types.forEach(function(section) {
        var before = 'before' + section;
        var after = 'after' + section;

        if (registered[before]) {
          renderers = renderers.concat(registered[before]);
        } else if (registered[section]) {
          renderers = renderers.concat(registered[section]);
        } else if (registered[after]) {
          renderers = renderers.concat(registered[after]);
        }
      });

      return renderers.map(function(Renderer) {
        return new Renderer(node);
      });
    }

    function applyRenderers(node, renderers){
      if(!renderers || renderers.length === 0) return;
      var latestBox;
      renderers.forEach(function(renderer) {
        if (renderer.shouldRender(node)) {
          if (!renderer.getRenderShape()) {
            renderer.setRenderShape(renderer.create(node));
            if (renderer.bringToBack) {
              node.getRenderContainer().prependShape(renderer.getRenderShape());
            } else {
              node.getRenderContainer().appendShape(renderer.getRenderShape());
            }
          }

          renderer.getRenderShape().setVisible(true);

          latestBox = renderer.update(renderer.getRenderShape(), node, node._contentBox);
          if (typeof latestBox === 'function') {
            latestBox = latestBox();
          }
          //合并渲染区域 记录渲染区域的位置和大小
          if (latestBox) {
            node._contentBox = node._contentBox.merge(latestBox);
            renderer.contentBox = latestBox;
          }
        }
        //不应该渲染，但是渲染图形已经创建，则将其隐藏。
        else if (renderer.getRenderShape()) {
          renderer.getRenderShape().setVisible(false);
        }
      });
    }
    function renderNode(node, rendererClasses) {
      var latestBox;

      if (!node._centerRenderers) {
        node._centerRenderers = createRenderers(node, rendererClasses, ['center', 'left', 'top', 'right', 'bottom']);
        node._otherRenderers = createRenderers(node, rendererClasses, ['outline', 'outside']);
      }

      node._contentBox = new kity.Box();
      applyRenderers(node, node._centerRenderers);
      if(node.hasChildren()){
        var maxHeight = 0;
        node.children.forEach(function(child){
          renderNode(child, rendererClasses);
          if(maxHeight < child._contentBox.height){
            maxHeight = child._contentBox.height;
          }
        });
        var offset, childBox;
        maxHeight /= 2;
        node.layout({x: 0, y: maxHeight + node._contentBox.bottom});
        node.children.forEach(function(child){
          childBox = child.getContentBox();
          offset = child.getLayoutOffset();
          node._contentBox = node._contentBox.merge(
            new kity.Box(
              childBox.x + offset.x,
              node._contentBox.y,
              childBox.width,
              node._contentBox.height
            )
          );
        });
        node._contentBox = node._contentBox.expand(0, 0, maxHeight - node.getStyle('padding-bottom'), 0);
      }
      applyRenderers(node, node._otherRenderers);
      node._contentBox = node._contentBox.expand(
        node.getStyle('margin-top'),
        node.getStyle('margin-right'),
        node.getStyle('margin-bottom'),
        node.getStyle('margin-left')
      );
      return node._contentBox;
    }
    return {
      renderNodeBatch: function(nodes) {
        if(!nodes || nodes.length === 0) return;
        var me = this;
        nodes.forEach(function(node){
          me.renderNode(node, me._rendererClasses);
        });
      },

      renderNode: function(node){
        renderNode(node, this._rendererClasses);
        this.fire('noderender', {node: node});
        return node._contentBox;
      }
    };
  }

  kity.extendClass(Designer, createDesignerExtention());

  kity.extendClass(DesignerNode, {
    render: function() {
      //if (!this.attached) return;
      if(this.parent){
        this.parent.render();
      } else {
        this.getDesigner().renderNode(this);
      }
      return this;
    },
    renderTree: function() {
      //if (!this.attached) return;
      var list = [];
      this.traverse(function(node) {
        list.push(node);
      });
      this.getDesigner().renderNodeBatch(list);
      return this;
    },
    getRenderer: function(type) {
      var center = this._renderers;
      var i;
      if (center){
        for (i = 0; i < center.length; i++) {
          if (center[i].getType() === type) return center[i];
        }
      }
      var other = this._otherRenderers;
      if(other){
        for (i = 0; i < other.length; i++) {
          if (other[i].getType() === type) return other[i];
        }
      }
      return null;
    },
    getContentBox: function() {
      //if (!this._contentBox) this.render();&& this.parent.isCollapsed()
      return this._contentBox || new kity.Box();
    },
    getRenderBox: function(rendererType, refer) {
      var renderer = rendererType && this.getRenderer(rendererType);
      var contentBox = renderer ? renderer.contentBox : this.getContentBox();
      var ctm = kity.Matrix.getCTM(this.getRenderContainer(), refer || 'paper');
      return ctm.transformBox(contentBox);
    }
  });

  module.exports = Renderer;
});
