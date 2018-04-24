define(function (require, exports, module) {
  function get(designer) {
    return {
      "name": "note",
      "children": [{
        "name": "text",
        "editor": {
          "placeholder":designer.getLang('message.inputs'),
          "multiline": true,
          "style": {
            "width": "350px",
            "height": "100px"
          }
        }
      }]
    };
  }

  exports.get = get;
});
