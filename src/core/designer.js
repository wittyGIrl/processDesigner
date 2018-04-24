/**
 * @fileOverview
 *
 * WitDesigner 类，暴露在 window 上的唯一变量
 *
* @author: techird
* @copyright: Baidu FEX, 2014
 */
define(function(require, exports, module) {
    var kity = require('./kity');
    var utils = require('./utils');

    var _initHooks = [];

    var Designer = kity.createClass('Designer', {
        constructor: function(options) {
            this._options = utils.extend({}, options);
            // 数据
            this.data = {
                id: utils.guid()
            };

            var initHooks = _initHooks.slice();

            var initHook;
            while (initHooks.length) {
                initHook = initHooks.shift();
                if (typeof(initHook) == 'function') {
                    initHook.call(this, this._options);
                }
            }

            this.fire('ready');
        },
        getData: function(key) {
            return key ? this.data[key] : this.data;
        },

        setData: function(key, value) {
            if (typeof key == 'object') {
                var data = key;
                for (key in data) if (data.hasOwnProperty(key)) {
                    this.data[key] = data[key];
                }
            }
            else {
                this.data[key] = value;
            }
            return this;
        }
    });

    Designer.version = '0.1.0';
    Designer.LANG = {};

    //注册初始化函数
    Designer.registerInitHook = function(hook) {
        _initHooks.push(hook);
    };

    module.exports = Designer;
});
