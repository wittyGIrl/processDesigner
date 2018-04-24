/**
 * @fileOverview
 *  可拖拽节点
 *  数据
 *  未使用
 */
define(function(require, exports, module) {
  var Designer = require('../../core/witdesigner').Designer;
  var FUI = require('../../core/fui');
  var $ = require('../../core/jquery');
  var kity = require('../../core/kity');
  var Utils = require('../../core/utils');

  Designer.registerUI('ribbon/node/data', function(designer) {

    var $dragbutton = designer.getUI('widget/dragbutton');
    var $tabs = designer.getUI('ribbon/tabs');

    var dataInput = designer.getOutlineManager('dataInput').create(
      designer);
    //scriptTask.getShape(0).node.setAttribute('stroke-width', 1);
    dataInput.setAttr('transform', 'translate(5, 0)');
    dataInput.setData('outlineType', 'dataInput');

    var dataOutput = designer.getOutlineManager('dataOutput').create(
      designer);
    //scriptTask.getShape(0).node.setAttribute('stroke-width', 1);
    dataOutput.setAttr('transform', 'translate(5, 0)');
    dataOutput.setData('outlineType', 'dataOutput');

    var $nodeSelect = $dragbutton.generate('AppendRootNode', [ dataInput, dataOutput ]);

    $tabs.node.appendWidget($nodeSelect);

    bindPropertyGrid();

    return $nodeSelect;

    function bindPropertyGrid() {
      var DataInputShape = designer.getOutlineManagerClass('dataInput');

      var inputName = designer.getLang(
        'ui.command.AppendRootNode.dataInput');
      var missingNameMessage = designer.getLang(
        'message.missingNameMessage');
      var missingIdMessage = designer.getLang(
        'message.missingIdMessage');

      DataInputShape.groups = {
        dataInput: {
          text: designer.getLang('node.property.dataInput'),
          actions: ['add', 'remove'],
          editors: {
            name: {
              type: 'validatebox',
              options: {
                required: true,
                missingMessage: Utils.stringFormate(
                  missingNameMessage, [inputName])
              }
            },
            value: {
              type: 'typedvaluebox',
              options: {
                comboOptions: {
                  required: true,
                  editable: false,
                  width: 150
                },
                textOptions: {
                  required: true,
                  width: 150,
                  missingMessage: Utils.stringFormate(
                    missingIdMessage, [inputName])
                },
                comboboxOptions: {
                  required: true,
                  editable: false,
                  width: 150,
                  data: [{
                    value: 'int',
                    text: 'int'
                  }, {
                    value: 'string',
                    text: 'string'
                  }, {
                    value: 'bool',
                    text: 'bool'
                  }, {
                    value: 'datetime',
                    text: 'datetime'
                  }]
                }
              }
            }
          }
        }
      };
      DataInputShape.property = [

      ];

      var DataOutputShape = designer.getOutlineManagerClass(
        'dataOutput');

      var outputName = designer.getLang(
        'ui.command.AppendRootNode.dataOutput');

      DataOutputShape.groups = {
        dataOutput: {
          text: designer.getLang('node.property.dataOutput'),
          actions: ['add', 'remove'],
          editors: {
            name: {
              type: 'validatebox',
              options: {
                required: true,
                missingMessage: Utils.stringFormate(designer.getLang(
                  'message.missingNameMessage'), [outputName])
              }
            },
            value: {
              type: 'typedvaluebox',
              options: {
                comboOptions: {
                  required: true,
                  editable: false,
                  width: 150
                },
                textOptions: {
                  required: true,
                  width: 150,
                  missingMessage: Utils.stringFormate(designer.getLang(
                    'message.missingIdMessage'), [outputName])
                },
                comboboxOptions: {
                  required: true,
                  editable: false,
                  width: 150,
                  data: [{
                    value: 'int',
                    text: 'int'
                  }, {
                    value: 'string',
                    text: 'string'
                  }, {
                    value: 'bool',
                    text: 'bool'
                  }, {
                    value: 'datetime',
                    text: 'datetime'
                  }]
                }
              }
            }
          }
        }
      };
      DataOutputShape.property = [

      ];
    }
  });
});
