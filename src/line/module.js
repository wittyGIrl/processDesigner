/**
 * @fileOverview
 *
 * 对线提供模块支持
 * 模块 event renderer command
 */
define(function(require,exports,module){
    var kity = require('../core/kity');
    var utils = require('../core/utils');
    var Designer = require('../core/designer');

    /* 已注册的模块 */
    var _modules = {};

    exports.register = function(name, module) {
        _modules[name] = module;
    };

    /* 模块初始化 */
    Designer.registerInitHook(function() {
        this._initLineModules();
    });

    kity.extendClass(Designer, {
        _initLineModules:function(){
            var modules = _modules;
            //需要真正加载的模块(可以是部分_modules中的模块)
            var modulesToLoad = this._options.lineModules || utils.keys(modules);
            var mod, moduleObj, i, l, name, moduleCommands, moduleRanderers, moduleEvents;

            this._lineCommands = {};
            this._lineQuery = {};
            this._lineModules = {};
            this._lineRendererClasses = {};

            for(i = 0, l = modulesToLoad.length; i < l; i++){
                name = modulesToLoad[i];
                mod = modules[name];
                if(!mod) continue;
                if(typeof mod === 'function'){
                    moduleObj = mod.call(this);
                }
                else{
                    moduleObj = mod;
                }
                if(!moduleObj) continue;

                this._lineModules[name] = moduleObj;

                if(moduleObj.init){
                    moduleObj.init.call(this, this._options);
                }

                moduleCommands = moduleObj.commands;
                if(moduleCommands){
                    for(name in moduleCommands){
                        this._lineCommands[name.toLowerCase()] = moduleCommands[name];
                    }
                }

                moduleRanderers = moduleObj.renderers;
                if(moduleRanderers){
                    for(var type in moduleRanderers){
                        this._lineRendererClasses[type] = this._lineRendererClasses[type] || [];
                        var renderer = moduleRanderers[type];
                        if(utils.isArray(renderer)){
                            this._lineRendererClasses[type].concat(renderer);
                        }
                        else{
                            this._lineRendererClasses[type].push(renderer);
                        }
                    }
                }

                moduleEvents = moduleObj.events;
                if(moduleEvents){
                    for(name in moduleEvents){
                        this.on(name, moduleEvents[name]);
                    }
                }
            }
        },

        destroyLineModules: function() {
            var modules = this._lineModules;

            this._resetEvents();

            for (var key in modules) {
                if (!modules[key].destroy) continue;
                modules[key].destroy.call(this);
            }
        },

        resetLineModules: function() {
            var modules = this._lineModules;

            for (var key in modules) {
                if (!modules[key].reset) continue;
                modules[key].reset.call(this);
            }
        }
    });
});
