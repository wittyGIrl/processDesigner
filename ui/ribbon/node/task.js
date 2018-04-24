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

    var box = new kity.Box(0, 0, 40, 30);
    var fakeNode = new DesignerNode();
    fakeNode.designer = designer;

    var scriptTaskOutline = designer.getOutlineManager('scriptTask');
    var scriptTask = scriptTaskOutline.create(fakeNode, box);
    scriptTaskOutline.doUpdate(scriptTask, fakeNode, box);
    scriptTask.setAttr('transform', 'translate(8, 10)');
    scriptTask.setData('options', { outlineType: 'scriptTask' });

    var userTaskOutline = designer.getOutlineManager('userTask');
    var userTask = userTaskOutline.create(fakeNode);
    userTaskOutline.doUpdate(userTask, fakeNode, box);
    userTask.setAttr('transform', 'translate(8, 10)')
      .setData('options', { outlineType: 'userTask' });

    var sendTaskOutline = designer.getOutlineManager('sendTask');
    var sendTask = sendTaskOutline.create(fakeNode, box);
    sendTaskOutline = sendTaskOutline.doUpdate(sendTask, fakeNode, box);
    sendTask.setAttr('transform', 'translate(8, 10)');
    sendTask.setData('options', {
      outlineType: 'sendTask'
    });

    //特殊的 userTask，通过 userTask下的一个属性来判断
    var loopTask = userTaskOutline.create(fakeNode);
    userTaskOutline.doUpdate(loopTask, fakeNode, box);
    var loopMarkers = ['loopCharacteristics'];
    loopMarkers.forEach(function(markerName){
      var marker = Designer.getMarker(markerName);
      var markerShape = marker.create(fakeNode);
      marker.update(markerShape, fakeNode, box.expand(0, 0, -10, 0));
      loopTask.addShape(markerShape);
    });
    loopTask.setAttr('transform', 'translate(8, 10)');
    loopTask.setData('text', 'loopTask');
    loopTask.setData('options', {
      isLoop: true,
      outlineType: 'userTask',
      markers: loopMarkers
    });



    var $nodeSelect = $dragbutton.generate('AppendRootNode', [userTask, scriptTask, loopTask, sendTask], {
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
