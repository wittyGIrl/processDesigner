/**
 * @fileOverview
 *
 * 默认导出
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
define(function(require, exports, module) {

    var ui = {};
  //  require('./lang/zh-cn');
  //  require('./lang/en');
    require('./core/ui');
    require('./core/fui');
    require('./core/axss');
    require('./core/event');
    ui.Store = require('./core/store');

    //widget
    require('./widget/commandbutton');
    require('./widget/commandselectmenu');
    require('./widget/dragbutton');
    require('./widget/menutab');
    require('./widget/friendlytimespan');
    require('./widget/notice');

    // menu
    require('./menu/menu');
    require('./menu/header');
    require('./menu/history/history');
    require('./menu/history/recent');
    require('./menu/shortkey/shortkey');
    require('./menu/shortkey/keys');

    // topbar
    require('./topbar/history');
    require('./topbar/quickvisit');
    require('./topbar/status');

    // ribbon
    require('./ribbon/tabs');
    require('./ribbon/node/startEvent');
    require('./ribbon/node/endEvent');
    require('./ribbon/node/task');
    require('./ribbon/node/restServiceTask');
    require('./ribbon/node/callActivity');
    require('./ribbon/node/gateway');

    require('./ribbon/node/event');
    require('./ribbon/node/property');
    require('./ribbon/node/operation');
    require('./ribbon/node/align');

    require('./ribbon/node/note');



    require('./topbar/title');

    //module
    require('./module/nav');
    require('./module/autosave');


    module.exports = ui;
});
