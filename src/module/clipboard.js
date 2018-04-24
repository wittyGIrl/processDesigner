/**
 * @fileOverview
 *
 * 剪切板
 *
 */
define(function (require, exports, module) {
  var kity = require('../core/kity');
  var utils = require('../core/utils');
  var DesignerNode = require('../core/node');
  var Command = require('../core/command');
  var Module = require('../core/module');

  Module.register('ClipboardModule', function () {
    var designer = this,
      _clipboardNodes = [], // 剪切板中的节点
      _clipboardLines = []; // 剪切板中的线

    function resetClipboard() {
      _clipboardNodes = [];
      _clipboardLines = [];
    }

    //目标：复制时线也是可选，可以选择该节点的哪几条线。
    //剪切板中的node和line都是原始的，没有复制，复制会在PasteCommand中完成
    function sendToClipboard(nodes) {
      resetClipboard();
      if (!nodes.length) return;
      // nodes.sort(function(a, b) {
      //     return a.getIndex() - b.getIndex();
      // });
      _clipboardNodes = getNodes(nodes);

      _clipboardNodes.forEach(function (node) {
        var lineEnd;
        node.getStartLines().forEach(function (line) {
          lineEnd = line.endNode;
          if (~_clipboardNodes.indexOf(lineEnd)) {
            utils.unduplicatedPush(_clipboardLines, line);
          }
        });
        node.getEndLines().forEach(function (line) {
          lineEnd = line.startNode;
          if (~_clipboardNodes.indexOf(lineEnd)) {
            utils.unduplicatedPush(_clipboardLines, line);
          }
        });
      });
    }

    /*
    * 将nodes中的下级节点也提取到nodes的数组中
    * 因为剪切板中的节点，不允许单独存在的非根节点。
    * 即如果一个非根结点在剪切板中，那么其父节点一定也在剪切板中，且其父节点一定排在它的前面。
    */
    function getNodes(nodes){
      var results = [];
      nodes.forEach(function(node){
        if(!node.isRoot()) return;
        node.preTraverse(function(current){
          utils.unduplicatedPush(results, current);
        });
      });
      return results;
    }

    /**
     * @command Copy
     * @description 复制当前选中的节点
     * @shortcut Ctrl + C
     * @state
     *   0: 当前有选中的节点
     *  -1: 当前没有选中的节点
     */
    var CopyCommand = kity.createClass('CopyCommand', {
      base: Command,

      execute: function (designer) {
        this.setContentChanged(false);
        var nodes = designer.getSelectedNodes();
        if(!nodes.length){
          return false;
        }
        sendToClipboard(nodes.slice(0));
      }
    });

    /**
     * @command Cut
     * @description 剪切当前选中的节点
     * @shortcut Ctrl + X
     * @state
     *   0: 当前有选中的节点
     *  -1: 当前没有选中的节点
     */
    var CutCommand = kity.createClass('CutCommand', {
      base: Command,

      execute: function (designer) {
        if (this._relations) {
          this._relations.forEach(function(relation){
            designer.removeNode(relation.node);
            if(relation.parent){
              relation.parent.render().updateLine();
            }
          });
          sendToClipboard(this._nodes);
          return;
        }

        var nodes = designer.getSelectedNodes().slice(0);
        if (nodes.length === 0) return false;

        sendToClipboard(nodes);

        var relations = [],
          relation,
          lines = [];
        nodes.forEach(function (node) {
          node.preTraverse(addLine);
          relation = {
            node: node,
          };
          if(node.parent){
            relation.index = node.getIndex();
            relation.parent = node.parent;
          }
          designer.removeNode(node);
          if(relation.parent){
            relation.parent.render().updateLine();
          }
          relations.push(relation);
        });

        this._relations = relations;
        this._nodes = nodes;
        this._lines = lines;
        this._designer = designer;

        function addLine(node){
          utils.combineArr(lines, node.getStartLines());
          utils.combineArr(lines, node.getEndLines());
        }
      },

      unexecute: function () {
        resetClipboard();

        var relation;
        var designer = this._designer;

        this._relations.forEach(function(relation){
          designer.appendNode(relation.node, relation.parent, relation.index);
        });
        this._lines.forEach(function (line) {
          designer.addLine(line);
        });
        this._relations.forEach(function(relation){
          if(relation.parent){
            relation.parent.render().updateLine();
          } else {
            relation.node.render().updateLine();
          }
        });
      }
    });

    /**
     * @command Paste
     * @description 粘贴当前剪切板中的节点到第一个当前选中的节点附近
     * @shortcut Ctrl + V
     * @state
     *   0: 当前有选中的节点
     *  -1: 当前没有选中的节点
     */
    var PasteCommand = kity.createClass('PasteCommand', {
      base: Command,

      execute: function (designer) {
        if (this._clonedNodes) {
          var lineData;
          this._clonedNodes.forEach(function (paste) {
            if(paste.attached) return;
            designer.appendNode(paste, null, null, false);
            paste.render();
          });
          this._clonedLines.forEach(function (line) {
            designer.addLine(line).updateLine(line);
          });
          return;
        }

        if (_clipboardNodes.length === 0) {
          return false;
        }
        var benchmark = _clipboardNodes[0].getLayoutOffset(),
          offset,
          offsetX = 20,
          node = designer.getSelectedNode();
        if (node) {
          var p = node.getLayoutOffset();
          offset = new kity.Point(
            p.x - benchmark.x + offsetX,
            p.y - benchmark.y + offsetX
          );
        } else {
          offset = new kity.Point(offsetX, offsetX);
        }

        var clonedNodes = [],
          idMap = {},
          cloned;
        _clipboardNodes.forEach(function(node){
          cloned = node.clone(true, true);
          idMap[node.getData('id')] = cloned;
          if(node.parent){
            cloned.parent = idMap[node.parent.getData('id')];
          }
          clonedNodes.push(cloned);
        });

        var paste;
        clonedNodes.forEach(function(paste){
          designer.appendNode(paste, paste.parent, null, false);
          if(paste.parent){
            paste.parent.render();
          } else {
            paste.setLayoutOffset(paste.getLayoutOffset().offset(offset));
            designer.applyLayoutResult(paste);
            paste.render();
          }
        });
        var clonedLine,
          data,
          clonedLines = [];
        _clipboardLines.forEach(function (line) {
          clonedLine = line.clone();
          clonedLines.push(clonedLine);
          clonedLine.startNode = idMap[line.startNode.getData('id')];
          clonedLine.endNode = idMap[line.endNode.getData('id')];
          designer.addLine(clonedLine).updateLine(clonedLine);
        });

        designer.select(clonedNodes, true);

        this._offset = offset;
        this._clonedNodes = clonedNodes;
        this._clonedLines = clonedLines;
        this._designer = designer;
      },

      unexecute: function () {
        //resetClipboard();
        var designer = this._designer;
        this._clonedLines.forEach(function (line) {
          designer.removeLine(line);
        });
        this._clonedNodes.forEach(function (node) {
          if(node.attached){
            designer.removeNode(node);
            if(node.parent){
              node.parent.render().updateLine();
            }
          }
        });
      }
    });

    return {
      'commands': {
        'copy': CopyCommand,
        'cut': CutCommand,
        'paste': PasteCommand
      },
      'commandShortcutKeys': {
        'copy': 'normal::ctrl+c|',
        'cut': 'normal::ctrl+x',
        'paste': 'normal::ctrl+v'
      }
    };
  });
});
