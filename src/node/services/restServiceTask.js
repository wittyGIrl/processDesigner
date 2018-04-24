/**
 * @fileOverview
 *
 * 其他服务
 */
define(function (require, exports, module) {
  var kity = require('../../core/kity');
  var utils = require('../../core/utils');

  var Designer = require('../../core/designer');
  var OutlineManager = require('../../core/outline');

  var Renderer = require('../../core/render');
  var ioSpecification=require('../mixins/dataSet/ioSpecification');


  var restServiceTaskShape = kity.createClass('restServiceTaskShape', {
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
     var cir = new kity.Path().stroke(node.getStyle('normal-stroke'), 2);
     var text = new kity.Path().stroke(node.getStyle('normal-stroke'), 2);
     group.addShape(rect);
     group.addShape(cir);
     group.addShape(text);
      group.setId(utils.uuid('restServiceTask'));
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
      outline.height = box.height;
      outline.setRadius(5);
      //
      var cir = shapes[1];
      var x = box.x + 4;
      var y = box.y + 4;
      var redius = 5,
        space = 3;
      cir.getDrawer().clear()
        .moveTo(x+8,y+6)
        .carcTo(redius*1.2,1,1,x+7,y+7)
        .moveTo(x+10,y+4)
        .carcTo(redius*1.1,1,0,x+8,y+10)
        // .moveTo(x+10,y+4)
        // .lineTo(x+12,y+2)
        .moveTo(x+2,y+2)
        .lineTo(x-1,y-1)
        .moveTo(x+5,y+1)
        .lineTo(x+5,y-2)
        .moveTo(x+8,y+3)
        .lineTo(x+11,y)
        .moveTo(x+1,y+5)
        .lineTo(x-3,y+5)
        .moveTo(x+5,y+7)
        .lineTo(x+4,y+4)
        .moveTo(x+1,y+8)
        .lineTo(x+1,y+11)
        .moveTo(x+2,y+10)
        .lineTo(x+1,y+13)
        /*外圈圆到此结束*/
        .moveTo(x+10,y+10)//制造圆心
        .lineTo(x+12,y+12)
        .moveTo(x+8,y+8)
        .lineTo(x+6,y+6)
        .moveTo(x+12,y+5)//以下为顺时针设置齿轮
        .lineTo(x+14,y+2)
        .moveTo(x+16,y+9)
        .lineTo(x+19,y+5)
        .moveTo(x+17,y+11)
        .lineTo(x+21,y+11)
        .moveTo(x+15,y+15)
        .lineTo(x+18,y+18)
        .moveTo(x+11,y+17)
        .lineTo(x+12,y+19)
        .moveTo(x+7,y+14)
        .lineTo(x+5,y+17)
        var text = shapes[2];
        var x = box.x + 27;
        var y = box.y + 4;
        var redius = 5,
          space = 3;
        text.getDrawer().clear()
        .moveTo(x,y)
        .lineTo(x,y+10)
        .moveTo(x,y)
        .carcTo(redius*0.7,1,1,x,y+5)
        .moveTo(x+4,y+6)
        .lineTo(x+6,y+10)
      return box;
    }
  });

  Designer.registerOutline('restServiceTask', restServiceTaskShape);

  var attributes = require('../mixins/basicAttributes');
  var note = require('../mixins/note');
  var resourceRole = require('../mixins/resourceRole');


  var dataInputAssociations=require('../mixins/dataSet/dataInputAssociations');
  var dataInputAssociation=require('../mixins/dataSet/dataInputAssociation');


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
  restServiceTaskShape.getProperty = function (designer,json) {
    var attrs=attributes.get();
    var isImport = json.isImport;
    function test(){
      if(json && json.property){
        var children=json.property.children;
        children.forEach(function (child, i) {
        if (child.name === 'ioSpecification') {
          ioSpec = child;
          ioIndex = i;
        }
      })
        ioSpecification.beforeImport(ioSpec);
        children[ioIndex] = ioSpec;
        if(children.length>1){
          var newObject=new Array();
          for(var i=1;i<children.length;i++){
            if(children[i].name=='dataInputAssociation'){
                var idEditor=new Object();
                idEditor.type="none";
                var editorObj0=new Object();//获取editor内容
                editorObj0.type="combobox";
                editorObj0.options=sourceRefData;
                var newTarget=new Array();
                var editorObj1=new Object();//获取editor内容
            //    children[i].attributes[0].editor=idEditor;
                children[i].children[0].children[0].editor=editorObj0;
                newObject[i-1]=utils.deepCopy(children[i]);
                children[i].hidden=true;
              }
          }
           children[1].children=newObject;
        }
      }
    }
    setTimeout(test,500);
    attrs.push({
      "name": "implementation",
      "editor": {
        "placeholder":designer.getLang('message.inputs'),
        "type": "textbox"
      }
    });
    attrs.push({
      "name": 'operationRef',
      "editor": {
        "type": "combobox",
        "options": designer.getOption('optMethod')
      }
    });
    attrs.push({
      "name": 'returnType',
      "editor": {
        "type": "combobox",
        "options": designer.getOption('returnType')
      }
    });
    attrs.push({
      "name": 'timeout',
      'editor':{
        'placeholder':designer.getLang('label.second'),
        'onKeyPress':function(e){
          var e=e||window.event;
          if (e.which < 48 || e.which > 57)
            e.preventDefault();
        },
      }
    });
    attrs.push({
      "name": 'serviceUsername',
      "editor":{
        "placeholder":designer.getLang('message.inputs'),
        "requiredMessage":designer.getLang('message.requiredMessage'),
      }
    });
    attrs.push({
      "name": 'password',
      "editor":{
        'type':'password',
      }
    });
    return {
      "name": "restServiceTask",
      "attributes": attrs,
      "children": [
        ioSpecification.get(designer),
        dataInputAssociations.get()
      ],
    };
  };
    restServiceTaskShape.beforeExport=function(designer, node, json){
      var ioSpec, ioIndex;
      var children=json.children;
      children.forEach(function (child, i) {
        if (child.name === 'ioSpecification') {
          ioSpec = utils.copy(child);
          ioIndex = i;
        }
      });
      ioSpecification.beforeExport(ioSpec);
      for(i=0;i<json.children.length;i++){
        if(json.children[i].name=='dataInputAssociations'){
          var t=1;
          for(var j=0;j<json.children[i].children.length;j++){
            if(json.children[i].children[j])
              json.children[++t]=utils.deepCopy(json.children[i].children[j]);
            if(json.children[i].children[j]&&(json.children[i].children[j].name=='dataInput'||json.children[i].children[j].name=='dataOutput'))
              json.children[i].children[j].hidden='true';
          }
        }
        else if(json.children[i].name=='dataInputAssociation')
          json.children[i].hidden=true;
      }
    children[ioIndex] = ioSpec;
    }
    exports.updateValue=updateValue;
});
