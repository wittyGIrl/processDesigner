/**
 * @fileOverview
 *
 * eventDefinition
 */
define(function (require, exports, module) {
  var _definitions = {};
  function register(name, definition){
    _definitions[name] = definition;
  }
  function get(name){
    if(!_definitions[name]){
      throw new Error('unregister event definition: ' + name);
    }
    return _definitions[name];
  }

  module.exports = {
    get: get,
    register: register,
  };

});
