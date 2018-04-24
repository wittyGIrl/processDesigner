/**
 * @fileOverview
 *  可拖拽节点
 *  开始节点
 *
 */
define(function(require, exports, module) {
  var witdesigner = require('../../core/witdesigner');
  var Designer = witdesigner.Designer;
  var DesignerNode = witdesigner.Node;
  var FUI = require('../../core/fui');
  var $ = require('../../core/jquery');
  var kity = require('../../core/kity');

  Designer.registerUI('ribbon/node/startEvent', function(designer) {

    var $commandselectmenu = designer.getUI('widget/dragbutton');
    var $tabs = designer.getUI('ribbon/tabs');

    var box = new kity.Box(0, 0, 30, 30);
    var fakeNode = new DesignerNode();
    fakeNode.designer = designer;

    var nodeType = 'startEvent';
    var startEventOutline = designer.getOutlineManager(nodeType);
    var startEvent = startEventOutline.create(fakeNode, box);
    startEventOutline.doUpdate(startEvent, fakeNode, box);
    startEvent.setAttr('transform', 'translate(10, 10)');
    startEvent.setData('options', {
      outlineType: nodeType
    });

    var $nodeSelect = $commandselectmenu.generate('AppendRootNode', [startEvent], {
      onShow: function() {
        $tabs.node.getWidgets().forEach(function(widget) {
          if (widget !== this && widget.getType() === 'SelectMenu') {
            widget.hide();
          }
        }, this);
      }
    });

    $tabs.node.appendWidget($nodeSelect);

    return $nodeSelect;
  });
});
