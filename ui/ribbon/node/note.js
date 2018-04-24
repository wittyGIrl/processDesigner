/**
 * @fileOverview
 *
 * 节点备注
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
/* global marked: true */
define(function (require, exports, module) {
  var Designer = require('../../core/witdesigner').Designer;
  var FUI = require('../../core/fui');
  var $ = require('../../core/jquery');
  var kity = require('../../core/kity');
  var utils = require('../../core/utils');

  Designer.registerUI('ribbon/node/note', function (designer) {
    var propertyEditor = designer.getUI('ribbon/node/property');
    var axss = designer.getUI('axss');

    var $preview = $(
      '<div id="note-previewer" style="display:none;"></div>');

    designer.on('editnoterequest', function () {
      var owner = designer.getSelectedNode();
      if (owner) {
        var tabs = utils.getTabs(owner, designer.getLang('tabs'));

        propertyEditor.render({
          open: true,
          tabs: tabs,
          selectedTabIndex: 0,
          owner: owner
        });
      }
    });

    var previewTimer;
    designer.on('shownoterequest', function (e) {
      previewTimer = setTimeout(function () {
        showPreview(e);
      }, 300);
    });
    designer.on('hidenoterequest', function () {
      clearTimeout(previewTimer);
    });

    designer.on('mousedown mousewheel DOMMouseScroll', function (e) {
      hidePreview(e);
    });

    designer.on('noteChange', function(e){
      designer.executeCommand('note', e.owner, axss(e.note));
    });

    //$('#witdesigner').after($notePanel).after($preview);
    $('#witdesigner').after($preview);

    function showPreview(e) {
      if (e.mouseEvent) {
        var pos = e.mouseEvent.getPosition('screen');
        $preview.css({
          top: pos.y,
          left: pos.x
        });
        var noteText = e.node.getData('note');
        var textArr = noteText ? noteText.split('\n') : [' '];
        textArr.unshift('<p>');
        textArr.push('</p>');
        $preview.html(textArr.join('</p><p>'));
        $preview.show();
      }
    }

    function hidePreview(e) {
      $preview.hide();
    }
  });
});
