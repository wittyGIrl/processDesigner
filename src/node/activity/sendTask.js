/**
 * @fileOverview
 *
 * 发送任务
 */
define(function (require, exports, module) {
  var kity = require('../../core/kity');
  var utils = require('../../core/utils');

  var Designer = require('../../core/designer');
  var OutlineManager = require('../../core/outline');

  var Renderer = require('../../core/render');

  var SendTaskShape = kity.createClass('SendTaskShape', {
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
      //图形标志
      var sign = new kity.Path().fill(node.getStyle('normal-stroke'));
      var line = new kity.Path().stroke(node.getStyle('background'), node.getStyle('stroke-width'));
      group.addShape(rect);
      group.addShape(sign);
      group.addShape(line);

      group.setId(utils.uuid('sendTask'));
      this._node = node;
      this._outlineShape = group;
      return this._outlineShape;
    },
    doUpdate: function (outlineGroup, node, box) {
      var shapes = outlineGroup.getShapes();
      var outline = shapes[0];
      outline.x = box.x;
      outline.y = box.y;
      outline.width = box.width;
      outline.height = box.height;
      outline.setRadius(5);

      var sign = shapes[1];
      var line = shapes[2];
      var x = box.x + 4;
      var y = box.y + 2;
      var space = 10;
      var right = x + 1.6 * space;
      var bottom = y + space;
      var middle = y + space / 2;
      sign.getDrawer().clear()
        .moveTo(x, y)
        .lineTo(right, y)
        .lineTo(right, bottom)
        .lineTo(x, bottom)
        .lineTo(x, y);
      line.getDrawer().clear()
        .moveTo(x, y)
        .lineTo(x + 0.8 * space, middle)
        .lineTo(right, y);
      return box;
    }
  });

  Designer.registerOutline('sendTask', SendTaskShape);

  var attributes = require('../mixins/attributes');

  var displayName = require('../mixins/displayName');
  var note = require('../mixins/note');
  var notification = require('../mixins/notification');

  SendTaskShape.getProperty = function (designer) {
    var noti = notification.get(designer, {}, 'complex');
    noti.hidden = true;
    return {
      "name": "sendTask",
      "attributes": attributes.get(),
      "children": [
        noti, {
          "name": "extensionElements",
          "children": [
            displayName.get(designer),
            note.get(designer),
          ]
        }
      ]
    };
  };
});
