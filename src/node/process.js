/**
 * @fileOverview
 *
 * process
 */
define(function (require, exports, module) {
  var kity = require('../core/kity');

  var Designer = require('../core/designer');

  var displayName = require('./mixins/displayName');
  var form = require('./mixins/form');
  var presentation = require('./mixins/presentation');
  var notifications = require('./mixins/notifications');
  var eventNotifications = require('./mixins/eventNotifications');
  var ioSpecification = require('./mixins/ioSpecification');
  var dataInputAssociation=require('./mixins/dataInputAssociation');


  kity.extendClass(Designer, {
    getDefaultProps: function () {
      return {
        "name": "process",
        "attributes": [{
          "name": "id",
          "hidden": "true",
          // "editor": {
          //   "type": "none"
          // }
        }, {
          "name": 'name',
          "editor": {
            "required": true
          }
        }, {
          "name": 'offsetX',
          "hidden": true
        }, {
          "name": 'offsetY',
          "hidden": true
        }, {
          "name": 'transform',
          "hidden": true
        },{
          "name": 'zoom',
          "hidden": true
        }],
        "children": [
          ioSpecification.get(this),
          {
          "name": "extensionElements",
          "children": [
            displayName.get(this),
            form.get(this, true),
            presentation.get(this),
            notifications.get(this),
            eventNotifications.get(this, 'process')
          ]
        }
      ]};
    },
    //
    resetNotificationTemplate: function(){
      var notifications = this.getData('notifications');
      if(!notifications || !notifications.children) return;
      var templates = [];
      notifications.children.forEach(function(noti){
        var value, text;
        noti.attributes.forEach(function(attr){
          if(attr.name === 'id'){
            if(!attr.value) return;
            value = attr.value;
          }
          else if(attr.name === 'name'){
            if(!attr.value) return;
            text = attr.value;
          }
        });
        templates.push({ value: value, text: text||value});
      });
      var tem = this.getOption('notificationTemplate');
      tem.splice(0, tem.length);
      templates.forEach(function(template){
        tem.push(template);
      });
    }
  });
});
