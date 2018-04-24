/**
* @fileOverview
*
* 生成与指定命令绑定的下拉选框
* @author: techird
* @copyright: Baidu FEX, 2014
*/
define(function(require, exports, module){
    var Designer = require('../core/witdesigner').Designer;
    var FUI = require('../core/fui');
    var $ = require('../core/jquery');

    Designer.registerUI('widget/commandselectmenu', function(designer) {
        function mapValueWidget(command, valueList) {
            return valueList.map(function(value) {
                var text = designer.getLang([command, value].join('.')) || value;
                return {
                    clazz: 'Button',
                    label: text,
                    text: text,
                    value: value,
                    className: [command, value].join(' ')
                };
            });
        }

        function generate(command, valueList, column) {

            var $selectMenu = new FUI.SelectMenu({
                widgets: typeof(valueList[0]) === 'object' ? valueList : mapValueWidget(command, valueList),
                className: ['command-widget', 'command-selectmenu', command].join(' '),
                column: column || 3
            });

            $selectMenu.bindExecution('change', function() {
                designer.executeCommand(command,'' ,$selectMenu.getValue());
            });

            $selectMenu.bindCommandState(designer, command, function(value) {
                if (value !== undefined) this.selectByValue(value);
            });

            return $selectMenu;
        }

        return {
            generate: generate
        };
    });
});
