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

  var ExclusiveGatewayShape = kity.createClass('ExclusiveGatewayShape', {
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
      //标志
      var sign = new kity.Path().stroke(node.getStyle('normal-stroke'), 4);
      group.addShape(rect);
      group.addShape(sign);
      rect.setId(utils.uuid('exclusiveGateway'));
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
      sign.getDrawer().clear()
        .moveTo(midX - box.width / 4, midY - box.height / 4)
        .lineTo(midX + box.width / 4, midY + box.height / 4)
        .moveTo(midX + box.width / 4, midY - box.height / 4)
        .lineTo(midX - box.width / 4, midY + box.height / 4);

      return box;
    }
  });

  Designer.registerOutline('exclusiveGateway', ExclusiveGatewayShape);

  var attributes = require('../mixins/attributes');
  var note = require('../mixins/note');

  ExclusiveGatewayShape.getProperty = function (designer) {
    return {
      "name": "exclusiveGateway",
      "attributes": [{
        "name": "id",
        "editor": {
          "type": "none"
        }
      }, {
        "name": 'name',
        "hidden": true
      }, {
        "name": 'offsetX',
        "hidden": true
      }, {
        "name": 'offsetY',
        "hidden": true
      }, {
        "name": 'transform',
        "hidden": true
      }, {
        "name": 'default',
        "hidden": true
      }],
      "children": [{
        "name": "extensionElements",
        "children": [note.get(designer)]
      }]
    };
  };
});
