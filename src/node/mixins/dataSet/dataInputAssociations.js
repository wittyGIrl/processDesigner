define(function (require, exports, module) {
  var dataInputAssociation = require('./dataInputAssociation');
  var utils = require('../../../core/utils');

  /*获取子流程目标数据*/

  function get(){
    var datas= {
      "name": "dataInputAssociations",
      "hidden": true,
      "variableChildren": true,
      "defaultChild": dataInputAssociation.get(),
      "children": []
    };
    return datas;
  }
  exports.get = get;
//  exports.updateValue = updateValue;
});
