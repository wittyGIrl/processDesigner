/**
 * @fileOverview
 *
 * line
 */
define(function (require, exports, module) {
  var kity = require('../core/kity');

  var Designer = require('../core/designer');

  var formalExpression  = require('./mixins/formalExpression');

  kity.extendClass(Designer, {
    getLineDefaultProps: function (condition) {
      var designer = this;
      return {
        "name": "sequenceFlow",
        "hideTitle": true,
        "attributes": [{
          "name": "id",
          "hidden": "true",
          // "editor": {
          //   "type": "none"
          // }
        }, {
          "name": 'name'
        }, {
          "name": 'actionId',
          "hidden": true
        }, {
          "name": 'offsetX',
          "hidden": true
        }, {
          "name": 'offsetY',
          "hidden": true
        }, {
          "name": 'targetRef',
          "hidden": true
        }, {
          "name": 'sourceRef',
          "hidden": true
        }, {
          "name": 'startPos',
          "hidden": true
        }, {
          "name": 'endPos',
          "hidden": true
        }, {
          "name": 'inflections',
          "hidden": true
        }],
        "children": [
          formalExpression.get(designer, {name: 'conditionExpression', value: condition}, 'conditionExpression', true)
        ]
      };
    }
  });

});
