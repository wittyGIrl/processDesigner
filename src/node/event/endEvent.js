/**
 * @fileOverview
 *
 * 结束节点
 */
define(function (require, exports, module) {
  var kity = require('../../core/kity');
  var utils = require('../../core/utils');

  var Designer = require('../../core/designer');
  var OutlineManager = require('../../core/outline');

  var EventDefinition = require('../eventDefinition/eventDefinition');

  var EndEventShape = kity.createClass('EndEventShape', {
    base: OutlineManager,
    create: function (node) {
      var eventDefinition = node.getData('eventDefinition');
      var group = new kity.Group();

      var circle = new kity.Circle().pipe(function () {
        this.stroke(node.getStyle('normal-stroke'),
          node.getStyle('end-stroke-width'));
        this.fill(node.getStyle('background'));
      });
      group.addShape(circle);

      group.setId(utils.uuid('endEvent'));
      this._node = node;
      return this._outlineShape = group;
    },
    doUpdate: function (outlineGroup, node, box) {
      var shapes = outlineGroup.getShapes();
      var outline = shapes[0];
      //设置半径
      var d = box.width > box.height ? box.width : box.height;
      var mid = utils.midPoint(box, {
        x: box.x + box.width,
        y: box.y + box.height
      });
      outline.setRadius(d / 2).setCenter(mid.x, mid.y);

      return new kity.Box(box.x, box.y, d, d);
    },
    updateColor: function (node, outlineGroup, selected) {
      if (typeof (outlineGroup) === 'boolean') {
        selected = outlineGroup;
        outlineGroup = this._outlineShape;
      }
      var shapes = outlineGroup.getShapes();
      var outline = shapes[0];

      outline.stroke(
        node.getStyle(selected ? 'selected-stroke' : 'normal-stroke'),
        node.getStyle('end-stroke-width')
      );
    }
  });

  Designer.registerOutline('endEvent', EndEventShape);

  var attributes = require('../mixins/attributes');
  var displayName = require('../mixins/displayName');
  var note = require('../mixins/note');

  EndEventShape.getProperty = function (designer, options) {
    var children;
    var currentAttrs;
    var eventDefinition = options.eventDefinition;
    if(eventDefinition){
    //不包含displayName
      children =  [{
        "name": "extensionElements",
        "children": [
          note.get(designer)
        ]},
        Designer.getEventDefinition(eventDefinition).getProperty()
       ];
      //不包含name
      currentAttrs = [{
        "name": "id",
        "editor": {
          "type": "none"
        }
      }, {
        "name": 'offsetX',
        "hidden": true
      }, {
        "name": 'offsetY',
        "hidden": true
      }, {
        "name": 'transform',
        "hidden": true
      }];
    }
    else{
      children =  [{
        "name": "extensionElements",
        "children": [
          displayName.get(designer, '{"zh-cn": "结束", "zh-tw": "結束", "en": "End"}'),
          note.get(designer)
        ]
      }];
      currentAttrs = attributes.get({name:'结束'});
    }
    return {
      "name": "endEvent",
      "attributes": currentAttrs,
      "children": children,
    };
  };
});
