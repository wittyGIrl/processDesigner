define(function (require, exports, module) {
  function get(designer) {
    return {
      "name": "subject",
      "attributes": [{
        "name": "lang",
        "editor": {
          "type": "combobox",
          "options": designer.getOption('langType')
        }
      }],
      "children": [{
        "name": "text",
        "vertical": true,
        "editor": {
          "type": "template",
          "variables": designer.getOption('templateVariable'),
          "required": true,
          "style": {
            "height": "50px"
          }
        }
      }]
    };
  }

  exports.get = get;
});
