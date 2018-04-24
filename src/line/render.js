/**
 * @fileOverview
 *
 * 定义line Renderer
 * 每次渲染中可能改变的部分作为Renderer
 */
define(function(require, exports, module) {
  var kity = require('../core/kity');
  var utils = require('../core/utils');
  var Designer = require('../core/designer');
  var Line = require('../core/line');

  var Renderer = kity.createClass('LineRenderer', {
    //返回RenderShape;调用出renderer.setRenderShape(renderer.create())
    create: function() {
      throw new Error('Not Implement:LineRenderer.create');
    },
    shouldRender: function(line) {
      return true;
    },
    shouldDraw: function(line) {
      return true;
    },
    update: function(shape, line, box) {
      if (this.shouldDraw(shape, line)) {
        this.draw(shape, line);
      }
      return this.place(shape, line, box);
    },
    draw: function(shape, line) {
      throw new Error('Not Implement:LineRenderer.draw');
    },
    place: function(shape, line, box) {
      throw new Error('Not Implement:Renderer.place');
    }
  });

  var _width = 20;
  function fix(p1, p2, position) {
    if (p1.x === p2.x) {
      if (Math.abs(position.x - p1.x) > _width) {
        if (position.x > p1.x) {
          position.x = p1.x + _width;
        } else {
          position.x = p1.x - _width;
        }
      }
    } else {
      if (Math.abs(position.y - p1.y) > _width) {
        if (position.y > p1.y) {
          position.y = p1.y + _width;
        } else {
          position.y = p1.y - _width;
        }
      }
    }
  }
  function check(p1, p2, axis, position) {
    var min,
      max;
    if (p1[axis] < p2[axis]) {
      min = p1[axis];
      max = p2[axis];
    } else {
      min = p2[axis];
      max = p1[axis];
    }
    if (position[axis] >= min && position[axis] <= max) {
      return true;
    }
    return false;
  }

  function restrict(inflections, position) {
    var pos1,
      pos2;
    for (var i = 0, l = inflections.length - 1; i < l; i++) {
      pos1 = inflections[i];
      pos2 = inflections[i + 1];
      if (check(pos1, pos2, 'x', position) || check(pos1, pos2, 'y', position)) {
        fix(pos1, pos2, position);
        return position;
      }
    }
  }

  function createDesignerExtendtion() {
    function createLineRenderer(designer, registered) {
      if (designer._lineRenderers) return;

      var renderers = [];

      ['center', 'left', 'right', 'top', 'bottom', 'outline', 'outside'].forEach(function(section) {
        var before = 'before' + section;
        var after = 'after' + section;

        if (registered[before]) {
          renderers = renderers.concat(registered[before]);
        } else if (registered[section]) {
          renderers = renderers.concat(registered[section]);
        } else if (registered[after]) {
          renderers = renderers.concat(registered[after]);
        }
      });

      //node renderer是每个node保存自己的renderer
      //line renderer不再每条line都保存自己的renderer，而是在designer中保存。
      //因为line不太可能（至少目前是这样）出现每条line的renderer不同的情况
      //节省不必要的内存开销
      designer._lineRenderers = renderers.map(function(Renderer) {
        return new Renderer();
      });
    }

    function layoutLineContainer(line) {
      var offset,
        id,
        position;
      var data = line.getData();

      if (data.x) {
        position = {
          x: parseProportion('x'),
          y: parseProportion('y')
        };
      } else {
        //默认显示在中点
        position = utils.midPoint(line.startPos, line.endPos);
      }
      offset = restrict(line.inflections, utils.roundXY(position));
      if (offset) {
        //修正offset
        offset.x -= line._contentBox.width / 2;
        offset.y -= line._contentBox.height / 2;
      } else {
        offset = line.inflections[0];
      }

      line.getRenderContainer().setTranslate(offset.x, offset.y);

      function parseProportion(axis) {
        return line.startPos[axis] + (line.endPos[axis] - line.startPos[axis]) * data[axis];
      }
    }
    return {
      renderLine: function(line) {
        var rendererClasses = this._lineRendererClasses;
        var latestBox;

        createLineRenderer(this, rendererClasses);

        if (!line._renderShapes) {
          line._renderShapes = [];
        }

        line._contentBox = new kity.Box();
        this._lineRenderers.forEach(function(renderer, i) {
          if (renderer.shouldRender(line)) {
            if (!line._renderShapes[i]) {
              line._renderShapes[i] = renderer.create(line);
              if (renderer.container === 'lineGroup') {
                line.group.prependShape(line._renderShapes[i]);
              } else {
                if (renderer.bringToBack) {
                  line.getRenderContainer().prependShape(line._renderShapes[i]);
                } else {
                  line.getRenderContainer().appendShape(line._renderShapes[i]);
                }
              }
            }

            line._renderShapes[i].setVisible(true);

            latestBox = renderer.update(line._renderShapes[i], line, line._contentBox);
            if (typeof latestBox === 'function') {
              latestBox = latestBox();
            }
            //合并渲染区域 记录渲染区域的位置和大小
            if (latestBox) {
              line._contentBox = line._contentBox.merge(latestBox);
            }
          }
          //不应该渲染，但是渲染图形已经创建，则将其隐藏。
          else if (line._renderShapes[i]) {
            line._renderShapes[i].setVisible(false);
          }
        });

        layoutLineContainer(line);
      }
    };
  }

  kity.extendClass(Designer, createDesignerExtendtion());

  kity.extendClass(Line, {
    render: function() {
      this.getDesigner().renderLine(this);
      return this;
    },
    getContentBox: function() {
      return this._contentBox || new kity.Box();
    }
  });

  module.exports = Renderer;

});
