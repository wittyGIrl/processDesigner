define(function (require, exports, module) {
  var subject = require('./subject');
  var description = require('./description');

  function get(designer) {
    return {
      "name": "presentationElements",
      "variableChildren": true,
      "defaultChild": [
        subject.get(designer),
        description.get(designer)
      ],
      "children": [
        subject.get(designer),
        description.get(designer)
      ]
    };
  }

  exports.get = get;
});
