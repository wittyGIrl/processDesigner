/**
 * @fileOverview
 *
 * 用 FUI.Tabs 实现的多级的创建
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

define(function(require, exports, module){
    var Designer = require('../core/witdesigner').Designer;
    var FUI = require('../core/fui');
    var $ = require('../core/jquery');

    Designer.registerUI('widget/menutab', function(designer) {

        function generate(parent, name, asDefault) {
            var index = parent.getButtons().length;
            var menu = designer.getLang('ui.menu');
            var tab = parent.appendTab({
                buttons: [{
                    label: menu[name + 'Tab'] || menu[name],
                    className: 'tab-' + name
                }]
            });
            if (asDefault) {
                parent.select(index);
            }
            return tab[0].panel.getContentElement();
        }

        return {
            generate: generate
        };
    });
});
