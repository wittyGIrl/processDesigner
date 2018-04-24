define(function(require, exports, module) {
  var formalExpression  = require('./formalExpression');

  function get(designer, defaultValue, targetName) {
    defaultValue = defaultValue || {};
    return {
      "name": defaultValue.name,
      "children": [{
        "name": "resourceAssignmentExpression",
        "hideItself": true,
        "children": [
          formalExpression.get(designer, defaultValue.expression, targetName),
        ]
      }]
    };
  }

  exports.get = get;
});
