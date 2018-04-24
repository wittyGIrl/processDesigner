/**
 * @fileOverview
 *
 *
 * @author: Bryce
 */

/* global alert:true, $:true */
define(function(require, exports, module) {
    module.exports.show = function(title, message, type, timeout){
        if($ && $.messager){
            var messageBox = $.messager.show({
                title: title,
                msg: message,
                showType: type || 'slide',
                timeout: timeout || 2000,
                width: 150,
                height: 80,
                style:{
                    right: '',
                    top: 10,
                    bottom: '',
                    //left: ''
                }
            });

        }
        else{
            //alert(message);
        }
    };
});
