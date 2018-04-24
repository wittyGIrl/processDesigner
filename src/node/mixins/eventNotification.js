define(function (require, exports, module) {

  function get(designer, type) {

    return {
      "name": "eventNotification",
      "attributes": [{
        "name": "event",
        "editor": {
          "type": "combobox",
          "options": designer.getOption(type + 'EventOptions'),
          "autofocus": true
        }
      }, {
        "name": "notificationRef",
        "editor": {
          "type": "combobox",
          "options": designer.getOption('notificationTemplate')
        }
      }],
      "children": [{
        "name": "interface",
        "hidden": true,
        "attributes": [{
          "name": "name",
          "value": "email"
        }]
      }, {
        "name": "priority",
        "attributes": [{
          "name": "generatingMode",
          "hidden": true
        }],
        "children": [{
          "name": "text",
          "editor": {
            "type": "combobox",
            "options": designer.getOption('priorityType')
          }
        }]
      }, {
        "name": "recipients",
        "children": [{
          "name": "resourceAssignmentExpression",
          "hideItself": true,
          "children": [{
            "name": "formalExpression",
            "hideItself": true,
            "attributes": [{
              "name": "generatingMode",
              "hidden": true
            }],
            "children": [{
              "name": "text",
              "editor": {
                "type": "combobox",
                "options": designer.getOption('recipients')
              }
            }]
          }]
        }]
      }]
    };
  }

  exports.get = get;
});
