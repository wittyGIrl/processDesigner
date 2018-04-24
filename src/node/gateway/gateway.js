/**
 * @fileOverview
 *
 * 网关
 */
define(function (require, exports, module) {
  var kity = require('../../core/kity');
  var utils = require('../../core/utils');

  var Designer = require('../../core/designer');
  var OutlineManager = require('../../core/outline');

  var Renderer = require('../../core/render');

  var GatewayShape = kity.createClass('GatewayShape', {
    base: OutlineManager,
    create: function (node) {
      var rect = new kity.Path().pipe(function () {
        this.stroke(
          node.getStyle('normal-stroke'),
          node.getStyle('stroke-width')
        );
        this.fill(node.getStyle('background'));
      });

      rect.setId(utils.uuid('gateway'));
      this._node = node;
      return this._outlineShape = rect;
    },
    doUpdate: function (outline, node, box) {
      var midX = (2 * box.x + box.width) / 2;
      var midY = (2 * box.y + box.height) / 2;
      outline.getDrawer().clear()
        .moveTo(midX, box.y)
        .lineTo(box.x + box.width, midY)
        .lineTo(midX, box.y + box.height)
        .lineTo(box.x, midY)
        .lineTo(midX, box.y);

      return box;
    }
  });

  Designer.registerOutline('gateway', GatewayShape);

  var attributes = require('../mixins/attributes');
  var displayName = require('../mixins/displayName');

  GatewayShape.getProperty = function (designer) {
    return {
      "name": "gateway",
      "attributes": attributes.get(),
      "children": [{
        "name": "extensionElements",
        "children": [
          displayName.get(designer)
        ]
      }]
    };
  };
});
