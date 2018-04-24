/**
 * @fileOverview
 *
 * 节点操作（编辑和删除）
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
define(function(require, exports, module){
    var Designer = require('../../core/witdesigner').Designer;
    var FUI = require('../../core/fui');
    var $ = require('../../core/jquery');
    var kity = require('../../core/kity');

    Designer.registerUI('ribbon/node/operation', function(designer) {
        var $tabs = designer.getUI('ribbon/tabs');
        var text = designer.getLang('ui.command.operation');
        var $operationPanel = new FUI.LabelPanel({
            label: text,
            column: true
        });

        var name = 'remove';
        var buttonText = designer.getLang('ui.command.' + name);
        var $button = new FUI.Button({
            label: buttonText,
            text: buttonText,
            className: ['command-widget', 'command-button', name]
        });

        $button.bindExecution('click',  function() {
            if(designer.getSelectedNode()){
                designer.executeCommand('RemoveNode');
            }
            if(designer.getSelectedLine()){
                designer.executeCommand('RemoveLine');
            }
        });

        $button.bindCommandState(designer, name, false,
            function(){
                return designer.getSelectedNodes().length > 0 || designer.getSelectedLines().length > 0;
            },
            function(){
                return true;
            }
        );

        $button.appendTo($operationPanel);
        $operationPanel.appendTo($tabs.node);

        return $operationPanel;
    });
});
