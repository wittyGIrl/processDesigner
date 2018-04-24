define(function (require, exports, module) {
  function get(designer, defaultValue) {
    defaultValue = defaultValue || {};
    return {
      "name": "dataInput",
      "attributes": [{
        "name": "id",
        "value": defaultValue.id,
        "editor": {
          "required": true,
          "placeholder":designer.getLang('message.inputs'),
          "requiredMessage":designer.getLang('message.requiredMessage'),
          //"autofocus": true
        }
      },{
        "name": "name",
        "value": defaultValue.name,
        "editor": {
          "required": true,
          "placeholder":designer.getLang('message.inputs'),
          "requiredMessage":designer.getLang('message.requiredMessage'),
        }
      },{
        "name": "itemSubjectRef",
        "value": defaultValue.itemSubjectRef || 'xsd:int',
        "editor": {
          "type": "combobox",
          "options": designer.getOption('dataType')
        }
      },{
        "name":"optional",
        "value":"true",
        "editor":{
          "type": "checkbox"
      }
    }]
    };
  }

  exports.get = get;
});
