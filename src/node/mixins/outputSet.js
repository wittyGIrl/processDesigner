define(function (require, exports, module) {
  var utils = require('../../core/utils');

  var dataOutput = require('./dataOutput');

  function get(designer) {
    return {
      "name": "outputSet",
      "variableChildren": true,
      //  "hideTitle": true,
      "defaultChild": dataOutput.get(designer),
      "children": []
    };
  }


  function getRef(input) {
    if (!input) return;
    var id = utils.certainName('id', input.attributes);
    var optional=utils.certainName('optional', input.attributes);
    if (typeof id === 'undefined' || id === null) return;
    if(optional.value=="true")
    return {
      name: 'dataOutputRefs',
      children: [{
        name: "text",
        value: id.value
      }]
    };
    else
    return {
      name: 'optionalOutputRefs',
      children: [{
        name: "text",
        value: id.value
      }]
    };
  }

  function beforeExport(json, ioSpec) {
    if (!json || !json.children || !json.children.length || !ioSpec) return;
    var refs = [],
      ref;
    json.children.forEach(function (input) {
      ioSpec.children.push(input);
      ref = getRef(input);
      if (ref) {
        refs.push(ref);
      }
    });
    json.children = refs;

    return json;
  }

  function beforeImport(json, inputs) {
    json = json || {
      name: 'outputSet'
    };
    if (inputs && inputs.length) {
      var children = [];
      inputs.forEach(function (input) {
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
