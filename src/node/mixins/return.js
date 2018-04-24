define(function (require, exports, module) {
  function get(name, defaultValue) {
    return {
      "name": name,
      "attributes": [{
        "name": "enable",
        "value": defaultValue,
        "editor": {
          "type": "checkbox"
        }
      }]
    };
  }

  exports.get = get;
});
