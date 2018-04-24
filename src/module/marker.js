/**
 * @fileOverview
 *
 * marker
 */
define(function(require, exports, module) {
  var kity = require('../core/kity');
  var utils = require('../core/utils');

  var Designer = require('../core/designer');
  var DesignerNode = require('../core/node');
  var Command = require('../core/command');
  var Module = require('../core/module');
  var Renderer = require('../core/render');

  var MarkerRenderer = kity.createClass('MarkerRenderer', {
    base: Renderer,

    create: function(node) {
      var group = new kity.Group();
      var markers = node.getData('markers');
      markers.forEach(function(marker) {
        group.addShape(Designer.getMarker(marker).create(node));
      });
      return group;
    },

    shouldRender: function(node) {
      return !!node.getData('markers');
    },

    update: function(group, node, box) {
      var markers = node.getData('markers');
      group.eachItem(function(i, item){
        box = box.merge(Designer.getMarker(markers[i]).update(item, node, box));
      });
      return box;
    },
  });

  var _markers = {};
  utils.extend(Designer, {
    registerMarker: function(name, marker) {
      _markers[name] = marker;
      return this;
    },
    getMarker: function(name) {
      if (!_markers[name]) {
        throw new Error('unregister marker: ' + name);
      }
      return _markers[name];
    }
  });

  Module.register('marker', {
    renderers: {
      bottom: MarkerRenderer
    }
  });

  module.exports = MarkerRenderer;
});
