/**
 * @fileOverview
 *
 * 定义命令类
 * 命令必须依附于模块，不允许单独存在
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
define(function(require,exports,module){
    var kity = require('./kity');
    var utils = require('./utils');
    var Designer = require('./designer');
    var DesignerNode = require('./node');
    var DesignerEvent = require('./event');

    var COMMADN_STATE_READY=0,
      COMMAND_STATE_DISABLED=-1,
      COMMAND_STATE_ACTIVED=1;

    /**
     * 表示一个命令基类，包含命令的查询及执行
     */
    var Command = kity.createClass('Command', {
        constructor: function() {
            this._isContentChange = true;
            this._isSelectionChange = false;
        },

        /**
         * 命令执行
         * @return  {bool} false，表示该命令无效，不会被记录在commandHistory
         */
        execute: function(designer, args) {
            throw new Error('Not Implement: Command.execute()');
        },
        // //撤销 可选
        // unexecute: function(){
        //     throw new Error('Not Implement: Command.unexecute()');
        // },

        setContentChanged: function(val) {
            this._isContentChange = !!val;
        },

        isContentChanged: function() {
            return this._isContentChange;
        },

        setSelectionChanged: function(val) {
            this._isSelectionChange = !!val;
        },

        isSelectionChanged: function() {
            return this._isContentChange;
        },

        queryState: function(km) {
            return COMMADN_STATE_READY;
        },

        queryValue: function(km) {
            return 0;
        }
    });

    Command.STATE_NORMAL = COMMADN_STATE_READY;
    Command.STATE_ACTIVE = COMMAND_STATE_ACTIVED;
    Command.STATE_DISABLED = COMMAND_STATE_DISABLED;

    kity.extendClass(Designer, {
        getCommandHistory: function(){
            if(this._commandHistory){
                return this._commandHistory;
            }
            return this._commandHistory = [];
        },
        getRedoCommandHistory: function(){
            if(this.redoCommandHistory){
                return this.redoCommandHistory;
            }
            return this.redoCommandHistory = [];
        },
        _getCommand: function(name){
            return new this._commands[name.toLowerCase()]();
        },
        _queryCommand: function(name,type,args){
            var cmd = this._getCommand(name);
            if(cmd){
              var queryCmd = cmd['query' + type];
              if(queryCmd){
                return queryCmd.apply(cmd, [this].concat(args));
              }
            }
            return 0;
        },
        queryCommandState: function(name){
            return this._queryCommand(name, 'State', [].slice.call(arguments,1));
        },
        queryCommandValue: function(name){
            return this._queryCommand(name, 'Value', [].slice.call(arguments,1));
        },
        //执行命令
        executeCommand: function(name){
            if (!name) return null;

            name = name.toLowerCase();

            var cmdArgs = [].slice.call(arguments, 1),
                cmd, stoped, result, eventParams;
            var me = this;
            cmd = this._getCommand(name);

            eventParams = {
                command: cmd,
                commandName: name.toLowerCase(),
                commandArgs: cmdArgs
            };
            if (!cmd || !~this.queryCommandState(name)) {
                return false;
            }

            stoped = this._fire(new DesignerEvent('beforeExecCommand', eventParams, true));

            if (!stoped) {
                this._fire(new DesignerEvent('preExecCommand', eventParams, false));

                result = cmd.execute.apply(cmd, [me].concat(cmdArgs));

                this._fire(new DesignerEvent('execCommand', eventParams, false));

                if (cmd.isContentChanged()) {
                    this._firePharse(new DesignerEvent('contentchange'));
                    this._firePharse(new DesignerEvent('docchange'));
                }

                this._interactChange();
            }

            //该命令支持撤销，才会放入命令历史记录中
            if(cmd.unexecute && result !== false){
                //命令记录最多保留10条
                var commandHistory = this.getCommandHistory();
                var commandHistoryLength = this.getOption('commandHistoryLength') || 10;
                if(commandHistory.length >= commandHistoryLength){
                    commandHistory.shift();
                }
                var redoCommandHistory = this.getRedoCommandHistory();
                if(redoCommandHistory.length > 0){
                    this.redoCommandHistory = [];
                }
                this._commandHistory.push(cmd);
            }
            return result === undefined ? null : result;
        },
      //支持撤销的命令
        unexecuteCommand: function(){
            var cmd = this.getCommandHistory().pop();
            if(cmd){
                cmd.unexecute.apply(cmd,[this].concat(arguments));
                this.getRedoCommandHistory().push(cmd);
                if (cmd.isContentChanged()) {
                    this._firePharse(new DesignerEvent('contentchange'));
                    this._firePharse(new DesignerEvent('docchange'));
                }
                this._interactChange();
            }
        },
        //重新执行
        redoCommand: function(){
            var cmd = this.getRedoCommandHistory().pop();
            if(cmd){
                cmd.execute.apply(cmd, [this].concat(cmd._params));
                this.getCommandHistory().push(cmd);

                if (cmd.isContentChanged()) {
                    this._firePharse(new DesignerEvent('contentchange'));
                    this._firePharse(new DesignerEvent('docchange'));
                }

                this._interactChange();
            }
        }
    });

    module.exports = Command;
});
