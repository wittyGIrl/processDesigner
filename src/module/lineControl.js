/**
 * @fileOverview
 *
 * 定义连线控制模块
 */
define(function (require, exports, module) {
  var kity = require('../core/kity');
  var utils = require('../core/utils');

  var Module = require('../core/module');
  var Command = require('../core/command');

  var Locker = require('./lineInflectionLock');

  function pushPos(pathData, pos){
    if(!pos)return;
    pathData.push('L');
    pathData.push(pos.x);
    pathData.push(pos.y);
  }

  function updateConnection(line){
    if(!line)return;
    var connection = line.connection;
    var inflections = line.inflections;
    var pathData = ['M', line.startPos.x, line.startPos.y];

    pushPos(pathData, line.newStartPos);
    for (var i = 0, l = inflections.length; i < l; i++) {
      pushPos(pathData, inflections[i]);
    }
    pushPos(pathData, line.newEndPos);
    pushPos(pathData, line.endPos);
    //update
    connection.setPathData(pathData);
  }

  //for redo undo
  var DragLineCommand = kity.createClass('DragLineCommand', {
    base: Command,
    execute: function (designer, line, startPos, endPos, index, direction, end) {
      if (this._line) {
        line = this._line;
        startPos = this._startPos;
        endPos = this._endPos;
        index = this._index;
        direction = this._direction;
        end = this._end;
      }
      var inflections = line.inflections;

      var axis = direction ? 'x' : 'y';
      inflections[index][axis] = endPos[axis];
      inflections[index + 1][axis] = endPos[axis];

      if (index === 0) {
        this._flag = true;
        inflections.unshift(end);
      } else if (index === inflections.length - 2) {
        this._flag = true;
        inflections.push(end);
      }

      updateConnection(line);

      line.render();
      Locker.hideLocker(line);

      this._line = line;
      this._startPos = startPos;
      this._endPos = endPos;
      this._index = index;
      this._direction = direction;
      this._end = end;
      this._designer = designer;
      this._state = Command.STATE_ACTIVE;
    },

    //撤销
    unexecute: function () {
      var inflections = this._line.inflections;
      if(this._flag === true){
        if (this._index === 0) {
          inflections.shift();
        } else {
          inflections.pop();
        }
      }

      var axis = this._direction ? 'x' : 'y';
      inflections[this._index][axis] = this._startPos[axis];
      inflections[this._index + 1][axis] = this._startPos[axis];

      updateConnection(this._line);
      this._line.render();
      this._state = Command.STATE_NORMAL;

      Locker.hideLocker(this._line);
    },

    queryState: function (designer) {
      return this._state;
    }
  });

  var Liner = kity.createClass('Liner', {
    constructor: function (designer) {
      this._designer = designer;
    },
    //得到pos在connection的哪两个拐点之间
    _getSegment: function (line, pos) {
      var connection = line.connection;
      var inflections = line.inflections;
      if (inflections.length < 2) return;
      var width = line.shadow ?
        (line.shadow.getAttr('stroke-width') - 0) :
        (connection.getAttr('stroke-width') - 0);
      var i = 0,
        l = inflections.length - 1;
      var start, end, minX, maxX, minY, maxY, direction;
      var x = pos.x,
        y = pos.y;
      for (i; i < l; i++) {
        start = inflections[i];
        end = inflections[i + 1];
        if (start.x === end.x || Math.abs(start.x - end.x) < 1) {
          minX = start.x - width;
          maxX = start.x + width;
          if (start.y > end.y) {
            minY = end.y;
            maxY = start.y;
          } else {
            minY = start.y;
            maxY = end.y;
          }
          direction = true; //x 方向
        } else {
          minY = start.y - width;
          maxY = start.y + width;
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
    dragStart: function (line, pos) {
      this._startPos = pos.round();
      this._line = line;
    },
    drag: function (pos) {
      if (!this._startPos) return;

      //最小启动拖拽模式的距离
      var DRAG_MOVE_THRESHOLD = 10;

      var movement = kity.Vector.fromPoints(this._dragPos || this._startPos,
        pos);

      this._dragPos = pos;

      if (!this._dragMode) {
        // 判断拖放模式是否该启动
        if (kity.Vector.fromPoints(this._dragPos, this._startPos).length() <
          DRAG_MOVE_THRESHOLD) {
          return;
        }
        if (!this._enterDragMode()) {
          return;
        }
      }

      var line = this._line;
      var inflections = line.inflections;

      var axis = this._direction ? 'x' : 'y';
      inflections[this._index][axis] = this._dragPos[axis];
      inflections[this._index + 1][axis] = this._dragPos[axis];

      updateConnection(line);
    },
    dragEnd: function () {
      if (!this._dragMode) {
        utils.reset(this, ['_startPos', '_dragPos']);
        return;
      }

      this._designer.executeCommand('DragLine', this._line, this._startPos, this._dragPos, this._index, this._direction, this._end);

      this._designer.fire('draglineend', {line: this._line});

      utils.reset(this, ['_startPos', '_dragPos', '_node', '_line', '_end', '_originalStart', '_originalEnd', '_dragMode']);

      this._designer.setStatus('normal');
    },
    _enterDragMode: function () {
      var segment = this._getSegment(this._line, this._startPos);
      if (!segment) {
        return false;
      }
      var inflections = this._line.inflections;
      //端点。如果端点被拖动，则生成新的端点
      if(this._index === 0){
        this._end = new kity.Point(inflections[0].x,
          inflections[0].y);
      }
      else if(this._index === inflections.length - 2){
        this._end = new kity.Point(inflections[inflections.length -
          1].x, inflections[inflections.length - 1].y);
      }

      this._dragMode = true;

      this._designer.fire('draglinestart', {line: this._line});

      this._designer.setStatus('dragline');
      this._designer.getPaper().setStyle('cursor', this._direction ?
        'e-resize' : 'n-resize');
      return true;
    }
  });

  Module.register('DragLine', function () {
    var liner;

    return {
      init: function () {
        liner = new Liner(this);
        window.addEventListener('mouseup', function () {
          liner.dragEnd();
        });
      },
      commands: {
        'DragLine': DragLineCommand
      },
      events: {
        'normal.beforemousedown': function (e) {
          if (e.originEvent.button) return;
          var targetShape = e.kityEvent && e.kityEvent.targetShape;
          if (targetShape && targetShape.getId &&
            (~targetShape.getId().indexOf('connect') ||
              ~targetShape.getId().indexOf('shadow'))
          ) {
            var line = targetShape.line;
            this.selectLine(line, true);
            liner.dragStart(line, e.getPosition());
            e.stopPropagationImmediately();
          }
        },
        'normal.mousemove dragline.mousemove': function (e) {
          liner.drag(e.getPosition(), e.getTargetNode());
        },
        'normal.mouseup dragline.premouseup': function (e) {
          liner.dragEnd(e.getPosition(), e.getTargetNode());
          e.preventDefault();
        }
      }
    };
  });
});
