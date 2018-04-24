/**
 * @fileOverview
 *
 * 引脚
 */
define(function (require, exports, module) {
  var kity = require('../core/kity');
  var utils = require('../core/utils');

  var Designer = require('../core/designer');
  var Renderer = require('../core/render');
  var Module = require('../core/module');

  function pushActionGroup(node, actions, actionGroups, lang){
    var info, formActions, action, noPins = [];
    for(var i = 0, l = actionGroups.length; i<l; i++){
      formActions = actionGroups[i].children;
      if(!formActions || !formActions.length){
        continue;
      }
      for(var j = 0, len = formActions.length; j<len; j++){
        action = formActions[j];
        info = utils.getInfo(action.attributes);
        //只有类型为approve或者reject才会产生引脚
        if(info.type === 'approve' || info.type === 'reject'){
          var displayName;
          if (action.children) {
            displayName = utils.getDisplayName(
              null, utils.certainName('displayName', action.children),
              lang
            );
          }
          actions.push({id: info.id, name: displayName || info.name});
        }
        else{
          noPins.push(info.id);
        }
      }
    }
    //当节点的type改变需要删除引脚时，如果该引脚已经有了连线，那么直接一起删除
    if(noPins.length > 0){
      node.getStartLines().forEach(function(line){
        if(~noPins.indexOf(line.getData('actionId'))){
          node.getDesigner().removeLine(line);
        }
      });
    }
  }

  /*
  * 得到节点下会产生引脚的action集合
  */
  function getActionsForNode(node){
    var form = node.getData('form');
    if(! form || !form.children || !form.children.length) return;
    var lang = node.getDesigner().getOption('lang');
    var actions = [];
    var actionSet = utils.certainName('formActionSet', form.children);
    if(actionSet && actionSet.children && actionSet.children.length){
      pushActionGroup(node, actions, actionSet.children, lang);
    }
    return actions;
  }

  /*
  * 当节点的action的现实文字改变后，不重新生成DOM，只是修改文字内容
  */
  function updateText(node){
    if(!node || !node.pinsGroup) return;
    var textGroup = node.pinsGroup.textGroup;

    var actions = getActionsForNode(node);

    textGroup.eachItem(function(i, item){
      if(actions[i]){
        item.setContent(actions[i].name);
      }
    });
  }

  /*
  * 当节点的action改变后，重新生成节点的引脚的DOM
  */
  function setPins(node){
    if(!node) return;
    var group = node.pinsGroup,
      pinsGroup = group.pinsGroup,
      textGroup = group.textGroup;
    var background = node.getStyle('background');
    var items = [], textItems = [], textShape,
      fontSize = (node.getStyle('action-font-size') || 12) + 'px';

    var actions = getActionsForNode(node);
    if(!actions) return;
    actions.forEach(function(action){
      items.push(
        new kity.Circle(4, 0, 0).pipe(
          function () {
            this.stroke('black', 1).fill(background);
            this.setAttr('cursor', 'crosshair').setData('actionId', action.id);
            this.setId(utils.uuid('lpoint'));
          })
      );

      textShape = new kity.Text()
        .setAttr('text-rendering', 'inherit').setAttr('font-size', fontSize);
      if (kity.Browser.ie) {
        textShape.setVerticalAlign('top');
      } else {
        textShape.setAttr('dominant-baseline', 'text-before-edge');
      }
      textItems.push(textShape);
      textShape.setContent(action.name);
      if (kity.Browser.ie) {
        textShape.fixPosition();
      }
    });
    pinsGroup.setItems(items);
    textGroup.setItems(textItems);
  }

  var PinRenderer = kity.createClass('PinRenderer', {
    base: Renderer,

    create: function (node) {
      this.bringToBack = true;
      var group = new kity.Group();
      var textGroup = new kity.Group();
      group.path = new kity.Path().stroke('black');
      var pinsGroup = new kity.Group();
      group.pinsGroup = pinsGroup;
      group.textGroup = textGroup;
      group.appendShape(group.path);
      group.appendShape(pinsGroup);
      group.appendShape(textGroup);
      node.pinsGroup = group;
      setPins(node);

      return group;
    },

    shouldRender: function(node){
      return node.getData('mode') === 'pins';
    },

    update: function (group, node, box) {
      var pinsGroup = group.pinsGroup,
        textGroup = group.textGroup;
      var count = pinsGroup.getItems().length;
      var startLines = node.getStartLines();
      //无开始连线的节点，在非选中状态下，不显示pins
      if ((!startLines || startLines.length === 0) && !node.isSelected()) {
        group.setVisible(false);
        return box;
      }

      group.setVisible(true);

      /*
      * 使用outlineBox而不是用box的原因：box是不包含边线的宽度，而outlineBox是包含边线的宽度的。
      * 当线的宽度较大时，box会出现偏差。
      */
      var outlineBox = node.getOutlineManager().getOutlineShape().getBoundaryBox();

      var startX = Math.round(outlineBox.right);
      var startY = Math.round(outlineBox.cy);

      var width = 15;
      var space = 20;
      var pinX = startX + width;
      // setItems();

      var midNumber = (count - 1) / 2;
      pinsGroup.eachItem(function (i, item) {
        item.setCenter(pinX, startY + (i - midNumber) * space);
      });
      var diff = 17 ;//字显示在线的上方
      textGroup.eachItem(function (i, item) {
        item.setPosition(pinX, startY + (i - midNumber) * space - diff);
      });

      var drawer = group.path.getDrawer().clear();

      if (count > 0) {
        drawer.moveTo(startX, startY)
          .lineTo(pinX, startY);
        if (count > 1) {
          drawer.moveTo(pinX, startY - midNumber * space)
            .lineTo(pinX, startY + midNumber * space);
        }
      }

      return new kity.Box(box);
    }
  });

  kity.extendClass(Designer, {
    /*
    * 检验某节点是否有对应某些actions的连出线。若有，则返回第一条匹配的连线。否则无返回值。
    */
    checkLinesForPins: function(node, actions){
      if(!node || !actions) return;
      if(!actions.length){
        actions = [actions];
      }
      var actionIds = [];
      actions.forEach(function(action){
        if(action.attributes){
          var idAttr = utils.certainName('id', action.attributes);
          if(idAttr && idAttr.value){
            actionIds.push(idAttr.value);
          }
        }
      });
      var startLines = node.getStartLines(), actionId, line;
      for(var i=0,l=startLines.length; i<l; i++){
        line = startLines[i];
        actionId = line.getData('actionId');
        if(actionId && ~actionIds.indexOf(actionId)){
          return line;
        }
      }
    },
    getActionsForNode: getActionsForNode,
  });

  Module.register('PinModule', function () {
    return {
      renderers: {
        outside: PinRenderer
      },
      events: {
        actionsChange: function(e){
          setPins(e.node);
          e.node.render();
          this.updateLine(e.node, 'Start');
        },
        actionNameChange: function(e){
          updateText(e.node);
        }
      }
    };
  });
});
