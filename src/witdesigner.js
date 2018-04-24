/**
 * @fileOverview
 *
 * 默认导出（全部模块）
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
define(function(require, exports, module) {
    var Designer = require('./core/designer');
    var witdesigner = {
        version: Designer.version
    };
    witdesigner.Utils = require('./core/utils');

    //模块的引入顺序决定InitHook中的执行顺序
    witdesigner.Designer = Designer;
    witdesigner.Command = require('./core/command');
    witdesigner.Node = require('./core/node');

    require('./core/option');
    witdesigner.Event = require('./core/event');
    require('./core/status');
    require('./core/paper');
    require('./core/shortcut');

    require('./core/select');

    witdesigner.KeyMap = require('./core/keymap');

    witdesigner.Module = require('./core/module');

    witdesigner.Layout = require('./core/layout');
    witdesigner.Theme = require('./core/theme');

    witdesigner.Render = require('./core/render');
    witdesigner.Data = require('./core/data');
    require('./core/line');
    require('./core/outline');
    require('./core/lang');

    //modules
    require('./module/text');
    require('./module/marker');
    require('./module/eventDefinition');
    require('./module/node');
    require('./module/outline');
    require('./module/select');
    witdesigner.NodeDragger = require('./module/drag');
    witdesigner.TreeDragger = require('./module/dragTree');
    require('./module/line');
    require('./module/view');
    require('./module/lineControl');
    require('./module/lineInflectionLock');
    require('./module/lineEndDragger');
    require('./module/note');
    require('./module/keynav');
    require('./module/clipboard');
    require('./module/zoom');
    require('./module/history');
    require('./module/pin');
    require('./module/align');

    //layout
    require('./layout/default');

    //line moduls
    require('./line/lineshadow');
    require('./line/text');
    require('./line/drag');

    //connect
    // require('./connect/default');
    require('./connect/inflectionLockable');


    //theme
    require('./theme/default');

    //node
    require('./node/event/startEvent');

    require('./node/event/endEvent');
    require('./node/event/terminateEndEvent');

    require('./node/event/boundaryEvent');

    require('./node/eventDefinition/eventDefinition');
    require('./node/eventDefinition/terminateEventDefinition');
    require('./node/eventDefinition/timerEventDefinition');

    require('./node/activity/scriptTask');
    require('./node/activity/userTask');
    require('./node/activity/sendTask');
    require('./node/activity/callActivity');
    require('./node/services/restServiceTask');


    require('./node/markers/loopCharacteristics');

    require('./node/gateway/gateway');
    require('./node/gateway/exclusiveGateway');
    require('./node/gateway/inclusiveGateway');
    require('./node/data/dataInput');
    require('./node/data/dataOutput');
    require('./node/process');
    require('./node/line');

    module.exports = witdesigner;
});
