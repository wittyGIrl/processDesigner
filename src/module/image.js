/**
 * @fileOverview
 *
 * 定义图片模块类
 * 未完成
 */
 define(function(require, exports, module){
    var kity = require('../core/kity');
    var Renderer = require('../core/render');
    var Command = require('../core/command');
    var Module = require('../core/module');
    var Designer = require('../core/designer');

    var ImageRenderer = kity.createClass('ImageRenderer', {
        base: Renderer,
        create: function(){
            return new kity.Image();
        },

        update: function(Image, node, box){
            var imgUrl = node.getData('imgUrl');
            this.node.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', this.url);
            this.node.setAttribute('x', this.x);
            this.node.setAttribute('y', this.y);
            this.node.setAttribute('width', this.width);
            this.node.setAttribute('height', this.height);
            return this;
        }
    });

    var ImageCommand = kity.createClass('ImageCommand', {
        base: Command,
        execute: function(designer, url){
            var node = designer.getSelectedNode();
            if(node){
                node.setData('imgUrl',url);
                node.render();
            }
        },
        queryState: function(designer){
            return designer.getSelectedNodes().length == 1 ? 0 : -1;
        },
        queryValue: function(designer) {
            var node = designer.getSelectedNode();
            return node ? node.getData('imgUrl') : null;
        }
    });

    Designer.register('image', {
        commmands: {
            image: ImageCommand
        },
        renderers: {
            top: ImageRenderer
        }
    });
 });
