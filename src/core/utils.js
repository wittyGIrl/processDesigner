/**
 * @fileOverview
 *
 * 帮助方法
 */
define(function (require, exports) {
  var kity = require('./kity');
  var uuidMap = {};

  var utils = kity.Utils;

  exports.each = utils.each.bind(kity.Utils);
  exports.copy = utils.copy.bind(kity.Utils); //使用JSON.stringify和JSON.parse来复制，会忽略函数属性


  function extend() {
  	var options, name, src, copy, copyIsArray, clone,
  		target = arguments[ 0 ] || {},
  		i = 1,
  		length = arguments.length,
  		deep = false;

  	// Handle a deep copy situation
  	if ( typeof target === "boolean" ) {
  		deep = target;

  		// Skip the boolean and the target
  		target = arguments[ i ] || {};
  		i++;
  	}

  	// Handle case when target is a string or something (possible in deep copy)
  	if ( typeof target !== "object" && !utils.isFunction( target ) ) {
  		target = {};
  	}

  	// Extend jQuery itself if only one argument is passed
  	if ( i === length ) {
  		target = this;
  		i--;
  	}

  	for ( ; i < length; i++ ) {

  		// Only deal with non-null/undefined values
  		if ( ( options = arguments[ i ] ) != null ) {

  			// Extend the base object
  			for ( name in options ) {
  				src = target[ name ];
  				copy = options[ name ];

  				// Prevent never-ending loop
  				if ( target === copy ) {
  					continue;
  				}

  				// Recurse if we're merging plain objects or arrays
  				if ( deep && copy && ( utils.isObject( copy ) ||
  					( copyIsArray = utils.isArray( copy ) ) ) ) {

  					if ( copyIsArray ) {
  						copyIsArray = false;
  						clone = src && utils.isArray( src ) ? src : [];

  					} else {
  						clone = src && utils.isObject( src ) ? src : {};
  					}

  					// Never move original objects, clone them
  					target[ name ] = extend( deep, clone, copy );

  				// Don't bring in undefined values
  				} else if ( copy !== undefined ) {
  					target[ name ] = copy;
  				}
  			}
  		}
  	}

  	// Return the modified object
  	return target;
  }
  exports.extend = extend;
  function isHidden(hidden, data) {
    if ((typeof hidden === 'undefined' ? 'undefined' : typeof(hidden)) !== 'object') return hidden;
    for (var key in data) {
      if (!data.hasOwnProperty(key)) continue;
      if (key === hidden.targetName) {
        if ((0, _utils.isArray)(hidden.targetValues)) {
          return !~hidden.targetValues.indexOf(data[key]);
        } else {
          return data[key] !== hidden.targetValues;
        }
      }
    }
  }
  exports.isHidden=isHidden;

  exports.uuid = function (group) {
    uuidMap[group] = uuidMap[group] ? uuidMap[group] + 1 : 1;
    return group + uuidMap[group];
  };

  exports.guid = function () {
    return (+new Date() * 1e6 + Math.floor(Math.random() * 1e6)).toString(36);
  };

  /*深拷贝*/
  exports.deepCopy=function (o){
      return JSON.parse(JSON.stringify(o));
  }

  exports.listen = function (element, type, handler) {
    var types = this.isArray(type) ? type : this.trim(type).split(/\s+/),
      k = types.length;
    if (k) {
      while (k--) {
        type = types[k];
        if (element.addEventListener) {
          element.addEventListener(type, handler, false);
        } else {
          if (!handler._d) {
            handler._d = {
              els: []
            };
          }
          var key = type + handler.toString(),
            index = handler._d.els.indexOf(element);
          if (!handler._d[key] || index == -1) {
            if (index == -1) {
              handler._d.els.push(element);
            }
            if (!handler._d[key]) {
              handler._d[key] = eventHandler;
            }
            element.attachEvent('on' + type, handler._d[key]);
          }
        }
      }
    }
    element = null;

    function eventHandler(evt) {
      return handler.call(evt.srcElement, evt || window.event);
    }
  };

  /**
   * @method xextendArray()
   * @description 特殊的合并数组
   *   数组元素 均为包含name属性的对象，根据name的值来合并数组 {name:''}
   * @param {object} target 目标对象。数组中元素的name值是不重复的
   * @param {parameter} sources 源对象。数组中元素的name值可重复
   */
  function xextendArray(t, s) {
    if(!s || !t) return;
    var flag, i, j, k, keyList, len, len1, len2, name, ref, source, target;

    keyList = {};

    for (i = 0, len = t.length; i < len; i++) {
      target = t[i];
      if (utils.isObject(target)) {
        if (target.potentialNames) {
          ref = target.potentialNames;
          for (j = 0, len1 = ref.length; j < len1; j++) {
            name = ref[j];
            keyList[name] = target;
          }
        } else {
          keyList[target.name] = target;
        }
      }
    }

    flag = {};

    for (k = 0, len2 = s.length; k < len2; k++) {
      source = s[k];
      if (utils.isObject(source)) {
        if (keyList[source.name]) {
          if (flag[source.name]) {
            t.push(xdeepExtend({}, keyList[source.name], source));
          } else {
            xdeepExtend(keyList[source.name], source);
            flag[source.name] = true;
          }
        } else {
          t.push(xdeepExtend({}, source));
        }
      } else {
        t.push(source);
      }
    }

    return t;
  }
  exports.xextendArray = xextendArray;

  /**
   * @method xdeepExtend()
   * @description 特殊的对象合并。
   *   potentialNames: 某个属性是互斥的
   *   对数组合并采用xextendArray
   *   当target为object, source为数组时，则对
   *       source.forEach(function(item){
   *           xdeepExtend(target, item)
   *       })
   * @param {object} target 目标对象
   * @param {parameter} source 源对象
   */
  function xdeepExtend(t, s) {
    var a = arguments,
      len = a.length,
      j, length;
    for (var i = 1; i < len; i++) {
      var x = a[i];
      if (!x) continue;
      for (var k in x) {
        if (x.hasOwnProperty(k)) {
          //对于editor进行浅拷贝
          if (utils.isArray(x[k]) && k !== 'options') {
            //特殊处理children，当defaultChild存在时
            if (k === 'children' && t.defaultChild) {
              var arr = [];
              var flag = utils.isFunction(t.defaultChild);
              var child = flag ? t.defaultChild() : t.defaultChild;
              if (utils.isArray(child)) {
                //可添加多种类型的子节点
                var dict = arrayToDictionary(child, 'name');
                for (var n = 0, ll = x[k].length; n < ll; n++) {
                  arr.push(xdeepExtend({}, dict[x[k][n].name], x[k][n]));
                }
              } else {
                for (var m = 0, l = x[k].length; m < l; m++) {
                  //defaultChild 为function时，每次都生成新的对象，避免动态值相同
                  arr.push(xdeepExtend({}, flag ? t.defaultChild() : child, x[k][m]));
                }
              }
              t[k] = arr;
            } else {
              if (!utils.isArray(t[k])) {
                t[k] = [];
              }
              t[k] = xextendArray(t[k], x[k]);
            }
          } else {
            if (utils.isObject(x[k])) {
              if (typeof t[k] === "undefined" || t[k] === null) {
                t[k] = {};
              }
              xdeepExtend(t[k], x[k]);
            } else {
              t[k] = x[k];
            }
          }
        }
      }
    }
    return t;
  }

  exports.xdeepExtend = xdeepExtend;

  exports.trim = function (str) {
    return str.replace(/(^[ \t\n\r]+)|([ \t\n\r]+$)/g, '');
  };

  exports.keys = function (plain) {
    var keys = [];
    for (var key in plain) {
      if (plain.hasOwnProperty(key)) {
        keys.push(key);
      }
    }
    return keys;
  };

  exports.clone = function (source) {
    return JSON.parse(JSON.stringify(source));
  };

  exports.comparePlainObject = function (a, b) {
    return JSON.stringify(a) == JSON.stringify(b);
  };

  exports.encodeHtml = function (str, reg) {
    return str ? str.replace(reg ||
      /[&<">'](?:(amp|lt|quot|gt|#39|nbsp);)?/g,
      function (a, b) {
        if (b) {
          return a;
        } else {
          return {
            '<': '&lt;',
            '&': '&amp;',
            '"': '&quot;',
            '>': '&gt;',
            '\'': '&#39;'
          }[a];
        }
      }) : '';
  };

  exports.clearWhiteSpace = function (str) {
    return str.replace(/[\u200b\t\r\n]/g, '');
  };

  exports.each(['String', 'Function', 'Array', 'Number', 'RegExp', 'Object'],
    function (v) {
      var toString = Object.prototype.toString;
      exports['is' + v] = function (obj) {
        return toString.apply(obj) == '[object ' + v + ']';
      };
    }
  );

  exports.isNil = function(target){
    return typeof target === 'undefined' || target === null;
  };

  /**
   * @method reset()
   * @for utils
   * @param source 被重置的对象
   * @param 需要重置的属性
   * @description
   *     重置一个对象的指定属性.
   * @example
   *
   * ```js
   * utils.reset({foo: 'e', bool: true, obj: {} }, ['foo', 'obj', {bool: false}]);
   * // {foo: null, bool: false, obj: null}
   */
  exports.reset = function (source, targets) {
    if (!source) return;
    targets.forEach(function (target) {
      if (typeof target === 'string') {
        source[target] = null;
      } else {
        for (var p in target) {
          source[p] = target[p];
        }
      }
    });
  };

  exports.safeRemoveArrayItem = function (array, item) {
    if (!array || array.lenght === 0) return;
    var index = array.indexOf(item);
    if (~index) {
      array.splice(index, 1);
    }
  };

  var r = Math.round;
  exports.distance = function (a, b) {
    if (typeof a === 'object') {
      var width = r(a.x - b.x);
      var height = r(a.y - b.y);
      return Math.sqrt(width * width + height * height);
    } else {
      a = r(a);
      b = r(b);
      return Math.sqrt(a * a + b * b);
    }
  };
  exports.midPoint = function (a, b) {
    if (typeof a === 'object') {
      return {
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2
      };
    } else {
      var c = arguments[2],
        d = arguments[3];
      return {
        x: (a + c) / 2,
        y: (b + d) / 2
      };
    }
  };

  exports.roundXY = function (p) {
    p.x = p.x | 0;
    p.y = p.y | 0;
    return p;
  };

  function isZeroVector(v) {
    if (v.x === 0 && v.y === 0) {
      return true;
    }
    return false;
  }
  exports.isZeroVector = isZeroVector;

  //判断两个数是否同号
  function isSameSign(x, y) {
    if (x === 0 || y === 0) return null;
    var singX = x / Math.abs(x);
    var singY = y / Math.abs(y);
    return singX * singY > 0;
  }
  exports.isSameSign = isSameSign;

  //求两向量的夹角
  exports.getAngle = function (vector1, vector2) {
    var angle1 = vector1.getAngle();
    if (angle1 < 0) {
      angle1 += 360;
    }
    var angle2 = vector2.getAngle();
    if (angle2 < 0) {
      angle2 += 360;
    }
    var angle = Math.abs(angle1 - angle2);
    return angle > 180 ? 360 - angle : angle;
  };

  /**
   * @isParallel
   * @for kity.Vector
   * @grammar new kity.Rect(width, height, x, y, radius)
   * @param  {Vector} v1
   * @param  {Vector} v2
   * @return {Number} -1两个向量两个反向，0两个向量不平行，1两个向量同向
   */
  exports.isParallel = function (v1, v2) {
    if (isZeroVector(v1) || isZeroVector(v2)) {
      return 1;
    }

    if (v1.x === 0) {
      if (v2.x === 0) {
        if (isSameSign(v1.y, v2.y)) {
          return 1;
        }
        return -1;
      }
      return 0;
    } else if (v1.y === 0) {
      if (v2.y === 0) {
        if (isSameSign(v1.x, v2.x)) {
          return 1;
        }
        return -1;
      }
      return 0;
    } else { //v1 x,y均不为0
      if (v2.x === 0 || v2.y === 0) {
        return 0;
      }
      //v2 x,y均不为0
      var a = v1.x / v2.x;
      var b = v1.y / v2.y;
      if (a === b) {
        if (a > 0) {
          return 1;
        }
        return -1;
      }
      return 0;
    }
  };

  function getValueFromRows(rows, key, getIndex) {
    if (rows && rows.length > 0) {
      for (var i = 0, l = rows.length; i < l; i++) {
        if (rows[i].name === key) {
          if (getIndex === true)
            return i;
          return rows[i].value;
        }
      }
    }
    if (getIndex === true)
      return -1;
  }

  exports.getValueFromRows = getValueFromRows;

  function parseDisplayName(lang, displayName) {
    if (!displayName) return;
    try {
      return JSON.parse(displayName)[lang];
    } catch (e) {}
  }

  exports.parseDisplayName = parseDisplayName;

  exports.getDisplayName = function (owner, json, lang) {
    if (json && json.children && json.children.length) {
      var displayName = parseDisplayName(lang,
        json.children[0].value);
      if (displayName) {
        if(owner){
          owner.setData('textFromDisplayName', true);
        }
        return displayName;
      }
    }
  };

  exports.getInfo = function (rows) {
    var value = {};
    if (rows && rows.length) {
      rows.forEach(function (row) {
        switch (row.name) {
          case 'id':
          case 'name':
          case 'transform':
          case 'offsetX':
          case 'offsetY':
          case 'zoom':
          case 'sourceRef':
          case 'targetRef':
          case 'inflections':
          case 'startPos':
          case 'endPos':
          case 'actionId':
          case 'pins':
          case 'type':
          case 'attachedToRef':
            value[row.name] = row.value;
            break;
          default:
            break;
        }
      });
    }
    return value;
  };

  //获取具有指定名称的集合元素
  exports.certainName = function (name, array) {
    if (!name || !array || !array.length) return;

    var item;
    for (var i = 0, l = array.length; i < l; i++) {
      item = array[i];
      if (item.name === name) {
        return item;
      }
    }
  };

  function arrayToDictionary(array, key) {
    if (!array || !key) return;
    var object = {};
    array.forEach(function (item) {
      if (item[key]) {
        object[item[key]] = item;
      }
    });
    return object;
  }
  exports.arrayToDictionary = arrayToDictionary;

  exports.setTabs = function (extension, owner, tabsLang) {
    if (!extension || !extension.children || !owner || !tabsLang) return;
    var leftChildren = [], dict = {};
    extension.children.forEach(function (child) {
      if (tabsLang[child.name]) {
        owner.setData(child.name, child);
        dict[child.name] = child;
      } else {
        leftChildren.push(child);
      }
    });
    dict.leftChildren = leftChildren;
    return dict;
  };
  exports.getTabs = function (owner, tabsLang) {
    if (!owner || !tabsLang) return;
    var tabs = [],
      target;
    for (var name in tabsLang) {
      if(!tabsLang.hasOwnProperty(name))continue;
      target = owner.getData(name);
      if (target) {
        tabs.push({
          name: tabsLang[name],
          data: target
        });
      }
    }
    return tabs;
  };

  /**
   * @method arrayDiff()
   * @for
   * @param  {Array} oldArr
   * @param  {Array} newArr
   * @return {Object}
   *   added: 新增的元素
   *   deleted: 删除的元素
   * @description
   *   数组中元素不重复，基本类型
   *   比较得到新旧两个数组，改变的部分
   */
  exports.arrayDiff = function (oldArr, newArr) {
    oldArr = oldArr || [];
    newArr = newArr || [];
    var added = [];
    var deleted = [];
    var flag = {};
    newArr.forEach(function (one, i) {
      if (~oldArr.indexOf(one)) {
        flag[one] = true;
      } else {
        added.push(one);
      }
    });
    oldArr.forEach(function (one) {
      if (flag[one] !== true) {
        deleted.push(one);
      }
    });
    return {
      added: added,
      deleted: deleted
    };
  };

  /*
  * 合并两个数组并去重
  */
  exports.combineArr = function (one, another) {
    one = one || [];
    another = another || [];
    another.forEach(function (item) {
      if (!~one.indexOf(item)) {
        one.push(item);
      }
    });
    return one;
  };

  exports.unduplicatedPush = function(array, item) {
    if (~array.indexOf(item)) {
      return;
    }
    array.push(item);
  };

  exports.findInArray = function(arr, finder){
    if(!arr || !finder) return;
    var item;
    for(var i = 0, l = arr.length; i < l; i++){
      item = arr[i];
      if(finder(item, i) === true){
        return item;
      }
    }
  };
});
