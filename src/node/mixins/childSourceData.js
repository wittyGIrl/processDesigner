define(function (require, exports, module) {
  var utils = require('../../core/utils');
  var sourceRefData=new Array();
  function updateValue(json, input){
    var firstData=new Object();
    firstData.text=designer.getLang('label.choose');
    sourceRefData[0]=firstData;
    for(var i=0;i<input.length;i++){
      if(!input[i].attributes[0].value)
      input.splice(i,1);
    }
    for(var i=0;i<input.length;i++)
    {
      var data=new Object();
      data.text=input[i].attributes[0].value;
      data.value=input[i].attributes[0].value;
      data.type=input[i].attributes[2].value;
      sourceRefData[i+1]=data;
    }
    return sourceRefData;
  }
  function get(getProcessVariable) {
    return[{
          "name": "sourceRef",
          "children":[{
            "name": 'text',
            "editor": {
              "type": 'combobox',
              "options": sourceRefData,
            },
          }]
        },{
          "name": 'targetRef',
          "children":[{
            "name": 'text',
            "editor": {
              "type": 'combobox',
              "options": getProcessVariable,
            },
          }]
        }];
  }
  exports.get = get;
  exports.updateValue = updateValue;
});
