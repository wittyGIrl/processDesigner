define(function(require, exports, module) {

  function get(designer, defaultValue, targetName, notHide) {
    defaultValue = defaultValue || {};
    return {
      "name": defaultValue.name || "formalExpression",
      "hideItself": !notHide,
      "attributes": [{
        "name": "generatingMode",
        "hidden": true
      }],
      "children": [{
        "name": "text",
        "value": defaultValue.value,
        "editor": {
          "type": "a",
          "label": designer.getLang('label.details'),
          "onClick": function() {
            var popupWindow = designer.getOption('popupWindow');
            var propertyEditor = designer.getUI('ribbon/node/property');
            if (popupWindow && propertyEditor) {
              popupWindow(this, propertyEditor, targetName);
            }
          }
        }
      }]
    };
  }

  exports.get = get;
});
