/**
 * @fileOverview
 *
 * 草稿历史记录
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

define(function (require, exports, module) {
  var Designer = require('../../core/witdesigner').Designer;
  var FUI = require('../../core/fui');
  var $ = require('../../core/jquery');

  Designer.registerUI('menu/history/recent', function (designer) {

    var $menu = designer.getUI('menu/menu');
    var history = designer.getUI('menu/history/history');

    var recentList = [];
    var getUrl = designer.getOption('draftUrl');
    initRecentList();

    function initRecentList() {
      if (getUrl) {
        $.ajax({
          url: getUrl,
          async: true,
          type: "get",
          showProgressbar: false,
          success: function (data, textStatus) {
            recentList = data;
            renderList();
          }
        });
      }
    }

    /* 网盘面板 */
    var $panel = $(history).addClass('recent-file-panel');

    var text =  designer.getLang('ui.recent');

    var $clear = $('<button></button>')
      .addClass('clear-recent-list')
      .text(text.clearrecent)
      .appendTo($panel);

    /* 最近文件列表容器 */
    var $ul = $('<ul></ul>')
      .addClass('recent-file-list')
      .appendTo($panel);

    var $noticeTitle = $('<h3>' + text.noticeTitle + '</h3>')
      .addClass('notice-title')
      .appendTo($panel);

    var $noticeBody = $('<span>' + text.noticeBody + '</span>')
      .addClass('notice-body')
      .appendTo($panel);

    $clear.on('click', function () {
      var clearUrl = designer.getOption('clearDraftsUrl');
      if (clearUrl) {
        $.ajax({
          url: clearUrl,
          async: false,
          type: "post",
          showProgressbar: false,
          success: function (data, textStatus) {
            recentList = [];
            renderList();
          }
        });
      }
    });

    var changed = false;
    designer.on('autosavesuccess', function () {
      changed = true;
    });
    $menu.on('show', function () {
      if (changed) {
        initRecentList();
      }
    });

    function renderList() {
      $ul.empty();

      recentList.forEach(function (item) {
        if (item.discard === true) return;

        var $li = $('<li></li>')
          .addClass('recent-file-item')
          .appendTo($ul);

        $('<h4></h4>')
          .addClass('file-name')
          .text(designer.getLang('ui.recent.draftCreateTime', item.createTime))
          .appendTo($li);

        $('<a href="javascript:void(0);" draftId="' +
          item.id + '">' + text.loadDraft + '</a>'
        ).appendTo($li);

        $('<span></span>')
          .addClass('file-time')
          .displayFriendlyTime(new Date(item.lastUpdateTime), text.draftUpdateTime)
          .appendTo($li);
      });
    }

    var loadUrl = designer.getOption('loadDraftUrl');
    $ul.delegate('a', 'click', function (e) {
      if (loadUrl) {
        $.ajax({
          url: loadUrl + '?id=' + $(e.currentTarget).attr(
            'draftId'),
          async: false,
          type: "get",
          showProgressbar: false,
          success: function (data, textStatus) {
            if (data && data.json) {
              designer.importJson(JSON.parse(data.json));
            }
          }
        });
      }
    });

    return {
      init: initRecentList,
      hasRecent: function () {
        return recentList.length;
      },
      loadLast: function () {
        $ul.find('.recent-file-item').eq(0).click();
      },
      last: function () {
        return recentList.get(0) || null;
      }
    };
  });
});
