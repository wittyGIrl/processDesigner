/**
 * @fileOverview
 *
 * 显示并更新脑图文件的标题
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
define(function (require, exports, module) {
  var Designer = require('../core/witdesigner').Designer;
  var FUI = require('../core/fui');
  var $ = require('../core/jquery');
  var utils = require('../core/utils');

  Designer.registerUI('topbar/title', function (designer) {
    var panel = document.getElementById('panel');

    var titleButton = new FUI.Button({
      id: 'title',
      text: '未命名',
      label: '未命名',
      className: 'title'
    }).appendTo(panel);

    var propertyEditor = designer.getUI('ribbon/node/property');

    titleButton.on('click', function () {
      designer.removeAllSelectedLines().removeAllSelectedNodes();

      var owner = propertyEditor.react.props.owner;
      if (owner && owner.getData('id') === designer.getData('id')) {
        propertyEditor.react.open();
        designer.setStatus('property');
        return;
      }
      var property = designer.getData('property');
      var tabs = utils.getTabs(designer, designer.getLang('tabs'));

      propertyEditor.render({
        open: true,
        tabs: tabs,
        owner: designer
      });
    });

    designer.on('statuschange', function(e){
      if(e.lastStatus === 'property' && e.currentStatus === 'normal'){
        propertyEditor.react.close();
      }
    });

    designer.on('propertyOwnerChange', function(e){
      if(e.last && e.last.getType() === 'Designer'){
        this.resetNotificationTemplate();
      }
    });

    return titleButton;
  });
});
