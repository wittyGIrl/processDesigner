define(function (require, exports, module) {
  var utils = require('../../core/utils');

  var childSourceData = require('./childSourceData');
  var dataInput=require('./dataInput');

  function get(designer) {
    return {
      "name": "sourceRef",
      "variableChildren": true,
      //  "hideTitle": true,
      "defaultChild": childSourceData.get(designer),
      "children": []
    };
  }

  function getRef(input){
    if(!input)return;
    var id = utils.certainName('id', input.attributes);
    var name = utils.certainName('name', input.attributes);
    if(typeof id === 'undefined' || id === null)return;
    return {
      name: 'sourceRef',
      children: [{
        name: "text",
        value: id.value
      }]
    };
  }

  function beforeExport(json, source) {
    if(!json || !json.children || !json.children.length || !source)return;
    var refs = [], ref;
    json.children.forEach(function(input){
      //source.children.push(input);
      ref = getRef(input);
      if(ref){
        refs.push(ref);
      }
    });
    json.children = refs;

    return json;
  }

  function beforeImport(json, inputs) {
    json = json || {name: 'sourceRef'};
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
