/**
 * @fileOverview
 *
 * 快速访问区域
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
define(function(require, exports, module){
    var Designer = require('../core/witdesigner').Designer;
    var FUI = require('../core/fui');
    var $ = require('../core/jquery');

    Designer.registerUI('topbar/quickvisit', function (designer) {

        var rightDocks = [];

        function btn(name, dockRight) {
            var $btn = $('<a class="quick-visit-button"></a>')
                .text(designer.getLang('ui.quickvisit.' + name))
                .attr('title', designer.getLang('ui.quickvisit.' + name))
                .addClass(name);

            if (dockRight) {
                rightDocks.push($btn);
            }
            else {
                $btn.appendTo('#panel');
            }
            return $btn;
        }

        var $save = btn('save'),
            $deploy = btn('deploy'),
            $deployNewVersion = btn('deployNewVersion');
            //$new = btn('new');

        var ret = {
            //$new: $new,
            $save: $save,
            $deploy: $deploy ,
            $deployNewVersion: $deployNewVersion
        };

        designer.on('uiready', function quickVisit() {

            while (rightDocks.length) $('#panel #search').after(rightDocks.shift());


            function quickSave() {
                var data = designer.exportJson();
                var save = designer.getOption('save');
                if(save){
                   save.call(designer, data);
                }
            }
            function quickDeploy() {
                var data = designer.exportJson();
                var deploy = designer.getOption('deploy');
                if(deploy){
                   deploy.call(designer, data);
                }
            }
            function quickDeployNewVersion() {
                var data = designer.exportJson();
                var deployNewVersion = designer.getOption('deployNewVersion');
                if(deployNewVersion){
                   deployNewVersion.call(designer, data);
                }
            }

            $save.click(quickSave);
            $deploy.click(quickDeploy);
            $deployNewVersion.click(quickDeployNewVersion);

            // designer.addShortcut('ctrl+alt+n', quickNew);
            // designer.addShortcut('ctrl+s', quickSave);
            // designer.addShortcut('ctrl+alt+s', quickShare);
            // designer.addShortcut('ctrl+shift+s', function() {
            //     var $menu = designer.getUI('menu/menu');
            //     $menu.$tabs.select(2);
            //     $menu.show();
            // });

            ret.ready = true;
            //ret.quickNew = quickNew;
            ret.quickSave = quickSave;
            //ret.quickShare = quickShare;

        });

        ret.add = btn;

        return ret;
    });

});
