/**
 * @fileOverview
 *
 * 主菜单控制
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
define(function(require, exports, module){
    var Designer = require('../core/witdesigner').Designer;
    var FUI = require('../core/fui');
    var $ = require('../core/jquery');
    var event = require('../core/event');

    Designer.registerUI('menu/menu', function(designer) {

        var ret = event.setup({});
        var $menutab = designer.getUI('widget/menutab');

        // 主菜单容器
        var $panel = $('<div>')
            .attr('id', 'main-menu')
            .css('display', 'none')
            .appendTo('#content-wrapper');

        // 主菜单按钮
        var $button = new FUI.Button({

            id: 'main-menu-btn',
            label: designer.getLang('ui.menu.mainmenutext')

        }).appendTo(document.getElementById('panel'));

        // 一级菜单选项卡
        var $tabs = new FUI.Tabs({
            className: 'main-menu-level1'
        }).appendTo($panel[0]);

        var timer;

        function show() {
            $panel.css('display', 'block');
            clearTimeout(timer);
            timer = setTimeout(function() {
                $panel.addClass('show');
                ret.fire('show');
            });
        }

        function hide() {
            ret.fire('hide');
            $panel.removeClass('show');
            designer.getRenderTarget().focus();
            timer = setTimeout(function() {
                $panel.css('display', 'none');
            });
        }

        function isVisible() {
            return $panel.hasClass('show');
        }

        function toggle() {
            if ($('#content-wrapper').hasClass('fullscreen')) return;
            (isVisible() ? hide : show)();
        }

        function createSub(name, asDefault) {
            var $sub = $menutab.generate($tabs, name, asDefault);
            var menu = designer.getLang('ui.menu');
            var $h2 = $('<h2></h2>')
                .text(menu[name + 'Header'] || menu[name])
                .appendTo($sub);
            return $sub;
        }

        function createSubMenu(name, asDefault) {
            var $sub = createSub(name, asDefault);
            var $subtabs = new FUI.Tabs().appendTo($sub);
            return {
                $tabs: $subtabs,
                createSub: function(subname, asDefault) {
                    return $menutab.generate($subtabs, subname, asDefault);
                }
            };
        }

        designer.addShortcut('esc', toggle);

        $button.on('click', toggle);
        designer.on('click', function(e) {
            if (e.originEvent.button) return;
            if(isVisible()){
                hide();
            }
        });
        // expose
        ret.show = show;
        ret.hide = hide;
        ret.toggle = toggle;
        ret.isVisible = isVisible;
        ret.createSub = createSub;
        ret.createSubMenu = createSubMenu;
        ret.$panel = $panel;
        ret.$button = $button;
        ret.$tabs = $tabs;

        return ret;
    });
});
