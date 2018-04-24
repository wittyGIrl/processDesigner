define(function (require, exports, module) {
  var childSourceData = require('./childSourceData');
  var utils = require('../../../core/utils');


  function get(getProcessVariable) {
    var tempId="dataInputAssociation_"+utils.guid();
    var returnValue = {
      "name": "dataInputAssociation",
      "attributes": [
        {
        "name": "id",
        "editor": {
          "placeholder":designer.getLang('message.inputs'),
          "requiredMessage":designer.getLang('message.requiredMessage'),
          "required": true,
        }
      },
      {
        "name": "name",
        "editor": {
          "placeholder":designer.getLang('message.inputs'),
          "requiredMessage":designer.getLang('message.requiredMessage'),
          "required": true,
        }
      }],
      "children": childSourceData.get(getProcessVariable),
    };
    setTimeout(get,1000);
    return returnValue;
  }
  exports.get = get;
});
