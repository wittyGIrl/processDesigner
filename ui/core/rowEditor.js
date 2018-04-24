/**
* @fileOverview
*
* 定义特殊行的editor
*
* 存在特殊行的editor是定义在row中的。
* 而后端返回的Json中是不带editor，所以把特殊行的editor定义在此处。
*/
define(function(require, exports, module){
    var $ = require('./jquery');
    var Designer = require('../core/witdesigner').Designer;

    var rowEditors;

    Designer.registerUI('topbar/history', function(designer) {
        rowEditors = {
            terminateWhenReject:{
                value:{
                    type: "checkbox",
                    options: {"on":'true',"off":'false',
                        data:[
                            {value:"true", text:'是'},
                            {value:"false", text:'否'}
                        ]
                    }
                }
            },
            priority:{
                value:{
                    type: "combobox",
                    options: {
                        editable: false,
                        data:designer.getOption('priorityType')
                    }
            }},
            attachmentRight:{
                value:{
                    type: "combobox",
                    options: {
                        editable: false,
                        data:designer.getOption('attachmentRightType')
                    }
                }
            },
            scriptFormat:{
                value:{
                    type: "combobox",
                    options: {
                        editable: false,
                        data: designer.getOption('scriptFormatType')
                    }
                }
            }
        };
    });
    module.exports = {
        editors: rowEditors,

        checkRowEditors: function(rows){
            if(!rowEditors)return;
            var i,l,row;
            for(i=0,l=rows.length; i<l; i++){
                row = rows[i];
                if(rowEditors[row.name]){
                    row.editor = rowEditors[row.name];
                }
            }
        }
    };
});
