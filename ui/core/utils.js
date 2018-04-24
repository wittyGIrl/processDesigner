/**
 * @fileOverview
 *
 * utils
 *
 */
define(function (require, exports, module) {
  var witdesigner = require('./witdesigner');
  var Utils = witdesigner.Utils;

  Utils.extend(Utils, {
    stringFormate: function (str, param) {
      return str.replace(/{([0-9a-zA-Z_\.]+)}/g, function () {
        var key = arguments[1];
        if(!key)return '';
        if (~key.indexOf('.')){
            var keyArr = key.split('.');
            var arr = [];
            keyArr.forEach(function(item){
              arr.push(param[item] || item);
            });
            return arr.join(' ');
        }
        return param[key] || key;
      });
    }
  });

  module.exports = Utils;
});
