/**
 * @fileOverview
 *
 * Terminate 结束节点
 * ××在eventDefinition没实现时的权宜之计。
 * 但为了兼容问题，故没有移除。之后全部通过eventDefinition来实现。
 */
define(function (require, exports, module) {
  var kity = require('../../core/kity');
  var utils = require('../../core/utils');

  var Designer = require('../../core/designer');
  var OutlineManager = require('../../core/outline');

  var TerminateEndEventShape = kity.createClass('TerminateEndEventShape', {
    base: OutlineManager,
    create: function (node) {
      var group = new kity.Group();
      var circle = new kity.Circle().pipe(function () {
        this.stroke(node.getStyle('normal-stroke'),
          node.getStyle('end-stroke-width'));
        this.fill(node.getStyle('background'));
      });
      var sign = new kity.Circle().pipe(function () {
        this.fill(node.getStyle('normal-stroke'));
      });
      group.addShape(circle);
      group.addShape(sign);

      group.setId(utils.uuid('terminateEndNode'));
      this._node = node;
      return this._outlineShape = group;
    },
    doUpdate: function (outlineGroup, node, box) {
      var shapes = outlineGroup.getShapes();
      var outline = shapes[0];
      var sign = shapes[1];
      var space = 20;
      //设置半径
      var d = box.width > box.height ? box.width : box.height;
      outline.setRadius(d / 2);
      sign.setRadius((d - space) / 2);

      var mid = utils.midPoint(box, {
        x: box.x + box.width,
        y: box.y + box.height
      });
      //设置圆心
      outline.setCenter(mid.x, mid.y);
      sign.setCenter(mid.x, mid.y);

      box.width = box.height = d;
      return box;
    },
    updateColor: function (node, outlineGroup, selected) {
      if (typeof (outlineGroup) === 'boolean') {
        selected = outlineGroup;
        outlineGroup = this._outlineShape;
      }
      var shapes = outlineGroup.getShapes();
      var outline = shapes[0];

      outline.stroke(
        node.getStyle(selected ? 'selected-stroke' :
          'normal-stroke'),
        node.getStyle('end-stroke-width')
      );
    }
  });

  Designer.registerOutline('terminateEndEvent', TerminateEndEventShape);

  var attributes = require('../mixins/attributes');
  var note = require('../mixins/note');

  TerminateEndEventShape.getProperty = function (designer) {
    // var attrs = attributes.get();
    // attrs.push({
    //     "name": 'rejectNotation',
    //     "value": 'true',
    //     "hidden": true
    // });
    return {
      "name": "terminateEndEvent",
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
        "name": 'rejectNotation',
        "value": 'true',
        "hidden": true
      }],
      "children": [{
        "name": "extensionElements",
        "children": [note.get(designer)]
      }]
    };
  };

  TerminateEndEventShape.beforeExport = function(designer, node, json, attributes){
    json.name = 'endEvent';
  };
});
