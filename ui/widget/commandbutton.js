/**
 * @fileOverview
 *
 * 生成绑定到某个命令的按钮
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
 define(function(require, exports, module){
     var Designer = require('../core/witdesigner').Designer;
     var FUI = require('../core/fui');

     Designer.registerUI('widget/commandbutton', function(designer) {

         return {

             generate: function(command, onclick, enableHandler, activeHandler) {
                 var buttonText = designer.getLang('ui.command.' + command) || designer.getLang('ui.' + command);
                 var $button = new FUI.Button({
                     label: buttonText,
                     text: buttonText,
                     className: ['command-widget', 'command-button', command]
                 });

                 $button.bindExecution('click', onclick || function() {
                     designer.executeCommand.apply(designer,[command].concat(arguments));
                 });

                 $button.bindCommandState(designer, command, false, enableHandler, activeHandler );

                 return $button;
             }
         };
     });
 });
