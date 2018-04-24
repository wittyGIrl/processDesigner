/**
 * @fileOverview
 *
 * 状态切换控制
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
 define(function(require, exports, module){
    var kity = require('./kity');
    var Designer = require('./designer');

    Designer.registerInitHook(function(){
      this._initStatus();
    });

    kity.extendClass(Designer, {
        _initStatus: function(){
            this._status = 'normal';
            this._rollbackStatus = 'normal';
        },

        setStatus: function(status, force){
            if(this._status === 'readonly' && force !== false){
                return;
            }
            if(this._status !== status){
                this._rollbackStatus = this._status;
                this._status = status;
                this.fire('statuschange',{
                    lastStatus:this._rollbackStatus,
                    currentStatus:this._status
                });
            }
            return this;
        },

        rollbackStatus: function(){
            this.setStatus(this._rollbackStatus);
        },

        getRollbackStatus: function(){
            return this._rollbackStatus;
        },
        getStatus: function(){
            return this._status;
        }
    });
 });
