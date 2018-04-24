define(function(require, exports, module) {
  var presentation = require('./presentation');
  var resourceRole = require('./resourceRole');

  function get(designer, mode) {
    mode = mode || 'simple';
    var children = [{
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
    }];
    if (mode === 'simple') {
      children.push({
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
      });
    } else {
      children.push(resourceRole.get(designer, {
        name: 'recipients'
      }, 'notification.recipients'));
      children.push(resourceRole.get(designer, {
        name: 'ccs'
      }, 'notification.ccs'));
      children.push(resourceRole.get(designer, {
        name: 'bccs'
      }, 'notification.bccs'));
    }
    children.push(presentation.get(designer));
    return {
      "name": "notification",
      "attributes": [{
        "name": "id",
        "editor": {
          "required": true,
          "placeholder":designer.getLang('message.inputs'),
          "requiredMessage":designer.getLang('message.requiredMessage'),
          "autofocus": true
        }
      }, {
        "name": "name",
        "editor": {
          "placeholder":designer.getLang('message.inputs'),
          "requiredMessage":designer.getLang('message.requiredMessage'),
          "required": true,
        }
      }],
      "children": children
    };
  }
  exports.get = get;
});
