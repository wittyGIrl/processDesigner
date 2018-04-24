/**
 * @fileOverview
 *
 * eventDefinition
 */
define(function(require, exports, module) {
  var kity = require('../core/kity');
  var utils = require('../core/utils');

  var Designer = require('../core/designer');
  var DesignerNode = require('../core/node');
  var Command = require('../core/command');
  var Module = require('../core/module');
  var Renderer = require('../core/render');

  var EventDefinitionRenderer = kity.createClass('EventDefinitionRenderer', {
    base: Renderer,

    create: function(node) {
      var group = new kity.Group();
      var eventDefinition = node.getData('eventDefinition');
      return Designer.getEventDefinition(eventDefinition).create(node);
    },

    shouldRender: function(node) {
      return !!node.getData('eventDefinition');
    },

    update: function(group, node, box) {
      var eventDefinition = node.getData('eventDefinition');
      return box.merge(Designer.getEventDefinition(eventDefinition).update(group, node, box));
    },
  });

  var _evnetDefinitions = {};
  utils.extend(Designer, {
    registerEventDefinition: function(name, eventDefinition) {
      _evnetDefinitions[name] = eventDefinition;
      return this;
    },
    getEventDefinition: function(name) {
      if (!_evnetDefinitions[name]) {
        throw new Error('unregister eventDefinition: ' + name);
      }
      return _evnetDefinitions[name];
    }
  });

  Module.register('eventDefinition', {
    renderers: {
      center: EventDefinitionRenderer
    }
  });

  module.exports = EventDefinitionRenderer;
});
