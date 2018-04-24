/**
 * @fileOverview
 *  可拖拽节点
 *  子流程
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

  Designer.registerUI('ribbon/node/callActivity', function(designer) {
    var $dragbutton = designer.getUI('widget/dragbutton');
    var $tabs = designer.getUI('ribbon/tabs');

    var box = new kity.Box(0, 0, 40, 30);
    var fakeNode = new DesignerNode();
    fakeNode.designer = designer;

    var nodeType = 'callActivity';
    var callActivityOutline = designer.getOutlineManager('callActivity');
    var callActivity = callActivityOutline.create(fakeNode, box);
    callActivityOutline.doUpdate(callActivity, fakeNode, box);
    callActivity.setAttr('transform', 'translate(8, 10)');
    callActivity.setData('options', { outlineType: nodeType });

    var $nodeSelect = $dragbutton.generate('AppendRootNode', [callActivity], {
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
