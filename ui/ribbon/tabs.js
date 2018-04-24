/**
 * @fileOverview
 *
 * Ribbon 选项卡
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

define(function(require, exports, module) {
  var Designer = require('../core/witdesigner').Designer;
  var FUI = require('../core/fui');
  var $ = require('../core/jquery');

  Designer.registerUI('ribbon/tabs', function(designer) {
    //var memory = designer.getUI('memory');

    var $tab = new FUI.Tabs({
      buttons: ['node' /*, 'appearence', 'view'*/ ].map(function(
        key) {
        return designer.getLang('ui.tabs.' + key);
      })
    });
    //var $title = designer.getUI('topbar/title').$title;

    var $header = $('<div id="tab-select"></div>');
    var $container = $('<div id="tab-container"></div>');

    //$title.before($header);
    $('#panel').append($header).after($container);

    $tab.appendButtonTo($header[0]);
    $tab.appendPanelTo($container[0]);

    // 隐藏效果
    var lastIndex = 0;
    var muteRemember = false;
    $tab.on('tabsselect', function(e, info) {
      if (info.index == lastIndex) {
        $container.toggleClass('collapsed');
        $header.toggleClass('collapsed');
      } else {
        $container.removeClass('collapsed');
        $header.removeClass('collapsed');
      }
      if (!muteRemember) {
        //memory.set('ribbon-tab-collapsed', $container.hasClass('collapsed'));
        //memory.set('ribbon-tab-index', info.index);
      }
      lastIndex = info.index;
    });

    $tab.node = $tab.getPanel(0);
    //$tab.appearence = $tab.getPanel(1);
    //$tab.view = $tab.getPanel(2);

    //var rememberIndex = memory.get('ribbon-tab-index');
    //var rememberCollapse = memory.get('ribbon-tab-collapsed');

    // muteRemember = true;
    //$tab.select(rememberIndex || 0);
    // muteRemember = false;

    $tab.node = $tab.getPanel(0);

    // if (rememberCollapse) {
    //     $container.addClass('collapsed');
    //     $header.addClass('collapsed');
    // } else {
    //     $container.removeClass('collapsed');
    //     $header.removeClass('collapsed');
    // }
    return $tab;
  });
});
