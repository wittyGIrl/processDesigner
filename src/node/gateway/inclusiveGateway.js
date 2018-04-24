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

  var InclusiveGatewayShape = kity.createClass('InclusiveGatewayShape', {
    base: OutlineManager,
    create: function (node) {
      var group = new kity.Group();
      var rect = new kity.Rect().pipe(function () {
        this.stroke(
          node.getStyle('normal-stroke'),
          node.getStyle('stroke-width')
        );
        this.fill(node.getStyle('background'));
      });
      //脚本的图形标志
      var sign = new kity.Circle().stroke(node.getStyle(
        'normal-stroke'), 3);
      group.addShape(rect);
      group.addShape(sign);
      rect.setId(utils.uuid('inclusiveGateway'));
      this._node = node;
      return this._outlineShape = group;
    },
    doUpdate: function (outlineGroup, node, box) {
      var shapes = outlineGroup.getShapes();
      var outline = shapes[0];
      var midX = (2 * box.x + box.width) / 2;
      var midY = (2 * box.y + box.height) / 2;
      outline.getDrawer().clear()
        .moveTo(midX, box.y)
        .lineTo(box.x + box.width, midY)
        .lineTo(midX, box.y + box.height)
        .lineTo(box.x, midY)
        .lineTo(midX, box.y);

      var sign = shapes[1];
      sign.setCenter(midX, midY);
      sign.setRadius(box.width / 4);

      return box;
    }
  });

  Designer.registerOutline('inclusiveGateway', InclusiveGatewayShape);

  var attributes = require('../mixins/attributes');

  InclusiveGatewayShape.getProperty = function (designer) {
    return {
      "name": "inclusiveGateway",
      "attributes": attributes
    };
  };
});
