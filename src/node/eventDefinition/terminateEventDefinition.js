/**
 * @fileOverview
 *
 * TerminateEventDefinition
 */
define(function (require, exports, module) {
  var utils = require('../../core/utils');
  var kity = require('../../core/kity');

  var Designer = require('../../core/designer');

  var terminateEventDefinition = {
    create: function (node, width, height) {
      var sign = new kity.Circle().pipe(function () {
        this.fill(node.getStyle('normal-stroke'));
      });

      // this._node = node;
      return sign;
    },
    update: function (sign, node, box) {
      var radius = 10;
      //设置半径
      sign.setRadius(radius).setCenter(box.cx, box.cy);

      return sign.getRenderBox();
    }
  };


  terminateEventDefinition.getProperty = function () {
    return {
      name: "terminateEventDefinition",
      hidden: true,
      attributes: [{
        name: "id",
        value: 'terminateEventDefinition_' + utils.guid(),
      }]
    };
  };

  Designer.registerEventDefinition('terminateEventDefinition', terminateEventDefinition);

  module.exports = terminateEventDefinition;
});
