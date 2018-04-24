/**
 * @fileOverview
 *
 * 菜单头部
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
define(function(require, exports, module){
    var Designer = require('../core/witdesigner').Designer;
    var FUI = require('../core/fui');
    var $ = require('../core/jquery');

    Designer.registerUI('menu/header', function(designer) {

        var $menu = designer.getUI('menu/menu');

        var $header = $('<div class="main-menu-header"></div>')
            .prependTo($menu.$panel);

        var $backPanel = $('<div class="main-menu-back-panel"></div>')
            .appendTo($header);

        var $titlePanel = $('<div class="main-menu-title"></div>')
            .appendTo($header);

        var $backButton = new FUI.Button({

            className: 'main-menu-back-button',
            label: designer.getLang('ui.back')

        }).appendTo($backPanel[0]).on('click', $menu.hide);

        $menu.on('show', function() {
            var $title = designer.getUI('topbar/title');
            $titlePanel.text($title.getLabel());
        });

        return $header;
    });
});
