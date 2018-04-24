/**
 * @fileOverview
 *
 * lazy save when doc changed
 * @author: Bryce
 */

define(function(require, exports, module) {
    var Designer = require('../core/witdesigner').Designer;
    var Store = require('../core/store');
    var Notice = require('../widget/notice');

    Designer.registerUI('autosave', function(designer) {
        var autoSaveTimer;

        var $statusSpan = designer.getUI('topbar/status');

        var autoSaveText = designer.getLang('ui.status.autoSave');
        var localStoreText =  designer.getLang('ui.status.localStore');
        var autoSaveErrorText =  designer.getLang('ui.status.autoSaveError');

        designer.on('docchange', autoSave);

        designer.addShortcut('normal::ctrl+s', save);

        function autoSave() {
            var duration = designer.getOption('autoSaveDuration');
            //console.log(e.type + ' autosave\n');
            if(duration !== null && duration !== undefined &&
                duration !== false
            ){
                duration *= 1000;
                if(autoSaveTimer){
                    clearTimeout(autoSaveTimer);
                }

                autoSaveTimer = setTimeout(save, duration);
            }
        }

        function save(){
            var proc = designer.exportJson();
            if(proc){
                Store.set('process', proc);
                var autoSaveFunc = designer.getOption('autoSave');
                if(navigator.onLine && autoSaveFunc){
                    if(autoSaveFunc){
                        autoSaveFunc.call(designer, proc,
                            function(){
                                Notice.show('', autoSaveText);
                                $statusSpan.text(autoSaveText);
                            },
                            function(){
                                $statusSpan.text(autoSaveErrorText);
                            }
                        );
                    }
                }
                else{
                    Notice.show('', localStoreText);
                    $statusSpan.text(localStoreText);
                }
            }
        }
    });
});
