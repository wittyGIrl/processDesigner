/**
 * @fileOverview
 *
 * 定义连线拐点锁定模块
 */
define(function(require, exports, module){
    var kity = require('../core/kity');
    var utils = require('../core/utils');

    var Module = require('../core/module');

    function createLockerShape(designer, pos){
        var theme = designer.getThemeItems();
        return new kity.Path()
            .fill(theme['locker-background'] || theme.background)
            .stroke(theme['locker-stroke-color'] || 'black', theme['locker-stroke-width'] || 1)
            .setId('locker'+utils.guid());
    }
    var radius = 5;

    var Locker = {
        //显示锁
        showLocker: function(designer, line){
            var inflections = line.inflections;
            var group = line.group;
            var lastPos, pos;
            for(var i=0,l = inflections.length; i<l; i++){
                pos = inflections[i];
                //避免重复的拐点绘制重复的锁（自动生成的连线开始结束处默认有两个重复的拐点）
                if(lastPos && pos.x === lastPos.x && pos.y === lastPos.y){
                    continue;
                }
                var lockerShape = createLockerShape(designer, pos);
                var drawer = lockerShape.getDrawer();
                drawer.clear()
                    .moveTo(pos.x-radius, pos.y)
                    .arcTo(radius, radius, 0, 0, 1, pos.x+radius, pos.y)
                    .lineTo(pos.x+radius, pos.y+radius)
                    .lineTo(pos.x-radius, pos.y+radius);
                if(pos.locked === true){
                    drawer.lineTo(pos.x-radius, pos.y);
                }
                lockerShape.inflection = pos;

                group.addShape(lockerShape);
                lastPos = pos;
            }
        },
        //隐藏锁
        hideLocker: function(line){
            var group = line.group;
            var items = group.getItems();
            var i, l, item;
            for(i = items.length - 1; i >= 0; i--){
                item = items[i];
                if(item.getId().indexOf('locker') !== -1){
                    group.removeShape(item);
                }
            }
        },
        triggerLock: function(locker){
            var inflection = locker.inflection;
            var locked = inflection.locked;
            var drawer = locker.getDrawer();

            if(locked === true){
                drawer.clear()
                    .moveTo(inflection.x-radius, inflection.y)
                    .arcTo(radius, radius, 0, 0, 1, inflection.x+radius, inflection.y)
                    .lineTo(inflection.x+radius, inflection.y+radius)
                    .lineTo(inflection.x-radius, inflection.y+radius);
            }
            else{
                locked = false;
                drawer.lineTo(inflection.x-radius, inflection.y);
            }
            inflection.locked = !locked;
        }
    };

    Module.register('LockLine', function() {
        return  {
            events: {
                'normal.click': function(e) {
                    if (e.originEvent.button) return;
                    var targetShape = e.kityEvent && e.kityEvent.targetShape;
                    if(targetShape && targetShape.getId && ~targetShape.getId().indexOf('locker')){
                        Locker.triggerLock(targetShape);
                        e.stopPropagation();
                        return false;
                    }
                },
                'draglinestart lineenddragstart hidelocaker': function(e){
                    Locker.hideLocker(e.line);
                },
                'draglineend lineenddragend showlocker': function(e){
                    Locker.showLocker(this, e.line);
                }
            }
        };
    });

    module.exports = Locker;
});
