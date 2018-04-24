/**
 * @fileOverview
 *
 * 拓展 FUI 组件的功能
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

/* global FUI:true*/
define(function (require, exports, module) {
  var kity = require('./kity');
  var $ = require('./jquery');

  kity.extendClass(FUI.Widget, {
    setEnable: function (value) {
      if (value === false) this.disable();
      else this.enable();
    },

    setActive: function (value) {
      if (value === false) this.removeClass('active');
      else this.addClass('active');
    },

    bindExecution: function (event, fn) {
      var widget = this;
      widget.on(event, function () {
        if (widget.interactFlag) return;
        fn.apply(widget, arguments);
      });
    },

    //管理widget状态
    bindCommandState: function (designer, command, valueHandle,
      enableHandler, activeHandler) {
      var widget = this;
      designer.on('interactchange', function () {
        widget.interactFlag = true;
        if (valueHandle) {
          var value = this.queryCommandValue(command);
          if (value != widget.lastHandleCommandValue) {
            valueHandle.call(widget, value);
            widget.lastHandleCommandValue = value;
          }
        }
        widget.setEnable(enableHandler ? enableHandler() : this.queryCommandState(
          command) !== -1);
        widget.setActive(activeHandler ? activeHandler() : this.queryCommandState(
          command) === 1);
        widget.interactFlag = false;
      });
    }
  });

  kity.extendClass(FUI.Icon, {
    // heck：默认继承自Widget的__initEvent会阻止mousedown冒泡，影响拖拽
    __initEvent: function (value) {
      this.on("click", function () {
        this.__trigger("btnclick");
      });
    }
  });

  FUI.Svg = FUI.Utils.createClass("Svg", {

    base: FUI.Widget,

    constructor: function (options) {

      this.callBase(options);

    },

    __initOptions: function () {

      this.callBase();

      this.widgetName = 'Svg';
      this.__tpl =
        '<div unselectable="on" class="fui-svg" >\n<svg unselectable="on">\n </div>\n';

    },

    // heck：默认继承自Widget的__initEvent会阻止mousedown冒泡，影响拖拽
    __initEvent: function (value) {
    },

    __render: function () {

      this.__options.__width = this.__options.width;
      this.__options.__height = this.__options.height;

      this.__options.width = null;
      this.__options.height = null;

      this.callBase();

      this.__svg = $("svg", this.__element)[0];

      if (this.__options.__width !== null) {
        $(this.__svg).css({
          width: this.__options.__width
        });
      }

      if (this.__options.__height !== null) {
        $(this.__svg).css({
          height: this.__options.__height
        });
      }

    }

  });


  module.exports = window.FUI;
});
