/**
 * @fileOverview
 *
 * 快捷键说明
 *
 */

define(function (require, exports, module) {
  var Designer = require('../../core/witdesigner').Designer;
  var FUI = require('../../core/fui');
  var $ = require('../../core/jquery');

  Designer.registerUI('menu/shortkey/list', function (designer) {

    var $menu = designer.getUI('menu/menu');
    var history = designer.getUI('menu/shortkey/shortkey');

    /* 网盘面板 */
    var $panel = $(history).addClass('recent-file-panel');

    var shortkey = designer.getLang('ui.shortkey');

    /* 最近文件列表容器 */
    var $ul = $('<ul></ul>')
      .addClass('recent-file-list')
      .appendTo($panel);

    // var noticeTitle = designer.getLang('ui.shortkey.noticeTitle');
    // var $noticeTitle = $('<h3>' + noticeTitle + '</h3>')
    //   .addClass('notice-title')
    //   .appendTo($panel);
    //
    // var noticeBody = designer.getLang('ui.shortkey.noticeBody');
    // var $noticeBody = $('<span>' + noticeBody + '</span>')
    //   .addClass('notice-body')
    //   .appendTo($panel);


    if(!shortkey.keys) return;
    var array = [];
    shortkey.keys.forEach(function (key) {
      array.push('<li class = "shortkey-item"><span class = "shortkey-value">' +
        key.value +
        ' : </span><span class = "shortkey-text">' +
        key.text +
        '</span></li>');
    });
    $ul.append(array.join(''));

  });
});
