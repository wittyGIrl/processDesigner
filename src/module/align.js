/**
 * @fileOverview
 *
 * 对齐模块
 *
 */
define(function(require, exports, module) {
  var kity = require('../core/kity');
  var utils = require('../core/utils');

  var Designer = require('../core/designer');
  var Module = require('../core/module');
  var Command = require('../core/command');

  //for redo undo
  var AlignNodeCommand = kity.createClass('AlignNodeCommand', {
    base: Command,
    execute: function(designer, nodes, axis) {
      if (this._nodes) {
        nodes = this._nodes;
        axis = this._axis;
      } else {
        var offsets = [];
        nodes.forEach(function(node) {
          offsets.push(node.getLayoutOffset());
        });
        this._offsets = offsets;
        this._nodes = nodes;
        this._axis = axis;
        this._designer = designer;
      }

      designer.align(
        nodes,
        axis,
        nodes[0].getLayoutOffset()[axis]
      );

      this._state = Command.STATE_ACTIVE;
    },

    //撤销
    unexecute: function() {
      var offsets = this._offsets,
        nodes = this._nodes;
      nodes.forEach(function(node, index) {
        node.setLayoutOffset(offsets[index]);
      });
      var designer = this._designer;
      designer.applyLayoutResult(nodes);
      nodes.forEach(function(node) {
        node.updateLine();
      });
      this._state = Command.STATE_NORMAL;
    },

    queryState: function(designer) {
      return this._state;
    }
  });

  Module.register('AlignNode', function() {
    return {
      commands: {
        'AlignNode': AlignNodeCommand
      }
    };
  });
});
