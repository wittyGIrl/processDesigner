/**
 * multiInstanceLoopCharacteristics的json定义与xml不同, multiInstanceLoopCharacteristics的xml定义如下
 * <multiInstanceLoopCharacteristics isSequential="true">
 *			<loopDataInputRef>leaveDays</loopDataInputRef>
 *			<inputDataItem name="leave" itemSubjectRef="xsd:int" />
 *			<completionCondition><![CDATA[numberOfTerminatedInstances > 0]]></completionCondition>
 *	</multiInstanceLoopCharacteristics>
 *  原因：如果按照这样的格式定义json，那么这个在操作的时候，
 *  必须先在流程级别添加一个ItemDefinition，然后再在节点下选中这个itemDefinition中添加一个引用，这样操作太繁琐。
 */

define(function(require, exports, module) {
  var utils = require('../../core/utils');
  var itemDefinitionElem = require('./itemDefinition');
  var ioSpecificationElem = require('./ioSpecification');
  var dataInput = require('./dataInput');

  function get(designer, defaultValue) {
    defaultValue = defaultValue || {};
    var attrs=[{
      "name": "isSequential",
      "value":"true",
      "editor": {
        "type": "checkbox"
      }
    },{
      "name": "performerType",
      "value": "humanPerformer",
      "hidden":{
        "targetName": "isSequential",
        "targetValues": "false"
      },
      "editor":{
        "type": "combobox",
        "options": designer.getOption('performerType')
      }
    }];
    return {
      "name": "multiInstanceLoopCharacteristics",
      "attributes": attrs,
      "children": [{
        "name": "script",
        "children": [{
          "name": "text",
          "value": defaultValue.value,
          "editor": {
            "placeholder":designer.getLang('message.inputs'),
            "requiredMessage":designer.getLang('message.requiredMessage'),
            "multiline": true,
            "required": true,
            "style": {
              "height": "100px",
              "width": "350px"
            }
          }
        }]
      },{
          "name":"handleNumber",
          "value":defaultValue.handleNumber||"",
          "ref":"inputTest",
          "editor":{
            "placeholder":designer.getLang('message.handlerNumber'),
            "required":false,
            "onKeyPress":function(e){
              var e=e||window.event;
              if (e.which < 48 || e.which > 57)
                e.preventDefault();
            },
          "onBlur":function(e){
              var value=e.target.value;
              value=value.replace(/\D+/g,"");
              e.target.value=value;
          }
          }
      }]
    };
  }
  function beforeExport(designer, node, json) {
    if (!json || !json.children || !json.children.length) return;
    var itemDefinitions = designer.getData('itemDefinitions');
    if (!itemDefinitions) {
      itemDefinitions = [];
      designer.setData('itemDefinitions', itemDefinitions);
    }
    var dataId = node.getData('dataId');
    var itemDefinition;
    if (dataId) {
      itemDefinition = findItemDefinition(dataId, designer.getData('itemDefinitions'));
    } else {
      dataId = 'itemDefinition_' + utils.guid();
      itemDefinition = itemDefinitionElem.get(designer, {
        id: dataId,
        isCollection: 'true',
        itemKind: 'Physical',
        structureRef: 'witbpm:tAssigneeList',
      });
      itemDefinitions.push(itemDefinition);
      node.setData('dataId', dataId);
    }

    var ioSpecification;
    var loop,
      loopIndex;
    json.children.forEach(function(child, index) {
      if (child.name === 'multiInstanceLoopCharacteristics') {
        loop = child;
        loopIndex = index;
      }
    });
    if (loop) {
      var script,
        scriptIndex;
      loop.children.forEach(function(child, index) {
        if (child.name === 'script') {
          script = child;
          scriptIndex = index;
        }
      });
      var scriptValue = script.children[0].value;
      itemDefinitionElem.updateValue(itemDefinition, scriptValue);

      var inputId = node.getData('inputId') || ('dataInput_' + utils.guid());
      var handleNumber=utils.certainName('handleNumber',loop.children);
      var temp=handleNumber.value;
      var number=parseInt(temp);
      if(!isNaN(number)&&number>0)
          var compleCondition="numberOfCompletedInstances>="+number+" OR numberOfTerminatedInstances > 0";
      else
          compleCondition="numberOfTerminatedInstances > 0";
      loop.children[scriptIndex] = {
        name: 'loopDataInputRef',
        children: [{
          name: 'text',
          value: inputId
        }]
      };

      var reg = /select\s+[[]?(\w+)/i;
      var match = reg.exec(scriptValue);
      var itemName = '';
      if(match && match[1]){
        itemName = match[1];
      }
      loop.children.push({
           name: 'completionCondition',
           children: [{
             name: 'text',
             value: compleCondition
           }]
         });
      loop.children.push({
        name: 'inputDataItem',
        attributes: [{
          name: 'name',
          value: itemName
        }, {
          name: 'itemSubjectRef',
          value: 'xsd:int'
        }]
      });

      ioSpecification = ioSpecificationElem.get(designer);
      var inputSet = utils.certainName('inputSet', ioSpecification.children);
      inputSet.children.push(dataInput.get(designer, {
        id: inputId,
        name: inputId,
        itemSubjectRef: dataId,
      }));
      ioSpecificationElem.beforeExport(ioSpecification);
      json.children.unshift(ioSpecification);
    }
    return json;
  }

  function beforeImport(designer, node, json) {
    if (!json || !json.children || !json.children.length) return;
    var io,
      ioIndex,
      loop,
      loopIndex;
    json.children.forEach(function(child, index) {
      switch (child.name) {
        case 'ioSpecification':
          io = child;
          ioIndex = index;
          break;
        case 'multiInstanceLoopCharacteristics':
          loop = child;
          loopIndex = index;
          break;
        default:
          break;
      }
    });
    var dataId, inputId;
    if (io) {
      json.children.splice(ioIndex, 1);
      if (io.children) {
        io.children.forEach(function(child) {
          if (child.name === 'dataInput') {
            dataId = utils.certainName('itemSubjectRef', child.attributes).value;
            inputId = utils.certainName('id', child.attributes).value;
          }
        });
      }
    }
    if (loop && dataId) {
      var target = findItemDefinition(dataId, designer.getData('itemDefinitions'));
      var extension = utils.certainName('extensionElements', target && target.children);
      var assignList = utils.certainName('tAssigneeList', extension && extension.children);
      var script;
      if (assignList && assignList.children) {
        script = assignList.children[0];
      }
      if (script) {
        var completionCondition = utils.certainName('completionCondition', loop.children);
        var handle=completionCondition && completionCondition.children[0].value;
        var temp=handle.match(/\d+/g);
        var handleNumber;
        temp.forEach(function(child){if(child!=0)handleNumber=child;});
        var newLoop = get(designer, {
          value: script.children[0].value,
          handleNumber: handleNumber
        });
        utils.xextendArray(newLoop.attributes, loop.attributes);
        var isSequential = utils.certainName('isSequential', newLoop.attributes);
        if(isSequential){
          var flags=isSequential.value;
          node.setData('isSequential', flags=="true");
        }
        json.children[loopIndex] = newLoop;
      }
      node.setData('dataId', dataId);
      node.setData('inputId', inputId);
    }
    return json;
  }
  function findItemDefinition(id, itemDefinitions) {
    if (!itemDefinitions || !id) return;
    var item;
    for (var i = 0, l = itemDefinitions.length; i < l; i++) {
      item = itemDefinitions[i];
      if (item&&utils.certainName('id', item.attributes).value === id) {
        return item;
      }
    }
  }

  exports.get = get;
  exports.beforeImport = beforeImport;
  exports.beforeExport = beforeExport;
});
