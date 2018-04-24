/**
 * @fileOverview
 *
 * 默认主题
 */
define(function(require, exports, module) {
    var theme = require('../core/theme');

    /* jscs:disable maximumLineLength */
    theme.register('default', {
        'background': '#ffffff',
        // 'node-background': 'transparent',

        'color': '#430',
        'stroke': '#e9df98',
        'font-size': 24,
        'action-font-size': 12,
        'padding':[10, 10, 10, 25],
        'margin': [15, 25],
        'radius': 30,
        'space': 10,
        'shadow': 'rgba(0, 0, 0, .25)',

        'startEvent-width': 20,
        'startEvent-height': 20,
        'startEvent-padding':[5, 5],
        'startEvent-margin': [5, 5],


        'endEvent-padding':[5, 5] ,
        'endEvent-margin': [5, 5],
        'terminateEndEvent-padding':[5, 5] ,
        'terminateEndEvent-margin': [5, 5],

        'boundaryEvent-padding':[0] ,
        'boundaryEvent-margin': [5, 5],

        'connect-color': 'black',
        'connect-width': 1,
        'main-connect-width': 1,
        'connect-radius': 5,

        'selected-connect-color': '#fc8383',
        'selected-connect-width': 1,
        'selected-main-connect-width': 2,
        'selected-connect-radius': 5,

        'start-connect-color': '#fc8383',
        'end-connect-color': '#0F73E8',

        'marquee-background': 'rgba(255,255,255,.3)',
        'marquee-stroke': 'black',

        'text-selection-color': 'rgb(27,171,255)',
        'line-height': 1.1,

        'stroke-width': 2,
        'end-stroke-width':5,

        'normal-stroke': 'black',
        'normal-stroke-width': 3,

        'selected-background': 'rgb(254, 219, 0)',
        'selected-stroke': '#83FC9E',
        'selected-stroke-width': '3',
        'selected-color': 'black',

        'locker-background': '#ffffff',
        'locker-stroke-color': 'black',
        'locker-stroke-width': 2,

        'line-shadow-width': 15,
        'line-shadow-color': '#ffffff',

        'drop-hint-color': '#83FC9E',
        'drop-hint-width': 3,
    });
});
