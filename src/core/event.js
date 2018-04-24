/**
 * @fileOverview
 *
 * 定义事件类
 * 对kity事件和原生事件提供装饰
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
define(function(require, exports, module) {
  var kity = require('./kity');
  var utils = require('./utils');
  var Designer = require('./designer');

  var DesignerEvent = kity.createClass('DesignerEvent', {
    constructor: function(type, params, canstop) {
      params = params || {};
      if (params.getType && params.getType() == 'ShapeEvent') {
        this.kityEvent = params;
        this.originEvent = params.originEvent;
      } else if (params.target && params.preventDefault) {
        this.originEvent = params;
      } else {
        utils.extend(this, params);
      }
      this.type = type;
      this._canstop = canstop || false;
    },
    /*
    * @param {string|kity.Shape} refer
    *     参照的坐标系，
    *     `"screen"` - 以浏览器屏幕为参照坐标系
    *     `"designer"` - （默认）以脑图画布为参照坐标系
    *     `{kity.Shape}` - 指定以某个 kity 图形为参照坐标系
    */
    getPosition: function(refer) {
      if (!this.kityEvent) {
        return null;
      }

      if (!refer || refer === 'designer') {
        return this.kityEvent.getPosition(this.designer.getRenderContainer());
      }
      return this.kityEvent.getPosition.call(this.kityEvent, refer);
    },
    /**
     * @method getTargetNode()
     * @for DesignerEvent
     * @description 当发生的事件是鼠标事件时，获取事件位置命中的脑图节点
     *
     * @grammar getTargetNode() => {DesignerNode}
     */
    getTargetNode: function() {
      var findShape = this.kityEvent && this.kityEvent.targetShape;
      if (!findShape) return null;
      while (!findShape.designerNode && findShape.container) {
        findShape = findShape.container;
      }
      var node = findShape.designerNode;
      if (node && findShape.getOpacity() < 1) return null;
      return node || null;
    },

    getTargetLine: function() {
      var findShape = this.kityEvent && this.kityEvent.targetShape;
      if (!findShape) return null;
      while (!findShape.designerLine && findShape.container) {
        findShape = findShape.container;
      }
      var line = findShape.designerLine;
      if (line && findShape.getOpacity() < 1) return null;
      return line || null;
    },

    stopPropagation: function() {
      this._stop = true;
    },

    stopPropagationImmediately: function() {
      this._immediatelyStoped = true;
      this._stoped = true;
    },

    shouldStopPropagation: function() {
      return this._canstop && this._stoped;
    },

    shouldStopPropagationImmediately: function() {
      return this._canstop && this._immediatelyStoped;
    },

    preventDefault: function() {
      this.originEvent.preventDefault();
    },

    //是否是鼠标右键被触发
    isRightMB: function() {
      var isRightMB = false;
      if (!this.originEvent) {
        return false;
      }
      if ('which' in this.originEvent)
        //event.which 1,2,3 左，中，右
        isRightMB = this.originEvent.which == 3;
      else if ('button' in this.originEvent)
        //button 0,1,2 左，中，右
        isRightMB = this.originEvent.button == 2;
      return isRightMB;
    },
    getKeyCode: function() {
      var evt = this.originEvent;
      return evt.keyCode || evt.which;
    }
  });

  Designer.registerInitHook(function() {
    this._initEvents();
  });

  kity.extendClass(Designer, {
    _initEvents: function() {
      this._eventCallbacks = {};
    },

    _bindEvents: function() {
      this._bindPaperEvents();
      this._bindKeyboardEvents();
    },
    _resetEvents: function() {
      this._initEvents();
      this._bindEvents();
    },
    // TODO: mousemove lazy bind
    _bindPaperEvents: function() {
      this._paper.on('click dblclick mousedown contextmenu mouseup mousemove mouseover mouseout mousewheel DOMMouseScroll touchstart touchmove touchend dragenter dragleave drop', this._firePharse.bind(this));
      if (window) {
        window.addEventListener('resize', this._firePharse.bind(this));
        window.addEventListener('blur', this._firePharse.bind(this));
      }
    },
    _bindKeyboardEvents: function() {
      if ((navigator.userAgent.indexOf('iPhone') == -1) && (navigator.userAgent.indexOf('iPod') == -1) && (navigator.userAgent.indexOf('iPad') == -1)) {
        //只能在这里做，要不无法触发
        utils.listen(document.body, 'keydown keyup keypress paste', this._firePharse.bind(this));
      }
    },
    /**
     * @method dispatchKeyEvent
     * @description 派发键盘（相关）事件到脑图实例上，让实例的模块处理
     * @grammar dispatchKeyEvent(e) => {this}
     * @param  {Event} e 原生的 Dom 事件对象
     */
    dispatchKeyEvent: function(e) {
      this._firePharse(e);
    },

    /**
     * @method _firePharse
     * @description fire the related events just like before,pre,after
     * @grammar dispatchKeyEvent(e) => {this}
     * @param  {Event} e 原生的 Dom 事件对象
     */
    _firePharse: function(e) {
      var beforeEvent,
        preEvent,
        executeEvent;
      if (e.type === 'DOMMouseScroll') {
        e.type = 'mousewheel';
        e.wheelDelta = e.originEvent.wheelDelta = e.originEvent.detail * -10;
        e.wheelDeltaX = e.originEvent.mozMovementX;
        e.wheelDeltaY = e.originEvent.mozMovementY;
      }

      beforeEvent = new DesignerEvent('before' + e.type, e, true);
      if (this._fire(beforeEvent)) {
        return;
      }

      preEvent = new DesignerEvent('pre' + e.type, e, true);
      executeEvent = new DesignerEvent(e.type, e, true);
      if (this._fire(preEvent) || this._fire(executeEvent)) {
        this._fire(new DesignerEvent('after' + e.type, e, true));
      }
    },

    _interactChange: function(e) {
      var me = this;
      if (me._interactScheduled) return;
      setTimeout(function() {
        me._fire(new DesignerEvent('interactchange'));
        me._interactScheduled = false;
      }, 100);
      me._interactScheduled = true;
    },

    _listen: function(type, callback) {
      var callbacks = this._eventCallbacks[type] || (this._eventCallbacks[type] = []);
      callbacks.push(callback);
    },
    _fire: function(e) {
      /**
       * @property designer
       * @description 产生事件的 Designer 对象
       * @for DesignerShape
       * @type {Designer}
       */
      e.designer = this;

      var status = this.getStatus();
      var callbacks = this._eventCallbacks[e.type.toLowerCase()] || [];

      if (status) {
        callbacks = callbacks.concat(this._eventCallbacks[status + '.' + e.type.toLowerCase()] || []);
      }

      if (callbacks.length === 0) {
        return;
      }

      var lastStatus = this.getStatus();
      for (var i = 0; i < callbacks.length; i++) {
        callbacks[i].call(this, e);

        /* this.getStatus() != lastStatus ||*/
        if (e.shouldStopPropagationImmediately()) {
          break;
        }
      }

      return e.shouldStopPropagation();
    },
    //可以一次on多个类型的事件
    on: function(types, callback) {
      var me = this;
      types.split(/\s+/).forEach(function(type) {
        me._listen(type.toLowerCase(), callback);
      });
      return this;
    },
    off: function(types, callback) {
      var me = this;
      types.split(/\s+/).forEach(function(type) {
        var callbacks = me._eventCallbacks[type] || [];
        if (callbacks.length === 0) return;
        for (var i = 0, l = callbacks.length; i < l; i++) {
          if (callbacks[i] === callback) {
            callbacks.splice(i, 1);
          }
        }
      });
      return this;
    },
    fire: function(name, params) {
      var e = new DesignerEvent(name, params);
      this._fire(e);
      return this;
    }
  });
  module.exports = DesignerEvent;
});
