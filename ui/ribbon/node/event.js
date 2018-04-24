/**
 * @fileOverview
 *  可拖拽节点
 *  任务
 *
 */
define(function(require, exports, module) {
  var witdesigner = require('../../core/witdesigner');
  var Designer = witdesigner.Designer;
  var DesignerNode = witdesigner.Node;
  var FUI = require('../../core/fui');
  var $ = require('../../core/jquery');
  var kity = require('../../core/kity');

  var Utils = require('../../core/utils');

  Designer.registerUI('ribbon/node/task', function(designer) {
    var $dragbutton = designer.getUI('widget/dragbutton');
    var $tabs = designer.getUI('ribbon/tabs');

    var box = new kity.Box(0, 0, 26, 26);
    var fakeNode = new DesignerNode();
    fakeNode.designer = designer;

    var boundaryEventOutline = designer.getOutlineManager('boundaryEvent');
    fakeNode.setData('eventType', 'intermediate');
    var boundaryEvent = boundaryEventOutline.create(fakeNode, box);
    boundaryEventOutline.doUpdate(boundaryEvent, fakeNode, box);
    var eventDefinition = 'timerEventDefinition';
    var event = Designer.getEventDefinition(eventDefinition);
    var eventShape = event.create(fakeNode);
    event.update(eventShape, fakeNode, box);
    boundaryEvent.addShape(eventShape);

    boundaryEvent.setAttr('transform', 'translate(12, 14)');
    boundaryEvent.setData('text', eventDefinition);
    boundaryEvent.setData('options', {
      eventType: 'intermediate',
      eventDefinition: eventDefinition,
      outlineType: 'boundaryEvent',
      linePointsFilter: 4, //0100
    });

    var $nodeSelect = $dragbutton.generate('AppendChildNode', [boundaryEvent], {
      dragger: 'treeDragger',
      onShow: function() {
        $tabs.node.getWidgets().forEach(function(widget) {
          if (widget !== this && widget.getType() === 'SelectMenu') {
            widget.hide();
          }
        }, this);
      },
    });

    $tabs.node.appendWidget($nodeSelect);

    return $nodeSelect;
  });
});
