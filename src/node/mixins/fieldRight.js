define(function (require, exports, module) {
  var utils = require('../../core/utils');

  function get(designer,attributes) {
    function getWindow(popupWindow,propertyEditor,that){
      var useVal, processVal, userType;
      if(attributes&&attributes[1]){
        userVal=attributes[1].value;
        userType=attributes[2].value;
      }
      if(designer&&designer.data&&designer.data.basic&&designer.data.basic.children&&designer.data.basic.children[1]&&designer.data.basic.children[1].children)
        processVal=designer.data.basic.children[1].children[1].attributes[1].value;
      if(!(userVal||processVal))
        $.messager.alert('tips',designer.getLang('label.formChoice'),'error');
      else if(userVal && userType && userType=='razortemplate'){
        $.messager.alert('tips',designer.getLang('label.otherForm'),'info');
      }
      else if (popupWindow && propertyEditor && (userVal||processVal)) {
        popupWindow(that, propertyEditor, {
          type: "fieldRight",value:userVal||processVal
        });
      }
    }
    return {
      "name": 'fieldRightSet',
      "hideItself":true,
      "children":[{
        "name":'formRight',
        "editor":{
          "type": 'a',
          "label": designer.getLang('property.formRight'),
          "onClick": function() {
            var popupWindow = designer.getOption('popupWindow');
            var propertyEditor = designer.getUI('ribbon/node/property');
            var that=this;
            getWindow(popupWindow, propertyEditor,that);
          }
        },
      }]
    };
  }
  exports.get = get;
});
