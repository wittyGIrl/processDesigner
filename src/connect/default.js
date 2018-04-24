/**
 * @fileOverview***未使用***
 *
 * 定义默认连线方式
 *  未使用
 */
define(function(require, module, exports){
    var kity = require('../core/kity');
    var utils = require('../core/utils');

    var DesignerLine = require('../core/line');
    var OutlineManager = require('../core/outline');

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
    var Vector = kity.Vector;
    var Point = kity.Point;
    function findPath(startPos, startVector, endPos, endVector, notStartVector){
        var MIN_OFFSET = 12;
        //方向向量
        var direction = Vector.fromPoints(startPos, endPos);

        var inflections = [];

        //未指定开始方向
        if(utils.isZeroVector(startVector)){
            if(direction.x === 0 || direction.y === 0){
                var isParallelDirectionAndEndVector = utils.isParallel(direction, endVector);
                if(isParallelDirectionAndEndVector === 1){
                    //未指定开始方向，且方向向量和结束向量同向，那么直接连接，没有拐点。
                    return [startPos];
                }
                else if(isParallelDirectionAndEndVector === -1){
                    startVector = new Vector(direction.y, direction.x);
                    var isParallelStartAndNotStart = utils.isParallel(startVector, notStartVector);
                    if(isParallelStartAndNotStart === 1){
                        startVector = notStartVector.reverse();
                    }
                }
                else{
                    startVector = notStartVector.reverse();
                }
            }
            else{
                if(notStartVector.x === 0){
                    if(utils.isSameSign(direction.y, notStartVector.y)){
                        startVector = new Vector(direction.x, 0);
                    }
                    else{
                        if(Math.abs(direction.x) > Math.abs(direction.y)){
                            startVector = new Vector(direction.x, 0);
                        }
                        else{
                            startVector = new Vector(0, direction.y);
                        }
                    }
                }
                else{
                    if(utils.isSameSign(direction.x, notStartVector.x) === true){
                        startVector = new Vector(0, direction.y);
                    }
                    else{
                        if(Math.abs(direction.x) > Math.abs(direction.y)){
                            startVector = new Vector(direction.x, 0);
                        }
                        else{
                            startVector = new Vector(0, direction.y);
                        }
                    }
                }
            }
        }
        //当startVector和notStartVector反向时，startPos不是拐点
        var flagInCludeStartPos = notStartVector && utils.isParallel(startVector, notStartVector) !== -1;

        var point,movement ;
        var angle = utils.getAngle(direction, startVector);

        //夹角为锐角
        if(angle < 90){
            var isParallel = utils.isParallel(startVector, endVector);
            if(angle === 0){
                if(isParallel === 1){
                    return flagInCludeStartPos ? [startPos] : [];
                }
                else{
                    movement = startVector.normalize(MIN_OFFSET);
                }
            }
            else{
                if(startVector.x === 0){
                    movement = startVector.normalize(Math.abs(direction.y));
                }
                else{
                    movement = startVector.normalize(Math.abs(direction.x));
                }
                if(isParallel === 1 && !utils.isZeroVector(endVector)){
                    movement = movement.multipy(0.5);
                }
            }
        }
        else{
            movement = startVector.normalize(MIN_OFFSET);
        }
        //movement = movement.round();
        point = new kity.Point(startPos.x + movement.x, startPos.y + movement.y);

        if(point.x === endPos.x && point.y === endPos.y){
            return flagInCludeStartPos ? [startPos] : [];
        }

        if(flagInCludeStartPos){
            inflections.push(startPos);
        }
        return inflections.concat(findPath(point,new Vector(0,0),endPos,endVector,startVector.reverse()));
    }

    //默认以x,y方向的直线进行连接
    DesignerLine.register('default', function(line) {
        // Json导入的连线。并且未指定连线的起始位置
        //默认连线开始方向向右，结束方向向左
        if(isNaN(line.startIndex)){
            line.startVector = new Vector(1, 0);
            line.startIndex = OutlineManager.getOutVectorIndex(line.startVector);
            line.startPos = line.startNode.getOutlineManager().getLinePoints()[line.startIndex];

            line.endVector = new Vector(1, 0);
            line.endIndex = OutlineManager.getInVectorIndex(line.endVector);
            line.endPos = line.endNode.getOutlineManager().getLinePoints()[line.endIndex];
        }
        else if(!line.startPos){
            line.startPos = line.startNode.getOutlineManager().getLinePoints()[line.startIndex];
            line.startVector = OutlineManager.getOutVectorFromIndex(line.startIndex);

            line.endPos = line.endNode.getOutlineManager().getLinePoints()[line.endIndex];
            line.endVector = OutlineManager.getInVectorFromIndex(line.endIndex);
        }

        var startPos = line.startPos;
        var endPos = line.endPos;
        var startVector = line.startVector;
        var endVector = line.endVector || new Vector();

        var inflections = line.connection.getData('originalInflecions');
        if(!inflections){
            inflections = findPath(startPos, startVector, endPos, endVector);
        }
        else{
            //清空originalInflexions
            line.connection.setData('originalInflecions');
        }
        var pathData=['M', startPos.x, startPos.y];
        for(var i = 0, l = inflections.length; i<l; i++){
            pathData.push('L');
            var point = inflections[i];
            pathData.push(point.x);
            pathData.push(point.y);
        }
        pathData = pathData.concat(['L', endPos.x, endPos.y]);
        line.connection.setPathData(pathData);

        line.connection.setData('inflections', inflections);

        //绘制箭头
        var x = endPos.x;
        var y = endPos.y;
        var arrowDiretion = Vector.fromPoints(
            inflections.length > 0 ? inflections[inflections.length-1] : startPos,
            endPos
        );
        if(arrowDiretion.x === 0){
            line.arrow.setPathData([
                'M', x, y,
                'L', x+5*(arrowDiretion.x>0?1:-1), y-12*(arrowDiretion.y>0?1:-1),
                'L', x-5*(arrowDiretion.x>0?1:-1), y-12*(arrowDiretion.y>0?1:-1),
                'z'
            ]);
        }
        else{
            line.arrow.setPathData([
                'M', x, y,
                'L', x-12*(arrowDiretion.x>0?1:-1), y+5*(arrowDiretion.y>0?1:-1),
                'L', x-12*(arrowDiretion.x>0?1:-1), y-5*(arrowDiretion.y>0?1:-1),
                'z'
            ]);
        }
    });
});
