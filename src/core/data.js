/**
 * @fileOverview
 *
 * 数据导入导出
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
define(function (require, exports, module) {
  var kity = require('./kity');
  var utils = require('./utils');
  var Designer = require('./designer');
  var DesignerNode = require('./node');
  var DesignerEvent = require('./event');

  var ioSpecification = require('../node/mixins/ioSpecification');
  var formElement = require('../node/mixins/form');
  var multiInstanceLoopCharacteristics = require('../node/mixins/multiInstanceLoopCharacteristics');

  // 导入导出
  kity.extendClass(Designer, {
    /**
     * @method exportJson()
     * @for Designer
     * @description 导出为 JSON 对象。
     * @grammar exportJson() => {plain}
     */
    exportJson: function () {
      var basic = this.getData('basic');
      var movement = this.getViewDragger().getMovement();
      var designer = this;

      setAttributes(basic, {
        id: this.getData('id'),
        offsetX: movement.x,
        offsetY: movement.y,
        zoom: this.getZoomValue() || 100
      });

      var children = basic.children.slice(0);
      var ioSpec, ioIndex;
      children.forEach(function (child, i) {
        if (child.name === 'ioSpecification') {
          ioSpec = utils.copy(child);
          ioIndex = i;
        }
      });
      ioSpecification.beforeExport(ioSpec);
      children[ioIndex] = ioSpec;

      var i, l;
    //  var itemDefinitionOwners = [];
      var roots = this.getRoots();
      for (i = 0, l = roots.length; i < l; i++) {
        children = children.concat(exportNode(roots[i]));
      }

      var originLines = this.getLines();
      var lineData, line, jsonLine, actionId;
      for (i = 0, l = originLines.length; i < l; i++) {
        line = originLines[i];
        lineData = line.getData();
        jsonLine = lineData.property;
        if(!line.endNode)break;

        if(line.startNode.getData('mode') === 'pins'){
          actionId = line.getData('actionId');
        }else{
          actionId = null;
        }
        setAttributes(jsonLine, {
          id: lineData.id,
          targetRef: line.endNode.getData('nodeId'),
          sourceRef: line.startNode.getData('nodeId'),
          startPos: line.startIndex,
          endPos: line.endIndex,
          inflections: JSON.stringify(line.inflections),
          offsetX: lineData.x,
          offsetY: lineData.y,
          actionId: actionId,
        });
        children.push(jsonLine);
      }

      var definitions = this.getData('definitions');
      if (!definitions) {
        definitions = {
          name: 'definitions'
        };
      }
      var itemDefinitions = this.getData('itemDefinitions');
      // if(itemDefinitions){
      //   itemDefinitions = itemDefinitions.filter(function(item){
      //    var owner = utils.certainName('owner', item.attributes);
      //    return owner && ~itemDefinitionOwners.indexOf(owner.value);
      //   });
      //   this.setData('itemDefinitions', itemDefinitions);
      // }
      definitions.children = itemDefinitions ? itemDefinitions.slice(0) : [];
      definitions.children.push({
        name: "process",
        attributes: basic.attributes,
        children: children
      });
      return definitions;

      function exportNode(root){
        var offset = root.getLayoutOffset();
        var node = root.getData('property');
        var attributes = {
          id: root.getData('nodeId'),
          offsetX: offset.x,
          offsetY: offset.y,
          transform: root.getLayoutTransform().toString()
        };
        var outlineManager = designer.getOutlineManagerClass(root.getData('outlineType'));
        if(outlineManager.beforeExport){
          outlineManager.beforeExport(designer, root, node, attributes);
        }

        var results = [];
        if(root.hasChildren()){
          root.children.forEach(function(child){
            results = results.concat(exportNode(child));
          });
        }

        setAttributes(node, attributes);
        if(root.getData('isLoop')){
          node = utils.extend(true, {}, node);
      //    itemDefinitionOwners.push(root.getData('nodeId'));
          multiInstanceLoopCharacteristics.beforeExport(designer, root, node);
        }
        results.push(node);
        return results;
      }

      function setAttributes(owner, attributes, deleted) {
        if (!owner || !attributes) return;
        var ownerAttrs = owner.attributes;
        if (ownerAttrs && ownerAttrs.length) {
          var value;
          ownerAttrs.forEach(function (attr, index) {
            value = attributes[attr.name];
            if (typeof value !== 'undefined') {
              attr.value = value;
            }
          });
        }
      }
    },


    /**
     * @method importJson()
     * @for Designer
     * @description 导入数据，数据为 JSON 对象。
     *
     * @grammar importJson(json) => {this}
     *
     * @param {plain} json 要导入的数据
     */
    importJson: function (json, params) {
      if (!json) return;

      //trigger event
      this._fire(new DesignerEvent('preimport', null, false));

      this.clearNode();

      var processes = json.children;
      /*此程序段实现表单权限初始化加载时隐藏的功能*/
      for(var i=0;i<processes.length;i++){
        if(processes[i].name=='process'){
          if(processes[i].children && processes[i].children[1] && processes[i].children[1].children[1]&&processes[i].children[1].children[1].children[0])
          {
            var fieldRight=processes[i].children[1].children[1].children[0].children;
            for(var j=0;j<fieldRight.length;j++)
              fieldRight[j].hidden=true;//隐藏fieldRight
          }
        }
      }
      json.children = null;
      ensureDefinitionAttributes(json);
      this.setData('definitions', json);
      var proc = null;
      var itemDefinitions = [];
      if(processes && processes.length){
        processes.forEach(function(child){
          switch (child.name) {
            case 'process':
              proc = child;
              break;
            case 'itemDefinition':
              itemDefinitions.push(child);
              break;
            default:
              break;
          }
        });
        /*删除节点遗留的itemDefinition*/
        var tempArray=new Array();
        for(var i=0;i<proc.children.length;i++){
          if(proc.children[i].name=='userTask')
            for(var j=0;j<proc.children[i].children.length;j++){
              if(proc.children[i].children[j].name=='ioSpecification'){
                for(var k=0;k<proc.children[i].children[j].children.length;k++){
                  if(proc.children[i].children[j].children[k].name=='dataInput')
                    tempArray.push(proc.children[i].children[j].children[k].attributes[2].value);
                }
              }
            }
        }
        function getRepeat(arr,val){
          var flag=0;
          for(var i=0;i<arr.length;i++){
           if(val==arr[i])
            flag=1;
          }
          if(flag==1)
            return true;
          else
            return false;
        }
        for(var i=0;i<itemDefinitions.length;i++){
          if(!getRepeat(tempArray,itemDefinitions[i].attributes[0].value))
            itemDefinitions.splice(i,1);
        }
      }
      this.setData('itemDefinitions', itemDefinitions);
      if (proc) {
        var designer = this;
        var lang = designer.getOption('lang');
        var tabsLang = designer.getLang('tabs');

        //优化：xdeepextend中，不需要复制proc.children中的线和节点，
        var procChildren = proc.children,
          nodesDic = {},
          node, lines = [],
          indexArr = [],
          basicChildren = [],
          childrenNode = [],
          ioSpec, ioIndex;
        procChildren.forEach(function (child, i) {
          if (child.name === 'sequenceFlow') {
            lines.push(child);
          } else if (designer.getOutline(child.name)) {
            if(child.name === 'boundaryEvent'){
              childrenNode.push(child);
            } else {
              importNode(designer, child, nodesDic, lang);
            }
          } else {
            if (child.name === 'ioSpecification') {
              ioSpec = child;
              ioIndex = i;
            }
            //除线和节点外，其他显示在属性页basic
            basicChildren.push(child);
            indexArr.push(i);
          }
        });
        // 先 improt 根节点，然后在 import 其子节点
        childrenNode.forEach(function(child){
          importNode(designer, child, nodesDic, lang);
        });
        lines.forEach(function (line) {
          importLine(designer, line, nodesDic);
        });

        ioSpecification.beforeImport(ioSpec);
        basicChildren[ioIndex] = ioSpec;

        var basic = {
          attributes: proc.attributes,
          children: basicChildren
        };

        basic = utils.xdeepExtend(designer.getDefaultProps(), basic);
        var basicDict = utils.arrayToDictionary(basic.children, 'name');
        var key, flag = {};
        indexArr.forEach(function (index) {
          key = procChildren[index].name;
          if (basicDict[key]) {
            flag[key] = true;
            procChildren[index] = basicDict[key];
          }
        });
        for (key in basicDict) {
          if (flag[key]) break;
          procChildren.push(basicDict[key]);
        }

        var info = utils.getInfo(basic.attributes);

        var extension = utils.certainName('extensionElements', basic.children);
        utils.setTabs(extension, designer, tabsLang);
        var displayName;
        if (extension) {
          displayName = utils.getDisplayName(
            designer, utils.certainName('displayName', extension.children),
            lang
          );
        }
        if (displayName) {
          designer.getUI('topbar/title').setLabel(displayName);
        } else {
          designer.getUI('topbar/title').setLabel(info.name);
        }

        designer.setData('id', info.value)
          .setData('property', proc)
          .setData('basic', basic);
        if (info.offsetX && info.offsetY) {
          designer.getViewDragger().moveTo(
            new kity.Point(info.offsetX - 0, info.offsetY - 0)
          );
        }
        if (info.zoom) {
          this.executeCommand('zoom', info.zoom);
        }
      }

      this.resetNotificationTemplate();
      //this.setTemplate(json.template || 'default');
      this.setTheme(json.theme || 'default');
      this.refresh();

      /**
       * @event import,contentchange,interactchange
       * @for Designer
       * @when 导入数据之后
       */
      this.fire('import', params);

      this._firePharse({
        type: 'contentchange'
      });

      this._interactChange();

      return this;

      /**
       * @method importNode()
       * @param designer {Designer}
       * @param jsonNode {object} 节点对应的json
       * @param nodesDic {object} 节点id作为key的字典集合
       * @param lang {string} 当前的语言
       * @return DesignerNode
       * @for
       * @description 导入单个节点
       * @grammar importNode() => {DesignerNode}
       */
      function importNode(designer, jsonNode, nodesDic, lang) {
        var info = utils.getInfo(jsonNode.attributes);

        //特殊处理reject notation
        if (jsonNode.name === 'endEvent') {
          if (jsonNode.attributes && jsonNode.attributes.length) {
            var index = utils.getValueFromRows(jsonNode.attributes, 'rejectNotation', true);
            if (~index) {
              jsonNode.attributes.splice(index, 1);
              jsonNode.name = 'terminateEndEvent';
            }
          }
        }

        var eventDefinition, originExtension, isLoop;
        if(jsonNode.children){
          jsonNode.children.forEach(function(child){
            if(~child.name.indexOf('EventDefinition')){
              eventDefinition = child.name;
            }else if(child.name === 'extensionElements'){
              originExtension = child;
            } else if(jsonNode.name === 'userTask' && child.name === "multiInstanceLoopCharacteristics"){
              isLoop = true;
            }
          });
        }

        //对于以前没有id的formaction，默认使用name作为其id
        formElement.beforeImport(utils.certainName('form', originExtension && originExtension.children));

        var opts = {
          outlineType: jsonNode.name,
          nodeId: info.id,
          eventDefinition: eventDefinition,
          mode: info.pins === 'true' ? 'pins' : 'default' ,
          isLoop: isLoop,
          isImport: true,
          markers: isLoop ? ['loopCharacteristics'] : null
        };
        var property = designer.getOutlineManagerClass(jsonNode.name).getProperty(designer, opts);
        jsonNode = utils.xdeepExtend(property, jsonNode);
        opts.property = jsonNode;
        if(jsonNode.name === 'boundaryEvent'){
          opts.linePointsFilter = 4; // 对连线点进行限制 0100
        }
        var node = designer.createNode(opts, nodesDic[info.attachedToRef]);

        if(isLoop){
          multiInstanceLoopCharacteristics.beforeImport(designer, node, jsonNode);
        }

        var basicChildren = jsonNode.children.slice(0),
          extension = utils.certainName('extensionElements', jsonNode.children);

        utils.setTabs(extension, node, tabsLang);
        utils.setTabs(property, node, tabsLang);

        var noteElem = utils.certainName(
          'note',
          extension ? extension.children : null
        );
        var note;
        if (noteElem && noteElem.children && noteElem.children.length) {
          note = noteElem.children[0].value;
        }
        if (note !== null && typeof note !== 'undefined') {
          node.setData('note', note);
        }
        node.setData('basic', {
          name: jsonNode.name,
          attributes: jsonNode.attributes,
          children: basicChildren
        });

        var displayName;
        if (extension) {
          displayName = utils.getDisplayName(
            node,
            utils.certainName('displayName', extension.children),
            lang
          );
        }

        if (displayName) {
          node.setText(displayName);
        } else {
          node.setText(info.name);
        }

        if (info.offsetX && info.offsetY) {
          node.setLayoutOffset({
            x: info.offsetX - 0,
            y: info.offsetY - 0
          });
        }
        if (info.transform) {
          var matrix = new kity.Matrix();
          matrix.setMatrix.apply(matrix, info.transform.split(' '));
          node.setLayoutTransform(matrix);
        }
        nodesDic[info.id] = node;
        return node;
      }

      function importLine(designer, jsonLine, nodesDic) {
        var line, startNode, endNode, lineData;
        var info = utils.getInfo(jsonLine.attributes);
        startNode = nodesDic[info.sourceRef];
        endNode = nodesDic[info.targetRef];
        line = designer.createLine(startNode, endNode);
        var property = designer.getLineDefaultProps();
        jsonLine = utils.xdeepExtend(property, jsonLine);

        //actionId 转小写
        if(info.actionId){
          info.actionId = info.actionId.toLowerCase();
        }

        line.setData({
          id: info.id,
          text: info.name,
          property: jsonLine,
          basic: jsonLine,
          x: info.offsetX,
          y: info.offsetY,
          actionId: info.actionId,
        });
        line.startIndex = info.startPos === null ? NaN : info.startPos - 0;
        line.endIndex = info.endPos === null ? NaN : info.endPos - 0;
        if (info.inflections) {
          var inflections;
          try {
            inflections = JSON.parse(info.inflections);
          } catch (e) {
            console.log('waring: The inflections of line is illegel');
          }
          line.originalInflecions = inflections;
        }
      }

      function ensureDefinitionAttributes(json){
        if(!json) return;
        if(!json.attributes){
          json.attributes = [];
        }
        var attrs = {
          xmlns: {
            name: 'xmlns',
            value: 'http://www.omg.org/spec/BPMN/20100524/MODEL'
          },
          witbpm: {
            name: 'witbpm',
            fullName: 'xmlns:witbpm',
            value: 'http://www.witbpm.com/bpmn',
          },
          targetNamespace: {
            name: 'targetNamespace',
            value: 'http://www.witbpm.com/bpmn/demo'
          },
          expressionLanguage: {
            name: 'expressionLanguage',
            value: 'http://www.witbpm.com/bpmn/expression'
          },
          typeLanguage: {
            name: 'typeLanguage',
            value: 'http://www.w3.org/2001/XMLSchema'
          },
          xsd: {
            name: 'xsd',
            fullName: 'xmlns:xsd',
            value: 'http://www.w3.org/2001/XMLSchema'
          },
          tns: {
            name: 'tns',
            fullName: 'xmlns:tns',
            value: 'http://www.witbpm.com/bpmn/demo'
          },
          other: {
            name: 'other',
            fullName: 'xmlns:other',
            value: 'http://www.witbpm.com/other'
          },
        };
        json.attributes.forEach(function(attr){
          if(attrs[attr.name]){
            attrs[attr.name] = null;
          }
        });
        for(var key in attrs){
          if(attrs[key]){
            json.attributes.push(attrs[key]);
          }
        }
      }
    }
  });
});
