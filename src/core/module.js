/**
 * @fileOverview
 *
 * 模块
 * 模块 event renderer command
 */
define(function(require,exports,module){
    var kity = require('./kity');
    var utils = require('./utils');
    var Designer = require('./designer');

    /* 已注册的模块 */
    var _modules = {};

    exports.register = function(name, module) {
        _modules[name] = module;
    };

    /* 模块初始化 */
    Designer.registerInitHook(function() {
        this._initModules();
    });

    kity.extendClass(Designer, {
        _initModules:function(){
            var modules = _modules;
            //需要真正加载的模块(可以是部分_modules中的模块)
            var modulesToLoad = this._options.modules || utils.keys(modules);
            var mod, moduleObj, i, l, name, moduleCommands, moduleRanderers, moduleEvents;

            this._commands = {};
            this._query = {};
            this._modules = {};
            this._rendererClasses = {};

            for(i=0, l=modulesToLoad.length; i<l; i++){
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

                this._modules[name] = moduleObj;

                if(moduleObj.init){
                  moduleObj.init.call(this, this._options);
                }

                moduleCommands = moduleObj.commands;
                if(moduleCommands){
                    for(name in moduleCommands){
                        this._commands[name.toLowerCase()]=moduleCommands[name];
                    }
                }

                moduleRanderers = moduleObj.renderers;
                if(moduleRanderers){
                    for(var type in moduleRanderers){
                        this._rendererClasses[type] = this._rendererClasses[type] || [];
                        var renderer = moduleRanderers[type];
                        if(utils.isArray(renderer)){
                            this._rendererClasses[type].concat(renderer);
                        }
                        else{
                            this._rendererClasses[type].push(renderer);
                        }
                    }
                }

                moduleEvents = moduleObj.events;
                if(moduleEvents){
                    for(name in moduleEvents){
                        this.on(name,moduleEvents[name]);
                    }
                }

                //添加模块的快捷键
                if (moduleObj.commandShortcutKeys) {
                    this.addCommandShortcutKeys(moduleObj.commandShortcutKeys);
                }
            }
        },

        _garbage: function() {
            this.clearSelect();

            while (this._root.getChildren().length) {
                this._root.removeChild(0);
            }
        },

        destroy: function() {
            var modules = this._modules;

            this._resetEvents();
            this._garbage();

            for (var key in modules) {
                if (!modules[key].destroy) continue;
                modules[key].destroy.call(this);
            }
        },

        reset: function() {
            var modules = this._modules;

            this._garbage();

            for (var key in modules) {
                if (!modules[key].reset) continue;
                modules[key].reset.call(this);
            }
        }
    });
});
