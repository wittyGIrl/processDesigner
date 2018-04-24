/**
 * @fileOverview
 *
 * XSS Protection
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

define(function(require, exports, module){
    var Designer = require('./witdesigner').Designer;
    var $ = require('./jquery');

    Designer.registerUI('axss', function() {
        function axss(value) {
            var div = document.createElement('div');
            div.innerHTML = value;
            $(div).find('script, iframe, link').remove();
            for (var name in div) {
                if (name.indexOf('on') === 0) {
                    div.removeAttribute(name);
                }
            }
            return div.innerHTML;
        }
        return axss;
    });
});
