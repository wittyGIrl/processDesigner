/**
 * @fileOverview
 *
 * 定义文本模块类
 */
 define(function(require, exports, module){
    var kity = require('../core/kity');
    var utils = require('../core/utils');

    var Designer = require('../core/designer');
    var DesignerNode = require('../core/node');
    var Command = require('../core/command');
    var Module = require('../core/module');
    var Renderer = require('../core/render');
    var FONT_ADJUST = {
        '微软雅黑,Microsoft YaHei': -0.15,// >_<
        'arial black,avant garde': -0.17,
        'default': -0.15
    };

    var TextRenderer = kity.createClass('TextRenderer',{
        base: Renderer,

        create:function(){
            return new kity.Group().setId(utils.uuid('node_text'));
        },

        update:function(textGroup, node){
            function getDataOrStyle(name){
                return node.getData(name) || node.getStyle(name);
            }

            var nodeText = node.getText();
            var textArr = nodeText ? nodeText.split('\n') : [' '];

            var lineHeight = node.getStyle('line-height');
            var fontSize = getDataOrStyle('font-size');
            var fontFamily = getDataOrStyle('font-family') || 'default';

            //textArr.length行数，
            var textLength = textArr.length;

            var realLineHeight = lineHeight * fontSize;
            var height = realLineHeight * (textLength - 1) + fontSize;
            //var yStart = 0;//顶对齐
            var yStart = -height/2;//中心对齐

            if (kity.Browser.ie) {
                var adjust = FONT_ADJUST[fontFamily] || 0;
                textGroup.setTranslate(0, adjust * fontSize);
            }

            var rBox = new kity.Box(),
                r = Math.round;

            this.setTextStyle(node, textGroup);

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

            for(i=0; text = textArr[i], textShape = textGroup.getItem(i); i++){
                textShape.setContent(text);
                if(kity.Browser.ie){
                    textShape.fixPosition();
                }
            }
            this.setTextStyle(node, textGroup);
            var textHash = node.getText() +
                ['font-size', 'font-name', 'font-weight', 'font-style'].map(getDataOrStyle).join('/');

            if (node._currentTextHash == textHash && node._currentTextGroupBox) return node._currentTextGroupBox;

            node._currentTextHash = textHash;
            var max = Math.max;
            return function(){
                textGroup.eachItem(function(i, textShape) {
                    var y = yStart + i * realLineHeight;

                    textShape.setY(y);
                    var bbox = textShape.getBoundaryBox();
                    rBox = rBox.merge(new kity.Box(0, y, max(bbox.height, bbox.width) || 1, fontSize));
                });

                var nBox = new kity.Box(r(rBox.x), r(rBox.y), r(rBox.width), r(rBox.height));

                node._currentTextGroupBox = nBox;
                return nBox;
            };
        },
        setTextStyle: function(node, text) {
            var hooks = TextRenderer._styleHooks;
            hooks.forEach(function(hook) {
                hook(node, text);
            });
        }
    });

    var TextCommand = kity.createClass({
        base: Command,
        execute: function(designer, text) {
            var node = designer.getSelectedNode();
            if (node) {
                node.setText(text);
                node.render();
                //designer.layout();
            }
        },
        queryState: function(designer) {
            return designer.getSelectedNode() ? 0 : -1;
        },
        queryValue: function(designer) {
            var node = designer.getSelectedNode();
            return node ? node.getText() : null;
        }
    });

    utils.extend(TextRenderer, {
        _styleHooks: [],

        registerStyleHook: function(fn) {
            TextRenderer._styleHooks.push(fn);
        }
    });

    kity.extendClass(DesignerNode, {
        getTextGroup: function() {
            return this.getRenderer('TextRenderer').getRenderShape();
        }
    });

    Module.register('text', {
        commands: {
            text: TextCommand
        },
        renderers: {
            center: TextRenderer
        }
    });

    module.exports = TextRenderer;
 });
