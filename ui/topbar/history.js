 /**
 * @fileOverview
 *
 * 撤销重做按钮
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

define(function(require, exports, module){
    var Designer = require('../core/witdesigner').Designer;
    var FUI = require('../core/fui');

    Designer.registerUI('topbar/history', function(designer) {

        var ret = {};
        var commandbutton = designer.getUI('widget/commandbutton');

        var panel = document.getElementById('panel');
        ['undo', 'redo'].forEach(function(command) {
            ret[command] = commandbutton.generate(command).appendTo(panel);
        });

        return ret;
    });
});
