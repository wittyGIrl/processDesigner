/**
 * @fileOverview
 *
 * 定义节点基本属性
 */
define(function(require, exports, module){
    function get(defaultValue){
      defaultValue = defaultValue || {};
      return [{
        "name": "id",
        "editor": {
          "type": "none"
        }
      },{
        "name": 'name',
        "value": defaultValue.name,
        "editor": {
          "placeholder":designer.getLang('message.inputs'),
          "requiredMessage":designer.getLang('message.requiredMessage'),
          "required": true
        }
      },{
        "name": 'offsetX',
        "hidden": true
      },{
        "name": 'offsetY',
        "hidden": true
      }];
    }

    exports.get = get;
});
