/**
 * @fileOverview
 *
 * 生成支持拖拽行为的按钮
 *
 */
define(function(require, exports, module) {
  var kity = require('../core/kity');
  var witdesigner = require('../core/witdesigner');
  var Designer = witdesigner.Designer;
  var FUI = require('../core/fui');
  var $ = require('../core/jquery');
  var utils = require('../core/utils');

  Designer.registerUI('widget/dragbutton', function(designer) {
    var optionalDragger = {
      dragger: new witdesigner.NodeDragger(designer),
      treeDragger: new witdesigner.TreeDragger(designer)
    };
    //当前打开的selectMenu
    var currentSelectMenu;

    function mapValueWidget(command, shapeList) {
      return shapeList.map(function(shape) {
        var textId = shape.getData('text') || shape.getData('options').outlineType;
        var text = designer.getLang('ui.command.' + command + '.' + textId);
        return {
          clazz: 'Button',
          label: text,
          text: text,
          className: ['command-widget', 'drag-button', command, textId].join(' ')
        };
      });
    }

    function toSVGButtons($selectMenu, shapeList) {
      var i = 0;
      var buttons = $selectMenu.getWidgets();
      return shapeList.map(function(shape) {
        var $button = buttons[i];
        var svg = new FUI.Svg({
          width: 50,
          height: 50
        });
        var buttonNode = shape.getNode().cloneNode(true);
        svg.__svg.appendChild(buttonNode);
        $button.__iconWidget.__appendChild(svg);
        var options = $button.getOptions();
        options.targetShape = shape;

        i++;

        return $button;
      });
    }

    function generate(command, shapeList, options) {
      var defaultOpts = {
        setPosition: function(target, movement) {
          target.translate(movement.x, movement.y);
        },
        column: 2,
        dragger: 'dragger' // dragger | treeDragger
      };
      options = $.extend(defaultOpts, options);
      var dragger = optionalDragger[options.dragger];

      var $selectMenu = new FUI.SelectMenu({
        className: ['command-widget', 'command-selectmenu', command]
          .join(' '),
        column: options.column,
        selected: 0,
        widgets: mapValueWidget(command, shapeList)
      });

      toSVGButtons($selectMenu, shapeList);

      //heck: SelectMenu去掉mask
      $selectMenu.__mask = {
        hide: function() {},
        show: function() {
          currentSelectMenu = $selectMenu;
          if(options.onShow){
            options.onShow.call($selectMenu);
          }
        }
      };

      //menu没展开时也可显示提示文字
      $selectMenu.on('select', function(event, data) {
        if (data && data.widget) {
          $($selectMenu.__dropBtn.__element).attr('title',
            $(data.widget.__element).attr('title')
          );
        }
      });

      designer.on('click', function(e) {
        if (e.originEvent.button) return;
        if (currentSelectMenu) {
          currentSelectMenu.hide();
        }
      });

      $selectMenu.select(0);

      var flag = false;
      var startPos, dragPos, _path, targetShape;

      $selectMenu._resetTargetShape = function(target) {
        targetShape = target;
      };

      targetShape = shapeList[0];
      //bind events
      $selectMenu.__dropBtn.on('mousedown', function(e) {
        flag = true;
      }).on('mouseup', function(e) {
        flag = false;
      });

      $selectMenu.__widgetMenu.getWidgets().forEach(function(button) {
        button.on('mousedown', function(e) {
          flag = true;
          var shape = this.getOptions().targetShape;
          if (shape) {
            targetShape = shape;
          }
        }).on('mouseup', function(e) {
          flag = false;
        });
      });

      designer.on('mousemove', function(e) {
        if (flag) {
          var rc = designer.getRenderContainer();
          var pos = e.getPosition(rc).round();

          if(dragger.isDragging()){
            dragger.dragMove(pos, options.setPosition);
          } else {
            targetShape.setMatrix((new kity.Matrix()).translate(pos.x - 15, pos.y - 15));
            rc.addShape(targetShape);
            dragger.dragStart(pos, targetShape, true);
          }
        }
      });
      designer.on('mouseup', function(e) {
        if (flag) {
          if(dragger.isDragging()){
            var rc = designer.getRenderContainer();
            var pos = e.getPosition(rc).round();

            rc.removeShape(targetShape);
            var end = dragger.dragEnd(pos);
            if(command === 'AppendChildNode'){
              if(!end) return;
            }
            designer.executeCommand(
              command,
              $.extend({offset: pos}, targetShape.getData('options')),
              end
            );
            hideCurrentMenu();
          }
          flag = false;
        }
      });

      window.addEventListener('mouseup', function() {
        flag = false;
        if (dragger.isDragging()) {
          dragger.dragEnd();
          designer.getRenderContainer().removeShape(targetShape);
        }
      });

      $selectMenu.bindExecution('change', function(e, data) {
        targetShape = data.to.widget.getOptions().targetShape;
      });

      //  $button.bindCommandState(designer, command, false, enableHandler, activeHandler );

      return $selectMenu;

      function hideCurrentMenu(){
        if (currentSelectMenu) {
          currentSelectMenu.hide();
          var shape = currentSelectMenu.getSelected().getOptions().targetShape;
          if (shape) {
            currentSelectMenu._resetTargetShape(shape);
          }
          currentSelectMenu = null;
        }
      }
    }

    return {
      generate: generate
    };
  });
});
