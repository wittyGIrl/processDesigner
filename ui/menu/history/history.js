/**
 * @fileOverview
 *
 * 草稿历史记录
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
define(function(require, exports, module){
    var Designer = require('../../core/witdesigner').Designer;
    Designer.registerUI('menu/history/history', function(designer) {
        return designer.getUI('menu/menu').createSub('history', true);
    });
});
