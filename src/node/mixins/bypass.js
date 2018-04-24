define(function (require, exports, module) {
  function get(name, defaultValue) {
    return {
      "name": name,
      "children": [{
        "name": "text",
        "value": defaultValue,
        "editor": {
          "type": "checkbox"
        }
      }]
    };
  }

  exports.get = get;
});
