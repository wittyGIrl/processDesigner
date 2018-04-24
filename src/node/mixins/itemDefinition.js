define(function (require, exports, module) {
  var utils = require('../../core/utils');

  var dataInput = require('./dataInput');

  function get(designer, defaultValue) {
    defaultValue = defaultValue || {};
    return {
      name: 'itemDefinition',
      defaultChild: dataInput.get(designer),
      attributes: [{
        name: 'id',
        value: defaultValue.id
      }, {
        name: 'isCollection',
        value: defaultValue.isCollection,
      }, {
        name: 'itemKind',
        value: defaultValue.itemKind,
      }, {
        name: 'structureRef',
        value: defaultValue.structureRef,
      }],
      children: [{
        name: 'extensionElements',
        children: [{
          name: 'tAssigneeList',
          fullName: 'witbpm:tAssigneeList',
          attributes: [{
            name: 'type',
            value: 'WitBPM.Workflow.Core.AssigneeList'
          }, {
            name: 'scriptFormat',
            value: 'SQL'
          }],
          children: [{
            name: 'script',
            children: [{
              name: 'text',
              value: defaultValue.value
            }]
          }]
        }]
      }]
    };
  }

  function updateValue(json, value){
    if(json){
      var extension = utils.certainName('extensionElements', json.children);
      var assignList = utils.certainName('tAssigneeList', extension && extension.children);
      if(assignList){
        assignList.children[0].children[0].value = value;
      }
    }
  }

  exports.get = get;
  exports.updateValue = updateValue;

});
