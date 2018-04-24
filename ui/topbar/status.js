/**
 * @fileOverview
 *
 * 显示当前文件的保存状态
 *
 * @author: Bryce
 */
define(function(require, exports, module){
    var Designer = require('../core/witdesigner').Designer;
    var FUI = require('../core/fui');
    var $ = require('../core/jquery');
    var Utils = require('../core/utils');

    Designer.registerUI('topbar/status', function(designer) {
        var $statusSpan = $('<span class = "file-status">' +
            designer.getLang('ui.status.ready') + '</span>'
        ).appendTo(document.getElementById('panel'));

        var text = designer.getLang('ui.status.draftStatus');
        var hint = designer.getLang('ui.status.draftHint');
        designer.on('import', function(e){
            if(e && e.source === 'draft'){
                $statusSpan.html('<a title="' + hint + '" draftId="' +
                e.draftId + '">' + text + '</a>');
            }
        });

        var readyText = designer.getLang('ui.status.ready');
        var discardDraftUrl = designer.getOption('discardDraftUrl');
        $statusSpan.delegate('a', 'click', function(e){
            if(discardDraftUrl){
                $.ajax({
                    url: discardDraftUrl + '&id=' + $(e.currentTarget).attr('draftId'),
                    async: false,
                    type: "post",
                    showProgressbar: false,
                    success: function (data, textStatus) {
                        if(data){
                            designer.importJson(data);
                        }
                        $statusSpan.text(readyText);
                    }
                });
            }
        });
        return $statusSpan;
    });
});
