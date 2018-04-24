/**
 * @fileOverview
 *
 * 子流程
 */
define(function (require, exports, module) {
  var kity = require('../../core/kity');
  var utils = require('../../core/utils');

  var Designer = require('../../core/designer');
  var OutlineManager = require('../../core/outline');

  var Renderer = require('../../core/render');


  var callActivityShape = kity.createClass('callActivityShape', {
    base: OutlineManager,
    create: function (node) {
      var group = new kity.Group();
      var rect = new kity.Rect().pipe(function () {
        this.stroke(
          node.getStyle('normal-stroke'),
          node.getStyle('stroke-width')
        );
        this.fill(node.getStyle('background'));
      });
      //子流程的图形标志
      var sign = new kity.Path().stroke(node.getStyle('normal-stroke'), 1);
      group.addShape(rect);
      group.addShape(sign);
        //sign.on('click', function() {
        //if(attrs && attrs[7].value){
        //var data='../src/cancel.png';
        // $.ajax({
        //   url: "GetProcessDefinition?id=35",
        //   type: 'get',
        //   async: true,
        //   success:function(data){
        //     //getpropery.name.value=data.json.children[0].attributes[1].value;
        //   //  var t='../src/text.svg';
        //   console.log(data);
        //
        //   //  var image=new kity.Image(t,30,70);
        //   //  rect.setWidth(100).setHeight(100);
        //   //  group.addShape(image);
        //   //  rect.setBox(image.getBoundaryBox().expand(-15.-10,15,10));
        //   }
        // });
      //});
      group.setId(utils.uuid('callActivity'));
      this._node = node;
      this._outlineShape = group;

      return this._outlineShape;
    },
    doUpdate: function (outlineGroup, node, box) {
      var shapes = outlineGroup.getShapes();
      var outline = shapes[0];
      outline.x = box.x;
      outline.y = box.y;
      outline.width = box.width;
      outline.height = box.height+10;
      outline.setRadius(5);

       var sign = shapes[1];
       var x = box.x;
       var y = box.y;
      var width=box.width/2,
          height=box.height/2;
          space=(height+1)/2;
      if(sign){
       sign.getDrawer().clear().pipe(function(d){
          d.moveTo(x+width-space-1,y+height+space/2+8);
          d.lineTo(x+width+space+1,y+height+space/2+8);
          d.lineTo(x+width+space+1,y+box.height+10);
          d.lineTo(x+width-space-1,y+box.height+10);
          d.lineTo(x+width-space-1,y+height+space/2+8);
          d.moveTo(x+width-space+2,y+height+space+2+10);
          d.lineTo(x+width+space-2,y+height+space+2+10);
          d.moveTo(x+width,y+height+2+space/2+8);
          d.lineTo(x+width,y+box.height-2+10);
          d.close();
       });
     }
      return box;
    }
  });

  Designer.registerOutline('callActivity', callActivityShape);

  var attributes = require('../mixins/attributes');
  var note = require('../mixins/note');
  var resourceRole = require('../mixins/resourceRole');


  var dataInputAssociations=require('../mixins/dataInputAssociations');
  var dataInputAssociation=require('../mixins/dataInputAssociation');

  var sourceRefData=new Array;
  function updateValue(json, input){
    var firstData=new Object();
    firstData.text=designer.getLang('label.choose');
    sourceRefData[0]=firstData;
    for(var i=0;i<input.length;i++){
      if(!input[i].attributes[0].value)
      input.splice(i,1);
    }
    for(var i=0;i<input.length;i++)
    {
      var data=new Object();
      data.text=input[i].attributes[0].value;
      data.value=input[i].attributes[0].value;
      data.type=input[i].attributes[2].value;
      sourceRefData[i+1]=data;
    }
    return sourceRefData;
  }

  callActivityShape.getProperty = function (options, json) {
    var attrs=attributes.get();
    var isImport = options.isImport;
    var values;
    if(json && json.property ){
         values=json.property.attributes[7].value;
    }
    attrs.push({
      "name": "terminateProcessWhenRejected",
      "value": "true",
      "editor": {
        "type": "checkbox"
      }
    });
    attrs.push({
      "name": 'pins',
      "value": isImport ? 'false' : 'true',
      "editor": {
        "type": "checkbox"
      }
    });
    attrs.push({
      "name": 'calledElement',
      "editor":{
        "type":"getSelect",
        "label":designer.getLang('label.choice'),
        "onClick": function() {
          var popupWindow = designer.getOption("popupWindow");
          var propertyEditor = designer.getUI("ribbon/node/property");
          if (popupWindow && propertyEditor) {
              popupWindow(this, propertyEditor, {
                type: "processPath"
              });
          }
        }
      }
    });

    function test(){
      if(json.property && json.property.children)
        {
         var dataObject=json.property.children;
         var newObject=new Array();
         for(var i=1;i<dataObject.length;i++){
           var idEditor=new Object();
           idEditor.type="none";
           var editorObj0=new Object();//获取editor内容
           editorObj0.type="combobox";
           editorObj0.options=sourceRefData;
           var newTarget=new Array();
           var editorObj1=new Object();//获取editor内容
           editorObj1.type="combobox";
           editorObj1.options=dataInputAssociations.childProcess(newTarget, json.property.attributes);
           dataObject[i].attributes[0].editor=idEditor;
           dataObject[i].children[0].children[0].editor=editorObj0;
           dataObject[i].children[1].children[0].editor=editorObj1;
           newObject[i-1]=utils.deepCopy(dataObject[i]);
           dataObject[i].hidden=true;
         }
         dataObject[0].children=newObject;
       }
    }
    setTimeout(test,100);

    var datas= {
      "name": "callActivity",
      "attributes": attrs,
      "children": [dataInputAssociations.get(attrs)],
    };
    return datas;
  };

  callActivityShape.beforeExport=function(designer, node, json){
      json.children.length=1;
      for(var i=0; i<json.children[0].children.length; i++){
        json.children[i+1]=utils.deepCopy(json.children[0].children[i]);
        // }
      }
      for(var i=1;i<json.children.length;i++)
      {
        json.children[i].hidden=true;
      }

      return json;
  }

  /*类型检查函数,检测是否匹配,传入的参数是一个dataInputAssociation对象*/
  function typeCheck(checkData){
    if(checkData && checkData.children){
      var source=checkData.children[0].children[0].value;
      var target=checkData.children[1].children[0].value;
      var sourceType,targetType;
      for(var i=0;i<checkData.children[0].children[0].editor.options.length;i++)
        if(checkData.children[0].children[0].editor.options[i].value==source)
          sourceType=checkData.children[0].children[0].editor.options[i].type;
      for(var i=0;i<checkData.children[1].children[0].editor.options.length;i++)
        if(checkData.children[1].children[0].editor.options[i].value==target)
          targetType=checkData.children[1].children[0].editor.options[i].type;
      switch (sourceType) {
        case "xsd:int":
          if(targetType=="xsd:int" || targetType=="xsd:decimal")
            return false;
          else
            return true;
          break;
        case "xsd: string":
            if(targetType=="string")
              return false;
            else
              return true;
            break;
        case "xsd: decimal":
            if(targetType=="decimal")
              return false;
            else
              return true;
            break;
        case "xsd: bool":
            if(targetType=="bool")
              return false;
            else
              return true;
            break;
        case "xsd: datetime":
            if(targetType=="datetime")
              return false;
            else
              return true;
            break;
        default: return true;
            break;

      }
    }
  }

  exports.updateValue=updateValue;
});
