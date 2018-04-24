/**
 * @fileOverview
 *
 * 线上文字显示，文字可拖拽
 * @author: Bryce
 */
define(function (require, exports, module) {
  var kity = require('../core/kity');
  var utils = require('../core/utils');

  var Designer = require('../core/designer');
  var DesignerLine = require('../core/line');
  var LineModule = require('./module');
  var LineRenderer = require('./render');

  var FONT_ADJUST = {
    '微软雅黑,Microsoft YaHei': -0.15, // >_<
    'arial black,avant garde': -0.17,
    'default': -0.15
  };

  var TextLineRenderer = kity.createClass('TextLineRenderer', {
    base: LineRenderer,

    create: function () {
      return new kity.Group().setId(utils.uuid('ltext'));
    },

    shouldRender: function (line) {
      return true; //line._designer.getStatus() === 'normal';
    },

    shouldDraw: function (textGroup, line) {
      if (textGroup.getData('text') === line.getText()) {
        return false;
      }
      return true;
    },

    draw: function (textGroup, line) {
      function getDataOrStyle(name) {
        return line._designer.getData(name) || line._designer.getStyle(
          name);
      }

      var lineText = line.getText();
      var textArr = lineText ? lineText.split('\n') : [' '];

      textGroup.setData('text', lineText);

      var lineHeight = line._designer.getStyle('line-height');
      var fontSize = getDataOrStyle('font-size');
      var fontFamily = getDataOrStyle('font-family') || 'default';

      //textArr.length行数，
      var textLength = textArr.length;


      if (kity.Browser.ie) {
        var adjust = FONT_ADJUST[fontFamily] || 0;
        textGroup.setTranslate(0, adjust * fontSize);
      }

      this.setTextStyle(line, textGroup);

      var textGroupLength = textGroup.getItems().length;
      var i, ci, textShape, text;

      //一行对应一个kity.Text
      if (textLength < textGroupLength) {
        for (i = textLength, ci; ci = textGroup.getItem(i);) {
          textGroup.removeItem(i);
        }
      } else if (textLength > textGroupLength) {
        var growth = textLength - textGroupLength;
        while (growth--) {
          textShape = new kity.Text()
            .setAttr('text-rendering', 'inherit');
          if (kity.Browser.ie) {
            textShape.setVerticalAlign('top');
          } else {
            textShape.setAttr('dominant-baseline', 'text-before-edge');
          }
          textGroup.addItem(textShape);
        }
      }

      for (i = 0; text = textArr[i], textShape = textGroup.getItem(i); i++) {
        textShape.setContent(text);
        if (kity.Browser.ie) {
          textShape.fixPosition();
        }
      }
      // this.setTextStyle(line, textGroup);
    },

    place: function (textGroup, line) {
      var lineHeight = line._designer.getStyle('line-height');
      var fontSize = line._designer.getData('font-size') || line._designer
        .getStyle('font-size');

      var lineText = line.getText();
      var textArr = lineText ? lineText.split('\n') : [' '];

      var textLength = textArr.length;

      var realLineHeight = lineHeight * fontSize;
      var height = realLineHeight * (textLength - 1) + fontSize;
      var yStart = 0; //-height/2;

      var rBox = new kity.Box(),
        r = Math.round,
        max = Math.max;
      return function () {
        textGroup.eachItem(function (i, textShape) {
          var y = yStart + i * realLineHeight;

          textShape.setY(y);
          var bbox = textShape.getBoundaryBox();
          rBox = rBox.merge(new kity.Box(0, y, max(bbox.height,
            bbox.width) || 1, fontSize));
        });

        var nBox = new kity.Box(r(rBox.x), r(rBox.y), r(rBox.width),
          r(rBox.height));

        //node._currentTextGroupBox = nBox;
        return nBox;
      };
    },

    setTextStyle: function (line, text) {
      var hooks = TextLineRenderer._styleHooks;
      hooks.forEach(function (hook) {
        hook(line, text);
      });
    }
  });

  utils.extend(TextLineRenderer, {
    _styleHooks: [],

    registerStyleHook: function (fn) {
      TextLineRenderer._styleHooks.push(fn);
    }
  });

  kity.extendClass(DesignerLine, {
    getTextGroup: function () {
      return this.getRenderer('TextRenderer').getRenderShape();
    }
  });

  LineModule.register('text', {
    renderers: {
      center: TextLineRenderer
    }
  });

  module.exports = TextLineRenderer;
});
