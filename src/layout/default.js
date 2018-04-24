/**
 * @fileOverview
 *
 * 定义默认布局
 */
define(function(require, exports, module) {
  var kity = require('../core/kity');
  var Layout = require('../core/layout');

  var DefaultLayout = kity.createClass('DefaultLayout', {
    base: Layout,
    doLayout: function(node, offset) {
      if (!node.hasChildren()) return;
      this.stack(node.children, 'x', offset);
    }
  });

  Layout.register('default', DefaultLayout);
});
