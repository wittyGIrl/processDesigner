/**
 * @fileOverview
 *
 * 快捷键上下左右选择节点
 *
 */
define(function(require, exports, module) {
    var kity = require('../core/kity');
    var utils = require('../core/utils');
    var keymap = require('../core/keymap');

    var Designer = require('../core/designer');
    var DesignerNode = require('../core/node');
    var Module = require('../core/module');
    var Renderer = require('../core/render');

    Module.register('KeyboardModule', function() {
        var min = Math.min,
            max = Math.max,
            abs = Math.abs,
            sqrt = Math.sqrt,
            exp = Math.exp;

        function buildPositionNetwork(designer) {
            var pointIndexes = [],
                p,
                roots = designer.getRoots();

            roots.forEach(function(node) {
                p = node.getLayoutBox();

                // bugfix: 不应导航到收起的节点（判断其尺寸是否存在）
                if (p.width && p.height) {
                    pointIndexes.push({
                        left: p.x,
                        top: p.y,
                        right: p.x + p.width,
                        bottom: p.y + p.height,
                        width: p.width,
                        height: p.height,
                        node: node
                    });
                }
            });
            for (var i = 0; i < pointIndexes.length; i++) {
                findClosestPointsFor(pointIndexes, i);
            }
        }

        //得到两个矩形的距离，矩形可能相交
        function getDistance(box1, box2){
            var xDist = box1.left - box2.left;
            var yDist = box1.top - box2.top;
            return sqrt(xDist * xDist + yDist * yDist);
        }

        function findClosestPointsFor(pointIndexes, iFind) {
            var find = pointIndexes[iFind];
            var most = {},
                quad;
            var current, dist;

            for (var i = 0; i < pointIndexes.length; i++) {

                if (i == iFind) continue;
                current = pointIndexes[i];

                dist = getDistance(current, find);

                // left
                if (current.left < find.left) {
                    if (!most.left || dist < most.left.dist) {
                        most.left = {
                            dist: dist,
                            node: current.node
                        };
                    }
                }

                // right
                if (current.left > find.left) {
                    if (!most.right || dist < most.right.dist) {
                        most.right = {
                            dist: dist,
                            node: current.node
                        };
                    }
                }

                // top
                if (current.top < find.top) {
                    if (!most.top || dist < most.top.dist) {
                        most.top = {
                            dist: dist,
                            node: current.node
                        };
                    }
                }

                // bottom
                if (current.top > find.top) {
                    if (!most.down || dist < most.down.dist) {
                        most.down = {
                            dist: dist,
                            node: current.node
                        };
                    }
                }
            }
            find.node._nearestNodes = {
                right: most.right && most.right.node || null,
                top: most.top && most.top.node || null,
                left: most.left && most.left.node || null,
                down: most.down && most.down.node || null
            };
        }

        function navigateTo(km, direction) {
            var referNode = km.getSelectedNode();
            if (!referNode) {
                km.select(km.getRoot());
                //buildPositionNetwork(km);
                return;
            }
            if (!referNode._nearestNodes) {
                buildPositionNetwork(km);
            }
            var nextNode = referNode._nearestNodes[direction];
            if (nextNode) {
                km.select(nextNode, true);
            }
        }

        return {
            'events': {
                'layoutallfinish viewchange': function() {
                    buildPositionNetwork(this);
                },
                'normal.keydown readonly.keydown': function(e) {
                    var designer = this;
                    ['left', 'right', 'up', 'down'].forEach(function(key) {
                        if (e.isShortcutKey(key)) {
                            navigateTo(designer, key === 'up' ? 'top' : key);
                            e.preventDefault();
                        }
                    });
                }
            }
        };
    });
});
