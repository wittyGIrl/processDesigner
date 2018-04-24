/**
 * @fileOverview
 *  可拖拽节点
 *  网关
 *
 */
define(function(require, exports, module) {
  var witdesigner = require('../../core/witdesigner');
  var Designer = witdesigner.Designer;
  var DesignerNode = witdesigner.Node;
  var FUI = require('../../core/fui');
  var $ = require('../../core/jquery');
  var kity = require('../../core/kity');

  Designer.registerUI('ribbon/node/gateway', function(designer) {
    var $dragbutton = designer.getUI('widget/dragbutton');
    var $tabs = designer.getUI('ribbon/tabs');

    var box = new kity.Box(0, 0, 40, 40);
    var fakeNode = new DesignerNode();
    fakeNode.designer = designer;

    // var gatewayOutline = designer.getOutlineManager('gateway');
    // var gateway = gatewayOutline.create(fakeNode, box);
    // gatewayOutline.doUpdate(gateway, fakeNode, box);
    // gateway.setAttr('transform', 'translate(7, 5)');
    // gateway.setData('outlineType', 'gateway');

    var exclusiveGatewayOutline = designer.getOutlineManager('exclusiveGateway');
    var exclusiveGateway = exclusiveGatewayOutline.create(fakeNode, box);
    exclusiveGatewayOutline.doUpdate(exclusiveGateway, fakeNode, box);
    exclusiveGateway.setAttr('transform', 'translate(7, 5)');
    exclusiveGateway.setData('options', {
      outlineType: 'exclusiveGateway'
    });

    // var inclusiveGatewayOutline = designer.getOutlineManager('inclusiveGateway');
    // var inclusiveGateway = inclusiveGatewayOutline.create(fakeNode, box);
    // inclusiveGatewayOutline.doUpdate(inclusiveGateway, fakeNode, box);
    // inclusiveGateway.setAttr('transform', 'translate(7, 5)');
    // inclusiveGateway.setData('options', {
    //   outlineType: 'inclusiveGateway'
    // });

    var $nodeSelect = $dragbutton.generate(
      'AppendRootNode',
      //gateway, exclusiveGateway, inclusiveGateway
      [exclusiveGateway], {
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
