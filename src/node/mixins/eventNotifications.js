define(function (require, exports, module) {
  var eventNotification = require('./eventNotification');

  function get(designer, type) {
    return {
      "name": "eventNotifications",
      "hidden": true,
      "variableChildren": true,
      //  "hideTitle": true,
      "defaultChild": eventNotification.get(designer, type),
      "children": []
    };
  }

  exports.get = get;

});
