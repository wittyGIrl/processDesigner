/**
 * @fileOverview
 *
 * 放大缩小模块
 *
 */
define(function(require, module, exports){
    var Designer = require('../core/designer');
    var kity = require('../core/kity');

    var Module = require('../core/module');
    var Command = require('../core/command');

    Module.register('Zoom', function() {
        var me = this;

        var timeline;

        me.setDefaultOptions('zoom', [10, 20, 30, 50, 80, 100, 120, 150, 200]);

        function setTextRendering() {
            var value = me._zoomValue >= 100 ? 'optimize-speed' : 'geometricPrecision';
            me.getRenderContainer().setAttr('text-rendering', value);
        }

        function fixPaperCTM(paper) {
            var node = paper.shapeNode;
            var ctm = node.getCTM();
            var matrix = new kity.Matrix(ctm.a, ctm.b, ctm.c, ctm.d, (ctm.e | 0) + 0.5, (ctm.f | 0) + 0.5);
            node.setAttribute('transform', 'matrix(' + matrix.toString() + ')');
        }

        kity.extendClass(Designer, {
            zoom: function(value) {
                var paper = this.getPaper();
                var viewport = paper.getViewPort();
                viewport.zoom = value / 100;
                viewport.center = {
                    x: viewport.center.x,
                    y: viewport.center.y
                };
                paper.setViewPort(viewport);
                if (value == 100) fixPaperCTM(paper);
            },
            getZoomValue: function() {
                return this._zoomValue;
            }
        });

        function zoomDesigner(designer, value) {
            var paper = designer.getPaper();
            var viewport = paper.getViewPort();

            if (!value) return;
            value -= 0;

            var animator = new kity.Animator({
                beginValue: designer._zoomValue,
                finishValue: value,
                setter: function(target, value) {
                    target.zoom(value);
                }
            });

            designer._zoomValue = value;

            setTextRendering();

            if (timeline) {
                timeline.pause();
            }
            timeline = animator.start(designer, 300, 'easeInOutSine');
            timeline.on('finish', function() {
                designer.fire('viewchange');
            });

            this.setContentChanged(false);
            designer.fire('zoom', { zoom: value });
        }

        var ZoomCommand = kity.createClass('Zoom', {
            base: Command,

            execute: function(designer, value){
              zoomDesigner.call(this, designer, value);
            },
            queryValue: function(designer) {
                return designer._zoomValue;
            }
        });

        var ZoomInCommand = kity.createClass('ZoomInCommand', {
            base: Command,

            execute: function(designer) {
                zoomDesigner.call(this, designer, this.nextValue(designer));
                this.setContentChanged(false);
            },
            queryState: function(designer) {
                return +!this.nextValue(designer);
            },
            nextValue: function(designer) {
                var stack = designer.getOption('zoom'),
                    i;
                for (i = 0; i < stack.length; i++) {
                    if (stack[i] > designer._zoomValue) return stack[i];
                }
                return 0;
            },
            enableReadOnly: true
        });

        var ZoomOutCommand = kity.createClass('ZoomOutCommand', {
            base: Command,

            execute: function(designer) {
                zoomDesigner.call(this, designer, this.nextValue(designer));
                this.setContentChanged(false);
            },
            queryState: function(designer) {
                return +!this.nextValue(designer);
            },
            nextValue: function(designer) {
                var stack = designer.getOption('zoom'),
                    i;
                for (i = stack.length - 1; i >= 0; i--) {
                    if (stack[i] < designer._zoomValue) return stack[i];
                }
                return 0;
            },
            enableReadOnly: true
        });

        return {
            init: function() {
                this._zoomValue = 100;
                setTextRendering();
            },
            commands: {
                'zoom-in': ZoomInCommand,
                'zoom-out': ZoomOutCommand,
                'zoom': ZoomCommand
            },
            events: {
                'normal.mousewheel readonly.mousewheel': function(e) {
                    if (!e.originEvent.ctrlKey && !e.originEvent.metaKey) return;

                    var delta = e.originEvent.wheelDelta;
                    var me = this;

                    if (!kity.Browser.mac) {
                        delta = -delta;
                    }

                    // 稀释
                    if (Math.abs(delta) > 100) {
                        clearTimeout(this._wheelZoomTimeout);
                    } else {
                        return;
                    }

                    this._wheelZoomTimeout = setTimeout(function() {
                        var value;
                        var lastValue = me.getPaper()._zoom || 1;
                        if (delta < 0) {
                            me.execCommand('zoom-in');
                        } else if (delta > 0) {
                            me.execCommand('zoom-out');
                        }
                    }, 100);

                    e.originEvent.preventDefault();
                }
            },

            commandShortcutKeys: {
                'zoom-in': 'ctrl+=',
                'zoom-out': 'ctrl+-'
            }
        };
    });

});
