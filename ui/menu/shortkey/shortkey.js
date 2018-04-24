/**
 * @fileOverview
 *
 * 快捷键
 */
define(function(require, exports, module){
    var Designer = require('../../core/witdesigner').Designer;
    Designer.registerUI('menu/shortkey/shortkey', function(designer) {
        return designer.getUI('menu/menu').createSub('shortkey');
    });
});
