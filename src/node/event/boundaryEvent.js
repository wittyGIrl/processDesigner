/**
 * @fileOverview
 *
 * boundaryEvent
 */
define(function (require, exports, module) {
  var kity = require('../../core/kity');
  var utils = require('../../core/utils');

  var Designer = require('../../core/designer');
  var OutlineManager = require('../../core/outline');

  var EventDefinition = require('../eventDefinition/eventDefinition');

  var BoundaryEventShape = kity.createClass('BoundaryEventShape', {
    base: OutlineManager,
    create: function (node) {
      this.eventType = 'intermediate';//node.getData('eventType');
      var group = new kity.Group();

      var circle = new kity.Circle().fill('inherit').stroke('inherit', node.getStyle('stroke-width'));

      if(this.eventType === 'intermediate'){
        var circle2 = new kity.Circle().fill('inherit').stroke('inherit', node.getStyle('stroke-width'));
        var outline = new kity.Group().pipe(function(){
          this.stroke(node.getStyle('normal-stroke'), node.getStyle('stroke-width'));
          this.fill(node.getStyle('background'));
        });
        outline.addShape(circle);
        outline.addShape(circle2);
        group.addShape(outline);
      } else {
        circle.fill(node.getStyle('background'));
        if(this.eventType === 'end') {
          circle.stroke(node.getStyle('normal-stroke'), node.getStyle('end-stroke-width'));
        } else {
          circle.stroke(node.getStyle('normal-stroke'), node.getStyle('stroke-width'));
        }
        group.addShape(circle);
      }
      group.setId(utils.uuid('boundaryEvent'));
      this._node = node;
      return this._outlineShape = group;
    },

    doUpdate: function (outlineGroup, node, box) {
      var shapes = outlineGroup.getShapes();
      var outline = shapes[0];
      var space = 3;
      //设置半径
      var radius = box.width > box.height ? box.width : box.height;
      // box = new kity.Box(box.x, box.y, radius, radius);
      radius /= 2;

      var scale = 0;

      var strokeDash;
  //    var cancelActivity=node.getData("cancelActivity");
      var cancelActivity;
      if(node.data && node.data.property)
        cancelActivity=node.data.property.attributes[1].value;
      if(cancelActivity === "false"){
        strokeDash = "5 3";
      }

      if(this.eventType === 'intermediate'){
        var items = outline.getItems();
        scale += space * items.length;
        items.forEach(function(item){
          item.setRadius(radius + scale).setCenter(box.cx, box.cy);
          scale -= space;
          item.setAttr('stroke-dasharray', strokeDash);
        });
      } else {
        scale += space;
        outline.setRadius(radius).setCenter(box.cx, box.cy);
        outline.setAttr('stroke-dasharray', strokeDash);
      }
      radius  = radius * 2 + scale * 2;
      return new kity.Box(box.x - scale, box.y - scale, radius, radius);
    },
  });

  Designer.registerOutline('boundaryEvent', BoundaryEventShape);

  var attributes = require('../mixins/attributes');
  var displayName = require('../mixins/displayName');
  var note = require('../mixins/note');

  BoundaryEventShape.getProperty = function (designer, options) {
    var children = [];
    var eventDefinition = options.eventDefinition;
    if(eventDefinition){
      children.push(
        Designer.getEventDefinition(eventDefinition).getProperty()
      );
    }
    children.push({
      "name": "extensionElements",
      "children": [
        note.get(designer),
      ]
    });
    var attributes=[{
      "name": "id",
      "editor": {
        "type": "none"
      }
    }, {
      "name": 'cancelActivity',
      "value": "true",
      "editor": {
        "type": "checkbox"
      }
    }, {
      "name": 'attachedToRef',
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
    }];
    return {
      "name": "boundaryEvent",
      "attributes":attributes,
      "children":children,
    };
  };

  BoundaryEventShape.beforeExport = function(designer, node, json, attributes){
    if(node.parent){
      attributes.attachedToRef = node.parent.getData('nodeId');
    }
  };
});
