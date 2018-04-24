/**
 * @fileOverview
 *
 * 拖拽连线开始或结束位置，是线脱离并附着到另一个节点（目前只允许拖拽结束节点）
 */
define(function (require, exports, module) {
  var kity = require('../core/kity');
  var utils = require('../core/utils');

  var Module = require('../core/module');
  var OutlineManager = require('../core/outline');
  var Command = require('../core/command');

  var Locker = require('./lineInflectionLock');

  //for redo undo
  var ChangeLineEndNodeCommand = kity.createClass(
    'ChangeLineEndNodeCommand', {
      base: Command,
      execute: function (designer, line, endNode, origins) {
        if(endNode){
          line.endNode = endNode;
        }
        if (this._line) {
          line = this._line;
          origins = this._origins;
          line.endNode = this._endNode;
          line.endIndex = this._endIndex;
          line.endVector = this._endVector;
          line.endPos = this._endPos;
        }
        var originEndNode = origins.endNode;
        if (originEndNode !== line.endNode) {
          line.endNode.getEndLines().push(line);

          var endLines = originEndNode.getEndLines();
          endLines.splice(endLines.indexOf(line), 1);
        }
        designer.updateLine(line.startNode, line);

        Locker.hideLocker(line);

        this._line = line;
        this._origins = origins;
        this._designer = designer;
        this._state = Command.STATE_ACTIVE;
      },

      //撤销
      unexecute: function () {
        var line = this._line,
          origins = this._origins;
        var originEndNode = origins.endNode;
        if (originEndNode !== line.endNode) {
          originEndNode.getEndLines().push(line);

          var endLines = line.endNode.getEndLines();
          endLines.splice(endLines.indexOf(line), 1);
        }
        this._endNode = line.endNode;
        this._endIndex = line.endIndex;
        this._endVector = line.endVector;
        this._endPos = line.endPos;
        utils.extend(line, origins);

        this._designer.updateLine(line.startNode, line);

        Locker.hideLocker(line);

        this._state = Command.STATE_NORMAL;
      },

      queryState: function (designer) {
        return this._state;
      }
    });

  var MAX_RADIUS = 10;

  var LineEndDragger = kity.createClass('LineEndDragger', {
    constructor: function (designer) {
      this._designer = designer;
    },
    start: function (pos) {
      var selectedLine = this._designer.getSelectedLine();
      if (selectedLine) {
        var endPos = selectedLine.endPos;
        if (kity.Vector.fromPoints(endPos, pos).length() < MAX_RADIUS) {
          this._startPos = pos;
          this._line = selectedLine;
          return true;
        }
      }
      return false;
    },
    off: function (pos) {
      var line = this._line;
      this._endNode = line.endNode;
      this._endVector = line.endVector;
      this._endPos = line.endPos;
      this._endIndex = line.endIndex;

      line.endPos = pos;
      line.endNode = null;

      this._designer.fire('lineenddragstart', {
        line: line
      });
    },
    move: function (pos, endNode) {
      if (!this._startPos) return;

      //最小启动拖拽模式的距离
      var DRAG_MOVE_THRESHOLD = 4;

      var movement = kity.Vector.fromPoints(this._dragPos || this._startPos,
        pos);

      this._dragPos = pos;
      if (!this._dragMode) {
        // 判断拖拽是否满足最小距离
        if (kity.Vector.fromPoints(this._dragPos, this._startPos).length() <
          DRAG_MOVE_THRESHOLD) {
          return;
        }
        if (!this._enterDragMode()) {
          return;
        }
      }

      var line = this._line;
      var connection = line.connection;

      if (endNode) {
        var endVector = endNode.getInVector(pos);
        line.endVector = endVector;
        var outlineManager = endNode.getOutlineManager();
        var linePoints = outlineManager.getLinePoints();
        line.endIndex = OutlineManager.getInVectorIndex(endVector);
        line.endPos = linePoints[line.endIndex];
      } else {
        line.endPos = pos;
        line.endVector = null;
      }
      this._designer.updateLine(line.startNode, line);
    },
    on: function (endNode) {
      if (!this._dragMode) {
        utils.reset(this, ['_startPos', '_dragPos']);
        return;
      }

      var line = this._line;
      if (line) {
        if (endNode) {
          //redo,undo
          this._designer.executeCommand('ChangeLineEndNode', line, endNode, {
            endNode: this._endNode,
            endVector: this._endVector,
            endPos: this._endPos,
            endIndex: this._endIndex
          });
        } else {
          line.endNode = this._endNode;
          line.endVector = this._endVector;
          line.endPos = this._endPos;
          this._designer.updateLine(line.startNode, line);
        }
      }

      this._designer.fire('lineenddragend', {
        line: line
      });
      utils.reset(this, ['_startPos', '_dragPos', '_node', '_line',
        '_dragMode'
      ]);

      this._designer.setStatus('normal');
      this._designer.getPaper().setStyle('cursor', 'defalut');
    },
    _enterDragMode: function () {
      this.off(this._dragPos);
      this._dragMode = true;

      this._designer.setStatus('draglineend');
      this._designer.getPaper().setStyle('cursor', 'move');
      return true;
    }
  });

  Module.register('DragLineEnd', function () {
    var endDrager;

    return {
      init: function () {
        endDrager = new LineEndDragger(this);
        window.addEventListener('mouseup', function () {
          endDrager.on();
        });
      },
      commands: {
        'ChangeLineEndNode': ChangeLineEndNodeCommand
      },
      events: {
        'normal.beforemousedown': function (e) {
          if (e.originEvent.button) return;
          if (endDrager.start(e.getPosition().round())) {
            e.stopPropagationImmediately();
          }
        },
        'normal.mousemove draglineend.mousemove': function (e) {
          endDrager.move(e.getPosition().round(), e.getTargetNode());
        },
        'normal.mouseup draglineend.premouseup': function (e) {
          endDrager.on(e.getTargetNode());
          e.preventDefault();
        }
      }
    };
  });
});
