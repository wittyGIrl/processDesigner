/**
 * @fileOverview
 *
 * 选择
 */
define(function(require, exports, module) {
  var kity = require('./kity');
  var utils = require('./utils');
  var Designer = require('./designer');
  var DesignerNode = require('./node');

  var LineLocker = require('../module/lineInflectionLock');

  Designer.registerInitHook(function() {
    this._initSelection();
  });

  kity.extendClass(Designer, {
    _initSelection: function() {
      this._selectedNodes = [];
      this._selectedLines = [];
    },

    renderChangedLineSelection: function(last) {
      var current = this.getSelectedLines();
      var line,
        data;
      var theme = this.getThemeItems();

      var designer = this;

      var changed = false;

      last.forEach(function(line) {
        if (current.indexOf(line) === -1) {
          changed = true;
          line.connection.stroke(theme['connect-color'], theme['connect-width']);
          line.arrow.fill(theme['connect-color']);
          line.arrow.setStyle('cursor', 'default');

          LineLocker.hideLocker(line);

          line.startNode.getOutlineManager().updateColor(line.startNode, false);
          line.endNode.getOutlineManager().updateColor(line.endNode, false);
        }
      });

      current.forEach(function(line) {
        if (last.indexOf(line) === -1) {
          changed = true;
          line.connection.stroke(theme['selected-connect-color'], theme['selected-connect-width']);
          line.arrow.fill(theme['selected-connect-color']);
          line.arrow.setStyle('cursor', 'move');

          LineLocker.showLocker(designer, line);

          line.startNode.getOutlineManager().updateColor(line.startNode, true);
          line.endNode.getOutlineManager().updateColor(line.endNode, true);
        }
      });

      if (changed) {
        //触发内部改变 事件
        this._interactChange();
        this.fire('selectionchange');
      }
    },

    getSelectedLines: function() {
      //不能克隆返回，会对当前选区操作，从而影响querycommand
      return this._selectedLines;
    },

    getSelectedLine: function() {
      return this._selectedLines[0] || null;
    },

    removeAllSelectedLines: function() {
      var me = this;
      var last = this._selectedLines.splice(0);
      this._selectedLines = [];
      this.renderChangedLineSelection(last);
      return this.fire('lineselectionclear');
    },

    removeSelectedLines: function(lines) {
      var me = this;
      var last = this._selectedLines.slice(0);
      lines = utils.isArray(lines) ? lines : [lines];

      lines.forEach(function(line) {
        var index;
        if ((index = me._selectedLines.indexOf(line)) === -1) return;
        me._selectedLines.splice(index, 1);
      });

      this.renderChangedLineSelection(last);
      return this;
    },

    selectLine: function(lines, isSingleSelect) {
      var last = this.getSelectedLines();
      if (isSingleSelect) {
        this._selectedLines = [];
        this.removeAllSelectedNodes();
      }

      lines = utils.isArray(lines) ? lines : [lines];
      var me = this;
      lines.forEach(function(line) {
        if (me._selectedLines.indexOf(line) !== -1) {
          return;
        }
        me._selectedLines.unshift(line);
      });
      this.renderChangedLineSelection(last);
      return this;
    },

    renderChangedSelection: function(last) {
      var current = this.getSelectedNodes();
      var changed = [],
        data;

      var theme = this.getThemeItems();

      last.forEach(function(node) {
        if (current.indexOf(node) === -1) {
          changed.push(node);

          node.getStartLines().forEach(function(line) {
            line.connection.stroke(theme['connect-color'], theme['connect-width']);
            line.arrow.fill(theme['connect-color']);
          });
          node.getEndLines().forEach(function(line) {
            line.connection.stroke(theme['connect-color'], theme['connect-width']);
            line.arrow.fill(theme['connect-color']);
          });
        }
      });

      current.forEach(function(node) {
        if (last.indexOf(node) === -1) {
          changed.push(node);

          node.getStartLines().forEach(function(line) {
            line.connection.stroke(theme['start-connect-color'], theme['connect-width']);
            line.arrow.fill(theme['start-connect-color']);
          });
          node.getEndLines().forEach(function(line) {
            line.connection.stroke(theme['end-connect-color'], theme['connect-width']);
            line.arrow.fill(theme['end-connect-color']);
          });
        }
      });

      if (changed.length) {
        //触发内部改变 事件
        this._interactChange();
        this.fire('selectionchange');
      }
      while (changed.length) {
        changed.shift().render();
      }
    },

    getSelectedNodes: function() {
      //不能克隆返回，会对当前选区操作，从而影响querycommand
      return this._selectedNodes;
    },

    getSelectedNode: function() {
      return this._selectedNodes[0] || null;
    },

    removeAllSelectedNodes: function() {
      var me = this;
      var last = this._selectedNodes.splice(0);
      this._selectedNodes = [];
      this.renderChangedSelection(last);
      return this.fire('selectionclear');
    },

    removeSelectedNodes: function(nodes) {
      var me = this;
      var last = this._selectedNodes.slice(0);
      nodes = utils.isArray(nodes) ? nodes : [nodes];

      nodes.forEach(function(node) {
        var index;
        if ((index = me._selectedNodes.indexOf(node)) === -1) return;
        me._selectedNodes.splice(index, 1);
      });

      this.renderChangedSelection(last);
      return this;
    },

    select: function(nodes, isSingleSelect) {
      if (utils.isNil(nodes)) return this;
      var last = this.getSelectedNodes().slice(0);
      if (isSingleSelect) {
        this._selectedNodes = [];
        this.removeAllSelectedLines();
      }

      nodes = utils.isArray(nodes) ? nodes : [nodes];
      nodes.forEach(function(node) {
        utils.unduplicatedPush(this._selectedNodes, node);
      }, this);
      this.renderChangedSelection(last);
      return this;
    },

    //当前选区中的节点在给定的节点范围内的保留选中状态，
    //没在给定范围的取消选中，给定范围中的但没在当前选中范围的也做选中效果
    toggleSelect: function(node) {
      if (utils.isArray(node)) {
        node.forEach(this.toggleSelect.bind(this));
      } else {
        if (node.isSelected()) this.removeSelectedNodes(node);
        else this.select(node);
      }
      return this;
    },

    isSingleSelect: function() {
      return this._selectedNodes.length === 1;
    },

    getSelectedAncestors: function(includeRoot) {
      var nodes = this.getSelectedNodes().slice(0),
        ancestors = [],
        judge;

      // 根节点不参与计算
        // var rootIndex = nodes.indexOf(this.getRoot());
        // if (~rootIndex && !includeRoot) {
        //     nodes.splice(rootIndex, 1);
        // }

      // 判断 nodes 列表中是否存在 judge 的祖先
      function hasAncestor(nodes, judge) {
        for (var i = nodes.length - 1; i >= 0; --i) {
          if (nodes[i].isAncestorOf(judge)) return true;
        }
        return false;
      }

      // 按照拓扑排序
      nodes.sort(function(node1, node2) {
        return node1.getLevel() - node2.getLevel();
      });

      // 因为是拓扑有序的，所以只需往上查找
      while ((judge = nodes.pop())) {
        if (!hasAncestor(nodes, judge)) {
          ancestors.push(judge);
        }
      }
      return ancestors;
    }
  });

  kity.extendClass(DesignerNode, {
    isSelected: function() {
      var designer = this.getDesigner();
      var arr = designer && designer.getSelectedNodes();
      return utils.isArray(arr) && arr.indexOf(this) !== -1;
    }
  });

  Designer.registerInitHook(function() {
    /*
    * 当节点被 detach 时，如果该节点处于选中状态，则需要中选中节点数组中去掉
    */
    this.on('nodedetach', function(e) {
      var nodes = this.getSelectedNodes(),
        index;
      e.node.preTraverse(function(current){
        index = index = nodes.indexOf(current);
        if(~index){
          nodes.splice(index, 1);
        }
      });
    });
  });
});
