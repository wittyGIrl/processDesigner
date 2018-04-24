/**
 * @fileOverview
 *
 * line，级别略低于node，因为line必须依附node存在
 *
 * @author: Bryce
 */
define(function(require, exports, module) {
  var kity = require('./kity');
  var utils = require('./utils');
  var Module = require('./module');
  var Designer = require('./designer');
  var DesignerNode = require('./node');
  var OutlineManager = require('../core/outline');

  /**
   * @class DesignerLine
   *
   * 表示一条线
   */
  var DesignerLine = kity.createClass('DesignerLine', {
    constructor: function(designer, options) {
      this._designer = designer;
      // 数据
      this.data = {
        id: 'line_' + utils.guid()
      };
      utils.extend(this.data, options);
      // 绘图容器
      this.initContainers();

    },
    /**
     * @class DesignerLine
     *
     * 线的container，包括两部分
     *      rendercontainer 包含linerenderer渲染的图形
     *      container 包含线本身相关的图形。比如箭头等
     */
    initContainers: function() {
      this.container = new kity.Group().setId(utils.uuid('process_line'));
      this.rc = new kity.Group();
      this.container.appendShape(this.rc);
      this.rc.designerLine = this;

      var designer = this._designer;
      var group = new kity.Group();
      var connection = new kity.Path();
      connection.stroke(
        designer.getStyle('connect-color') || 'black',
        designer.getStyle('connect-width') || 2
      ).setId(utils.uuid('connect'));

      var arrow = new kity.Path();
      arrow.fill(designer.getStyle('connect-color') || 'black')
        .setId(utils.uuid('arrow'));

      group.addShape(connection).addShape(arrow);

      connection.line = this;
      arrow.line = this;

      this.getContainer().addShape(group);

      this.group = group;
      this.arrow = arrow;
      this.connection = connection;
    },

    getRenderContainer: function() {
      return this.rc;
    },

    getContainer: function() {
      return this.container;
    },

    getData: function(key) {
      return key ? this.data[key] : this.data;
    },
    /**
     * @method setData
     *
     * Data中只保存简单类型
     */
    setData: function(key, value) {
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

    setText: function(text) {
      this.data.text = text;
      return this;
    },

    /**
     * 获取节点的文本数据
     * @return {String}
     */
    getText: function() {
      return this.data.text || null;
    },

    getDesigner: function() {
      return this._designer;
    },

    clone: function() {
      var cloned = new DesignerLine(this._designer);

      cloned.startNode = this.startNode;
      cloned.endNode = this.endNode;
      cloned.startIndex = this.startIndex;
      cloned.endIndex = this.endIndex;

      var newId = cloned.data.id;
      cloned.data = utils.extend(true, {}, this.data);
      cloned.data.id = newId;

      return cloned;
    }
  });


  // 连线提供方
  var _lineProviders = {};

  function register(name, provider) {
    _lineProviders[name] = provider;
  }

  utils.extend(DesignerLine, {
    register: register
  });

  kity.extendClass(Designer, {
    _initLineGroup: function(designer, options) {
      this._lineContainer = new kity.Group().setId(utils.uuid('designer_line_group'));
      this.getRenderContainer().prependShape(this._lineContainer);
    },

    getLineContainer: function() {
      return this._lineContainer;
    },

    getLines: function() {
      if (this._lines) {
        return this._lines;
      }
      return this._lines = [];
    },

    /**
     * @method createLine
     * @description 创建节点之间的连线
     * @param  {DesignerNode}
     * @param  {Point}/{DesignerNode} 连线的起始位置或者连线的结束节点。
     *    操作中产生的连线都会指定起始位置。
     *    导入时创建的连线均指定结束节点，同时被导入的Json中不包含连线位置的信息。
     */
    createLine: function(startNode, endNodeOrstartPos, startIndex, endIndex) {
      var line = new DesignerLine(this);
      line.startNode = startNode;
      if (endNodeOrstartPos.getType() === 'DesignerNode') {
        line.endNode = endNodeOrstartPos;
      } else {
        var outlineManager = startNode.getOutlineManager();
        line.startPos = endNodeOrstartPos;
        line.startVector = outlineManager.getOutVector(endNodeOrstartPos);
        line.startIndex = OutlineManager.getOutVectorIndex(line.startVector);
      }
      //连线与节点相交的点。目前节点的连出连入点是受限制的四个点。
      // todo:节点边界任意位置均可连出连入
      // var line = {
      //     connection: connection,
      //     arrow: arrow,
      //     startPos: pos,
      //     startNode: startNode,
      //     startVector: startVector,
      //     endPos: null,
      //     endNode: null,
      //     endVector: null
      // };
      startNode.getStartLines().push(line);
      if (line.endNode) {
        endNodeOrstartPos.getEndLines().push(line);
      }

      this.getLineContainer().addShape(line.getContainer());

      this.getLines().push(line);
      return line;
    },

    removeLine: function(line) {
      var lines = this.getLines();

      utils.safeRemoveArrayItem(lines, line);

      var startLines = line.startNode.getStartLines();
      utils.safeRemoveArrayItem(startLines, line);
      if (line.endNode) {
        var endLines = line.endNode.getEndLines();
        utils.safeRemoveArrayItem(endLines, line);
      }
      this.getLineContainer().removeShape(line.getContainer());
    },

    addLine: function(line) {
      if (!line) return;
      this.getLines().push(line);

      var startLines = line.startNode.getStartLines();
      startLines.push(line);
      if (line.endNode) {
        line.endNode.getEndLines().push(line);
      }
      this.getLineContainer().addShape(line.getContainer());
      return this;
    },

    /**
     * 刷新线
     * @param  {DesignerNode} 刷新线的节点
     * @param  {DesignerLine|string}
     *    {DesignerLine} optional 未指定，则刷新该点所有的线
     *    {string} 'Start'/'End' 刷新该点发出的线/刷新该点结束的线
     */
    updateLine: function(node, line) {
      if (node && node.getType() === 'DesignerLine') {
        line = node;
        node = line.startNode;
      }
      var designer = this,
        provider = node.getLineProvider(),
        vectorType,
        posType,
        vertexType,
        lowerType;

      if (line) {
        if (utils.isString(line)) {
          updateNodeLines(node, line);
        } else {
          provider(line);
          designer.renderLine(line);
        }
        return;
      }
      //刷新全部连线
      updateNodeLines(node, 'Start');
      updateNodeLines(node, 'End');

      function updateNodeLines(target, type) {
        lowerType = type.toLowerCase();
        vectorType = lowerType + 'Vector';
        posType = lowerType + 'Pos';
        vertexType = lowerType === 'start' ? 'getVertexOut' : 'getVertexIn';
        target['get' + type + 'Lines']().forEach(function(line) {
          if (line[vectorType]) {
            line[posType] = target[vertexType](line[vectorType]);
          }
          provider(line);
          designer.renderLine(line);
        });
      }
    },
    /**
     * 刷新全部线
     */
    updateAllLines: function() {
      this.getLines().forEach(function(line) {
        this.updateLine(line);
      }, this);
      return this;
    }
  });

  Designer.registerInitHook(function() {
    this._initLineGroup();
    /*noderender 初始化线
    因为layoutapply目前只在importJson中触发
    不能监听layoutapply。
        如果每个节点都刷新其开始和结束的线，那么每条线都会被刷新两次
        如果每个节点只刷新开始或者结束之一，那么线的另一头的位置可能改变
    所以必须监听全部节点都layout结束的事件
    layoutallfinish
    */
    this.on('layoutallfinish', function(e) {
      this.updateAllLines();
      this.fire('contentchange');
    });
  });

  kity.extendClass(DesignerNode, {
    /**
     * @private
     * @method getLine()
     * @for DesignerNode
     * @description 获取当前节点的连线类型
     *
     * @grammar getLine() => {string}
     */
    getLine: function() {
      return this.data.line || 'inflectionLockable';
    },

    getLineProvider: function() {
      return _lineProviders[this.getLine()];
    },
    /**
     * @public
     * @method getStartLines()
     * @for DesignerNode
     * @description 获取在当前节点开始的连线集合
     *
     * @grammar getStartLines() => {Array}
     */
    getStartLines: function() {
      if (this._startLines) {
        return this._startLines;
      }
      return this._startLines = [];
    },
    /**
     * @public
     * @method getEndLines()
     * @for DesignerNode
     * @description 得到在当前节点结束的连线集合
     *
     * @grammar getEndLines() => {Array}
     */
    getEndLines: function() {
      if (this._endLines) {
        return this._endLines;
      }
      return this._endLines = [];
    },
    updateLine: function(line, excludeChilren) {
      this.getDesigner().updateLine(this, line);
      if(!excludeChilren){
        this.children.forEach(function(child){
          child.updateLine(line);
        });
      }
      return this;
    },
  });

  module.exports = DesignerLine;
});
