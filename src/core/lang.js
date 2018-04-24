/**
* @fileOverview
*
*  添加多语言模块
*
* @author: techird
* @copyright: Baidu FEX, 2014
*/

define(function(require, exports, module){
    var Designer = require('./designer');
    var kity = require('./kity');

    kity.extendClass( Designer, {
        getLang: function ( path ) {
            var lang = langType;
            if ( !lang ) {
                throw Error( "not import language file" );
            }
            path = ( path || "" ).split( "." );
            for ( var i = 0, ci; ci = path[ i++ ]; ) {
                lang = lang[ ci ];
                if ( !lang ) break;
            }

            if (typeof(lang) == 'string') {
                var args = arguments;
                return lang.replace(/\{(\d+)\}/ig, function(match, gindex) {
                    return args[+gindex + 1] !== undefined && args[+gindex + 1].toString() || match;
                });
            }
            return lang;
        }
    });
});
