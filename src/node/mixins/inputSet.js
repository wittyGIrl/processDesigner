define(function (require, exports, module) {
  var utils = require('../../core/utils');
  var childSourceData=require('./childSourceData');
  var childSourceData2=require('./dataSet/childSourceData');
  var dataInput = require('./dataInput');
  var callActivity=require('../activity/callActivity');
  var restServiceTask=require('../services/restServiceTask');

  function get(designer) {
    return {
      "name": "inputSet",
      "variableChildren": true,
      //  "hideTitle": true,
      "defaultChild": dataInput.get(designer),
      "children": []
    };
  }

  function getRef(input){
    if(!input)return;
    var id = utils.certainName('id', input.attributes);
    var optional=utils.certainName('optional', input.attributes);
    var itemSubjectRef=utils.certainName('itemSubjectRef', input.attributes);
    if(typeof id === 'undefined' || id === null)return;
  //  childSourceData.updateValue(dataInputAssociation,id);
    if(optional.value=="true")
    return {
      name: 'dataInputRefs',
      children: [{
        name: "text",
        value: id.value
      }]
    };
    else
    return {
      name: 'optionalInputRefs',
      children: [{
        name: "text",
        value: id.value
      }]
    };
  }

  function beforeExport(json, ioSpec) {
    if(!json || !json.children || !json.children.length || !ioSpec)return;
    var refs = [], ref;
    var dataInputAssociation;
    childSourceData.updateValue(dataInputAssociation, json.children);
    childSourceData2.updateValue(dataInputAssociation, json.children);
    json.children.forEach(function(input){
      ioSpec.children.push(input);
      ref = getRef(input);
      if(ref){
        refs.push(ref);
      }
    });
    json.children = refs;
    return json;
  }

  function beforeImport(json, inputs) {
    json = json || {name: 'inputSet'};
    var dataInputAssociation;
    childSourceData.updateValue(dataInputAssociation, inputs);
    childSourceData2.updateValue(dataInputAssociation, inputs);
    callActivity.updateValue(dataInputAssociation, inputs);
    restServiceTask.updateValue(dataInputAssociation, inputs);
    if(inputs && inputs.length){
      var children = [];
      inputs.forEach(function(input){
        children.push(input);
      });
      json.children = children;
    }
    return json;
  }

  exports.get = get;
  exports.beforeImport = beforeImport;
  exports.beforeExport = beforeExport;
});
