/**
 * @fileOverview
 *
 * 定义节点类
 * 关注于树的结构和数据，而不关心具体的显示
 */

define(function (require, exports, module) {
  var kity = require('./kity');
  var utils = require('./utils');
  var Designer = require('./designer');

  /**
   * @class DesignerNode
   *
   * 表示一个脑图节点
   */
  var DesignerNode = kity.createClass('DesignerNode', {

    /**
     * 创建一个游离的脑图节点
     *
     * @param {String|Object} textOrData
     *     节点的初始数据或文本
     */
    constructor: function (textOrData) {

      // 指针
      this.parent = null;
      this.root = this;
      this.children = [];

      // 数据
      this.data = {
        id: utils.guid(),
        created: +new Date(),
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      };

      // 绘图容器
      this.initContainers();

      if (utils.isString(textOrData)) {
        this.setText(textOrData);
      } else if (utils.isObject(textOrData)) {
        utils.extend(this.data, textOrData);
      }
    },

    initContainers: function () {
      //每个node都包含一个renderContainer，处理所有图形相关的信息。
      //而node本身关注的的问题是树形结构本身
      this.rc = new kity.Group().setId(utils.uuid('designer_node'));
      this.rc.designerNode = this;
    },

    /**
     * 判断节点是否根节点
     */
    isRoot: function () {
      return this.parent === null;
    },

    /**
     * 判断节点是否叶子
     */
    isLeaf: function () {
      return this.children.length === 0;
    },

    /**
     * 获取节点的根节点
     */
    getRoot: function () {
      return this.root || this;
    },

    /**
     * 获得节点的父节点
     */
    getParent: function () {
      return this.parent;
    },

    getSiblings: function () {
      var children = this.parent.children;
      var siblings = [];
      var self = this;
      children.forEach(function (child) {
        if (child != self) siblings.push(child);
      });
      return siblings;
    },

    /**
     * 获得节点的深度
     */
    getLevel: function () {
      var level = 0,
        ancestor = this.parent;
      while (ancestor) {
        level++;
        ancestor = ancestor.parent;
      }
      return level;
    },

    /**
     * 获得节点的复杂度（即子树中节点的数量）
     */
    getComplex: function () {
      var complex = 0;
      this.traverse(function () {
        complex++;
      });
      return complex;
    },

    /**
     * 获得节点的类型（root|main|sub）
     */
    getNodeType: function (type) {
      this.type = ['root', 'main', 'sub'][Math.min(this.getLevel(), 2)];
      return this.type;
    },

    /**
     * 判断当前节点是否被测试节点的祖先
     * @param  {DesignerNode}  test 被测试的节点
     */
    isAncestorOf: function (test) {
      var ancestor = test.parent;
      while (ancestor) {
        if (ancestor == this) return true;
        ancestor = ancestor.parent;
      }
      return false;
    },

    getData: function (key) {
      return key ? this.data[key] : this.data;
    },

    setData: function (key, value) {
      if (typeof key == 'object') {
        var data = key;
        for (key in data)
          if (data.hasOwnProperty(key)) {
            this.data[key] = data[key];
          }
      } else {
        this.data[key] = value;
      }
      return this;
    },

    /**
     * 设置节点的文本数据
     * @param {String} text 文本数据
     */
    setText: function (text) {
      this.data.text = text;
      return this;
    },

    /**
     * 获取节点的文本数据
     * @return {String}
     */
    getText: function () {
      return this.data.text || null;
    },
    setX: function (x) {
      this.data.x = x || 0;
      return this;
    },
    setY: function (y) {
      this.data.y = y || 0;
      return this;
    },
    getX: function () {
      return this.data.x;
    },
    getY: function () {
      return this.data.y;
    },
    setWidth: function (w) {
      this.data.width = w || 0;
      return this;
    },
    setHeight: function (h) {
      this.data.height = h || 0;
      return this;
    },
    getWidth: function () {
      return this.data.width;
    },
    getHeight: function () {
      return this.data.height;
    },
    /**
     * 先序遍历当前节点树
     * @param  {Function} fn 遍历函数
     */
    preTraverse: function (fn, excludeThis) {
      var children = this.getChildren();
      if (!excludeThis) fn(this);
      for (var i = 0; i < children.length; i++) {
        children[i].preTraverse(fn);
      }
    },

    /**
     * 后序遍历当前节点树
     * @param  {Function} fn 遍历函数
     */
    postTraverse: function (fn, excludeThis) {
      var children = this.getChildren();
      for (var i = 0; i < children.length; i++) {
        children[i].postTraverse(fn);
      }
      if (!excludeThis) fn(this);
    },

    traverse: function (fn, excludeThis) {
      return this.postTraverse(fn, excludeThis);
    },

    getChildren: function () {
      return this.children;
    },

    hasChildren: function(){
      return this.children && this.children.length > 0;
    },

    getIndex: function () {
      return this.parent ? this.parent.children.indexOf(this) : -1;
    },

    insertChild: function (node, index) {
      if (utils.isNil(index)) {
        index = this.children.length;
      }
      if (node.parent) {
        node.parent.removeChild(node);
      }
      node.parent = this;
      node.root = this.root;

      this.children.splice(index, 0, node);
      return this;
    },

    appendChild: function (node) {
      return this.insertChild(node);
    },

    prependChild: function (node) {
      return this.insertChild(node, 0);
    },

    removeChild: function (elem) {
      var index = elem,
        removed;
      if (elem instanceof DesignerNode) {
        index = this.children.indexOf(elem);
      }
      if (index >= 0) {
        removed = this.children.splice(index, 1)[0];
        removed.parent = null;
        removed.root = removed;
      }
      return this;
    },

    clearChildren: function () {
      this.children = [];
      return this;
    },

    getChild: function (index) {
      return this.children[index];
    },

    getRenderContainer: function () {
      return this.rc;
    },

    getCommonAncestor: function (node) {
      return DesignerNode.getNodeCommonAncestor(this, node);
    },

    contains: function (node) {
      return this == node || this.isAncestorOf(node);
    },

    /**
     * 克隆自身，新克隆的节点id与自身不同
     * @param  {bool} 是否将节点的线也一起复制
     * @param  {bool} 是否将下级节点也一起复制
     */
    clone: function (excludeLines, excludeChilren) {
      var cloned = new DesignerNode();

      var newId = cloned.data.id;
      cloned.data = utils.extend(true, {}, this.data);
      cloned.data.id = newId;
      cloned.data.nodeId = cloned.data.outlineType + '_' + newId;

      if(!excludeChilren){
        this.children.forEach(function (child) {
          cloned.appendChild(child.clone(excludeLines));
        });
      }

      if (!excludeLines) {
        this.getStartLines().forEach(function (line) {
          cloned.getStartLines().push(
            line.clone().setData('startNode', cloned)
          );
        });

        this.getEndLines().forEach(function (line) {
          cloned.getEndLines().push(
            line.clone().setData('endNode', cloned)
          );
        });
      }

      return cloned;
    },

    compareTo: function (node) {

      if (!utils.comparePlainObject(this.data, node.data)) return false;
      if (!utils.comparePlainObject(this.temp, node.temp)) return false;
      if (this.children.length != node.children.length) return false;

      var i = 0;
      while (this.children[i]) {
        if (!this.children[i].compareTo(node.children[i])) return false;
        i++;
      }

      return true;
    },

    getDesigner: function () {
      return this.getRoot().designer;
    }
  });

  //Static Method
  DesignerNode.getCommonAncestor = function (nodeA, nodeB) {
    if (nodeA instanceof Array) {
      return DesignerNode.getCommonAncestor.apply(this, nodeA);
    }
    switch (arguments.length) {
      case 1:
        return nodeA.parent || nodeA;

      case 2:
        if (nodeA.isAncestorOf(nodeB)) {
          return nodeA;
        }
        if (nodeB.isAncestorOf(nodeA)) {
          return nodeB;
        }
        var ancestor = nodeA.parent;
        while (ancestor && !ancestor.isAncestorOf(nodeB)) {
          ancestor = ancestor.parent;
        }
        return ancestor;

      default:
        return Array.prototype.reduce.call(arguments,
          function (prev, current) {
            return DesignerNode.getCommonAncestor(prev, current);
          },
          nodeA
        );
    }
  };

  //暴露接口
  kity.extendClass(Designer, {

    getRoot: function () {
      return this._roots && this._roots[0] || null;
    },

    getRoots: function () {
      return this._roots || [];
    },

    setRoots: function (roots) {
      this._roots = roots;
      roots.forEach(function(root){
        root.designer = this;
      }, this);
      return this;
    },

    addRoot: function (root, excludeLines) {
      return this.insertRoot(root, null, excludeLines);
    },

    insertRoot: function (root, index, excludeLines) {
      if (index === undefined) {
        index = this.children.length;
      }

      this._roots.splice(index, index, root);
      this.attachNode(root, excludeLines);
      return root.designer = this;
    },

    removeRoot: function (root, excludeLines) {
      var index = this._roots.indexOf(root);
      if (index !== -1) {
        this._roots.splice(index, 1);
        this.detachNode(root, excludeLines);
      }
      return this;
    },

    getAllNode: function () {
      var nodes = [];
      var cb = function (node) {
        nodes.push(node);
      };
      for (var i = 0, l = this._roots.length; i < l; i++) {
        this._roots[i].traverse(cb, false);
      }
      return nodes;
    },

    getNodeById: function (id) {
      return this.getNodesById([id])[0];
    },

    getNodesById: function (ids) {
      var nodes = this.getAllNode();
      var result = [];
      nodes.forEach(function (node) {
        if (ids.indexOf(node.getData('id')) != -1) {
          result.push(node);
        }
      });
      return result;
    },

    getNodesByNodeId: function (ids) {
      var nodes = this.getAllNode();
      var result = [];
      nodes.forEach(function (node) {
        if (ids.indexOf(node.getData('nodeId')) != -1) {
          result.push(node);
        }
      });
      return result;
    },

    createNode: function (textOrData, parent, index) {
      var node = new DesignerNode(textOrData);
      this.fire('nodecreate', {
        node: node,
        parent: parent,
        index: index
      });
      this.appendNode(node, parent, index);
      return node;
    },

    appendNode: function (node, parent, index, excludeLines) {
      if (parent) {
        parent.insertChild(node, index);
        this.attachNode(node, excludeLines);
      } else {
        this.addRoot(node, excludeLines);
      }
      return this;
    },

    removeNode: function (node, excludeLines) {
      if (node.parent) {
        node.parent.removeChild(node);
        this.detachNode(node, excludeLines);
      } else {
        this.removeRoot(node, excludeLines);
      }
      return this;
    },

    attachNode: function (node, excludeLines) {
      var designer = this;
      var rc = this.getRenderContainer();
      node.preTraverse(function (current) {
        current.attached = true;
        rc.addShape(current.getRenderContainer());
        //line
        if (!excludeLines) {
          current.getStartLines().forEach(function (line) {
            designer.addLine(line);
          });
          current.getEndLines().forEach(function (line) {
            designer.addLine(line);
          });
        }
      });

      this.fire('nodeattach', {
        node: node
      });
      return this;
    },

    detachNode: function (node, excludeLines) {
      var designer = this;
      var rc = this.getRenderContainer();
      node.preTraverse(function (current) {
        current.attached = false;
        rc.removeShape(current.getRenderContainer());
        if (!excludeLines) {
          var startLines = current.getStartLines(),
            endLines = current.getEndLines();

          while (startLines.length > 0) {
            designer.removeLine(startLines[0]);
          }
          while (endLines.length > 0) {
            designer.removeLine(endLines[0]);
          }
        }
      });

      this.fire('nodedetach', {
        node: node
      });
      return this;
    },

    getDesignerTitle: function () {
      return this.getRoot().getText();
    },

    clearNode: function () {
      // 删除当前所有节点
      while (this._roots.length) {
        this.removeNode(this._roots[0]);
      }
      return this;
    }
  });

  kity.extendClass(DesignerNode, {
    //style
    getStyle: function (item, node) {
      return null;
    },
    /**
     * 获取当前节点的前驱或者后继节点
     * @param  isPrecesor {bool} true 获取前驱节点；false 获取后继节点
     * @param  nodes {Array} 记录已经获取到的节点。避免环状结构死循环。
     */
    getPrecusors: function(isPrecesor, nodes){
      nodes = nodes || [];
      var getLines = isPrecesor ? 'getEndLines' : 'getStartLines';
      var adjacencyType =  isPrecesor ? 'startNode' : 'endNode';
      var adjacency;
      this[getLines]().forEach(function(line){
        adjacency = line[adjacencyType];
        if(!~nodes.indexOf(adjacency)){
          nodes.push(adjacency);
          adjacency.getPrecusors(isPrecesor, nodes);
        }
      });
      return nodes;
    }
  });

  module.exports = DesignerNode;
});
