/**
 * @fileOverview
 *  可拖拽节点
 *  结束节点
 *
 */
define(function (require, exports, module) {
  var witdesigner = require('../../core/witdesigner');
  var Designer = witdesigner.Designer;
  var DesignerNode = witdesigner.Node;
  var FUI = require('../../core/fui');
  var $ = require('../../core/jquery');
  var kity = require('../../core/kity');

  Designer.registerUI('ribbon/node/endEvent', function (designer) {
    var $dragbutton = designer.getUI('widget/dragbutton');
    var $tabs = designer.getUI('ribbon/tabs');

    var box = new kity.Box(0, 0, 30, 30);
    var fakeNode = new DesignerNode();
    fakeNode.designer = designer;

    var nodeType = 'endEvent';
    var endEventOutline = designer.getOutlineManager(nodeType);
    var endEvent = endEventOutline.create(fakeNode, box);
    endEventOutline.doUpdate(endEvent, fakeNode, box);
    endEvent.setAttr('transform', 'translate(10, 10)');
    endEvent.setData('options', {outlineType: nodeType});

    var eventDefinition = 'terminateEventDefinition';
    var terminateEndEvent = endEventOutline.create(fakeNode, box);
    endEventOutline.doUpdate(terminateEndEvent, fakeNode, box);
    terminateEndEvent.setAttr('transform', 'translate(10, 10)');

    var event = Designer.getEventDefinition(eventDefinition);
    var eventShape = event.create(fakeNode);
    event.update(eventShape, fakeNode, box);
    terminateEndEvent.addShape(eventShape);

    terminateEndEvent.setData('text', 'terminateEndEvent');
    terminateEndEvent.setData('options', {
      outlineType: nodeType,
      eventDefinition: eventDefinition
    });

    var $nodeSelect = $dragbutton.generate(
      'AppendRootNode', [endEvent, terminateEndEvent], {
        onShow: function() {
          $tabs.node.getWidgets().forEach(function(widget) {
            if (widget !== this && widget.getType() === 'SelectMenu') {
              widget.hide();
            }
          }, this);
        }
      }
    );

    $tabs.node.appendWidget($nodeSelect);

    return $nodeSelect;
  });
});
