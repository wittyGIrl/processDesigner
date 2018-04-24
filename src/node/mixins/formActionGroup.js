define(function (require, exports, module) {
  var utils = require('../../core/utils');
  var formAction = require('./formAction');

  function get(designer) {
    var defaultActions = designer.getOption('defaultActions');
    var children = [];
    if(defaultActions && defaultActions.length > 0){
      defaultActions.forEach(function(action){
        children.push(
          formAction.get(designer, action)
        );
      });
    }
    return {
      "name": "formActionGroup",
      "variableChildren": true,
      "defaultChild": formAction.def.bind(null, designer, {type: 'approve'}),
      "children": children
    };
  }

  function def(designer) {
    return {
      "name": "formActionGroup",
      "variableChildren": true,
      "defaultChild": formAction.def.bind(null, designer, {type: 'approve'}),
      "children": [
        formAction.def(designer, {
          type: 'approve'
        })
      ]
    };
  }

  function beforeImport(group) {
    if(!group || !group.children)return;
    group.children.forEach(function(action){
      formAction.beforeImport(action);
    });
  }

  exports.get = get;
  exports.def = def;
  exports.beforeImport = beforeImport;
});
