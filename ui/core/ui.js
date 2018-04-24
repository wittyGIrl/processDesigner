/**
 * @fileOverview
 *
 * UI 注册及加载机制
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
define(function(require, exports, module){
    var Designer = require('./witdesigner').Designer;
    var kity = require('./kity');
    var $ = require('./jquery');

    var uiQueue = [];

    /* 注册一个新的 UI 交互 */
    Designer.registerUI = function(id, deps, ui) {
        if (typeof(deps) == 'function') {
            ui = deps;
            deps = null;
        }
        uiQueue.push({
            id: id,
            ui: ui,
            deps: deps
        });
    };

    kity.extendClass(Designer, {
        /* 为实例注册 UI 交互 */
        initUI: function() {
            var ui = this._ui = {};
            var designer = this;

            uiQueue.forEach(function(uiDeal) {
                var deps = uiDeal.deps;
                if (deps) deps = deps.map(function(dep) {
                    return designer.getUI(dep);
                });
                ui[uiDeal.id] = uiDeal.ui.apply(null, [designer].concat(deps || []));
            });

            // 阻止非脑图事件冒泡
            $('#content-wrapper').delegate('#panel, #tab-container, .fui-dialog, #main-menu', 'keydown keyup', function(e) {
                e.stopPropagation();
            });

            // 阻止非脑图事件冒泡
            $('#content-wrapper').delegate('input', 'mousedown mousemove mouseup contextmenu', function(e) {
                e.stopPropagation();
            });

            designer.getPaper().addClass('loading-target');

            this.fire('interactchange');
            this.fire('uiready');
        },

        /* 获得实例的 UI 实例 */
        getUI: function(id) {
            return this._ui[id];
        }
    });

    $.ajaxSetup({ cache: false });
    // $.extend($, {
    //     pajax: function() {
    //         var jqXHR = $.ajax.apply($, arguments);
    //         return new Promise(function(resolve, reject) {
    //             jqXHR.done(resolve);
    //             jqXHR.fail(function(jqXHR, textStatus, errorThrown) {
    //                 var e = new Error(textStatus);
    //                 e.getDetail = function() {
    //                     try {
    //                         return 'jQuery XHR Error: \n' + JSON.stringify(errorThrown);
    //                     } catch (e) {
    //                         return errorThrown;
    //                     }
    //                 };
    //                 reject(e);
    //             });
    //         });
    //     }
    // });

    // preload css images
    // $(function() {
    //     var list = ["kmcat_warn.png", "kmcat_sad.png", "icons.png", "template_large.png", "history.png", "feedback.png", "iconpriority.png", "iconprogress.png", "template.png", "layout.png", "next-level.png", "prev-level.png"];
    //     list.forEach(function(item) {
    //         (new Image()).src = 'ui/theme/default/images/' + item;
    //     });
    // });
});
