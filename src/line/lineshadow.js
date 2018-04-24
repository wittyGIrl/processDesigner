/**
 * @fileOverview
 *
 * line shadow
 *  目前shadow：颜色与背景色相同，而线本身操作的事件绑定在shadow上，
 *  直接解决了线很细，用户选不中的问题。
 */
define(function(require, module, exports){
    var kity = require('../core/kity');
    var utils = require('../core/utils');

    var ConnectionManager = require('../core/line');
    var OutlineManager = require('../core/outline');

    var LineModule = require('./module');
    var LineRenderer = require('./render');

    var ShadowLineRenderer = kity.createClass('ShadowLineRenderer', {
        base: LineRenderer,

        create: function(line) {
            this.container = 'lineGroup';
            //创建shadow
            var shadow = new kity.Path()
                .setId(utils.uuid('shadow'))
                .stroke(
                    line._designer.getStyle('line-shadow-color') || 'white',
                    line._designer.getStyle('line-shadow-width') || 8
                )
                .setStyle('opacity', 0);

            shadow.line = line;
            line.shadow = shadow;
            return shadow;
        },

        update: function(shadow, line, box) {
            shadow.setPathData(line.connection.getPathData());
            return new kity.Box();
        }

    });

    LineModule.register('LineShadow', function() {
        return  {
            renderers: {
                center: ShadowLineRenderer
            },
            events: {
                'linecontrolend': function(e){
                    var line = e.line;
                    line.shadow.setPathData(line.connection.getPathData());
                }
            }
        };
    });
});
