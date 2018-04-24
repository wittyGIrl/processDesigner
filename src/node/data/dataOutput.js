/**
 * @fileOverview
 *
 * 数据输出
 */
 define(function(require, exports, module){
    var kity = require('../../core/kity');
    var utils = require('../../core/utils');

    var Designer = require('../../core/designer');
    var OutlineManager = require('../../core/outline');

    var Renderer = require('../../core/render');

    var DataOutputShape = kity.createClass('DataOutputShape',{
        base: OutlineManager,
        create: function(node, width, height){
            var group = new kity.Group();
            var rect = new kity.Path().pipe(function(){
                this.stroke(
                    node.getStyle('normal-stroke'),
                    node.getStyle('stroke-width')
                );
                this.fill(node.getStyle('background'));
            });
            //标志
            var sign = new kity.Path()
                .stroke(node.getStyle('normal-stroke'),1)
                .fill('black');
            group.addShape(rect);
            group.addShape(sign);
            if(node.getType() === 'Designer'){
                this.doUpdate(node, group, {x:0, y:0, width: width, height: height});
                return group;
            }
            rect.setId(utils.uuid('dataOutput'));
            this._node = node;
            this._outlineShape = group;
            return this._outlineShape;
        },
        doUpdate: function(node, outlineGroup, box){
            var shapes = outlineGroup.getShapes();
            var outline = shapes[0];
            var space = box.width/3;
            outline.getDrawer().clear()
                .moveTo(box.x, box.y)
                .lineTo(box.x+box.width-space, box.y)
                .lineTo(box.x+box.width-space, box.y+space)
                .lineTo(box.x+box.width, box.y+space)
                .moveTo(box.x+box.width-space, box.y)
                .lineTo(box.x+box.width, box.y+space)
                .lineTo(box.x+box.width, box.y+box.height)
                .lineTo(box.x, box.y+box.height)
                .lineTo(box.x, box.y);

            var sign = shapes[1];
            var x = box.x+4;
            var y = box.y+6;
            var width = 5;
            sign.getDrawer().clear()
                .moveTo(x, y)
                .lineTo(x+2*width, y)
                .lineTo(x+2*width, y-width)
                .lineTo(x+7/2*width, y+width/2)
                .lineTo(x+2*width, y+2*width)
                .lineTo(x+2*width, y+width)
                .lineTo(x, y+width)
                .close();

            return outlineGroup;
        }
    });

    Designer.registerOutline('dataOutput',DataOutputShape);
 });
