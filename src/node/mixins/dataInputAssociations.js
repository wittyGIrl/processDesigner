define(function (require, exports, module) {
  var dataInputAssociation = require('./dataInputAssociation');
  var utils = require('../../core/utils');

  /*获取子流程目标数据*/
  function childProcess(childProcessValue,attrs){
    if(attrs && attrs[7].value){
      var href = (window.location.href).match(/(\S*)(?=Designer)/);
      childProcessValue.length=0;
      var child=new Object();
      child.text=designer.getLang('label.choose');
      child.value=designer.getLang('label.choose');
      childProcessValue[0]=child;
      try{
        $.ajax({
          "url": href[0]+'getprocessInputSpecification?processId='+attrs[7].value,
          "method": 'get',
          "async": false,
          "data": attrs[7].value,
          "success": function(data){
            for(var i=0;i<data.length;i++)
            {
              var tempData=new Object();
              tempData.text=data[i].name;
              tempData.value=data[i].name;
              tempData.type=data[i].itemSubjectRef;
              childProcessValue[i+1]=tempData;
            }
          }
        })
      }catch(err){
        clearInterval(getChildData);
      }
    }
    return childProcessValue;//返回editor中的options对象数组
  }

  /*实现输入变量的ID自动变化*/

  function get(attrs) {
    var getValue;
    var childProcessValue=new Array();
  //  var tempId="dataInputAssociation_"+utils.guid();
    function getAttrs(){
      try{
      //    tempId="dataInputAssociation_"+utils.guid();
          if(attrs[7].value &&(!getValue || getValue!=attrs[7].value)){
            if(getValue != attrs[7].value){
              getValue=attrs[7].value;
              childProcess(childProcessValue,attrs);
            }
          }
        }
      catch(err){
        clearInterval(getChildData);
      }
    }
    var getChildData=setInterval(getAttrs,1000);
    var datas= {
      "name": "dataInputAssociations",
      "hidden": true,
      "variableChildren": true,
      "defaultChild": dataInputAssociation.get(childProcessValue),
      "children": []
    };
    return datas;
  }
  exports.get = get;
  exports.childProcess=childProcess;
});
