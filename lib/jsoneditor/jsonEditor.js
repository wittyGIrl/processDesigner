(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.JsonEditor = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
(function() {
  var App, AppStore, CollapsableField, Nav, React, Tab, Tabs, classnames;

  React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

  classnames = require('classnames');

  Nav = require('./components/Nav');

  Tabs = require('./components/tabs/Tabs');

  Tab = require('./components/tabs/Tab');

  CollapsableField = require('./components/CollapsableField');

  AppStore = require('./stores/AppStore');

  App = React.createClass({displayName: "App",
    getInitialState: function() {
      return AppStore.getData();
    },
    close: function() {
      return this.refs.nav.close();
    },
    open: function() {
      return this.refs.nav.open();
    },
    toggle: function() {
      return this.refs.nav.toggle();
    },
    isOpen: function() {
      return this.state.open;
    },
    componentDidMount: function() {
      return AppStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
      return AppStore.removeChangeListener(this._onChange);
    },
    render: function() {
      var className, formatter, onAddChild, onBeforeChange, onChange, onClose, onOpen, onRemoveChild, onToggle, ref, tabs;
      ref = this.props, className = ref.className, onOpen = ref.onOpen, onClose = ref.onClose, onToggle = ref.onToggle, onChange = ref.onChange, onBeforeChange = ref.onBeforeChange, onAddChild = ref.onAddChild, onRemoveChild = ref.onRemoveChild, formatter = ref.formatter;
      className = classnames('Tab', className);
      tabs = [];
      if (this.state.tabs && this.state.tabs.length) {
        this.state.tabs.forEach(function(tab, index) {
          return tabs.push(
          React.createElement(Tab, {label: tab.name, key: index},
            React.createElement(CollapsableField, {data: tab.data,
              style: {marginLeft: '0px'},
              formatter: formatter,
              onChange: onChange,
              onBeforeChange: onBeforeChange,
              onAddChild: onAddChild,
              onRemoveChild: onRemoveChild})
          )
        );
        });
      }
      return React.createElement(Nav, {ref: "nav", open: this.state.open,
      onOpen: onOpen,
      onClose: onClose,
      onToggle: onToggle
      },
      React.createElement(Tabs, {selectedIndex: this.state.selectedTabIndex},
        tabs
      )
    );
    },
    _onChange: function() {
      return this.setState(AppStore.getData());
    }
  });

  module.exports = App;

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./components/CollapsableField":5,"./components/Nav":8,"./components/tabs/Tab":28,"./components/tabs/Tabs":30,"./stores/AppStore":33,"classnames":37}],2:[function(require,module,exports){
(function() {
  exports.App = require('./App');

  exports.Store = require('./stores/AppStore');

  exports.Utils = require('./utils');

}).call(this);

},{"./App":1,"./stores/AppStore":33,"./utils":34}],3:[function(require,module,exports){
(function() {
  var Actions, AppDispatcher, Constants;

  AppDispatcher = require('../dispatcher/AppDispatcher');

  Constants = require('../constants/Constants');

  Actions = {
    addChild: function(data) {
      return AppDispatcher.dispatch({
        actionType: Constants.ADD_CHILD,
        data: data
      });
    },
    removeChild: function(data, index) {
      return AppDispatcher.dispatch({
        actionType: Constants.REMOVE_CHILD,
        data: data,
        index: index
      });
    },
    toggleCollape: function(data) {
      return AppDispatcher.dispatch({
        actionType: Constants.TOGGLE_COLLAPE,
        data: data
      });
    },
    switchTab: function(index) {
      return AppDispatcher.dispatch({
        actionType: Constants.SWITCH_TABS,
        index: index
      });
    },
    openNav: function() {
      return AppDispatcher.dispatch({
        actionType: Constants.OPEN_NAV
      });
    },
    closeNav: function() {
      return AppDispatcher.dispatch({
        actionType: Constants.CLOSE_NAV
      });
    },
    toggleNav: function() {
      return AppDispatcher.dispatch({
        actionType: Constants.TOGGLE_NAV
      });
    },
    updateValue: function(data, target, value) {
      return AppDispatcher.dispatch({
        actionType: Constants.UPDATE_VALUE,
        data: data,
        target: target,
        value: value
      });
    }
  };

  module.exports = Actions;

}).call(this);

},{"../constants/Constants":31,"../dispatcher/AppDispatcher":32}],4:[function(require,module,exports){
(function (global){
(function() {
  var Button, PureRenderMixin, React, Ripple, classnames;

  React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

  classnames = require('classnames');

  PureRenderMixin = React.addons.PureRenderMixin;

  Ripple = require('./animation/Ripple');

  Button = React.createClass({displayName: "Button",
    mixins: [PureRenderMixin],
    render: function() {
      var children, className, disableRipple, label, onClick, ref, style;
      ref = this.props, label = ref.label, children = ref.children, className = ref.className, style = ref.style, onClick = ref.onClick, disableRipple = ref.disableRipple;
      className = classnames('Button', className);
      if (disableRipple) {
        return React.createElement("button", {className: className, style: style,
        onClick: onClick},
        label,
        children
      );
      } else {
        return React.createElement("button", {className: className, style: style,
        onClick: onClick},
        React.createElement(Ripple, null,
          label,
          children
        )
      );
      }
    }
  });

  module.exports = Button;

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./animation/Ripple":12,"classnames":37}],5:[function(require,module,exports){
(function (global){
(function() {
  var Actions, CollapsableField, Editor, Field, React, Title, classnames, utils;

  React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

  classnames = require('classnames');

  Title = require('./Title');

  Editor = require('./editor/Editor');

  Field = require('./Field');

  utils = require('../utils');

  Actions = require('../actions/Actions');

  CollapsableField = React.createClass({displayName: "CollapsableField",
    handleBeforeChange: function(value, oldValue, data) {
      if (typeof data === 'string') {
        data = this.props.data.name + "." + data;
      } else {
        data = this.props.data.name + "." + data.name;
      }
      if (this.props.onBeforeChange) {
        return this.props.onBeforeChange.call(this, value, oldValue, data);
      }
    },
    handleChange: function(value, oldValue, data) {
      if (typeof data === 'string') {
        data = this.props.data.name + "." + data;
      } else {
        data = this.props.data.name + "." + data.name;
      }
      if (this.props.onChange) {
        return this.props.onChange.call(this, value, oldValue, data);
      }
    },
    checkAttr: function(attr, attributes) {
      var a, hidden, j, len;
      hidden = attr.hidden;
      if (hidden == null) {
        return false;
      }
      if (typeof hidden === 'object') {
        for (j = 0, len = attributes.length; j < len; j++) {
          a = attributes[j];
          if (a.name === hidden.targetName) {
            return !~hidden.targetValues.indexOf(a.value);
          }
        }
      } else {
        return hidden;
      }
    },
    check: function(data) {
      var attr, j, k, len, len1, ref, ref1, target;
      if (data.hidden) {
        return false;
      }
      if (!data.children || data.children.length === 0) {
        if (data.attributes && data.attributes.length) {
          ref = data.attributes;
          for (j = 0, len = ref.length; j < len; j++) {
            attr = ref[j];
            if (!this.checkAttr(attr, data.attributes)) {
              if (target) {
                return false;
              }
              target = attr;
            }
          }
          if (target) {
            return target;
          }
        }
      }
      if (!(data.children && data.children.length === 1)) {
        return false;
      }
      target = data.children[0];
      if (target.name === 'text') {
        if (data.attributes && data.attributes.length) {
          ref1 = data.attributes;
          for (k = 0, len1 = ref1.length; k < len1; k++) {
            attr = ref1[k];
            if (!this.checkAttr(attr, data.attributes)) {
              return false;
            }
          }
        }
        return target;
      } else if (target.hideItself) {
        return this.check(target);
      }
    },
    getFieldClass: function(data, className) {
      return classnames({
        'horizontal': !data.vertical
      }, className);
    },
    render: function() {
      var attr, attributes, children, data, elems, index, j, len, me, onAddChild, onRemoveChild, ref, style, target, text;
      elems = [];
      ref = this.props, data = ref.data, onAddChild = ref.onAddChild, onRemoveChild = ref.onRemoveChild;
      if (!data) {
        return React.createElement(Field, null);
      }
      style = this.props.style || {};
      children = data.children;
      index = 0;
      if (!(children && children.length || data.attributes || data.variableChildren)) {
        text = this.props.formatter ? this.props.formatter(data.name) : data.name;
        elems.push(
        React.createElement(Field, {className: this.getFieldClass(data, 'leaf'), label: text, key: index},
          React.createElement(Editor, React.__spread({
            onChange: this.handleChange,
            onBeforeChange: this.handleBeforeChange,
            autofocus: data.autofocus},
            data.editor,
            {owner: data,
            target: "value",
            value: data.value}))
        )
      );
      } else {
        target = this.check(data);
        if (target) {
          text = this.props.formatter ? this.props.formatter(data.name) : data.name;
          elems.push(
          React.createElement(Field, {className: this.getFieldClass(data, 'leaf'), label: text, key: index},
            React.createElement(Editor, React.__spread({
              onChange: this.handleChange,
              onBeforeChange: this.handleBeforeChange,
              autofocus: target.autofocus},
              target.editor,
              {owner: target,
              target: "value",
              value: target.value}))
          )
        );
        } else {
          if (data.name && !data.hideItself && !data.hideTitle) {
            if (style.marginLeft == null) {
              style.marginLeft = '1em';
            }
            text = this.props.formatter ? this.props.formatter(data.name) : data.name;
            elems.push(
            React.createElement(Title, {className: "x-group-title", text: text, key: index++,
              index: this.props.index,
              addable: !data.collaped && data.variableChildren,
              removable: this.props.removable,
              collaped: data.collaped,
              onClick: this._onHandleClick,
              onAdd: this._onHandleAdd,
              onRemove: this.props.onRemove})
          );
          }
          if (!data.collaped) {
            if (data.attributes && !data.hideItself) {
              attributes = data.attributes;
              for (j = 0, len = attributes.length; j < len; j++) {
                attr = attributes[j];
                if (this.checkAttr(attr, attributes)) {
                  continue;
                }
                text = this.props.formatter ? this.props.formatter(attr.name) : attr.name;
                elems.push(
                  React.createElement(Field, {className: this.getFieldClass(attr, 'leaf'), label: text, key: index++},
                    React.createElement(Editor, React.__spread({
                      onChange: this.handleChange,
                      onBeforeChange: this.handleBeforeChange},
                      attr.editor,
                      {owner: attr,
                      target: "value",
                      value: attr.value}))
                  )
                );
              }
            }
            me = this;
            if (children) {
              children.forEach(function(child, i) {
                if (child&&child.hidden) {
                  return;
                }
                return elems.push(
                React.createElement(CollapsableField, {data: child, key: index++,
                  index: i,
                  formatter: me.props.formatter,
                  onChange: me.handleChange,
                  onBeforeChange: this.handleBeforeChange,
                  onAddChild: onAddChild,
                  onRemoveChild: onRemoveChild,
                  removable: data.variableChildren,
                  onRemove: me._onHandleRemove})
              );
              });
            }
          }
        }
      }
      return React.createElement("div", {style: style},
      elems
    );
    },
    _onHandleAdd: function() {
      var flag;
      if (this.props.onAddChild) {
        flag = this.props.onAddChild.call(this, this.props.data);
      }
      if (flag !== false) {
        Actions.addChild(this.props.data);
      }
      if (typeof flag === 'function') {
        return flag();
      }
    },
    _onHandleRemove: function(index) {
      var flag;
      if (this.props.onRemoveChild) {
        flag = this.props.onRemoveChild.call(this, this.props.data, index);
      }
      if (flag !== false) {
        Actions.removeChild(this.props.data, index);
      }
      if (typeof flag === 'function') {
        return flag();
      }
    },
    _onHandleClick: function() {
      return Actions.toggleCollape(this.props.data);
    }
  });

  module.exports = CollapsableField;

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../actions/Actions":3,"../utils":34,"./Field":6,"./Title":10,"./editor/Editor":17,"classnames":37}],6:[function(require,module,exports){
(function (global){
(function() {
  var Field, React, classnames;

  React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

  classnames = require('classnames');

  Field = React.createClass({displayName: "Field",
    render: function() {
      var className, label;
      className = classnames('FormField', this.props.className);
      label = null;
      if (this.props.label) {
        label = React.createElement("label", {className: "FormLabel", style: this.props.labelStyle},
              this.props.label
            );
      }
      return React.createElement("div", {className: className, style: this.props.style},
      label,
			this.props.children
		);
    }
  });

  module.exports = Field;

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"classnames":37}],7:[function(require,module,exports){
(function (global){
(function() {
  var Inkbar, React, classnames;

  React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

  classnames = require('classnames');

  Inkbar = React.createClass({displayName: "Inkbar",
    render: function() {
      var className, style;
      className = classnames('Inkbar', this.props.className);
      style = {
        width: this.props.width,
        left: this.props.left
      };
      return React.createElement("div", {className: className, style: style},
      " "
    );
    }
  });

  module.exports = Inkbar;

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"classnames":37}],8:[function(require,module,exports){
(function (global){
(function() {
  var Actions, Nav, React, classnames;

  React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

  classnames = require('classnames');

  Actions = require('../actions/Actions');

  Nav = React.createClass({displayName: "Nav",
    getDefaultProps: function() {
      return {
        open: false
      };
    },
    close: function() {
      Actions.closeNav();
      if (this.props.onClose) {
        return this.props.onClose();
      }
    },
    open: function() {
      Actions.openNav();
      if (this.props.onOpen) {
        return this.props.onOpen();
      }
    },
    toggle: function() {
      Actions.toggleNav();
      if (this.props.onToggle) {
        return this.props.onToggle();
      }
    },
    stopPropagation: function(e) {
      return e.stopPropagation();
    },
    render: function() {
      var className, modalClass, style;
      className = classnames('Nav', this.props.className);
      modalClass = classnames('Modal');
      style = null;
      if (this.props.open) {
        style = {
          transform: 'translate3d(0px, 0px, 0px)'
        };
      }
      return React.createElement("div", {className: className, style: style, onClick: this.stopPropagation},
			this.props.children
		);
    }
  });

  module.exports = Nav;

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../actions/Actions":3,"classnames":37}],9:[function(require,module,exports){
(function (global){
(function() {
  var Note, React, classnames, noteType;

  React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

  classnames = require('classnames');

  noteType = ['default', 'primary', 'success', 'warning', 'danger'];

  Note = React.createClass({displayName: "Note",
    getDefaultProps: function() {
      return {
        type: 'default'
      };
    },
    render: function() {
      var className;
      className = classnames('FormNote', this.props.type ? "FormNote--" + this.props.type : null, this.props.className);
      return React.createElement("div", React.__spread({},  this.props, {className: className}),
      this.props.children
    );
    }
  });

  module.exports = Note;

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"classnames":37}],10:[function(require,module,exports){
(function (global){
(function() {
  var Button, React, Svg, Title, classnames;

  React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

  classnames = require('classnames');

  Button = require('./Button');

  Svg = require('./svg/Svg');

  Title = React.createClass({displayName: "Title",
    handleRemove: function() {
      if (this.props.onRemove) {
        return this.props.onRemove(this.props.index);
      }
    },
    render: function() {
      var buttons, className, index;
      className = classnames('x-title', this.props.className);
      buttons = [];
      index = 0;
      buttons.push(React.createElement(Button, {className: "Button--link-text",
        label: this.props.text,
        key: index++,
        onClick: this.props.onClick},
        React.createElement("span", null, " "),
        React.createElement(Svg, {svg: this.props.collaped ? 'rightarrow' : 'downarrow'})
      ));
      if (this.props.addable) {
        buttons.push(React.createElement(Button, {className: "Button--link-text",
          key: index++,
          disableRipple: true,
          onClick: this.props.onAdd},
          React.createElement(Svg, {svg: "add"})
        ));
      }
      if (this.props.removable) {
        buttons.push(React.createElement(Button, {className: "Button--link-text u-float-right",
          key: index++,
          disableRipple: true,
          onClick: this.handleRemove},
          React.createElement(Svg, {svg: "delete"})
        ));
      }
      return React.createElement("div", {className: className},
      buttons
    );
    }
  });

  module.exports = Title;

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Button":4,"./svg/Svg":27,"classnames":37}],11:[function(require,module,exports){
(function (global){
(function() {
  var CircleRipple, PureRenderMixin, React;

  React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

  PureRenderMixin = React.addons.PureRenderMixin;

  CircleRipple = React.createClass({displayName: "CircleRipple",
    mixins: [PureRenderMixin],
    getDefaultProps: function() {
      return {
        opacity: 0.16
      };
    },
    componentWillAppear: function(callback) {
      return this._initializeAnimation(callback);
    },
    componentWillEnter: function(callback) {
      return this._initializeAnimation(callback);
    },
    componentDidAppear: function() {
      return this._animate();
    },
    componentDidEnter: function() {
      return this._animate();
    },
    componentWillLeave: function(callback) {
      var me, style;
      style = ReactDOM.findDOMNode(this).style;
      style.opacity = 0;
      me = this;
      return setTimeout(function() {
        if (me.isMounted()) {
          return callback();
        }
      }, 2000);
    },
    render: function() {
      var color, opacity, ref, style;
      ref = this.props, color = ref.color, opacity = ref.opacity, style = ref.style;
      if (typeof color !== 'undefined' && color !== null) {
        style.backgroundColor = color;
      }
      return React.createElement("div", {className: "circle-ripple", style: style});
    },
    _animate: function() {
      var style;
      style = ReactDOM.findDOMNode(this).style;
      style.opacity = 1;
      style.transition = 'opacity 3s cubic-bezier(0.23, 1, 0.32, 1) 0ms , ' + 'transform 1s cubic-bezier(0.23, 1, 0.32, 1) 0ms';
      return style.transform = 'scale(1)';
    },
    _initializeAnimation: function(callback) {
      var me, style;
      style = ReactDOM.findDOMNode(this).style;
      style.opacity = this.props.opacity;
      style.transform = 'scale(0)';
      me = this;
      return setTimeout(function() {
        if (me.isMounted()) {
          return callback();
        }
      }, 0);
    }
  });

  module.exports = CircleRipple;

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],12:[function(require,module,exports){
(function (global){
(function() {
  var CircleRipple, PureRenderMixin, React, Ripple, TransitionGroup, ref, update;

  React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

  ref = React.addons, PureRenderMixin = ref.PureRenderMixin, TransitionGroup = ref.TransitionGroup, update = ref.update;

  CircleRipple = require('./CircleRipple');

  Ripple = React.createClass({displayName: "Ripple",
    mixins: [PureRenderMixin],
    getInitialState: function() {
      return {
        nextKey: 0,
        ripples: []
      };
    },
    render: function() {
      var children, rippleGroup, ripples;
      children = this.props.children;
      ripples = this.state.ripples;
      rippleGroup = React.createElement(TransitionGroup, {className: "ripple"},
      ripples
    );
      return React.createElement("div", {className: "ripple-container",
      onMouseUp: this._handleMouseUp,
      onMouseDown: this._handleMouseDown,
      onMouseLeave: this._handleMouseLeave,
      onTouchStart: this._handleTouchStart,
      onTouchEnd: this._handleTouchEnd},
      rippleGroup,
      children
    );
    },
    start: function(e, isRippleTouchGenerated) {
      var newRipple, ripples;
      if (this._ignoreNextMouseDown && !isRippleTouchGenerated) {
        this._ignoreNextMouseDown = false;
        return;
      }
      ripples = this.state.ripples;
      newRipple = React.createElement(CircleRipple, {
      key: this.state.nextKey,
      style: this._getRippleStyle(e),
      color: this.props.color});
      ripples = update(ripples, {
        $push: [newRipple]
      });
      this._ignoreNextMouseDown = isRippleTouchGenerated;
      return this.setState({
        nextKey: ++this.state.nextKey,
        ripples: ripples
      });
    },
    end: function() {
      var currentRipples;
      currentRipples = this.state.ripples;
      return this.setState({
        ripples: update(currentRipples, {
          $splice: [[0, 1]]
        })
      });
    },
    _handleMouseDown: function(e) {
      if (e.button === 0) {
        return this.start(e, false);
      }
    },
    _handleMouseUp: function() {
      return this.end();
    },
    _handleMouseLeave: function() {
      return this.end();
    },
    _offset: function(el) {
      var rect;
      rect = el.getBoundingClientRect();
      return {
        top: rect.top + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft
      };
    },
    _getRippleStyle: function(e) {
      var botLeftDiag, botRightDiag, el, left, offset, offsetHeight, offsetWidth, pageX, pageY, pointerX, pointerY, rippleRadius, rippleSize, top, topLeftDiag, topRightDiag;
      el = ReactDOM.findDOMNode(this);
      offsetHeight = el.offsetHeight, offsetWidth = el.offsetWidth;
      offset = this._offset(el);
      pageX = e.pageX, pageY = e.pageY;
      pointerX = pageX - offset.left;
      pointerY = pageY - offset.top;
      topLeftDiag = this._calcDiag(pointerX, pointerY);
      topRightDiag = this._calcDiag(offsetWidth - pointerX, pointerY);
      botRightDiag = this._calcDiag(offsetWidth - pointerX, offsetHeight - pointerY);
      botLeftDiag = this._calcDiag(pointerX, offsetHeight - pointerY);
      rippleRadius = Math.max(topLeftDiag, topRightDiag, botRightDiag, botLeftDiag);
      rippleSize = rippleRadius * 2;
      left = pointerX - rippleRadius;
      top = pointerY - rippleRadius;
      return {
        height: rippleSize + "px",
        width: rippleSize + "px",
        top: top + "px",
        left: left + "px"
      };
    },
    _calcDiag: function(a, b) {
      return Math.sqrt(a * a + b * b);
    }
  });

  module.exports = Ripple;

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./CircleRipple":11}],13:[function(require,module,exports){
(function (global){
(function() {
  var Actions, Checkbox, React, classnames;

  React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

  classnames = require('classnames');

  Actions = require('../../actions/Actions');

  Checkbox = React.createClass({displayName: "Checkbox",
    getDefaultProps: function() {
      return {
        on: 'true',
        off: 'false'
      };
    },
    getInitialState: function() {
      return {
        value: this.props.value || ''
      };
    },
    componentDidMount: function() {
      if (this.props.autofocus) {
        return this.focus();
      }
    },
    componentWillReceiveProps: function(nextProps) {
      if (nextProps.value !== this.state.value) {
        return this.setState({
          value: nextProps.value
        });
      }
    },
    handleChange: function(e) {
      var flag, value;
      if (this.props.onBeforeChange) {
        flag = this.props.onBeforeChange(value, this.oldValue, this.props.owner);
      }
      if (flag === false) {
        return;
      }
      value = e.target.checked;
      value = value ? this.props.on : this.props.off;
      this.setState({
        value: value
      });
      this._onUpdateValue(value);
      return this.oldValue = value;
    },
    focus: function() {
      return this.refs.textInput.focus();
    },
    render: function() {
      var className, value;
      className = classnames("x-checkbox-editor", this.props.className);
      value = this.state.value || '';
      return React.createElement("div", null,
      React.createElement("input", React.__spread({},  this.props, {className: className,
        ref: "textInput", checked: value === this.props.on || value.toLowerCase() == this.props.on,
        value: value, onChange: this.handleChange}))
     );
    },
    _onUpdateValue: function(value) {
      Actions.updateValue(this.props.owner, this.props.target, value);
      if (this.props.onChange) {
        return this.props.onChange(value, this.oldValue, this.props.owner);
      }
    }
  });

  module.exports = Checkbox;

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../actions/Actions":3,"classnames":37}],14:[function(require,module,exports){
(function (global){
(function() {
  var Actions, Combobox, React, classnames;

  React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

  classnames = require('classnames');

  Actions = require('../../actions/Actions');

  Combobox = React.createClass({displayName: "Combobox",
    getDefaultProps: function() {
      return {
        value: ''
      };
    },
    getInitialState: function() {
      return {
        value: typeof this.props.value === 'undefined' || this.props.value === null ? '' : this.props.value
      };
    },
    componentDidMount: function() {
      if (this.props.options && this.props.options.length > 0 && this.props.options[0].value !== '' && this.state.value === '') {
        Actions.updateValue(this.props.owner, this.props.target, this.props.options[0].value);
      }
      if (this.props.autofocus) {
        return this.focus();
      }
    },
    componentWillReceiveProps: function(nextProps) {
      if (nextProps.value !== this.state.value) {
        return this.setState({
          value: nextProps.value
        });
      }
    },
    handleChange: function(e) {
      var flag, value;
      value = e.target.value;
      if (this.oldValue === void 0 || this.oldValue === null) {
        this.oldValue = this.state.value;
      }
      if (this.props.onBeforeChange) {
        flag = this.props.onBeforeChange(value, this.oldValue, this.props.owner);
      }
      if (flag === false) {
        return;
      }
      this.setState({
        value: value
      });
      this._onUpdateValue(value);
      return this.oldValue = value;
    },
    focus: function() {
      return this.refs.select.focus();
    },
    render: function() {
      var className, i, index, len, opt, optionElems, options;
      optionElems = [];
      index = 0;
      options = this.props.options || [];
      for (i = 0, len = options.length; i < len; i++) {
        opt = options[i];
        optionElems.push(
        React.createElement("option", {key: index++, value: opt.value}, opt.text)
      );
      }
      className = classnames("x-combobox", "FormInput", this.props.className);
      return React.createElement("select", React.__spread({},  this.props, {className: className,
      ref: "select",
      onChange: this.handleChange,
      onDoubleClick: this.props.onDoubleClick,
      onClick: this.props.onClick,
      value: this.state.value}),
      optionElems
    );
    },
    _onUpdateValue: function(value) {
      Actions.updateValue(this.props.owner, this.props.target, value);
      if (this.props.onChange) {
        return this.props.onChange(value, this.oldValue, this.props.owner);
      }
    }
  });

  module.exports = Combobox;

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../actions/Actions":3,"classnames":37}],15:[function(require,module,exports){
(function (global){
(function() {
  var Actions, DefaultEditor, React, Validatable, classnames;

  React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

  classnames = require('classnames');

  Validatable = require('../mixins/validatable');

  Actions = require('../../actions/Actions');

  DefaultEditor = React.createClass({displayName: "DefaultEditor",
    mixins: [Validatable],
    getDefaultProps: function() {
      return {
        required: false,
        requiredMessage: langType.message.requiredMessage,
        rule: '',
        invalidMessage: langType.message.requiredMessage,
        value: ''
      };
    },
    getInitialState: function() {
      return {
        isValid: true,
        value: this.props.value || ''
      };
    },
    componentDidMount: function() {
      var value;
      value = this.state.value;
      if (this.props.autofocus && (typeof value === 'undefined' || typeof value === null || value === '')) {
        return this.focus();
      }
    },
    componentWillReceiveProps: function(nextProps) {
      var newState;
      if (nextProps.value !== this.state.value) {
        newState = {
          value: nextProps.value
        };
        this.validateValue(nextProps.value, newState);
        return this.setState(newState);
      }
    },
    validateValue: function(value, newState) {
      var valid;
      if (typeof this.props.rule === 'function') {
        valid = this.props.rule(value);
      } else if (typeof this.props.rule === 'string') {
        valid = this.validate(this.props.rule, value);
      }
      if (typeof valid === 'boolean') {
        return newState.isValid = valid;
      } else if (typeof valid === 'object') {
        newState.isValid = valid.isValid;
        return this.props.invalidMessage = valid.message;
      }
    },
    handleChange: function(e) {
      var flag, newState, value;
      if (this.props.onBeforeChange) {
        flag = this.props.onBeforeChange(value, this.oldValue, this.props.owner);
      }
      if (flag === false) {
        return;
      }
      value = e.target.value;
      newState = {
        value: value
      };
      this.validateValue(value, newState);
      this.setState(newState);
      if (newState.isValid) {
        this._onUpdateValue(value);
      }
      return this.oldValue = value;
    },
    focus: function() {
      return this.refs.textInput.focus();
    },
    render: function() {
      var className, placeholder, requiredMessage, validationMessage, value;
      requiredMessage = null;
      if (this.props.required && !this.state.value) {
        requiredMessage = React.createElement("div", {className: "form-validation is-invalid"},
          this.props.requiredMessage
        );
      }
      validationMessage = null;
      if (!this.state.isValid) {
        validationMessage = React.createElement("div", {className: "form-validation is-invalid"},
          this.props.invalidMessage
        );
      }
      className = classnames("x-default-editor", 'FormInput', {
        'is-invalid': !this.state.isValid || requiredMessage !== null
      }, this.props.className);
      placeholder = this.props.placeholder || '请输入';
      value = this.state.value || '';
      if (this.props.multiline) {
        return React.createElement("div", null,
        React.createElement("textarea", React.__spread({},  this.props, {className: className,
          placeholder: placeholder,
          ref: "textInput",
          value: value, onChange: this.handleChange})),
        requiredMessage,
        validationMessage
       );
      } else {
        return React.createElement("div", null,
        React.createElement("input", React.__spread({},   this.props, {className: className,
          placeholder: placeholder,
          ref: "textInput",
          value: value, onChange: this.handleChange})),
        requiredMessage,
        validationMessage
       );
      }
    },
    _onUpdateValue: function(value) {
      Actions.updateValue(this.props.owner, this.props.target, value);
      if (this.props.onChange) {
        return this.props.onChange(value, this.oldValue, this.props.owner, this.props.target);
      }
    }
  });

  module.exports = DefaultEditor;

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../actions/Actions":3,"../mixins/validatable":22,"classnames":37}],16:[function(require,module,exports){
(function (global){
(function() {
  var Actions, DurationEditor, React, classnames;

  React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

  classnames = require('classnames');

  Actions = require('../../actions/Actions');

  DurationEditor = React.createClass({displayName: "DurationEditor",
    getDefaultProps: function() {
      return {
        required: false,
        value: '',
        year: 'year',
        month: 'month',
        week: 'week',
        day: 'day',
        hour: 'hour',
        minute: 'minute',
        second: 'second',
        options: ['year', 'month', 'week', 'day', 'hour', 'minute', 'second'],
        format: {
          year: 'Y',
          month: 'M',
          week: 'W',
          day: 'D',
          hour: 'H',
          minute: 'M',
          second: 'S'
        }
      };
    },
    getInitialState: function() {
      return this.setDuration(this.props.value);
    },
    componentDidMount: function() {
      var value;
      value = this.state.value;
      if (this.props.autofocus && (typeof value === 'undefined' || typeof value === null || value === '')) {
        return this.focus();
      }
    },
    componentWillReceiveProps: function(nextProps) {
      var newState;
      if (nextProps.value !== this.state.value) {
        newState = {
          value: nextProps.value
        };
        return this.setState(newState);
      }
    },
    handleChange: function(type, e) {
      var newState, value;
      value = e.target.value - 0;
      if (isNaN(value) || value === 0) {
        value = '';
      }
      newState = {};
      newState[type] = value;
      this.setState(newState, function(){
        return this._onUpdateValue(this.getDuration());
      });
  //    return this._onUpdateValue(this.getDuration());
    },
    focus: function() {
      if (this.refs[0]) {
        return this.refs[0].focus();
      }
    },
    render: function() {
      var children, className, day, hour, minute, month, options, ref, ref1, second, week, year;
      ref = this.props, options = ref.options, className = ref.className;
      ref1 = this.state, year = ref1.year, month = ref1.month, week = ref1.week, day = ref1.day, hour = ref1.hour, minute = ref1.minute, second = ref1.second;
      className = classnames("x-duration-editor", 'FormInput', className);
      children = options.map(function(option, i) {
        return React.createElement("span", {key: i},
        React.createElement("input", {className: className,
          ref: i,
          value: this.state[option],
          onChange: this.handleChange.bind(this, option)}
        ),
        React.createElement("span", null,
          this.props[option]
        )
      );
      }, this);
      return React.createElement("div", null,
      children
    );
    },
    getDuration: function() {
      var flag, flagArr, format, options, ref, results, value;
      ref = this.props, options = ref.options, format = ref.format;
      flag = false;
      flagArr = ['H', 'M', 'S'];
      value = 0;
      results = [];
      options.forEach(function(option) {
        value = this.state[option] - 0;
        if (!(isNaN(value) || value === 0)) {
          if (flag === false && ~flagArr.indexOf(format[option])) {
            results.push('T');
            flag = true;
          }
          results.push(value);
          return results.push(format[option]);
        }
      }, this);
      if (results.length > 0) {
        results.unshift('P');
      }
      return results.join('');
    },
    setDuration: function(duration) {
      var matchs, reg;
      duration = duration || '';
      reg = /P((\d+)Y)?((\d+)M)?((\d+)W)?((\d+)D)?T?((\d+)H)?((\d+)M)?((\d+)S)?/i;
      matchs = duration.match(reg);
      return {
        year: matchs && matchs[2] || '',
        month: matchs && matchs[4] || '',
        week: matchs && matchs[6] || '',
        day: matchs && matchs[8] || '',
        hour: matchs && matchs[10] || '',
        minute: matchs && matchs[12] || '',
        second: matchs && matchs[14] || ''
      };
    },
    _onUpdateValue: function(value) {
      Actions.updateValue(this.props.owner, this.props.target, value);
      if (this.props.onChange) {
        return this.props.onChange(value, this.props.owner, this.props.target);
      }
    }
  });

  module.exports = DurationEditor;

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../actions/Actions":3,"classnames":37}],17:[function(require,module,exports){
(function (global){
(function() {
  var Checkbox, Combobox, DefaultEditor, DurationEditor, Editor, GlobalizedEditor, Multicheckbox, React, Template;

  React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

  DefaultEditor = require('./DefaultEditor');

  Combobox = require('./Combobox');

  GlobalizedEditor = require('./GlobalizedEditor');

  Template = require('./Template');

  Checkbox = require('./Checkbox');

  Multicheckbox = require('./Multicheckbox');

  DurationEditor = require('./DurationEditor');

  Editor = React.createClass({displayName: "Editor",
    handleClick: function() {
      if (this.props.onClick) {
        return this.props.onClick.call(this);
      }
    },
    render: function() {
      var className, type;
      type = this.props.type || 'default';
      className = this.props.className;
      switch (type) {
        case 'none':
          return React.createElement("div", null, React.createElement("label", {className: "FormLabel"}, this.props.value));
        case 'combobox':
          return React.createElement(Combobox, React.__spread({},  this.props, {className: className}));
        case 'globalizedEditor':
          return React.createElement(GlobalizedEditor, React.__spread({},  this.props, {className: className}));
        case 'template':
          return React.createElement(Template, React.__spread({},  this.props, {className: className}));
        case 'checkbox':
          return React.createElement(Checkbox, React.__spread({},  this.props, {className: className}));
        case 'multicheckbox':
          return React.createElement(Multicheckbox, React.__spread({},  this.props, {className: className}));
        case 'a':
          return React.createElement("button", {className: "Button Button--link",
          onClick: this.handleClick},
          this.props.label
        );
        case 'durationEdtior':
          return React.createElement(DurationEditor, React.__spread({},  this.props, {className: className}));
        case 'getSelect':{
			    return React.createElement("div",{className:'getSelect'},
			           React.createElement("input",{style:{height:'20px',width:'300px',marginRight:'1px'},onChange:this.handleChange,readOnly:true,ref:function(ref){this.myTextInput = ref}.bind(this),value:this.props.value}),
			           React.createElement("button",{style:{height:'25px',lineHeight:'25px',border:'1px solid #777',color:'#777',backgroundColor:'white',
				             "cursor":"pointer"},onClick:this.handleClick},this.props.label));
          }
        default:
          return React.createElement(DefaultEditor, React.__spread({},  this.props, {className: className}));
      }
    }
  });
  module.exports = Editor;

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Checkbox":13,"./Combobox":14,"./DefaultEditor":15,"./DurationEditor":16,"./GlobalizedEditor":18,"./Multicheckbox":19,"./Template":21}],18:[function(require,module,exports){
(function (global){
(function() {
  var Actions, DefaultEditor, Field, GlobalizedEditor, React, classnames;

  React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

  classnames = require('classnames');

  Field = require('../Field');

  DefaultEditor = require('./DefaultEditor');

  Actions = require('../../actions/Actions');

  GlobalizedEditor = React.createClass({displayName: "GlobalizedEditor",
    getDefaultProps: function() {
      return {
        required: false,
        options: [
          {
            text: '中文',
            value: 'zh-cn'
          }, {
            text: '英文',
            value: 'en'
          }
        ],
        value: ''
      };
    },
    getInitialState: function() {
      return {
        value: this.parse(this.props.value || '')
      };
    },
    componentWillReceiveProps: function(nextProps) {
      return this.setState({
        value: this.parse(nextProps.value)
      });
    },
    handleChange: function(value, oldValue, data, target) {
      var flag, wholeValue;
      if (this.props.onBeforeChange) {
        flag = this.props.onBeforeChange(value, this.oldValue, this.props.owner);
      }
      if (flag === false) {
        return;
      }
      wholeValue = this.stringify();
      this._onUpdateValue(wholeValue);
      if (target) {
        target = this.props.owner.name + "." + target;
      } else {
        target = this.props.owner.name;
      }
      if (this.props.onChange) {
        return this.props.onChange(value, oldValue, target);
      }
    },
    parse: function(value) {
      var error;
      if (value == null) {
        value = this.state.value;
      }
      if (value) {
        try {
          value = JSON.parse(value);
        } catch (error) {
          value = {};
        }
      } else {
        value = {};
      }
      return value;
    },
    stringify: function() {
      return JSON.stringify(this.state.value);
    },
    render: function() {
      var autofocus, className, i, index, len, opt, options, rows, value;
      className = classnames("x-default-editor", this.props.className);
      options = this.props.options;
      rows = [];
      value = this.state.value;
      index = 0;
      autofocus = this.props.autofocus;
      for (i = 0, len = options.length; i < len; i++) {
        opt = options[i];
        rows.push(
        React.createElement("div", {className: "FormRow", key: index++},
          React.createElement(Field, {label: opt.text, className: "horizontal",
            labelStyle: {paddingLeft:'0px', width: '70px'},
            style: {marginLeft:'0px'}},
            React.createElement(DefaultEditor, {className: "FormInput", style: {marginLeft:'0px'},
              required: this.props.required,
              autofocus: autofocus,
              onChange: this.handleChange,
              owner: value,
              target: opt.value,
              placeholder:designer.getLang('message.inputs'),
              value: value[opt.value]})
          )
         ));
        autofocus = false;
      }
      return React.createElement("div", null,
      rows
    );
    },
    _onUpdateValue: function(value) {
      return Actions.updateValue(this.props.owner, this.props.target, value);
    }
  });

  module.exports = GlobalizedEditor;

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../actions/Actions":3,"../Field":6,"./DefaultEditor":15,"classnames":37}],19:[function(require,module,exports){
(function (global){
(function() {
  var Actions, Multicheckbox, React, classnames;

  React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

  classnames = require('classnames');

  Actions = require('../../actions/Actions');

  Multicheckbox = React.createClass({displayName: "Multicheckbox",
    getInitialState: function() {
      return {
        value: this.props.value || 0
      };
    },
    componentWillReceiveProps: function(nextProps) {
      if (nextProps.value !== this.state.value) {
        return this.setState({
          value: nextProps.value
        });
      }
    },
    handleChange: function(index, e) {
      var flag, value;
      if (this.props.onBeforeChange) {
        flag = this.props.onBeforeChange(this.state.value, index, e.target.checked, this.props);
      }
      if (flag === false) {
        return;
      }
      this.oldValue = this.state.value;
      value = isNaN(flag) ? this.state.value : flag;
      value = e.target.checked ? value | Math.pow(2, index) : value & (Math.pow(2, this.props.data.count) - 1 - Math.pow(2, index));
      return this._onUpdateValue(value);
    },
    render: function() {
      var children, className, i, j, options, ref, style, target, value;
      className = classnames("x-multicheckbox-editor", this.props.className);
      value = this.state.value || 0;
      options = this.props.data.options || [];
      style = this.props.mode === 'vertical' ? {
        display: 'block'
      } : null;
      children = [];
      for (i = j = 0, ref = options.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        target = options[i];
        children.push(
        React.createElement("span", {key: i, style: style},
          React.createElement("input", {className: className, type: "checkbox",
            checked: value & Math.pow(2, target.key),
            onChange: this.handleChange.bind(this, target.key)}),
          target.text
        ));
      }
      return React.createElement("div", {className: "x-multicheckbox-editor"},
      children
     );
    },
    _onUpdateValue: function(value) {
      Actions.updateValue(this.props.owner, this.props.target, value);
      if (this.props.onChange) {
        return this.props.onChange(value, this.oldValue, this.props.owner);
      }
    }
  });

  module.exports = Multicheckbox;

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../actions/Actions":3,"classnames":37}],20:[function(require,module,exports){
(function (global){
(function() {
  var Actions, Note, React, SelectList, classnames;

  React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

  classnames = require('classnames');

  Note = require('../Note');

  Actions = require('../../actions/Actions');

  SelectList = React.createClass({displayName: "SelectList",
    getDefaultProps: function() {
      return {
        value: ''
      };
    },
    getInitialState: function() {
      return {
        value: this.props.value || ''
      };
    },
    componentDidMount: function() {
      if (this.props.autofocus) {
        return this.focus();
      }
    },
    componentWillReceiveProps: function(nextProps) {
      if (nextProps.value !== this.state.value) {
        return this.setState({
          value: nextProps.value
        });
      }
    },
    handleChange: function(e) {
      var flag, value;
      if (this.props.onBeforeChange) {
        flag = this.props.onBeforeChange(value, this.oldValue, this.props.owner);
      }
      if (flag === false) {
        return;
      }
      value = e.target.value;
      this.setState({
        value: value
      });
      if (this.props.onChange) {
        this.props.onChange(value, this.oldValue);
      }
      return this.oldValue = value;
    },
    focus: function() {
      return this.refs.select.focus();
    },
    render: function() {
      var className, currentOption, i, index, len, note, noteElem, opt, optionElems, options, value;
      optionElems = [];
      index = 0;
      options = this.props.options || [];
      currentOption = [];
      value = this.state.value || '';
      for (i = 0, len = options.length; i < len; i++) {
        opt = options[i];
        if (value === opt.value) {
          currentOption = opt;
        }
        optionElems.push(
        React.createElement("option", {key: index++, value: opt.value}, opt.text)
      );
      }
      if (currentOption) {
        value = currentOption.value;
        note = currentOption.description;
      }
      noteElem = null;
      if (note) {
        noteElem = React.createElement(Note, null, note);
      }
      className = classnames("x-selectlist", "FormInput", this.props.className);
      return React.createElement("div", null,
      React.createElement("select", React.__spread({},  this.props, {className: className,
        onChange: this.handleChange,
        onDoubleClick: this.props.onDoubleClick,
        onClick: this.props.onClick,
        value: value}),
        optionElems
      ),
      noteElem
    );
    }
  });

  module.exports = SelectList;

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../actions/Actions":3,"../Note":9,"classnames":37}],21:[function(require,module,exports){
(function (global){
(function() {
  var Actions, Field, Note, React, SelectList, Template, classnames;

  React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

  classnames = require('classnames');

  Field = require('../Field');

  Note = require('../Note');

  SelectList = require('./SelectList');

  Actions = require('../../actions/Actions');

  Template = React.createClass({displayName: "Template",
    getDefaultProps: function() {
      return {
        required: false,
        requiredMessage: '该项为必填项',
        variables: [],
        template: '${flow.GetVariable("{0}")}',
        value: '',
        selectValue: ''
      };
    },
    getInitialState: function() {
      return {
        value: this.props.value
      };
    },
    componentDidMount: function() {
      if (this.props.autofocus) {
        return this.focus();
      }
    },
    componentWillReceiveProps: function(nextProps) {
      if (nextProps.value !== this.state.value) {
        return this.setState({
          value: nextProps.value
        });
      }
    },
    onSelectChange: function(value) {
      if (this.selectValue !== value) {
        return this.selectValue = value;
      }
    },
    handleChange: function(e) {
      var flag, value;
      if (this.props.onBeforeChange) {
        flag = this.props.onBeforeChange(value, this.oldValue, this.props.owner);
      }
      if (flag === false) {
        return;
      }
      value = e.target.value;
      this.setState({
        value: value
      });
      this._onUpdateValue(value);
      this.oldValue = value;
      this.selectionStart = e.target.selectionStart;
      return this.selectionEnd = e.target.selectionEnd;
    },
    handleDoubleSelect: function(e) {
      var endStr, startStr, temp, template, value;
      value = this.state.value;
      template = this.props.template.replace('{0}', this.selectValue || '');
      if (typeof this.selectionStart === 'undefined' || this.selectionStart === null) {
        value += template;
      } else {
        if (this.selectionStart > this.selectionEnd) {
          temp = this.selectionStart;
          this.selectionStart = this.selectionEnd;
          this.selectionEnd = temp;
        }
        startStr = value.substring(0, this.selectionStart);
        endStr = value.substring(this.selectionEnd);
        value = startStr + template + endStr;
      }
      this.setState({
        value: value
      });
      if (this.props.owner) {
        return this.props.owner[this.props.target] = value;
      }
    },
    handleClick: function(e) {
      this.selectionStart = e.target.selectionStart;
      return this.selectionEnd = e.target.selectionEnd;
    },
    focus: function() {
      return this.refs.textarea.focus();
    },
    render: function() {
      var className, requiredMessage, selectValue, value;
      value = this.state.value;
      requiredMessage = null;
      if (this.props.required && !this.state.value) {
        requiredMessage = React.createElement("div", {className: "form-validation is-invalid"},
          this.props.requiredMessage
        );
      }
      className = classnames("x-template-editor", {
        'is-invalid': requiredMessage !== null
      }, "FormInput", this.props.className);
      selectValue = this.selectValue || this.props.selectValue;
      this.oldValue = value;
      return React.createElement("div", {className: "FormRow"},
      React.createElement(Field, {label: langType.label.addVariable, className: "horizontal"},
        React.createElement(SelectList, {ref: "select", size: "8",
          value: selectValue,
          options: this.props.variables,
          onChange: this.onSelectChange,
          onDoubleClick: this.handleDoubleSelect}
          )
      ),
      React.createElement("textarea", {className: className, style: this.props.style,
        ref: "textarea",
        value: value,
        onChange: this.handleChange,
        onClick: this.handleClick}
        ),
        langType.label.requiredMessage
     );
    },
    _onUpdateValue: function(value) {
      Actions.updateValue(this.props.owner, this.props.target, value);
      if (this.props.onChange) {
        return this.props.onChange(value, this.oldValue, this.props.owner);
      }
    }
  });

  module.exports = Template;

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../actions/Actions":3,"../Field":6,"../Note":9,"./SelectList":20,"classnames":37}],22:[function(require,module,exports){
(function() {
  var Validatable, rules;

  rules = {
    ASCII: function(value) {
      var flag;
      flag = !/[^a-zA-Z0-9]/.test(value);
      if (flag) {
        return !/^[0-9]/.test(value);
      }
      return flag;
    }
  };

  Validatable = {
    validate: function(rule, value) {
      if (rules[rule]) {
        return rules[rule](value);
      }
      return true;
    }
  };

  module.exports = Validatable;

}).call(this);

},{}],23:[function(require,module,exports){
(function (global){
(function() {
  var AddSvg, React;

  React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

  AddSvg = React.createClass({displayName: "AddSvg",
    render: function() {
      return (
      	React.createElement("svg", {viewBox: "0 0 128 128", width: "22pt", height: "22pt"},
          React.createElement("g", {"fill-rule": "evenodd"},
            React.createElement("path", {d: "M56,72 L8.00697327,72 C3.59075293,72 0,68.418278 0,64 C0,59.5907123 3.58484404,56 8.00697327,56 L56,56 L56,8.00697327 C56,3.59075293 59.581722,0 64,0 C68.4092877,0 72,3.58484404 72,8.00697327 L72,56 L119.993027,56 C124.409247,56 128,59.581722 128,64 C128,68.4092877 124.415156,72 119.993027,72 L72,72 L72,119.993027 C72,124.409247 68.418278,128 64,128 C59.5907123,128 56,124.415156 56,119.993027 L56,72 L56,72 Z"})
          )
        )
      );
    }
  });

  module.exports = AddSvg;

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],24:[function(require,module,exports){
(function (global){
(function() {
  var DeleteSvg, React;

  React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

  DeleteSvg = React.createClass({displayName: "DeleteSvg",
    render: function() {
      return (
      React.createElement("svg", {viewBox: "0 0 128 128", width: "22pt", height: "22pt"},
        React.createElement("g", {"fill-rule": "evenodd"},
          React.createElement("path", {d: "M65.0864256,75.4091629 L14.9727349,125.522854 C11.8515951,128.643993 6.78104858,128.64922 3.65685425,125.525026 C0.539017023,122.407189 0.5336324,117.334539 3.65902635,114.209145 L53.7727171,64.0954544 L3.65902635,13.9817637 C0.537886594,10.8606239 0.532659916,5.79007744 3.65685425,2.6658831 C6.77469148,-0.451954124 11.8473409,-0.457338747 14.9727349,2.66805521 L65.0864256,52.7817459 L115.200116,2.66805521 C118.321256,-0.453084553 123.391803,-0.458311231 126.515997,2.6658831 C129.633834,5.78372033 129.639219,10.8563698 126.513825,13.9817637 L76.4001341,64.0954544 L126.513825,114.209145 C129.634965,117.330285 129.640191,122.400831 126.515997,125.525026 C123.39816,128.642863 118.32551,128.648248 115.200116,125.522854 L65.0864256,75.4091629 L65.0864256,75.4091629 Z"}
          )
        )
      )
    );
    }
  });

  module.exports = DeleteSvg;

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],25:[function(require,module,exports){
(function (global){
(function() {
  var DownArrowSvg, React;

  React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

  DownArrowSvg = React.createClass({displayName: "DownArrowSvg",
    render: function() {
      return (
        React.createElement("svg", {viewBox: "0 0 128 128", width: "22pt", height: "22pt"},
            React.createElement("path", {d: "M109.35638,81.3533152 C107.923899,82.7869182 105.94502,83.6751442 103.759224,83.6751442 L24.5910645,83.6751442 C20.225873,83.6751442 16.6751442,80.1307318 16.6751442,75.7584775 C16.6751442,71.3951199 20.2192225,67.8418109 24.5910645,67.8418109 L95.8418109,67.8418109 L95.8418109,-3.40893546 C95.8418109,-7.77412698 99.3862233,-11.3248558 103.758478,-11.3248558 C108.121835,-11.3248558 111.675144,-7.78077754 111.675144,-3.40893546 L111.675144,75.7592239 C111.675144,77.9416955 110.789142,79.9205745 109.356651,81.3538862 Z", transform: "translate(64.175144, 36.175144) rotate(45.000000) translate(-64.175144, -36.175144) "})
        )
      );
    }
  });

  module.exports = DownArrowSvg;

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],26:[function(require,module,exports){
(function (global){
(function() {
  var LeftArrowSvg, React;

  React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

  LeftArrowSvg = React.createClass({displayName: "LeftArrowSvg",
    render: function() {
      return (
        React.createElement("svg", {width: "22pt", height: "22pt", viewBox: "0 0 128 128", version: "1.1"},
          React.createElement("g", {"full-rule": "evenodd", transform: "translate(-48.000000, -3.000000)"},
            React.createElement("path", {d: "M112.743107,112.12741 C111.310627,113.561013 109.331747,114.449239 107.145951,114.449239 L27.9777917,114.449239 C23.6126002,114.449239 20.0618714,110.904826 20.0618714,106.532572 C20.0618714,102.169214 23.6059497,98.6159054 27.9777917,98.6159054 L99.2285381,98.6159054 L99.2285381,27.365159 C99.2285381,22.9999675 102.77295,19.4492387 107.145205,19.4492387 C111.508562,19.4492387 115.061871,22.993317 115.061871,27.365159 L115.061871,106.533318 C115.061871,108.71579 114.175869,110.694669 112.743378,112.127981 Z", transform: "translate(67.561871, 66.949239) rotate(-45.000000) translate(-67.561871, -66.949239)"}
    				)
          )
        )
      );
    }
  });

  module.exports = LeftArrowSvg;

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],27:[function(require,module,exports){
(function (global){
(function() {
  var AddSvg, DeleteSvg, DownArrowSvg, React, RightArrowSvg, Svg;

  React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

  AddSvg = require('./Add');

  DeleteSvg = require('./Delete');

  DownArrowSvg = require('./DownArrow');

  RightArrowSvg = require('./RightArrow');

  Svg = React.createClass({displayName: "Svg",
    render: function() {
      var svg;
      svg = this.props.svg;
      switch (svg.toLowerCase()) {
        case 'add':
          return React.createElement(AddSvg, null);
        case 'delete':
          return React.createElement(DeleteSvg, null);
        case 'downarrow':
          return React.createElement(DownArrowSvg, null);
        case 'rightarrow':
          return React.createElement(RightArrowSvg, null);
      }
    }
  });

  module.exports = Svg;

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Add":23,"./Delete":24,"./DownArrow":25,"./RightArrow":26}],28:[function(require,module,exports){
(function (global){
(function() {
  var React, Tab, classnames;

  React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

  classnames = require('classnames');

  Tab = React.createClass({displayName: "Tab",
    handleClick: function() {
      if (this.props.onClick) {
        return this.props.onClick(this.props.tabIndex);
      }
    },
    render: function() {
      var className, style;
      className = classnames('Tab', {
        'selected': this.props.selected
      }, this.props.className);
      style = {
        width: this.props.width
      };
      return React.createElement("div", React.__spread({},  this.props, {className: className, style: style,
      onClick: this.handleClick}),
      this.props.label
    );
    }
  });

  module.exports = Tab;

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"classnames":37}],29:[function(require,module,exports){
(function (global){
(function() {
  var React, TabTemplate, classnames;

  React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

  classnames = require('classnames');

  TabTemplate = React.createClass({displayName: "TabTemplate",
    render: function() {
      var className, style;
      className = classnames('TabTemplate', this.props.className);
      style = {};
      if (!this.props.selected) {
        style.height = '0px';
      }
      return React.createElement("div", {className: className, style: style},
      this.props.children
    );
    }
  });

  module.exports = TabTemplate;

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"classnames":37}],30:[function(require,module,exports){
(function (global){
(function() {
  var Actions, Inkbar, React, Tab, TabTemplate, Tabs, classnames;

  React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

  classnames = require('classnames');

  Tab = require('./Tab');

  TabTemplate = require('./TabTemplate');

  Inkbar = require('../Inkbar');

  Actions = require('../../actions/Actions');

  Tabs = React.createClass({displayName: "Tabs",
    getDefaultProps: function() {
      return {
        selectedIndex: 0
      };
    },
    handleRemove: function() {},
    handleSwitch: function(index) {
      if (index !== this.state.selectedIndex) {
        return this.setState({
          selectedIndex: index
        });
      }
    },
    getTabCount: function() {
      return React.Children.count(this.props.children);
    },
    render: function() {
      var children, claName, className, left, ref, selectedIndex, switchStyle, tabContent, tabs, width;
      ref = this.props, claName = ref.claName, children = ref.children;
      className = classnames('Tabs', claName);
      selectedIndex = this.props.selectedIndex || 0;
      if (selectedIndex >= children.length) {
        selectedIndex = 0;
      }
      this.props.selectedIndex = selectedIndex;
      width = (100 / this.getTabCount()) + "%";
      left = "calc(" + width + "*" + selectedIndex + ")";
      tabContent = [];
      tabs = [];
      React.Children.map(children, function(tab, index) {
        var selected;
        selected = selectedIndex === index;
        tabs.push(React.cloneElement(tab, {
          key: index,
          selected: selected,
          tabIndex: index,
          width: width,
          onClick: this._onHandleSwitch
        }));
        return tabContent.push(
        React.createElement(TabTemplate, {key: index, selected: selected},
          tab.props.children
        )
      );
      }, this);
      switchStyle = {
        transform: "translate3d(-" + (selectedIndex * 100) + "%, 0px, 0px)"
      };
      return React.createElement("div", {className: className},
      React.createElement("div", {className: "TabItemContainer"},
        tabs
      ),
      React.createElement("div", {className: "InkbarContainer"},
        React.createElement(Inkbar, {width: width, left: left})
      ),
      React.createElement("div", {className: "TabContent"},
        React.createElement("div", {className: "SwitchContainer", style: switchStyle},
          tabContent
        )
      )
    );
    },
    _onHandleSwitch: function(index) {
      return Actions.switchTab(index);
    }
  });

  module.exports = Tabs;

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../actions/Actions":3,"../Inkbar":7,"./Tab":28,"./TabTemplate":29,"classnames":37}],31:[function(require,module,exports){
(function() {
  var keyMirror;

  keyMirror = require('keymirror');

  module.exports = keyMirror({
    ADD_CHILD: null,
    REMOVE_CHILD: null,
    TOGGLE_COLLAPE: null,
    SWITCH_TABS: null,
    OPEN_NAV: null,
    CLOSE_NAV: null,
    TOGGLE_NAV: null,
    UPDATE_VALUE: null
  });

}).call(this);

},{"keymirror":41}],32:[function(require,module,exports){
(function() {
  var Dispatcher;

  Dispatcher = require('flux').Dispatcher;

  module.exports = new Dispatcher();

}).call(this);

},{"flux":39}],33:[function(require,module,exports){
(function() {
  var AppDispatcher, AppStore, CHANGE_EVENT, Constants, EventEmitter, _data, _selectTabIndex, addChild, debounce, debouncedChange, removeChild, switchTab, toggleCollape, toggleNav, updateValue, utils;

  AppDispatcher = require('../dispatcher/AppDispatcher');

  EventEmitter = require('events').EventEmitter;

  Constants = require('../constants/Constants');

  debounce = require('lodash.debounce');

  utils = require('../utils');

  CHANGE_EVENT = 'change';

  _data = {};

  _selectTabIndex = 0;

  addChild = function(data) {
    var c, child, i, len;
    if (!data.children) {
      data.children = [];
    }
    child = data.defaultChild;
    if (typeof child === 'function') {
      child = child();
    }
    if (child.length) {
      for (i = 0, len = child.length; i < len; i++) {
        c = child[i];
        data.children.push(utils.extend({}, c, ['editor']));
      }
    } else {
      data.children.push(utils.extend({}, child, ['editor']));
    }
    return true;
  };

  removeChild = function(data, index) {
    return data.children.splice(index, 1);
  };

  toggleCollape = function(data) {
    return data.collaped = !data.collaped;
  };

  switchTab = function(index) {
    return _selectTabIndex = index;
  };

  toggleNav = function() {
    return _data.open = !_data.open;
  };

  updateValue = function(data, target, value) {
    return data[target] = value;
  };

  AppStore = $.extend({}, EventEmitter.prototype, {
    setData: function(data) {
      _data = data;
      return this.emitChange();
    },
    getData: function() {
      _data.selectedTabIndex = _selectTabIndex;
      return _data;
    },
    emitChange: function() {
      return this.emit(CHANGE_EVENT);
    },
    addChangeListener: function(callback) {
      return this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function(callback) {
      return this.removeListener(CHANGE_EVENT, callback);
    }
  });

  AppDispatcher.register(function(action) {
    var data, index, target, value;
    switch (action.actionType) {
      case Constants.ADD_CHILD:
        data = action.data;
        if (data && data.defaultChild) {
          addChild(data);
          return AppStore.emitChange();
        }
        break;
      case Constants.REMOVE_CHILD:
        data = action.data, index = action.index;
        if (data && data.children && data.children.length && index >= 0) {
          removeChild(data, index);
          return AppStore.emitChange();
        }
        break;
      case Constants.TOGGLE_COLLAPE:
        data = action.data;
        if (data) {
          toggleCollape(data);
          return AppStore.emitChange();
        }
        break;
      case Constants.SWITCH_TABS:
        index = action.index;
        if (index >= 0) {
          switchTab(index);
          return AppStore.emitChange();
        }
        break;
      case Constants.OPEN_NAV:
        if (!_data.open) {
          toggleNav();
          return AppStore.emitChange();
        }
        break;
      case Constants.CLOSE_NAV:
        if (_data.open) {
          toggleNav();
          return AppStore.emitChange();
        }
        break;
      case Constants.TOGGLE_NAV:
        toggleNav();
        return AppStore.emitChange();
      case Constants.UPDATE_VALUE:
        data = action.data, target = action.target, value = action.value;
        if (data) {
          updateValue(data, target, value);
          return debouncedChange();
        }
    }
  });

  debouncedChange = debounce(AppStore.emitChange, 300).bind(AppStore);

  module.exports = AppStore;

}).call(this);

},{"../constants/Constants":31,"../dispatcher/AppDispatcher":32,"../utils":34,"events":35,"lodash.debounce":43}],34:[function(require,module,exports){
(function() {
  var debounce, toString, utils,
    slice = [].slice;

  toString = Object.prototype.toString;

  debounce = require('lodash.debounce');

  utils = {
    debounce: debounce,
    extend: function() {
      var clone, copy, copyIsArray, i, j, len, name, options, source, special, src, target;
      target = arguments[0], source = 3 <= arguments.length ? slice.call(arguments, 1, i = arguments.length - 1) : (i = 1, []), special = arguments[i++];
      if (target == null) {
        target = {};
      }
      if (special == null) {
        special = [];
      }
      if (typeof target !== "object") {
        target = {};
      }
      for (j = 0, len = source.length; j < len; j++) {
        options = source[j];
        if (options == null) {
          continue;
        }
        for (name in options) {
          src = target[name];
          copy = options[name];
          if (target === copy) {
            continue;
          }
          if (copy && (utils.isObject(copy) || (copyIsArray = utils.isArray(copy))) && !~special.indexOf(name)) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && utils.isArray(src) ? src : [];
            } else {
              clone = src && utils.isObject(src) ? src : {};
            }
            target[name] = utils.extend(clone, copy, special);
          } else if (copy != null) {
            target[name] = copy;
          }
        }
      }
      return target;
    }
  };

  ['String', 'Function', 'Array', 'Number', 'RegExp', 'Object'].forEach(function(type) {
    return utils["is" + type] = function(obj) {
      return toString.apply(obj) === ("[object " + type + "]");
    };
  });

  module.exports = utils;

}).call(this);

},{"lodash.debounce":43}],35:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],36:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],37:[function(require,module,exports){
/*!
  Copyright (c) 2015 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = '';

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes += ' ' + arg;
			} else if (Array.isArray(arg)) {
				classes += ' ' + classNames.apply(null, arg);
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes += ' ' + key;
					}
				}
			}
		}

		return classes.substr(1);
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],38:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule invariant
 */

"use strict";

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function (condition, format, a, b, c, d, e, f) {
  if (process.env.NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error('Invariant Violation: ' + format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;
}).call(this,require('_process'))
},{"_process":36}],39:[function(require,module,exports){
/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

module.exports.Dispatcher = require('./lib/Dispatcher');

},{"./lib/Dispatcher":40}],40:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Dispatcher
 *
 * @preventMunge
 */

'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var invariant = require('fbjs/lib/invariant');

var _prefix = 'ID_';

/**
 * Dispatcher is used to broadcast payloads to registered callbacks. This is
 * different from generic pub-sub systems in two ways:
 *
 *   1) Callbacks are not subscribed to particular events. Every payload is
 *      dispatched to every registered callback.
 *   2) Callbacks can be deferred in whole or part until other callbacks have
 *      been executed.
 *
 * For example, consider this hypothetical flight destination form, which
 * selects a default city when a country is selected:
 *
 *   var flightDispatcher = new Dispatcher();
 *
 *   // Keeps track of which country is selected
 *   var CountryStore = {country: null};
 *
 *   // Keeps track of which city is selected
 *   var CityStore = {city: null};
 *
 *   // Keeps track of the base flight price of the selected city
 *   var FlightPriceStore = {price: null}
 *
 * When a user changes the selected city, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'city-update',
 *     selectedCity: 'paris'
 *   });
 *
 * This payload is digested by `CityStore`:
 *
 *   flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'city-update') {
 *       CityStore.city = payload.selectedCity;
 *     }
 *   });
 *
 * When the user selects a country, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'country-update',
 *     selectedCountry: 'australia'
 *   });
 *
 * This payload is digested by both stores:
 *
 *   CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       CountryStore.country = payload.selectedCountry;
 *     }
 *   });
 *
 * When the callback to update `CountryStore` is registered, we save a reference
 * to the returned token. Using this token with `waitFor()`, we can guarantee
 * that `CountryStore` is updated before the callback that updates `CityStore`
 * needs to query its data.
 *
 *   CityStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       // `CountryStore.country` may not be updated.
 *       flightDispatcher.waitFor([CountryStore.dispatchToken]);
 *       // `CountryStore.country` is now guaranteed to be updated.
 *
 *       // Select the default city for the new country
 *       CityStore.city = getDefaultCityForCountry(CountryStore.country);
 *     }
 *   });
 *
 * The usage of `waitFor()` can be chained, for example:
 *
 *   FlightPriceStore.dispatchToken =
 *     flightDispatcher.register(function(payload) {
 *       switch (payload.actionType) {
 *         case 'country-update':
 *         case 'city-update':
 *           flightDispatcher.waitFor([CityStore.dispatchToken]);
 *           FlightPriceStore.price =
 *             getFlightPriceStore(CountryStore.country, CityStore.city);
 *           break;
 *     }
 *   });
 *
 * The `country-update` payload will be guaranteed to invoke the stores'
 * registered callbacks in order: `CountryStore`, `CityStore`, then
 * `FlightPriceStore`.
 */

var Dispatcher = (function () {
  function Dispatcher() {
    _classCallCheck(this, Dispatcher);

    this._callbacks = {};
    this._isDispatching = false;
    this._isHandled = {};
    this._isPending = {};
    this._lastID = 1;
  }

  /**
   * Registers a callback to be invoked with every dispatched payload. Returns
   * a token that can be used with `waitFor()`.
   */

  Dispatcher.prototype.register = function register(callback) {
    var id = _prefix + this._lastID++;
    this._callbacks[id] = callback;
    return id;
  };

  /**
   * Removes a callback based on its token.
   */

  Dispatcher.prototype.unregister = function unregister(id) {
    !this._callbacks[id] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.unregister(...): `%s` does not map to a registered callback.', id) : invariant(false) : undefined;
    delete this._callbacks[id];
  };

  /**
   * Waits for the callbacks specified to be invoked before continuing execution
   * of the current callback. This method should only be used by a callback in
   * response to a dispatched payload.
   */

  Dispatcher.prototype.waitFor = function waitFor(ids) {
    !this._isDispatching ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.waitFor(...): Must be invoked while dispatching.') : invariant(false) : undefined;
    for (var ii = 0; ii < ids.length; ii++) {
      var id = ids[ii];
      if (this._isPending[id]) {
        !this._isHandled[id] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.waitFor(...): Circular dependency detected while ' + 'waiting for `%s`.', id) : invariant(false) : undefined;
        continue;
      }
      !this._callbacks[id] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.waitFor(...): `%s` does not map to a registered callback.', id) : invariant(false) : undefined;
      this._invokeCallback(id);
    }
  };

  /**
   * Dispatches a payload to all registered callbacks.
   */

  Dispatcher.prototype.dispatch = function dispatch(payload) {
    !!this._isDispatching ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.') : invariant(false) : undefined;
    this._startDispatching(payload);
    try {
      for (var id in this._callbacks) {
        if (this._isPending[id]) {
          continue;
        }
        this._invokeCallback(id);
      }
    } finally {
      this._stopDispatching();
    }
  };

  /**
   * Is this Dispatcher currently dispatching.
   */

  Dispatcher.prototype.isDispatching = function isDispatching() {
    return this._isDispatching;
  };

  /**
   * Call the callback stored with the given id. Also do some internal
   * bookkeeping.
   *
   * @internal
   */

  Dispatcher.prototype._invokeCallback = function _invokeCallback(id) {
    this._isPending[id] = true;
    this._callbacks[id](this._pendingPayload);
    this._isHandled[id] = true;
  };

  /**
   * Set up bookkeeping needed when dispatching.
   *
   * @internal
   */

  Dispatcher.prototype._startDispatching = function _startDispatching(payload) {
    for (var id in this._callbacks) {
      this._isPending[id] = false;
      this._isHandled[id] = false;
    }
    this._pendingPayload = payload;
    this._isDispatching = true;
  };

  /**
   * Clear bookkeeping used for dispatching.
   *
   * @internal
   */

  Dispatcher.prototype._stopDispatching = function _stopDispatching() {
    delete this._pendingPayload;
    this._isDispatching = false;
  };

  return Dispatcher;
})();

module.exports = Dispatcher;
}).call(this,require('_process'))
},{"_process":36,"fbjs/lib/invariant":38}],41:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

"use strict";

/**
 * Constructs an enumeration with keys equal to their value.
 *
 * For example:
 *
 *   var COLORS = keyMirror({blue: null, red: null});
 *   var myColor = COLORS.blue;
 *   var isColorValid = !!COLORS[myColor];
 *
 * The last line could not be performed if the values of the generated enum were
 * not equal to their keys.
 *
 *   Input:  {key1: val1, key2: val2}
 *   Output: {key1: key1, key2: key2}
 *
 * @param {object} obj
 * @return {object}
 */
var keyMirror = function(obj) {
  var ret = {};
  var key;
  if (!(obj instanceof Object && !Array.isArray(obj))) {
    throw new Error('keyMirror(...): Argument must be an object.');
  }
  for (key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    ret[key] = key;
  }
  return ret;
};

module.exports = keyMirror;

},{}],42:[function(require,module,exports){
/**
 * lodash 3.9.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object == null ? undefined : object[key];
  return isNative(value) ? value : undefined;
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 equivalents which return 'object' for typed array constructors.
  return isObject(value) && objToString.call(value) == funcTag;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (isFunction(value)) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

module.exports = getNative;

},{}],43:[function(require,module,exports){
/**
 * lodash 3.1.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var getNative = require('lodash._getnative');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeNow = getNative(Date, 'now');

/**
 * Gets the number of milliseconds that have elapsed since the Unix epoch
 * (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @category Date
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => logs the number of milliseconds it took for the deferred function to be invoked
 */
var now = nativeNow || function() {
  return new Date().getTime();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed invocations. Provide an options object to indicate that `func`
 * should be invoked on the leading and/or trailing edge of the `wait` timeout.
 * Subsequent calls to the debounced function return the result of the last
 * `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
 * on the trailing edge of the timeout only if the the debounced function is
 * invoked more than once during the `wait` timeout.
 *
 * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options] The options object.
 * @param {boolean} [options.leading=false] Specify invoking on the leading
 *  edge of the timeout.
 * @param {number} [options.maxWait] The maximum time `func` is allowed to be
 *  delayed before it is invoked.
 * @param {boolean} [options.trailing=true] Specify invoking on the trailing
 *  edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // avoid costly calculations while the window size is in flux
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // invoke `sendMail` when the click event is fired, debouncing subsequent calls
 * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // ensure `batchLog` is invoked once after 1 second of debounced calls
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', _.debounce(batchLog, 250, {
 *   'maxWait': 1000
 * }));
 *
 * // cancel a debounced call
 * var todoChanges = _.debounce(batchLog, 1000);
 * Object.observe(models.todo, todoChanges);
 *
 * Object.observe(models, function(changes) {
 *   if (_.find(changes, { 'user': 'todo', 'type': 'delete'})) {
 *     todoChanges.cancel();
 *   }
 * }, ['delete']);
 *
 * // ...at some point `models.todo` is changed
 * models.todo.completed = true;
 *
 * // ...before 1 second has passed `models.todo` is deleted
 * // which cancels the debounced `todoChanges` call
 * delete models.todo;
 */
function debounce(func, wait, options) {
  var args,
      maxTimeoutId,
      result,
      stamp,
      thisArg,
      timeoutId,
      trailingCall,
      lastCalled = 0,
      maxWait = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = wait < 0 ? 0 : (+wait || 0);
  if (options === true) {
    var leading = true;
    trailing = false;
  } else if (isObject(options)) {
    leading = !!options.leading;
    maxWait = 'maxWait' in options && nativeMax(+options.maxWait || 0, wait);
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function cancel() {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (maxTimeoutId) {
      clearTimeout(maxTimeoutId);
    }
    lastCalled = 0;
    maxTimeoutId = timeoutId = trailingCall = undefined;
  }

  function complete(isCalled, id) {
    if (id) {
      clearTimeout(id);
    }
    maxTimeoutId = timeoutId = trailingCall = undefined;
    if (isCalled) {
      lastCalled = now();
      result = func.apply(thisArg, args);
      if (!timeoutId && !maxTimeoutId) {
        args = thisArg = undefined;
      }
    }
  }

  function delayed() {
    var remaining = wait - (now() - stamp);
    if (remaining <= 0 || remaining > wait) {
      complete(trailingCall, maxTimeoutId);
    } else {
      timeoutId = setTimeout(delayed, remaining);
    }
  }

  function maxDelayed() {
    complete(trailing, timeoutId);
  }

  function debounced() {
    args = arguments;
    stamp = now();
    thisArg = this;
    trailingCall = trailing && (timeoutId || !leading);

    if (maxWait === false) {
      var leadingCall = leading && !timeoutId;
    } else {
      if (!maxTimeoutId && !leading) {
        lastCalled = stamp;
      }
      var remaining = maxWait - (stamp - lastCalled),
          isCalled = remaining <= 0 || remaining > maxWait;

      if (isCalled) {
        if (maxTimeoutId) {
          maxTimeoutId = clearTimeout(maxTimeoutId);
        }
        lastCalled = stamp;
        result = func.apply(thisArg, args);
      }
      else if (!maxTimeoutId) {
        maxTimeoutId = setTimeout(maxDelayed, remaining);
      }
    }
    if (isCalled && timeoutId) {
      timeoutId = clearTimeout(timeoutId);
    }
    else if (!timeoutId && wait !== maxWait) {
      timeoutId = setTimeout(delayed, wait);
    }
    if (leadingCall) {
      isCalled = true;
      result = func.apply(thisArg, args);
    }
    if (isCalled && !timeoutId && !maxTimeoutId) {
      args = thisArg = undefined;
    }
    return result;
  }
  debounced.cancel = cancel;
  return debounced;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = debounce;

},{"lodash._getnative":42}]},{},[2])(2)
});
