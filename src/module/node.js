/**
 * @fileOverview
 *
 * 定义节点相关的命令
 */
define(function (require, exports, module) {
  var kity = require('../core/kity');
  var utils = require('../core/utils');

  var Designer = require('../core/designer');
  var DesignerNode = require('../core/node');
  var Command = require('../core/command');
  var Module = require('../core/module');


  var AppendRootCommand = kity.createClass('AppendRootCommand', {
    base: Command,
    execute: function (designer, options) {
      //redo
      if (this._root) {
        designer.addRoot(this._root).select(this._root, true);
        return;
      }
      var outlineType = options.outlineType;
      var opts = utils.extend({
          text: options.text,
          nodeId: outlineType + '_' + utils.guid(),
          outlineType: outlineType,
          mode: 'default',
        }, options);
      var node = designer.createNode(opts);
      if(options.offset){
        node.setLayoutOffset(options.offset);
      }

      var property = designer.getOutlineManagerClass(outlineType).getProperty(designer, opts);
      node.setData('property', property).setData('basic', property);
      var extension = utils.certainName('extensionElements', property.children);
      var displayName;
      if(extension){
        displayName = utils.getDisplayName(
          node,
          utils.certainName('displayName', extension.children),
          designer.getOption('lang')
        );
      }
      if(!displayName){
        var info = utils.getInfo(property.attributes);
        displayName = info.name;
      }
      if(typeof displayName !== 'undefined' && displayName !== null){
        node.setText(displayName);
      }

      utils.setTabs(extension, node, designer.getLang('tabs'));
      utils.setTabs(property, node, designer.getLang('tabs'));

      designer.applyLayoutResult(node).select(node, true);

      this._root = node;
      this._designer = designer;
    },
    unexecute: function () {
      this._designer.removeRoot(this._root);
    }
  });

  var AppendChildCommand = kity.createClass('AppendChildCommand', {
    base: Command,
    execute: function (designer, options, parent) {
      if (this._parent) {
        designer.appendNode(this._node, this._parent).select(this._node, true);
        this._parent.render().updateLine();
        return;
      }

      var outlineType = options.outlineType;
      var opts = utils.extend({
          text: options.text,
          nodeId: outlineType + '_' + utils.guid(),
          outlineType: outlineType,
        }, options);
      var node = designer.createNode(opts, parent);

      var property = designer.getOutlineManagerClass(outlineType).getProperty(designer, opts);
      node.setData('property', property).setData('basic', property);
      var extension = utils.certainName('extensionElements', property.children);

      utils.setTabs(extension, node, designer.getLang('tabs'));

      designer.select(node, true);
      parent.render().updateLine();
      this._parent = parent;
      this._node = node;
      this._designer = designer;
    },

    //撤销
    unexecute: function () {
      this._designer.removeNode(this._node);
      this._parent.render().updateLine();
    },

  });

  var RemoveNodeCommand = kity.createClass('RemoveNodeCommand', {
    base: Command,
    execute: function (designer) {
      var rc = designer.getRenderContainer();
      var lineContainer = designer.getLineContainer();
      var roots = designer.getRoots();
      //redo
      if (this._relations) {
        this._relations.forEach(function(relation){
          designer.removeNode(relation.node);
          if(relation.parent){
            relation.parent.render().updateLine();
          }
        });
        return;
      }

      var selected = designer.getSelectedNodes();
      if (!selected || selected.length === 0) return;
      var nodes = selected.slice(0);

      var relations = [],
        relation,
        lines = [];
      nodes.forEach(function (node) {
        node.preTraverse(addLine);
        relation = {
          node: node,
        };
        if(node.parent){
          relation.index = node.getIndex();
          relation.parent = node.parent;
        }
        designer.removeNode(node);
        if(relation.parent){
          relation.parent.render().updateLine();
        }
        relations.push(relation);
      });

      this._relations = relations;
      this._lines = lines;
      this._designer = designer;

      function addLine(node){
        utils.combineArr(lines, node.getStartLines());
        utils.combineArr(lines, node.getEndLines());
      }
    },
    unexecute: function () {
      var relation;
      var designer = this._designer;

      this._relations.forEach(function(relation){
        designer.appendNode(relation.node, relation.parent, relation.index);
      });
      this._lines.forEach(function (line) {
        designer.addLine(line);
      });
      this._relations.forEach(function(relation){
        if(relation.parent){
          relation.parent.render().updateLine();
        } else {
          relation.node.render().updateLine();
        }
      });
    },
    queryState: function (designer) {
      return designer.getSelectedNode() ? 0 : -1;
    }
  });

  //以下的命令并未使用
  var AppendSiblingCommand = kity.createClass('AppendSiblingCommand', {
    base: Command,
    execute: function (designer, text) {
      var sibling = designer.getSelectedNode();
      var parent = sibling.parent;
      if (!parent) return;
      var node = designer.createNode(text, parent, sibling.getIndex() +
        1);
      node.setGlobalLayoutTransform(sibling.getGlobalLayoutTransform());
      designer.select(node, true);
      node.render();
      //designer.layout();
    },
    queryState: function (designer) {
      return designer.getSelectedNode() ? 0 : -1;
    }
  });

  Module.register('NodeModule', function () {
    return {
      init: function () {
        var designer = this;
        this.addShortcut('normal::Del', function () {
          ['RemoveNode', 'RemoveLine'].forEach(function (command) {
            if (designer.queryCommandState(command) === 0) {
              designer.executeCommand(command);
            }
          });
        });
      },
      commands: {
        'AppendRootNode': AppendRootCommand,
        'AppendChildNode': AppendChildCommand,
        //'AppendSiblingNode': AppendSiblingCommand,
        'RemoveNode': RemoveNodeCommand
      }
    };
  });
});
