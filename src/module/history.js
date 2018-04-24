/**
 * @fileOverview
 *
 * 撤销重做
 *
 */

define(function(require, exports, module) {
    var kity = require('../core/kity');
    var utils = require('../core/utils');
    var DesignerNode = require('../core/node');
    var Command = require('../core/command');
    var Module = require('../core/module');

    Module.register('HistoryModule', function() {
        return {
            'commands': {
                "undo": kity.createClass("UndoCommand", {
                    base: Command,

                    execute: function(designer) {
                        designer.unexecuteCommand();

                    },

                    queryState: function(designer) {
                        return designer.getCommandHistory().length > 0 ?
                            0 : -1;
                    }
                }),
                "redo": kity.createClass("RedoCommand", {
                    base: Command,

                    execute: function(designer) {
                        designer.redoCommand();

                    },

                    queryState: function(designer) {
                        return designer.getRedoCommandHistory().length > 0 ?
                            0 : -1;
                    }
                })
            },

            'commandShortcutKeys': {
                'undo': 'normal::ctrl+z',
                'redo': 'normal::ctrl+y'
            }
        };
    });
});
