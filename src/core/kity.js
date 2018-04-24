/**
 * @fileOverview
 *
 * Kity 引入
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
define(function(require, exports, module) {
  var kity = window.kity;

  kity.extendClass(kity.Box, {
    translate: function(x, y){
      if(!kity.Utils.isNumber(x)){
        y = x.y;
        x = x.x;
      }
      return new kity.Box(this.x + x, this.y + y, this.width, this.height);
    },
  });

  module.exports = kity;
});
