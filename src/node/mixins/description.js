define(function (require, exports, module) {
  function get(designer) {
    return {
      "name": "description",
      "attributes": [{
        "name": "lang",
        "editor": {
          "type": "combobox",
          "options": designer.getOption('langType')
        }
      }, {
        "name": "textFormat",
        "value": "text/html",
        "hidden": true
      }],
      "children": [{
        "name": "text",
        "vertical": true,
        "editor": {
          "type": "template",
          "variables": designer.getOption('templateVariable'),
          "requiredMessage":designer.getLang('message.requiredMessage'),
          "required": true
        }
      }]
    };
  }

  exports.get = get;
});
