/**
 * @fileOverview
 *
 * LoopCharacteristics
 */
define(function (require, exports, module) {
  var utils = require('../../core/utils');
  var kity = require('../../core/kity');

  var Designer = require('../../core/designer');

  var loopCharacteristics = {
    create: function (node) {
      var shape = new kity.Path().stroke(
        node.getStyle('normal-stroke'),
        node.getStyle('stroke-width')
      );
      return shape;
    },
    update: function (shape, node, box) {
      var xIncrement, yIncrement, xSpace, ySpace;
      var space = 4;
      var x = box.x + box.width / 2 - space,
        y = box.bottom;
      var isSequential = node.getData('isSequential');
      if(typeof isSequential === 'undefined'){
        isSequential = true;
      }
      if(!isSequential){
        yIncrement = 10;
        xSpace = space;
        xIncrement = ySpace = 0;
      }
      else{
        xIncrement = 10;
        ySpace = space;
        yIncrement = xSpace = 0;
      }
      var drawer = shape.getDrawer().clear();
      for(var i = 0; i < 3; i++){
        drawer.moveTo(x, y).lineTo(x + xIncrement, y + yIncrement);
        x += xSpace;
        y += ySpace;
      }
      return box.expand(0, 0, 12, 0);
    }
  };

  Designer.registerMarker('loopCharacteristics', loopCharacteristics);

  module.exports = loopCharacteristics;
});
