/**
 * @fileOverview
 *
 * 开始节点
 */
define(function(require, exports, module) {
  var kity = require('../../core/kity');
  var utils = require('../../core/utils');

  var Designer = require('../../core/designer');
  var OutlineManager = require('../../core/outline');

  var StartEventShape = kity.createClass('StartEventShape', {
    base: OutlineManager,
    create: function(node) {
      var circle = new kity.Circle().pipe(function() {
        this.stroke(node.getStyle('normal-stroke'),
          node.getStyle('stroke-width'));
        this.fill(node.getStyle('background'));
      });
      circle.setId(utils.uuid('startNode'));
      this._node = node;
      return this._outlineShape = circle;
    },
    doUpdate: function(outline, node, box) {
      //设置半径
      var d = box.width > box.height ? box.width : box.height;
      outline.setRadius(d / 2);

      var mid = utils.midPoint(box, {
        x: box.x + box.width,
        y: box.y + box.height
      });
      //设置圆心
      return outline.setCenter(mid.x, mid.y);
    }
  });

  Designer.registerOutline('startEvent', StartEventShape);

  var attributes = require('../mixins/attributes');
  var displayName = require('../mixins/displayName');
  var form = require('../mixins/form');
  var note = require('../mixins/note');

  StartEventShape.getProperty = function(designer) {
    var attrs=attributes.get({
      name: 'Start'
    });
    return {
      "name": "startEvent",
      "attributes": attrs,
      "children": [{
        "name": "extensionElements",
        "children": [
          displayName.get(designer,
            '{"zh-cn": "开始", "zh-tw": "開始", "en": "Start"}'),
          note.get(designer),
          form.get(designer,false,attrs)
        ]
      }]
    };
  };
});
