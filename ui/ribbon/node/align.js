/**
 * @fileOverview
 *
 * 多节点横、纵向对齐
 *
 */
define(function(require, exports, module){
    var Designer = require('../../core/witdesigner').Designer;
    var FUI = require('../../core/fui');
    var $ = require('../../core/jquery');
    var kity = require('../../core/kity');

    Designer.registerUI('ribbon/node/align', function(designer) {
        var $tabs = designer.getUI('ribbon/tabs');
        var text = designer.getLang('ui.command.align');
        var $alignPanel = new FUI.LabelPanel({
            label: text,
            column: true
        });

        ['x','y'].forEach(function(name){
            var buttonText = designer.getLang('ui.command.align' + name);
            var $button = new FUI.Button({
                label: buttonText,
                text: buttonText,
                className: ['command-widget', 'command-button', 'align' + name]
            });
            $button.bindExecution('click',  function() {
                var nodes = designer.getSelectedNodes().slice();
                if(nodes.length === 0) return;
                designer.executeCommand('AlignNode', nodes, name);
            });

            $button.bindCommandState(designer, name, false,
                function(){
                    return designer.getSelectedNodes().length > 1;
                },
                function(){
                    return true;
                }
            );

            $button.appendTo($alignPanel);
        });

        $alignPanel.appendTo($tabs.node);

        return $alignPanel;
    });
});
