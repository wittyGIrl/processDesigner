/**
 * @fileOverview
 *
 * 脚本任务
 */
define(function (require, exports, module) {
  var kity = require('../../core/kity');
  var utils = require('../../core/utils');

  var Designer = require('../../core/designer');
  var OutlineManager = require('../../core/outline');

  var Renderer = require('../../core/render');

  var ScriptTaskShape = kity.createClass('ScriptTaskShape', {
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
      var sign = new kity.Path().stroke(node.getStyle('normal-stroke'), 1);
      group.addShape(rect);
      group.addShape(sign);
      group.setId(utils.uuid('scriptTask'));
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
      var x = box.x + 4;
      var y = box.y + 2;
      var height = 7,
        redius = 10,
        space = 3;
      sign.getDrawer().clear()
        .moveTo(x, y).lineTo(x + 10, y)
        .arcTo(redius, redius, 0, 0, 0, x + 10, y + height)
        .arcTo(redius, redius, 0, 0, 1, x + 10, y + 2 * height)
        .lineTo(x, y + 2 * height)
        .arcTo(redius, redius, 0, 0, 0, x, y + height)
        .arcTo(redius, redius, 0, 0, 1, x, y)
        .moveTo(x, y + space).lineTo(x + 10, y + space)
        .moveTo(x, y + 2 * space).lineTo(x + 10, y + 2 * space)
        .moveTo(x, y + 3 * space).lineTo(x + 10, y + 3 * space)
        .moveTo(x, y + 4 * space).lineTo(x + 10, y + 4 * space);

      return box;
    }
  });

  Designer.registerOutline('scriptTask', ScriptTaskShape);

  var attributes = require('../mixins/attributes');

  var displayName = require('../mixins/displayName');
  var note = require('../mixins/note');
  var returnElement = require('../mixins/return');

  ScriptTaskShape.getProperty = function (designer) {
    var attrs = attributes.get();
    attrs.push({
      "name": "scriptFormat",
      "value": "SQL",
      "hidden": true
    });
    return {
      "name": "scriptTask",
      "hideTitle": true,
      "attributes": attrs,
      "children": [{
        "name":"script",
        "children": [{
          "name": "text",
          "value": "",
          "editor": {
            "placeholder":designer.getLang('message.inputs'),
            "requiredMessage":designer.getLang('message.requiredMessage'),
            "multiline": true,
            "required": true,
            "style": {
              "height": "100px",
              "width": "350px"
            }
          }
        }]
      },{
        "name": "extensionElements",
        "children": [
          displayName.get(designer),
          note.get(designer),
          {
            "name": "policies",
            "hidden": true,
            "children": [returnElement.get('enableReturn', 'true')]
          }
        ]
      }]
    };
  };
});
