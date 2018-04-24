define(function (require, exports, module) {
  var utils = require('../../../core/utils');

  var dataOutput = require('../dataOutput');

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
      hidden:true,
      children: [{
        name: "text",
        value: id.value
      }]
    };
    else
    return {
      name: 'optionalOutputRefs',
      hidden:true,
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
    childSourceData.updateValue2(dataInputAssociation, json.children);
    json.children.forEach(function(input){
      var newObj=new Object();
      newObj=utils.deepCopy(input);
      if(input&&input.attributes&&input.attributes[0].value&&input.attributes[1].value)
        input.hidden=true;
      var flag=0;
      for(var k=0;k<ioSpec.children.length;k++){
        if(ioSpec.children[k]&&ioSpec.children[k].attributes &&ioSpec.children[k].attributes[0]&& ioSpec.children[k].attributes[0].value&&input &&input.attributes &&input.attributes[0].value==ioSpec.children[k].attributes[0].value)
          flag=1;
      }
      if(flag!=1)
        ioSpec.children.push(input);
      // if(input&&input.attributes&&input.attributes[0].value)
      //   if(!input.attributes[1].value)
      //     $.messager.alert('error','请输入名称','error');
      //   else
          ref = getRef(input);
      if(ref){
        refs.push(newObj);
        refs.push(ref);
      }
    });
    var newArr=new Array();
    for(var i=0;i<refs.length;i++){
      if(refs[i]&&refs[i].name=='dataOutputRefs'&&refs[i].name=='optionalOutputRefs'&&refs[i].children&&refs[i].children[0].value){
        var tempObject=refs[i].children[0].value;
        if(getRepeat(newArr,tempObject)){
          refs[i]=null;
          refs.length--;
        }
        else
          newArr.push(tempObject);
      }
    }
    json.children = refs;
    return json;
  }

  function beforeImport(json, inputs) {
    var dataType= [{
        value: 'xsd:int',
        text: 'int'
      }, {
        value: 'xsd:string',
        text: 'string'
      }, {
        value: 'xsd:boolean',
        text: 'bool'
      }, {
        value: 'xsd:datetime',
        text: 'datetime'
      }];
    json = json || {
      name: 'outputSet'
    };
    if (inputs && inputs.length) {
      var children = [];
      inputs.forEach(function(input){
        var editor2=new Object();
        editor2.type="combobox";
        editor2.options=dataType;
        var editor3=new Object();
        editor3.type='checkbox';
        input.attributes[2].editor=editor2;
        input.attributes[3].editor=editor3;
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
