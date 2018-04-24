/**
 * @fileOverview
 *
 * 定义边线模块。负责处理节点的边线
 */
define(function(require, exports, module) {
  var kity = require('../core/kity');
  var utils = require('../core/utils');

  var Designer = require('../core/designer');
  var Renderer = require('../core/render');
  var Module = require('../core/module');

  var OutlineRenderer = kity.createClass('OutlineRenderer', {
    base: Renderer,

    create: function(node) {
      // var outline = new kity.Rect().setId(utils.uuid('node_outline'));
      this.bringToBack = true;
      return node.getOutlineManager().create(node);
    },
    update: function(outline, node, box) {
      var minWidth = 15;
      if(box.width < minWidth){
        box.width = minWidth;
      }
      box = box.expand(
        node.getStyle('padding-top'),
        node.getStyle('padding-right'),
        node.getStyle('padding-bottom'),
        node.getStyle('padding-left')
      );
      return node.getOutlineManager().update(outline, node, box);
    }
  });

  // var OutsideRenderer = kity.createClass('OutsideRenderer', {
  //   base: Renderer,
  //   create: function(node) {
  //     return new kity.Group();
  //   },
  //   update: function(shadow, node, box) {
  //     return box.expand(
  //       node.getStyle('margin-top'),
  //       node.getStyle('margin-right'),
  //       node.getStyle('margin-bottom'),
  //       node.getStyle('margin-left')
  //     );
  //   }
  // });

  Module.register('OutlineModule', function() {
    return {
      renderers: {
        outline: OutlineRenderer,
        // beforeoutside: OutsideRenderer
      }
    };
  });
});
