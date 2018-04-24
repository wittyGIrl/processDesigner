/**
 * @fileOverview
 *
 * timerEventDefinition
 */
define(function (require, exports, module) {
  var utils = require('../../core/utils');
  var kity = require('../../core/kity');

  var Designer = require('../../core/designer');

  var timerEventDefinition = {
    create: function (node) {
      var group = new kity.Group();
      var outline = new kity.Circle().pipe(function () {
        this.stroke(
          node.getStyle('normal-stroke'),
          node.getStyle('stroke-width')
        );
        this.fill(node.getStyle('background'));
      });
      var sign = new kity.Path().stroke(node.getStyle('normal-stroke'), node.getStyle('stroke-width'));
      group.addShape(outline);
      group.addShape(sign);
      // this._node = node;
      return group;
    },
    update: function (group, node, box) {
      var shapes = group.getShapes();
      var outline = shapes[0];
      var sign = shapes[1];

      var space = 4;
      var radius = 13;

      //设置半径
      outline.setRadius(radius).setCenter(box.cx, box.cy);
      var cx = box.cx;
      var cy = box.cy;
      var x = cx - radius;
      var y = cy - radius;
      var right = cx + radius;
      var bottom = cy + radius;
      var halfRightAngle = 0.7 * radius;
      var halfSpace = 0.7 * space;
      var x1 = cx - halfRightAngle;
      var x2 = cx + halfRightAngle;
      var y1 = cy - halfRightAngle;
      var y2 = cy + halfRightAngle;
      sign.getDrawer().clear()
        .moveTo(cx, cy)
        .lineTo(cx + space, y + space)
        .moveTo(cx, cy)
        .lineTo(right - space, cy + space)

        .moveTo(cx, y)
        .lineTo(cx, y + space)
        .moveTo(right, cy)
        .lineTo(right - space, cy)
        .moveTo(cx, bottom)
        .lineTo(cx, bottom - space)
        .moveTo(x, cy)
        .lineTo(x + space, cy)

        .moveTo(x1, y1)
        .lineTo(x1 + halfSpace, y1 + halfSpace)
        .moveTo(x2, y1)
        .lineTo(x2 - halfSpace, y1 + halfSpace)
        .moveTo(x1, y2)
        .lineTo(x1 + halfSpace, y2 - halfSpace)
        .moveTo(x2, y2)
        .lineTo(x2 - halfSpace, y2 - halfSpace);
      return outline.getRenderBox();
    }
  };

  timerEventDefinition.getProperty = function () {
    return {
        name: "timerEventDefinition",
        hideItself: true,
        children: [
        //   {
        //   name: 'isLoop',
        //   value: "true",
        //   editor:{
        //     type: 'checkbox'
        //   }
        // },
        {
          name: 'timeDuration',
          children: [{
            name: "text",
            value: "",
            editor: {
              type: 'durationEdtior',
              options: [ 'day', 'hour', 'minute'],
              day: designer.getLang('label.day'),
              hour: designer.getLang('label.hour'),
              minute: designer.getLang('label.minute')
            }
          }]
        }
        // ,{ //增加定时器的循环任务,与定时是互斥条件
        //     name: "timeCycle",
        //     hidden:{
        //       targetName:'isLoop',
        //       targetValues: "false",
        //     },
        //     children: [{
        //     name: "text",
        //     value: "",
        //     editor: {
        //       type: 'durationEdtior',
        //       options: [ 'day', 'hour', 'minute'],
        //       day: '天',
        //       hour: '小时',
        //       minute: '分钟'
        //     }
        //   }]
        //   }
         ]
      };
  };

  Designer.registerEventDefinition('timerEventDefinition', timerEventDefinition);

  module.exports = timerEventDefinition;
});
