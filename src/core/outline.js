/**
 * @fileOverview
 *
 * 边线基类
 */
define(function(require, exports, module) {
  var kity = require('./kity');
  var utils = require('./utils');

  var Designer = require('./designer');
  var DesignerNode = require('./node');
  var Module = require('./module');

  var uuid = utils.uuid;

  var _outline = {};

  function registerOutline(name, outlineType) {
    _outline[name] = outlineType;
  }

  Designer.registerOutline = registerOutline;

  function generateShapeControllerGroup(designer, group) {
    var Rect = kity.Rect;
    var shape,
      i;
    var background = designer.getStyle('background');
    for (i = 0; i < 4; i++) {
      shape = new Rect(8, 8, 0, 0);
      shape
        .stroke('black', 1)
        .setId(uuid('control_point'))
        .fill(background);

      group.addShape(shape);
    }
    return group;
  }

  function generateLinePointsGroup(designer, group, cursor) {
    var Circle = kity.Circle;
    var shape,
      i;
    var background = designer.getStyle('background');

    for (i = 0; i < 4; i++) {
      shape = new Circle(4, 0, 0);
      shape
        .stroke('black', 1)
        .setId(uuid('lpoint'))
        .fill(background);
      if (cursor) {
        shape.setAttr('cursor', 'crosshair');
      }
      group.addShape(shape);
    }
    return group;
  }
  //得到控制点
  function getControlPoints(box) {
    var x = box.x;
    var y = box.y;
    var x2 = x + box.width;
    var y2 = y + box.height;
    var points = [];
    points.push([x, y]);
    points.push([x2, y]);
    points.push([x2, y2]);
    points.push([x, y2]);
    return points;
  }
  //得到推荐的连线引出点
  function getLinePoints(box) {
    var Point = kity.Point;
    var x = Math.round(box.x),
      y = Math.round(box.y),
      cx = Math.round(box.cx),
      cy = Math.round(box.cy);
    var points = [];
    points.push(new Point(cx, y)); //上
    points.push(new Point(Math.round(box.right), cy)); //右
    points.push(new Point(cx, Math.round(box.bottom))); //下
    points.push(new Point(x, cy)); //左
    return points;
  }

  kity.extendClass(Designer, {
    getOutline: function(name) {
      return _outline[name];
    },
    getOutlineShapes: function() {
      return _outline;
    },
    getOutlineManager: function(name) {
      if (!_outline[name]) {
        throw new Error('unregistered outline shape.');
      }
      return new _outline[name]();
    },
    getOutlineManagerClass: function(name) {
      if (!_outline[name]) {
        throw new Error('unregistered outline shape.');
      }
      return _outline[name];
    },
    /**
     * @method getShapeControllerGroup
     *
     * 未使用。目前节点大小是自适应的。不能拖拽改变大小
     */
    getShapeControllerGroup: function() {
      if (this._shapeControllerGroup) {
        // 每个designer唯一
        return this._shapeControllerGroup;
      }
      var group = new kity.Group().setId(uuid('shape_controller_group'));
      return this._shapeControllerGroup = generateShapeControllerGroup(this, group);
    },
    /**
     * @method getShapeControllerGroup
     *
     * 得到包含推荐的连线点的group
     * 拖拽连线的时候，当鼠标进入结束节点时显示。
     */
    getLinePointsGroup: function(index) {
      index = index || 0;
      this._linePointsGroup = this._linePointsGroup || [];
      if (this._linePointsGroup && this._linePointsGroup[index]) {
        //每个designer可以有多个
        return this._linePointsGroup[index];
      }
      var group = new kity.Group().setId(uuid('lpoints_group'));
      return this._linePointsGroup[index] = generateLinePointsGroup(this, group, index === 0);
    }
  });

  kity.extendClass(DesignerNode, {
    getOutlineManager: function() {
      if (this._outlineManager) {
        return this._outlineManager;
      }
      return this._outlineManager = this.getDesigner().getOutlineManager(
        this.getData('outlineType')
      );
    },
    getInVector: function(pos) {
      return this.getOutlineManager().getInVector(pos);
    },
    getOutVector: function(pos) {
      return this.getOutlineManager().getOutVector(pos);
    },
    getInVectorIndex: function(vector) {
      return OutlineManager.getInVectorIndex(vector);
    },
    getOutVectorIndex: function(vector) {
      return OutlineManager.getOutVectorIndex(vector);
    },
    getVertexIn: function(vector) {
      return this.getOutlineManager().getLinePoints()[OutlineManager.getInVectorIndex(vector)];
    },
    getVertexOut: function(vector) {
      return this.getOutlineManager().getLinePoints()[OutlineManager.getOutVectorIndex(vector)];
    }
  });

  var currentLineGroup1Container;

  var OutlineManager = kity.createClass('OutlineManager', {
    //传node 正常的使用
    //传designer 在生成相应的button时使用
    create: function(node) {
      throw new Error('Not Implement. OutlineManager.create');
    },
    doUpdate: function() {
      throw new Error('Not Implement. OutlineManager.doUpdate');
    },
    update: function(outline, node, box) {
      box = this.doUpdate(outline, node, box);

      var selected = node.isSelected();
      this.updateColor(node, outline, selected);

      if ((node.getData('outlineType') !== 'userTask' || node.getData('mode') === 'default') && selected) {
        //this.showShapeController(node, outline);
        this.showLinePoints(node, outline);
      } else {
        //this.hideShapeController(node);
        this.hideLinePoints(node);
      }
      return box;
    },
    updateColor: function(node, outline, selected) {
      if (typeof (outline) === 'boolean') {
        selected = outline;
        outline = this._outlineShape;
      }
      //改变边框的颜色
      if (outline.getType() === 'Group') {
        var shapes = outline.getShapes();
        if (shapes && shapes.length > 0) {
          shapes[0].stroke(
            node.getStyle(selected ? 'selected-stroke' : 'normal-stroke'),
            node.getStyle(selected ? 'selected-stroke-width' : 'stroke-width')
          );
        }
      } else {
        outline.stroke(
          node.getStyle(selected ? 'selected-stroke' : 'normal-stroke'),
          node.getStyle(selected ? 'selected-stroke-width' : 'stroke-width')
        );
      }
    },
    showShapeController: function(node, outlineShape) {
      // var realControlPoints = designer.getControlPoints();
      // var realLinePoints = designer.getLinePoints();
      var box = outlineShape.getBoundaryBox();
      var shapeControllerGroup = node.getDesigner().getShapeControllerGroup();
      node.getRenderContainer().appendShape(shapeControllerGroup);
      var controlPoints = getControlPoints(box);
      var items = shapeControllerGroup.getItems();
      for (var i = 0; i < 4; i++) {
        items[i].setPosition(controlPoints[i]);
      }
    },
    hideShapeController: function(node) {
      var container = node.getRenderContainer();
      var designer = node.getDesigner();
      try {
        //可能在showController中已经被移除，此时调用removeItem会报错
        container.removeItem(designer.getShapeControllerGroup());
      } catch (e) {
        var items = container.getItems();
        var index = items.indexOf(designer.getShapeControllerGroup());
        if (index !== -1) {
          items.splice(index, 1);
        }
      }
    },
    showLinePoints: function(node, outlineShape, index) {
      var box = outlineShape.getBoundaryBox();
      var linePointsGroup = node.getDesigner().getLinePointsGroup(index);

      currentLineGroup1Container = node.getRenderContainer().appendShape(linePointsGroup);
      var items = linePointsGroup.getItems();
      var linePoints = getLinePoints(box);
      var filter = node.getData('linePointsFilter') || 15;
      linePointsGroup.eachItem(function(i, item) {
        item.setCenter(linePoints[i]);
        if ((filter & Math.pow(2, i)) === 0) {
          item.setVisible(false);
        } else {
          item.setVisible(true);
        }
      });
    },
    hideLinePoints: function(node, index) {
      var container = node.getRenderContainer();
      var designer = node.getDesigner();
      var linePointsGroup = designer.getLinePointsGroup(index);
      try {
        container.removeItem(linePointsGroup);
      } catch (e) {
        var items = container.getItems();
        var i = items.indexOf(linePointsGroup);
        if (i !== -1) {
          items.splice(i, 1);
        }
      }
      //在同一次render中，若先执行了showLinePoints，
      //后执行的hideLinePoints，就会导致
      //linePointsGroup.container === undefined
      //此时重新把正确的container赋给linePointsGroup
      if (linePointsGroup.container === undefined) {
        linePointsGroup.container = currentLineGroup1Container;
      }
    },
    getOutlineShape: function() {
      return this._outlineShape;
    },
    getLinePoints: function() {
      var points = getLinePoints(this.getOutlineBox());

      return points;
    },
    getOutlineBox: function() {
      var matrix = this._node.getGlobalLayoutTransformPreview();
      return matrix.transformBox(this._outlineShape.getBoundaryBox());
    },
    /**
     * @public
     * @method getOutVector()
     * @for OutlineManager
     * @description 获取某点所在边线连出线的方向.
     * 基类的默认实现，默认为圆形边线。
     * @return {kity.Vector}
     *
     * @grammar getOutVector() => {kity.Vector}
     */
    getOutVector: function(pos) {
      if (!pos || !this._outlineShape) return;
      var box = this.getOutlineBox();

      var mid = utils.midPoint(box, {
        x: box.x + box.width,
        y: box.y + box.height
      });

      var vector = kity.Vector.fromPoints(mid, pos);
      var angle = vector.getAngle();
      if (angle < 0) {
        angle += 360;
      }
      if (angle <= 45 || angle >= 315) {
        return new kity.Vector(1, 0); //'left';
      }
      if (angle > 45 && angle <= 135) {
        return new kity.Vector(0, 1); //'up';
      }
      if (angle > 135 && angle <= 225) {
        return new kity.Vector(-1, 0); //'right';
      }
      return new kity.Vector(0, -1); //'down';
    },
    getInVector: function(pos) {
      return this.getOutVector(pos).reverse();
    },
  });

  utils.extend(OutlineManager, {
    getOutVectorIndex: function(vector) {
      if (vector.x === 0) {
        if (vector.y > 0) {
          return 2; //down
        } else {
          return 0; //up
        }
      } else {
        if (vector.x > 0) {
          return 1; //right
        } else {
          return 3; //left
        }
      }
    },
    //根据进入向量的方向，判断进入点在结束节点的index
    getInVectorIndex: function(vector) {
      if (vector.x === 0) {
        if (vector.y > 0) {
          return 0;
        } else {
          return 2;
        }
      } else {
        if (vector.x > 0) {
          return 3;
        } else {
          return 1;
        }
      }
    },
    getInVectorFromIndex: function(index) {
      return this.getOutVectorFromIndex(index).reverse();
    },
    getOutVectorFromIndex: function(index) {
      switch (index.toString()) {
        case '0':
          return new kity.Vector(0, -1);
        case '1':
          return new kity.Vector(1, 0);
        case '2':
          return new kity.Vector(0, 1);
        default:
          return new kity.Vector(-1, 0);
      }
    },
  });

  module.exports = OutlineManager;
});
