define(function (require, exports, module) {
  var utils = require('../../core/utils');
  var displayName = require('./displayName');

  function get(designer, defaultValue) {
    defaultValue = defaultValue || {};
    return {
      "name": "formAction",
      "attributes": [{
        "name": "id",
        "value": 'action_' + utils.guid(),
        "editor": {
          "type": "none"
        }
      }, {
        "name": "name",
        "value": defaultValue.name,
        "editor": {
          "required": true,
          "rule": "ASCII",
          "invalidMessage": designer.getLang('message.ASCIIMessage')
        }
      }, {
        "name": "type",
        "value": defaultValue.type,
        "editor": {
          "type": "combobox",
          "options": designer.getOption('formActions')
        }
      }, {
        "name": "addSignApproveType",
        "value": 0,
        "hidden": {
          "targetName": "type",
          "targetValues": designer.getOption('targetValues')
        },
        "editor": {
          "type": "combobox",
          "options": designer.getOption('addSignApproveTypes')
        }
      }],
      "children": [displayName.get(designer, defaultValue.displayName, {
        required: true
      })]
    };
  }

  //作为defaultChild , "autofocus": true
  function def(designer, defaultValue) {
    defaultValue = defaultValue || {};
    return {
      "name": "formAction",
      "attributes": [{
        "name": "id",
        "value": 'action_' + utils.guid(),
        "editor": {
          "type": "none"
        }
      }, {
        "name": "name",
        "value": defaultValue.name,
        "editor": {
          "autofocus": true,
          "required": true,
          "rule": "ASCII",
          "invalidMessage": designer.getLang('message.ASCIIMessage')
        }
      }, {
        "name": "type",
        "value": defaultValue.type,
        "editor": {
          "type": "combobox",
          "options": designer.getOption('formActions')
        }
      }, {
        "name": "addSignApproveType",
        "value": 0,
        "hidden": {
          "targetName": "type",
          "targetValues": designer.getOption('targetValues')
        },
        "editor": {
          "type": "combobox",
          "options": designer.getOption('addSignApproveTypes')
        }
      }],
      "children": [displayName.get(designer, defaultValue.displayName, {
        required: true
      })]
    };
  }

  function beforeImport(action) {
    if(!action || !action.attributes)return;
    var id, name;
    action.attributes.forEach(function(attr){
      if(attr.name === 'id'){
        id = attr;
        //所有id全部转成小写。
        if(id.value){
          id.value = id.value.toLowerCase();
        }
      } else if(attr.name === 'name'){
        name = attr;
      }
    });
    //name 转小写
    var nameValue = null;
    if(name && name.value){
      nameValue = name.value.toLowerCase();
    }

    if(!id){
      if(name){
        action.attributes.push({name: 'id', value: nameValue});
      }
    } else if(id.value === undefined || id.value === null){
      id.value = nameValue;
    }
  }

  exports.get = get;
  exports.def = def;
  exports.beforeImport = beforeImport;
});
