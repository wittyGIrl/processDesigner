define(function (require, exports, module) {
  function get(designer, defaultValue) {
    defaultValue = defaultValue || {};
    return {
      "name": "dataOutput",
      "attributes": [{
        "name": "id",
        "value": defaultValue.id,
        "editor": {
          "placeholder":designer.getLang('message.inputs'),
          "requiredMessage":designer.getLang('message.requiredMessage'),
          "required": true,
          "autofocus": true
        }
      },{
        "name": "name",
        "value": defaultValue.name,
        "editor": {
          "placeholder":designer.getLang('message.inputs'),
          "requiredMessage":designer.getLang('message.requiredMessage'),
          "required": true
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
