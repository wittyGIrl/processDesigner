/**
 * @fileOverview
 *
 * witdesigner
 *
 */
define(function(require, exports, module) {
    var witdesigner = window.witdesigner;
    var $ = window.$;
    var utils = witdesigner.Utils;
    var Designer = witdesigner.Designer;

    var instanceMap = {},
        instanceId = 0,
        uuidMap = {};

    $.extend(witdesigner, {
        uuid: function(name) {
            name = name || 'unknown';
            uuidMap[name] = uuidMap[name] || 0;
            ++uuidMap[name];
            return name + '_' + uuidMap[name];
        },
        createDesigner: function(renderTarget, options) {
            options = options || {};
            options.renderTo = utils.isString(renderTarget) ? document.getElementById(renderTarget) : renderTarget;
            var designer = new Designer(options);
            var property = designer.getDefaultProps();
            designer.setData('property', property).setData('basic', property);
            utils.setTabs(
              utils.certainName('extensionElements', property.children),
              designer,
              designer.getLang('tabs')
            );
            this.addDesigner(options.renderTo, designer);
            return designer;
        },
        addDesigner: function(target, designer) {
            var id;
            if (typeof(target) === 'string') {
                id = target;
            } else {
                id = target.id || ("KM_INSTANCE_" + instanceId++);
            }
            instanceMap[id] = designer;
        },
        getDesigner: function(target, options) {
            var id;
            if (typeof(target) === 'string') {
                id = target;
            } else {
                id = target.id || ("KM_INSTANCE_" + instanceId++);
            }
            return instanceMap[id] || this.createDesigner(target, options);
        },
        //挂接多语言
        LANG: {}
    });


    module.exports = witdesigner;
});
