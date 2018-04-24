/**
 * @fileOverview
 *
 * line的render部分是可以拖拽的
 *
 */
define(function(require, exports, module) {
  var kity = require('../core/kity');
  var utils = require('../core/utils');

  var Designer = require('../core/designer');
  var LineModule = require('./module');

  //可拖拽区域的宽度
  var _width = 20;
  var Dragger = kity.createClass('Dragger', {
    constructor: function(designer) {
      this._designer = designer;
    },
    _getSegment: function(line, pos) {
      var connection = line.connection;
      var inflections = line.inflections;
      if (inflections.length < 2) return;
      var i = 0,
        l = inflections.length - 1;
      var start,
        end,
        minX,
        maxX,
        minY,
        maxY,
        direction;
      var x = pos.x,
        y = pos.y;
      for (i; i < l; i++) {
        start = inflections[i];
        end = inflections[i + 1];
        if (start.x === end.x || Math.abs(start.x - end.x) < 1) {
          minX = start.x - _width;
          maxX = start.x + _width;
          if (start.y > end.y) {
            minY = end.y;
            maxY = start.y;
          } else {
            minY = start.y;
            maxY = end.y;
          }
          direction = true; //x 方向
        } else {
          minY = start.y - _width;
          maxY = start.y + _width;
          if (start.x > end.x) {
            minX = end.x;
            maxX = start.x;
          } else {
            minX = start.x;
            maxX = end.x;
          }
          direction = false; //y 方向
        }
        if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
          this._direction = direction;
          this._index = i;
          return [start, end];
        }
      }
    },

    dragStart: function(line, pos) {
      this._target = line;
      this._startPos = pos;
    },
    dragMove: function(pos) {
      if (!this._startPos) return;

      //最小启动拖拽模式的距离
      var DRAG_MOVE_THRESHOLD = 10;

      if (!this._dragMode) {
        // 判断拖放模式是否该启动
        if (kity.Vector.fromPoints(pos, this._startPos).length() < DRAG_MOVE_THRESHOLD) {
          return;
        }
        if (!this._enterDragMode()) {
          return;
        }
      }

      var designer = this._designer;

      var inflections = this._target.inflections;
      var me = this;
      var segment = this._getSegment(this._target, pos);
      //不在允许的范围内，进行限制
      if (!segment) {
        restrict();
      }

      //修正offset
      pos.x -= this._target._contentBox.width / 2;
      pos.y -= this._target._contentBox.height / 2;

      this._target.getRenderContainer().setTranslate(pos.x, pos.y);
      //this._target.setData({x: pos.x, y: pos.y});

      //不能随意拖动，位置限制在线的周围
      function restrict() {
        var pos1,
          pos2,
          posDistance = [];
        for (var i = 0, l = inflections.length - 1; i < l; i++) {
          posDistance.push(
            distance(
              inflections[i],
              inflections[i + 1],
              pos
            )
          );
        }
        var index = 0,
          minDistance = Number.MAX_VALUE;
        posDistance.forEach(function(dis, j) {
          if (dis < minDistance) {
            index = j;
            minDistance = dis;
          }
        });
        if (minDistance < Number.MAX_VALUE) {
          fix(inflections[index], inflections[index - 0 + 1], pos);
          me._dragPos = {
            x: pos.x,
            y: pos.y
          };
          return;
        }
        pos = {
          x: me._dragPos.x,
          y: me._dragPos.y
        };
      }
      function fix(p1, p2, position) {
        if (p1.x === p2.x) {
          if (Math.abs(position.x - p1.x) > _width) {
            if (position.x > p1.x) {
              position.x = p1.x + _width;
            } else {
              position.x = p1.x - _width;
            }
          }
          fixAnother('y');
        } else {
          if (Math.abs(position.y - p1.y) > _width) {
            if (position.y > p1.y) {
              position.y = p1.y + _width;
            } else {
              position.y = p1.y - _width;
            }
          }
          fixAnother('x');
        }
        function fixAnother(axis) {
          var min,
            max;
          if (p1[axis] < p2[axis]) {
            min = p1[axis];
            max = p2[axis];
          } else {
            min = p2[axis];
            max = p1[axis];
          }
          if (position[axis] < min) {
            position[axis] = min;
          } else if (position[axis] > max) {
            position[axis] = max;
          }
        }
      }
      function distance(p1, p2, position) {
        if (p1.x === p2.x) {
          return Math.abs(position.x - p1.x);
        }
        return Math.abs(position.y - p1.y);
      }
    },
    dragEnd: function() {
      var pos = this._dragPos;
      this._startPos = null;
      this._dragPos = null;
      if (!this._dragMode) {
        return;
      }

      this._dragMode = false;
      var me = this;
      if (pos) {
        this._target.setData('x', proportion('x'))
          .setData('y', proportion('y'));
      }
      this._target = null;
      this._designer.setStatus('normal');

      this._designer.fire('viewchange');

      function proportion(axis) {
        var num = (pos[axis] - me._target.startPos[axis]) / (me._target.endPos[axis] - me._target.startPos[axis]);
        return num.toFixed(2);
      }
    },
    _enterDragMode: function() {
      this._dragMode = true;
      this._designer.setStatus('draglinecontainer');
      return true;
    }
  });

  LineModule.register('DragRenderContainer', function() {
    var dragger;

    return {
      init: function() {
        dragger = new Dragger(this);
        window.addEventListener('mouseup', function() {
          dragger.dragEnd();
        });
      },
      events: {
        'normal.mousedown': function(e) {
          if (e.originEvent.button) return;
          var line = e.getTargetLine();
          if (line) {
            dragger.dragStart(line, e.getPosition().round());
          }
        },
        'normal.mousemove draglinecontainer.mousemove': function(e) {
          dragger.dragMove(e.getPosition().round());
        },
        'normal.mouseup draglinecontainer.premouseup': function(e) {
          dragger.dragEnd();
          //e.stopPropagation();
          e.preventDefault();
        }
      }
    };
  });
});
