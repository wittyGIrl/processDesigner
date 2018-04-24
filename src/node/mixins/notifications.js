define(function (require, exports, module) {
  var notification = require('./notification');

  function get(designer) {
    return {
      "name": "notifications",
      "hidden": true,
      "variableChildren": true,
      //  "hideTitle": true,
      "defaultChild": notification.get(designer),
      "children": []
    };
  }

  exports.get = get;
});
