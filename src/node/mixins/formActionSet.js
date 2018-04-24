define(function(require, exports, module){
    var formActionGroup = require('./formActionGroup');

    function get(designer){
      return {
          "name": "formActionSet",
          "variableChildren": true,
          "defaultChild": formActionGroup.def.bind(null, designer),
          "children": [formActionGroup.get(designer)]
      };
    }

    function beforeImport(actionSet) {
      if(!actionSet || !actionSet.children)return;
      actionSet.children.forEach(function(group){
        formActionGroup.beforeImport(group);
      });
    }

    exports.get = get;
    exports.beforeImport = beforeImport;
});
