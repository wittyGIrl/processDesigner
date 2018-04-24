/**
 * @fileOverview
 *
 * 定义连线模块
 */
define(function(require, exports, module) {
  var kity = require('../core/kity');
  var utils = require('../core/utils');

  var Module = require('../core/module');
  var Command = require('../core/command');
  var OutlineManager = require('../core/outline');


  //AppendLineCommand不会被单独执行。
  //之所以作为一个Command，是为了支持撤销重做。
  //所以在执行之前，line实际已被添加到designer._lines中了。
  var AppendLineCommand = kity.createClass('AppendLineCommand', {
    base: Command,
    execute: function(designer, line) {
      if (this._line) {
        line = this._line;
        designer.addLine(line);

        line.startPos = line.startNode.getOutlineManager().getLinePoints()[
          line.startIndex];
        line.endPos = line.endNode.getOutlineManager().getLinePoints()[
          line.endIndex];
        designer.updateLine(line.startNode, line);
      }

      var actionId = line.getData('actionId'),
        condition;
      if (actionId) {
        condition = 'sys_lastAction = "' + actionId + '"';
      }
      var property = designer.getLineDefaultProps(condition);
      line.setData('property', property).setData('basic', property);
      designer.selectLine(line, true);

      //designer.layout();
      this._line = line;
      this._designer = designer;
      this._state = Command.STATE_ACTIVE;
    },

    //撤销
    unexecute: function() {
      this._designer.removeLine(this._line);
      this._state = Command.STATE_NORMAL;
    },

    queryState: function(designer) {
      return this._state;
    }
  });

  var RemoveLineCommand = kity.createClass('RemoveLineCommand', {
    base: Command,
    execute: function(designer) {
      if (!this._lines) {
        this._lines = designer.getSelectedLines().slice(0);
      }

      this._lines.forEach(function(line) {
        designer.removeLine(line);
      });


      this._designer = designer;
    },

    //撤销
    unexecute: function() {
      var selectedLines = this._designer.getLines();
      var designer = this._designer;

      var data;
      this._lines.forEach(function(line) {
        designer.addLine(line);
        line.startPos = line.startNode.getOutlineManager().getLinePoints()[
          data.startIndex];
        line.endPos = line.endNode.getOutlineManager().getLinePoints()[
          data.endIndex];
        designer.updateLine(line.startNode, line);
      });

    },

    queryState: function(designer) {
      return designer.getSelectedLines().length > 0 ? 0 : -1;
    }
  });

  var Liner = kity.createClass('Liner', {
    constructor: function(designer) {
      this._designer = designer;
    },
    drawStart: function(shape, node) {
      this._shape = shape;
      this._startPos = node.getGlobalLayoutTransformPreview().transformPoint(shape.getCenter()).round();
      this._node = node;
    },
    draw: function(pos, endNode) {
      if (!this._startPos) return;

      //最小启动拖拽模式的距离
      var DRAG_MOVE_THRESHOLD = 10;

      var movement = kity.Vector.fromPoints(this._dragPos || this._startPos, pos);

      this._drawPos = pos;

      if (!this._drawMode) {
        // 判断拖放模式是否该启动
        if (kity.Vector.fromPoints(this._drawPos, this._startPos).length() <
          DRAG_MOVE_THRESHOLD) {
          return;
        }
        if (!this._enterDrawMode()) {
          return;
        }
      }

      if (endNode) {
        var endVector = endNode.getInVector(pos);
        this._line.endVector = endVector;
        var outlineManager = endNode.getOutlineManager();
        var linePoints = outlineManager.getLinePoints();
        this._line.endIndex = OutlineManager.getInVectorIndex(
          endVector);
        this._line.endPos = linePoints[this._line.endIndex];
        this._endNode = endNode;
      } else {
        this._line.endPos = pos;
        this._line.endVector = null;
      }
      this._designer.updateLine(this._node, this._line);
    },
    drawEnd: function(endNode) {
      if (this._line) {
        var line = this._line;
        if (!endNode) {
          if (line.endNode) {
            endNode = line.endNode;
          }
        }

        if (endNode && this._node.getData('id') !== endNode.getData(
            'id')) {
          this._line.endNode = endNode;
          endNode.getEndLines().push(this._line);
          line.setData('actionId', this._shape.getData('actionId'));
          this._designer.executeCommand('AppendLine', this._line,
            true);
        } else {
          this._designer.removeLine(this._line);
        }
      }

      if (!this._drawMode) {
        utils.reset(this, ['_startPos', '_drawPos', '_shape']);
        return;
      }

      utils.reset(this, ['_startPos', '_drawPos', '_shape', '_node', '_line', '_drawMode']);

      this._designer.setStatus('normal');
    },
    _enterDrawMode: function() {
      var designer = this._designer;
      this._line = designer.createLine(this._node, this._startPos);
      this._drawMode = true;
      this._designer.setStatus('drawline');
      return true;
    }
  });

  Module.register('DrawLine', function() {
    var liner;

    return {
      init: function() {
        liner = new Liner(this);
        window.addEventListener('mouseup', function() {
          liner.drawEnd();
        });
      },
      commands: {
        'AppendLine': AppendLineCommand,
        'RemoveLine': RemoveLineCommand,
      },
      events: {
        'normal.mousedown': function(e) {
          if (e.originEvent.button) return;
          var targetNode = e.getTargetNode();
          if (targetNode) {
            var targetShape = e.kityEvent && e.kityEvent.targetShape;
            if (targetShape && targetShape.getId && ~targetShape.getId()
                .indexOf('lpoint')) {
              liner.drawStart(targetShape, targetNode);
            }
          }
        },
        'normal.mousemove drawline.mousemove': function(e) {
          liner.draw(e.getPosition().round(), e.getTargetNode());
        },
        'normal.mouseup drawline.premouseup': function(e) {
          liner.drawEnd(e.getTargetNode());
          e.preventDefault();
        },
        'drawline.mouseover': function(e) {
          if (e.originEvent.button) return;
          var targetNode = e.getTargetNode();
          if (targetNode) {
            var outlineManager = targetNode.getOutlineManager();
            outlineManager.showLinePoints(targetNode, outlineManager.getOutlineShape(), 1);
          }
          e.preventDefault();
        },
        'normal.mouseout drawline.mouseout': function(e) {
          if (e.originEvent.button) return;
          var targetNode = e.getTargetNode();
          if (targetNode) {
            targetNode.getOutlineManager().hideLinePoints(targetNode,
              1);
          }
          e.preventDefault();
        }
      }
    };
  });
});
