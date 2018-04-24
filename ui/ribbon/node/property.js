/**
 * @fileOverview
 *
 * 属性页
 *
  global React:true, ReactDOM:true */
define(function (require) { //, exports, module
  var Designer = require('../../core/witdesigner').Designer;
  var FUI = require('../../core/fui');
  var utils = require('../../core/utils');
  var $ = require('../../core/jquery');

  var jsonEditor = require('../../core/jsonEditor');

  var Notice = require('../../widget/notice');

  var container, lang, propertyName,
    _props = {};

  function formatter(name) {
    return propertyName[name] || name;
  }

  Designer.registerUI('ribbon/node/property', function (designer) {
    function render(props) {
      designer.setStatus('property');
      if (props) {
        //tabs 每次都重新替换
        var tabs = props.tabs;
        props.tabs = null;
        _props.selectedTabIndex = null;
        $.extend(_props, props);
        _props.tabs = tabs;
      }
      var last = propertyEditor ? propertyEditor.props.owner : null,
        current = _props.owner;
      if (!last || current && current.getData('id') !== last.getData('id')) {
        designer.fire('propertyOwnerChange', {
          last: last,
          current: current
        });
      }
      jsonEditor.Store.setData(_props);
    }

    function setText(owner, text) {
      if (owner.getType() === 'Designer') {
        designer.getUI('topbar/title').setLabel(text);
      } else {
        owner.setText(text);
        owner.render();
        designer.updateLine(owner);
      }
    }

    var pinsCannotChange;
    /*
    * return false则拒绝该更改
    */
    function handleBeforeChange(value, oldValue, data){
      var owner = propertyEditor.state.owner;
      if (data && owner) {
        if (~data.indexOf('pins')) {
          if(owner.getStartLines().length > 0){
            designer.executeCommand('camera', owner, 600);
            if(!pinsCannotChange){
              pinsCannotChange = designer.getLang('message.pinsCannotChange');
            }
            Notice.show('', pinsCannotChange);
            return false;
          }
        }
      }
    }

    function handleChange(value, oldValue, data) {
      var owner = propertyEditor.state.owner;
      if (data && owner) {
        if (~data.indexOf('formAction.type')) {
          if(owner.getData('mode') === 'pins'){
            //只有类型为approve或者reject才会产生引脚
            designer.fire('actionsChange', {node: owner});
          }

          //formAction.type改变时，可能会需要显示或隐藏addsignapprovetype
          render();
        }
        else if(~data.indexOf('pins')){
          owner.setData('mode', value.toLowerCase() === 'true' ? 'pins' : 'default');
          designer.renderNode(owner);
        }
        else if(~data.indexOf('isSequential')){
          owner.setData('isSequential', value.toLowerCase() === 'true' ? true : false);
          designer.renderNode(owner);
        }
        else if(~data.indexOf('formAction.name') || ~data.indexOf('formAction.displayName')){
          designer.fire('actionNameChange', {node: owner});
        }
        else if (~data.indexOf('note')) {
          designer.fire('noteChange', {
            note: value,
            owner: owner
          });
        } else if (~data.indexOf('cancelActivity')) {
          owner.setData('cancelActivity', value.toLowerCase() === 'true' ? true : false);
          designer.renderNode(owner);
          //owner.render();
        } else if (~data.indexOf('extensionElements.displayName')) {
          var arr = data.split('.');
          if (arr.length && lang === arr[arr.length - 1]) {
            setText(owner, value);
            owner.setData('textFromDisplayName', !!value);
          }
        } else if (/notification.(\w*)((id$)|(me$))/.test(data)) {
          designer.resetNotificationTemplate();
          //如果当前流程属性已经设置了eventNotification，则需要刷新。
          var eventNotifications = designer.getData('eventNotifications');
          if (eventNotifications && eventNotifications.children &&
            eventNotifications.children.length) {
            render();
          }
        } else if (owner.getData('textFromDisplayName') !== true) {
          //节点均有outlineType,如果没有outlineType,说明为流程或者线
          var prefix = owner.getData('outlineType');
          if (!prefix) {
            prefix = owner.getType() === 'Designer' ? 'process' : 'sequenceFlow';
          }
          if (~data.indexOf(prefix + '.name')) {
            setText(owner, value);
          }
        }
        designer.fire('docchange');
      }
    }

    var actionCannotRemove;
    function beforeRemove(data, index){
      var owner = propertyEditor.state.owner;
      if(data && owner){
        if(owner.getData('mode') !== 'pins') return;
        var actions = [];
        if(data.name === 'formActionGroup' && data.children){
          actions = [data.children[index]];
        }
        else if(data.name === 'formActionSet' && data.children){
          actions = actions.concat(data.children[index].children);
        }
        if(actions.length > 0){
          var line = designer.checkLinesForPins(owner, actions);
          if(line){
            designer.selectLine(line);
            designer.executeCommand('camera', owner, 600);
            if(!actionCannotRemove){
              actionCannotRemove = designer.getLang('message.actionCannotRemove');
            }
            Notice.show('', actionCannotRemove);
            return false;
          }
          //callback
          return function(){
            designer.fire('actionsChange', {node: owner});
          };
        }
      }
    }

    function beforeAdd(data, index){
      var owner = propertyEditor.state.owner;
      if(data && owner){
        if(owner.getData('mode') !== 'pins') return;
        if(data.name === 'formActionGroup' || data.name === 'formActionSet'){
          //callback
          return function(){
            designer.fire('actionsChange', {node: owner});
          };
        }
      }
    }

    var $tabs = designer.getUI('ribbon/tabs');
    var text = designer.getLang('ui.command.property');
    var $propertyPanel = new FUI.LabelPanel({
      label: text,
      coloum: true
    });
    lang = designer.getOption('lang');
    propertyName = designer.getLang('property');

    var $button = new FUI.Button({
      label: text,
      text: text,
      className: ['command-widget', 'command-button', 'property']
    }).appendTo($propertyPanel);
    $propertyPanel.appendTo($tabs.node);

    //根据当前选中项更改propertygrid的内容
    function changePropertyOwner() {
      var owner = designer.getSelectedNode();
      if (!owner) {
        owner = designer.getSelectedLine();
      }
      if (owner) {
        var tabs = utils.getTabs(owner, designer.getLang('tabs'));

        render({
          open: true,
          tabs: tabs,
          owner: owner
        });
      }
    }

    $button.on('click', changePropertyOwner);

    designer.on('selectionchange', function () {
      if (propertyEditor.isOpen()) {
        changePropertyOwner();
      }
    });

    designer.on('interactchange', function () {
      var flag = designer.getSelectedNodes().length === 1 ||
        !!designer.getSelectedLine();
      $button.setEnable(flag);
      $button.setActive(flag);
      if (!flag) {
        var owner = propertyEditor.state.owner;
        if (owner && owner.getType() === 'Designer') {
          return;
        }
        propertyEditor.close();
        designer.setStatus('normal');
      }
    });

    //双击打开属性
    designer.on('dblclick', function (e) {
      if (e.originEvent.button) return;
      changePropertyOwner(e.getTargetNode() || e.getTargetLine());
    });
    container = document.getElementById('nav');

    render({
      open: false,
      formatter: formatter,
      onBeforeChange: handleBeforeChange, //return false 该更改会被拒绝。需要返回值，无法debounce
      onChange: jsonEditor.Utils.debounce(handleChange, 1000), //稀释
      onRemoveChild: beforeRemove,
      onAddChild: beforeAdd,
    });

    var propertyEditor = ReactDOM.render(
      React.createElement(jsonEditor.App, _props),
      container
    );

    return {
      react: propertyEditor,
      render: render
    };
  });
});
