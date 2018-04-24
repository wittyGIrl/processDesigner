/**
 * @fileOverview
 *
 * 定义视图模块
 * 提供对视图的拖拽
 */
define(function(require, exports, module) {
    var kity = require('../core/kity');
    var utils = require('../core/utils');

    var Designer = require('../core/designer');
    var DesignerNode = require('../core/node');
    var Command = require('../core/command');
    var Module = require('../core/module');
    var Renderer = require('../core/render');

    var ViewDragger = kity.createClass('ViewDragger', {
        constructor: function(designer) {
            this._designer = designer;
            this._enabled = false;
            this._bind();
            var me = this;
            this._designer.getViewDragger = function() {
                return me;
            };
            this.setEnabled(false);
        },

        isEnabled: function() {
            return this._enabled;
        },

        setEnabled: function(value) {
            var paper = this._designer.getPaper();
            paper.setStyle('cursor', value ? '-webkit-grab' : 'default');
            this._enabled = value;
        },

        move: function(offset, duration) {
            var designer = this._designer;

            var targetPosition = this.getMovement().offset(offset);

            this.moveTo(targetPosition, duration);
        },

        moveTo: function(position, duration) {

            if (duration) {
                var dragger = this;

                if (this._moveTimeline) this._moveTimeline.stop();

                this._moveTimeline = this._designer.getRenderContainer().animate(new kity.Animator(
                    this.getMovement(),
                    position,
                    function(target, value) {
                        dragger.moveTo(value);
                    }
                ), duration, 'easeOutCubic');

                this._moveTimeline.on('finish', function() {
                    dragger._moveTimeline = null;
                });

                return this;
            }

            this._designer.getRenderContainer().setTranslate(position.round());
            this._designer.fire('viewchange');
        },

        getMovement: function() {
            var translate = this._designer.getRenderContainer().transform.translate;
            return translate ? translate[0] : new kity.Point();
        },

        getView: function() {
            var designer = this._designer;
            var c = designer._lastClientSize || {
                width: designer.getRenderTarget().clientWidth,
                height: designer.getRenderTarget().clientHeight
            };
            var m = this.getMovement();
            var box = new kity.Box(0, 0, c.width, c.height);
            var viewMatrix = designer.getPaper().getViewPortMatrix();
            return viewMatrix.inverse().translate(-m.x, -m.y).transformBox(box);
        },

        _bind: function() {
            var dragger = this,
                isTempDrag = false,
                lastPosition = null,
                currentPosition = null;

            function dragEnd(e) {
                if (!lastPosition) return;

                lastPosition = null;

                e.stopPropagation();

                // 临时拖动需要还原状态
                if (isTempDrag) {
                    dragger.setEnabled(false);
                    isTempDrag = false;
                    if (dragger._designer.getStatus() == 'hand')
                        dragger._designer.rollbackStatus();
                }
                var paper = dragger._designer.getPaper();
                paper.setStyle('cursor', dragger._designer.getStatus() == 'hand' ? '-webkit-grab' : 'default');

                dragger._designer.fire('viewchanged');
            }

            this._designer.on('normal.mousedown normal.touchstart ' +
                'inputready.mousedown inputready.touchstart ' +
                'readonly.mousedown readonly.touchstart ' +
                'property.mousedown property.touchstart',
                function(e) {
                    if (e.originEvent.button === 2) {
                        e.originEvent.preventDefault(); // 阻止中键拉动
                    }
                    //右键或者alt+左键拖拽
                    if (e.originEvent.button === 2 || e.originEvent.altKey && !e.getTargetNode()) {
                        lastPosition = e.getPosition('view');
                        isTempDrag = true;
                    }
                })

            .on('normal.mousemove normal.touchmove ' +
                'readonly.mousemove readonly.touchmove ' +
                'inputready.mousemove inputready.touchmove ' +
                'property.mousemove property.touchmove',
                function(e) {
                    if (e.type == 'touchmove') {
                        e.preventDefault(); // 阻止浏览器的后退事件
                    }
                    if (!isTempDrag) return;
                    var offset = kity.Vector.fromPoints(lastPosition, e.getPosition('view'));
                    if (offset.length() > 10) {
                        this.setStatus('hand', true);
                        var paper = dragger._designer.getPaper();
                        paper.setStyle('cursor', '-webkit-grabbing');
                    }
                })

            .on('hand.beforemousedown hand.beforetouchstart', function(e) {
                // 已经被用户打开拖放模式
                if (dragger.isEnabled()) {
                    lastPosition = e.getPosition('view');
                    e.stopPropagation();
                    var paper = dragger._designer.getPaper();
                    paper.setStyle('cursor', '-webkit-grabbing');
                }
            })

            .on('hand.beforemousemove hand.beforetouchmove', function(e) {
                if (lastPosition) {
                    currentPosition = e.getPosition('view');

                    // 当前偏移加上历史偏移
                    var offset = kity.Vector.fromPoints(lastPosition, currentPosition);
                    dragger.move(offset);
                    e.stopPropagation();
                    e.preventDefault();
                    e.originEvent.preventDefault();
                    lastPosition = currentPosition;
                }
            })

            .on('mouseup touchend', dragEnd);

            window.addEventListener('mouseup', dragEnd);
            this._designer.on('contextmenu', function(e) {
                e.preventDefault();
            });
        }
    });

    Module.register('View', function() {

        var km = this;

        /**
         * @command Hand
         * @description 切换抓手状态，抓手状态下，鼠标拖动将拖动视野，而不是创建选区
         * @state
         *   0: 当前不是抓手状态
         *   1: 当前是抓手状态
         */
        var ToggleHandCommand = kity.createClass('ToggleHandCommand', {
            base: Command,
            execute: function(designer) {

                if (designer.getStatus() != 'hand') {
                    designer.setStatus('hand', true);
                } else {
                    designer.rollbackStatus();
                }
                this.setContentChanged(false);

            },
            queryState: function(designer) {
                return designer.getStatus() == 'hand' ? 1 : 0;
            },
            enableReadOnly: true
        });

        /**
         * @command Camera
         * @description 设置当前视野的中心位置到某个节点上
         * @param {witdesigner.DesignerNode} focusNode 要定位的节点
         * @param {number} duration 设置视野移动的动画时长（单位 ms），设置为 0 不使用动画
         * @state
         *   0: 始终可用
         */
        var CameraCommand = kity.createClass('CameraCommand', {
            base: Command,
            execute: function(km, focusNode, duration) {

                if(!focusNode)return ;
                var viewport = km.getPaper().getViewPort();
                var offset = focusNode.getRenderContainer().getRenderBox('view');
                var dx = viewport.center.x - offset.x - offset.width / 2,
                    dy = viewport.center.y - offset.y;
                var dragger = km._viewDragger;

                //var duration = km.getOption('viewAnimationDuration');
                dragger.move(new kity.Point(dx, dy), duration);
                this.setContentChanged(false);
            },
            enableReadOnly: true
        });

        /**
         * @command Move
         * @description 指定方向移动当前视野
         * @param {string} dir 移动方向
         *    取值为 'left'，视野向左移动一半
         *    取值为 'right'，视野向右移动一半
         *    取值为 'up'，视野向上移动一半
         *    取值为 'down'，视野向下移动一半
         * @param {number} duration 视野移动的动画时长（单位 ms），设置为 0 不使用动画
         * @state
         *   0: 始终可用
         */
        var MoveCommand = kity.createClass('MoveCommand', {
            base: Command,

            execute: function(km, dir) {
                var dragger = km._viewDragger;
                var size = km._lastClientSize;
                var duration = km.getOption('viewAnimationDuration');
                switch (dir) {
                    case 'up':
                        dragger.move(new kity.Point(0, size.height / 2), duration);
                        break;
                    case 'down':
                        dragger.move(new kity.Point(0, -size.height / 2), duration);
                        break;
                    case 'left':
                        dragger.move(new kity.Point(size.width / 2, 0), duration);
                        break;
                    case 'right':
                        dragger.move(new kity.Point(-size.width / 2, 0), duration);
                        break;
                }
            },

            enableReadOnly: true
        });

        return {
            init: function() {
                this._viewDragger = new ViewDragger(this);
            },
            commands: {
                'hand': ToggleHandCommand,
                'camera': CameraCommand,
                'move': MoveCommand
            },
            events: {
                statuschange: function(e) {
                    this._viewDragger.setEnabled(e.currentStatus == 'hand');
                },
                mousewheel: function(e) {
                    var dx, dy;
                    e = e.originEvent;
                    if (e.ctrlKey || e.shiftKey) return;
                    if ('wheelDeltaX' in e) {

                        dx = e.wheelDeltaX || 0;
                        dy = e.wheelDeltaY || 0;

                    } else {

                        dx = 0;
                        dy = e.wheelDelta;

                    }

                    this._viewDragger.move({
                        x: dx / 2.5,
                        y: dy / 2.5
                    });

                    var me = this;
                    clearTimeout(this._mousewheeltimer);
                    this._mousewheeltimer = setTimeout(function() {
                        me.fire('viewchanged');
                    }, 100);

                    e.preventDefault();
                },
                // ready: function() {
                //     this.executeCommand('camera', null, 0);
                //     this._lastClientSize = {
                //         width: this.getRenderTarget().clientWidth,
                //         height: this.getRenderTarget().clientHeight
                //     };
                // },
                resize: function(e) {
                    var a = {
                            width: this.getRenderTarget().clientWidth,
                            height: this.getRenderTarget().clientHeight
                        },
                        b = this._lastClientSize || a;
                    this._viewDragger.move(
                        new kity.Point((a.width - b.width) / 2 | 0, (a.height - b.height) / 2 | 0));
                    this._lastClientSize = a;
                },
                //节点图形在视野之外，移动view使节点图形进入视野
                'selectionchange layoutallfinish': function(e) {
                    var selected = this.getSelectedNode();

                    if (!selected) return;

                    var dragger = this._viewDragger;
                    var view = dragger.getView();
                    var focus = selected.getLayoutBox();
                    var space = 20;
                    var tolerance = 20;
                    var dx = 0,
                        dy = 0;

                    if (focus.right > view.right - tolerance) {
                        dx += view.right - focus.right - space;
                    } else if (focus.left < view.left + tolerance) {
                        dx += view.left - focus.left + space;
                    }

                    if (focus.bottom > view.bottom - tolerance) {
                        dy += view.bottom - focus.bottom - space;
                    }
                    if (focus.top < view.top + tolerance) {
                        dy += view.top - focus.top + space;
                    }

                    if (dx || dy) {
                        dragger.move(new kity.Point(dx, dy));
                    }
                }
            }
        };
    });
});
