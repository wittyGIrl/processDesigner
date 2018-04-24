/**
 * @fileOverview
 *
 * 定义可锁定拐点的连线
 * 默认以x,y方向的直线进行连接，同时提供可锁定的功能
 *
 * 锁定某一个拐点，那么这个拐点在拖拽节点时连线重新计算的时候不会改变位置。
 */
define(function (require, module, exports) {
  var kity = require('../core/kity');
  var utils = require('../core/utils');

  var DesignerLine = require('../core/line');
  var OutlineManager = require('../core/outline');

  var Vector = kity.Vector;
  var Point = kity.Point;
  var round = utils.roundXY;

  var MIN_OFFSET = 12;

  /**
   * @method getSideForVector()
   * @param vector {Vector}
   * @param side {bool} true返回模更大的分量；false返回模更小的分量
   * @return {Vector} 方向沿x或y轴
   * @for
   * @description 得到一个向量沿某一坐标轴的分量
   */
  function getSideForVector(vector, side) {
    if (Math.abs(vector.x) > Math.abs(vector.y)) {
      return side ? new Vector(vector.x, 0) : new Vector(0, vector.y);
    } else {
      return side ? new Vector(0, vector.y) : new Vector(vector.x, 0);
    }
  }

  /**
   * @method initVectorWithAnotherVector()
   * @param direction {Vector} 方向向量。开始点指向结束点的向量
   * @param vector {Vector} 另一点的方向
   * @param notVector {Vector} 不允许的方向。防止线回头
   * @return {Vector|bool} 方向沿x或y轴。返回false时，意味着开始和结束点可以直接连接，中间不存在拐点
   * @for
   * @description 根据方向向量，另一点的方向，此点不允许的方向，得到此点的方向
   *
   */
  function initVectorWithAnotherVector(direction, vector, notVector) {
    var retVector;
    if (direction.x === 0 || direction.y === 0) {
      var isParallelDirectionAndEndVector = utils.isParallel(direction,
        vector);
      if (isParallelDirectionAndEndVector === 1) {
        //未指定开始方向，且方向向量和结束向量同向，那么直接连接，没有拐点。
        return false; //[startPos];
      }
      //方向向量和结束向量反向
      else if (isParallelDirectionAndEndVector === -1) {
        retVector = new Vector(direction.y, direction.x);
        var isParallelStartAndNotStart = utils.isParallel(vector, notVector);
        if (isParallelStartAndNotStart === 1) {
          retVector = notVector.reverse();
        }
      } else {
        retVector = notVector.reverse();
      }
    } else {
      if (notVector.x === 0) {
        if (utils.isSameSign(direction.y, notVector.y)) {
          retVector = new Vector(direction.x, 0);
        } else {
          retVector = getSideForVector(direction, true);
        }
      } else {
        if (utils.isSameSign(direction.x, notVector.x) === true) {
          retVector = new Vector(0, direction.y);
        } else {
          retVector = getSideForVector(direction, true);
        }
      }
    }
    return retVector;
  }

  /**
   *
   * @method findPath()
   * @param startPos {Point}
   * @param startVector {Vector} 开始点的发出方向
   * @param endPos {Point}
   * @param endVector {Vector} 结束点进入方向。 不限方向时为零向量
   * @param notStartVector {Vector} 开始点不允许的方向。 当开始方向为零向量时使用
   * @return 拐点的数组(不包含起始点和结束点)
   * @for
   * @description 寻路，根据开始点，开始方向，结束点，结束方向，
   *  找到使用直线将两点进行连接时中间需要的拐点.
   *  startVector和endVector的方向均为沿x,y轴的方向
   * @grammar findPath() => {Array}
   */

  function findPath(startPos, startVector, endPos, endVector,
    notStartVector, notEndVector, includeStartPos) {

    //方向向量
    var direction = round(Vector.fromPoints(startPos, endPos));
    if (utils.isZeroVector(direction)) return [];

    var startIsZeroVector = utils.isZeroVector(startVector);
    // 未指定结束向量时，根据startVector(若不存在，则根据notStartVector)和notEndVector,确定endVector
    if (endVector === null) {
      if (startIsZeroVector) {
        endVector = getSideForVector(direction, false);
        if (utils.isParallel(endVector, notEndVector) === 1) {
          endVector = getSideForVector(direction, true);
        }
      } else {
        endVector = initVectorWithAnotherVector(direction, startVector,
          notEndVector);
        if (endVector === false) {
          return includeStartPos === false ? [] : [startPos];
        }
      }
    }
    //未指定开始方向时，根据endVector和notStartVector确定开始方向
    if (startIsZeroVector) {
      startVector = initVectorWithAnotherVector(direction, startVector,
        notStartVector);
      if (startVector === false) {
        return includeStartPos === false ? [] : [startPos];
      }
    }

    //当startVector和notStartVector反向时，startPos不是拐点
    if (includeStartPos === undefined) {
      includeStartPos = notStartVector && utils.isParallel(startVector,
        notStartVector) !== -1;
    }

    var point, movement;
    var angle = utils.getAngle(direction, startVector);

    //夹角为锐角
    if (angle < 90) {
      var isParallel = utils.isParallel(startVector, endVector);
      if (angle === 0) {
        if (isParallel === 1) {
          return includeStartPos ? [startPos] : [];
        } else {
          movement = startVector.normalize(MIN_OFFSET);
        }
      } else {
        if (startVector.x === 0) {
          movement = startVector.normalize(Math.abs(direction.y));
        } else {
          movement = startVector.normalize(Math.abs(direction.x));
        }
        if (isParallel === 1 && !utils.isZeroVector(endVector)) {
          movement = movement.multipy(0.5);
        }
      }
    } else {
      movement = startVector.normalize(MIN_OFFSET);
    }

    movement = round(movement);

    if (angle !== 0 && utils.isZeroVector(movement)) {
      if (startVector.x === 0) {
        point = new Point(startPos.x, endPos.y);
      } else {
        point = new Point(endPos.x, startPos.y);
      }
    } else {
      point = new Point(startPos.x + movement.x, startPos.y + movement.y);
    }

    if (point.x === endPos.x && point.y === endPos.y) {
      return includeStartPos ? [startPos] : [];
    }
    var inflections = [];

    if (includeStartPos) {
      inflections.push(startPos);
    }
    return inflections.concat(findPath(point, new Vector(0, 0), endPos,
      endVector, startVector.reverse()));
  }

  DesignerLine.register('inflectionLockable', function (line) {
    if (!line) return;
    initLine(line);

    /**
     * @method getInflectionsWithOldValue()
     * @return {Vector|bool} 方向沿x或y轴
     * @for
     * @description 得到拐点数组。
     *  对于存在锁定拐点的情况：
     *      findPath 开始点->锁定拐点中的第一个
     *      + 锁定拐点数组
     *      + findPath 锁定拐点中的最后一个->结束点
     */
    function getInflectionsWithOldValue() {
      var firstLockedIndex, lastLockedIndex;
      for (i = 0, l = oldInflections.length; i < l; i++) {
        if (oldInflections[i].locked) {
          lastLockedIndex = i;
          if (firstLockedIndex === undefined) {
            firstLockedIndex = lastLockedIndex;
          }
        }
      }
      if (firstLockedIndex !== undefined) {
        var fixedPos = oldInflections.slice(firstLockedIndex,
          lastLockedIndex + 1);

        inflections = findPath(
          newStartPos,
          newStartVector,
          oldInflections[firstLockedIndex],
          new Vector(),
          startVector.reverse(),
          fixedPos.length > 1 ? Vector.fromPoints(oldInflections[
            firstLockedIndex], fixedPos[1]) : new Vector()
        );

        inflections = inflections.concat(fixedPos);

        inflections = inflections.concat(
          findPath(
            oldInflections[lastLockedIndex],
            new Vector(),
            newEndPos,
            newEndVector,
            inflections.length > 1 ? Vector.fromPoints(inflections[
              inflections.length - 1], inflections[inflections.length -
              2]) : new Vector(),
            endVector.reverse(),
            false
          )
        );
      } else {
        // try{
        inflections = findPath(
          newStartPos, newStartVector,
          newEndPos, newEndVector,
          startVector.reverse(),
          endVector.reverse()
        );
        // }
        // catch(w){
        //     console.log(line.connection.getId()+'path error: x:'+newStartPos.x+' y:'+newStartPos.y+'   x: '+newEndPos.x+' y: '+newEndPos.y+ '\n'+JSON.stringify(line));
        // }
      }
    }

    var startPos = line.startPos;
    var endPos = line.endPos;
    var startVector = line.startVector;
    var endVector = line.endVector || new Vector();

    var inflections = line.originalInflecions;
    var newStartPos = startPos,
      newEndPos = endPos;
    var newStartVector = startVector,
      newEndVector = endVector;

    //连线的开始和结束位置附近添加默认拐点
    var startMovement = round(startVector.normalize(MIN_OFFSET));
    newStartPos = new Point(startPos.x + startMovement.x, startPos.y +
      startMovement.y);
    newStartVector = new Vector();
    if (!utils.isZeroVector(endVector)) {
      var endMovement = round(endVector.normalize(MIN_OFFSET));
      newEndPos = new Point(endPos.x - endMovement.x, endPos.y -
        endMovement.y);
      newEndVector = null;
    }

    var i, l;
    if (!inflections) {
      var oldInflections = line.inflections;
      if (oldInflections && oldInflections.length > 0) {
        getInflectionsWithOldValue();
      } else {
        inflections = findPath(
          newStartPos, startVector,
          newEndPos, newEndVector,
          startVector.reverse(),
          endVector.reverse()
        );
      }
    } else {
      inflections.forEach(function (inflection) {
        round(inflection);
      });
      //清空originalInflexions
      line.originalInflecions = null;
    }

    var pathData = ['M', startPos.x, startPos.y];
    if (utils.isZeroVector(newStartVector)) {
      //newStartPos，newEndPos放入inflections。一起存储到line的inflections中,在拖拽线时有用
      if (
        inflections.length === 0 ||
        newStartPos.x !== inflections[0].x ||
        newStartPos.y !== inflections[0].y
      ) {
        inflections.unshift(newStartPos);
      }
      pathData.push('L');
      pathData.push(newStartPos.x);
      pathData.push(newStartPos.y);
      line.newStartPos = new Point(newStartPos.x, newStartPos.y);
    }
    if (newEndVector === null) {
      if (
        inflections.length === 0 ||
        newEndPos.x !== inflections[inflections.length - 1].x ||
        newEndPos.y !== inflections[inflections.length - 1].y
      ) {
        inflections.push(newEndPos);
      }
    }
    for (i = 0, l = inflections.length; i < l; i++) {
      pathData.push('L');
      var point = inflections[i];
      pathData.push(point.x);
      pathData.push(point.y);
    }

    if (newEndVector === null) {
      pathData.push('L');
      pathData.push(newEndPos.x);
      pathData.push(newEndPos.y);
      line.newEndPos = new Point(newEndPos.x, newEndPos.y);
    }

    pathData = pathData.concat(['L', endPos.x, endPos.y]);
    line.connection.setPathData(pathData);

    line.inflections = inflections;

    //绘制箭头
    var x = endPos.x;
    var y = endPos.y;
    var arrowDiretion = Vector.fromPoints(
      inflections.length > 0 ?
      inflections[inflections.length - 1] : startPos,
      endPos
    );
    if (arrowDiretion.x === 0) {
      line.arrow.setPathData([
        'M', x, y,
        'L', x + 5 * (arrowDiretion.x > 0 ? 1 : -1), y - 12 * (
          arrowDiretion.y > 0 ? 1 : -1),
        'L', x - 5 * (arrowDiretion.x > 0 ? 1 : -1), y - 12 * (
          arrowDiretion.y > 0 ? 1 : -1),
        'z'
      ]);
    } else {
      line.arrow.setPathData([
        'M', x, y,
        'L', x - 12 * (arrowDiretion.x > 0 ? 1 : -1), y + 5 * (
          arrowDiretion.y > 0 ? 1 : -1),
        'L', x - 12 * (arrowDiretion.x > 0 ? 1 : -1), y - 5 * (
          arrowDiretion.y > 0 ? 1 : -1),
        'z'
      ]);
    }
  });

  /**
   * @method initVectorWithAnotherVector()
   * @param line {DesignerLine} 线
   * @return
   * @for
   * @description 初始化在绘制线时所必须的相关属性
   *
   */
  function initLine(line) {
    var actionId = line.getData('actionId');
    if (actionId) {
      var node = line.startNode;
      var items = node.pinsGroup.pinsGroup.getItems(),
        item, startPos;
      for (var i = 0, l = items.length; i < l; i++) {
        item = items[i];
        if (item.getData('actionId') === actionId) {
          startPos = node.getGlobalLayoutTransformPreview().transformPoint(item.getCenter());
          break;
        }
      }
      if (startPos) {
        line.startPos = startPos;
        line.startVector = new Vector(1, 0);
        if(line.endNode){
          line.endPos = line.endNode.getOutlineManager().getLinePoints()[line
            .endIndex];
          line.endVector = OutlineManager.getInVectorFromIndex(line.endIndex);
        }
        return;
      }
    }

    if (isNaN(line.startIndex)) {
      //线只有开始节点和结束节点，并没有指定在节点边线的哪个位置。
      //这种情况只可能是直接编写xml产生的。设计器本身不会产生这样的线
      //所以按照默认的方式来直接指定开始和结束的具体位置即可
      //默认连线开始方向向右，结束方向向右
      line.startVector = new Vector(1, 0);
      line.startIndex = OutlineManager.getOutVectorIndex(line.startVector);
      line.startPos = line.startNode.getOutlineManager().getLinePoints()[
        line.startIndex];

      line.endVector = new Vector(1, 0);
      line.endIndex = OutlineManager.getInVectorIndex(line.endVector);
      line.endPos = line.endNode.getOutlineManager().getLinePoints()[line.endIndex];
    } else if (!line.startPos) {
      //从json中导入的线，只保存了开始结束位置的index
      //根据index得到相应的pos,vector
      line.startPos = line.startNode.getOutlineManager().getLinePoints()[
        line.startIndex];
      line.startVector = OutlineManager.getOutVectorFromIndex(line.startIndex);

      line.endPos = line.endNode.getOutlineManager().getLinePoints()[line.endIndex];
      line.endVector = OutlineManager.getInVectorFromIndex(line.endIndex);
    }
  }
});
