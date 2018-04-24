define(function (require, exports, module) {
  var utils = require('../../core/utils');

  function get(designer, defaultValue, editor) {
    var opts = utils.extend(
      {
        "type": "globalizedEditor",
        "options": designer.getOption('requiredLangType'),
        "editor":{
          "placeholder":designer.getLang('message.inputs')
        }
      },
      editor
    );
    return {
      "name": "displayName",
      //"variableChildren": true,
      "children": [{
        "name": "text",
        "value": defaultValue,
        // "editor":{
        //   "placeholder":designer.getLang('message.inputs')
        // }
      //  "placeholder":designer.getLang('message.inputs'),
        "editor": opts
      }]
    };
  }

  exports.get = get;
});
