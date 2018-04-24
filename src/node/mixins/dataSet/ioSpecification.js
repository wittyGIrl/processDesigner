/**
 * ioSpecification的json定义与xml不同, ioSpecification的xml定义如下
 * <ioSpecification>
 *		<inputSet>
 *			<dataInputRefs>a</dataInputRefs>
 *		</inputSet>
 *		<dataInput id="a" name="a" itemSubjectRef="xsd:boolean" />
 *    <outputSet>
 *			<dataOutputRefs>a</dataOutputRefs>
 *		</outputSet>
 *		<dataOutput id="a" name="a" itemSubjectRef="xsd:boolean" />
 *	</ioSpecification>
 *  原因：如果按照这样的格式定义json，那么这个再操作的时候（以dataInput举例），
 *  必须先添加一个dataInput，然后再在inputSet中添加一个引用，这样操作太繁琐。
 *  xml这样定义的原因：BPMN中，dataInput有多种，以不同方式进行引用。
 *  例如：dataInputRefs, optionalInputRefs, whileExecutingInputRefs
 */

define(function (require, exports, module) {
  var outputSet = require('./outputSet');
  var inputSet = require('./inputSet');

  function get(designer) {
    return {
      "name": "ioSpecification",
      //  "hideTitle": true,
      "children": [
        inputSet.get(designer),
        outputSet.get(designer)
      ]
    };
  }

  function beforeExport(json) {
    if(!json || !json.children || !json.children.length)return;
    var inSet, outSet;
    json.children.forEach(function(child){
      if(child)
      switch(child.name){
        case 'inputSet':
          inSet = child;
          break;
        case 'outputSet':
          outSet = child;
          break;
        default:
          break;
      }
    });
    inputSet.beforeExport(inSet, json);
    outputSet.beforeExport(outSet, json);
    return json;
  }

  function beforeImport(json) {
    if(!json || !json.children || !json.children.length)return;
    var inSet, outSet, dataInputs = [], dataOutputs = [];
    json.children.forEach(function(child){
      if(child)
      switch(child.name){
        case 'inputSet':
          inSet = child;
          break;
        case 'outputSet':
          outSet = child;
          break;
        case 'dataInput':
          dataInputs.push(child);
          break;
        case 'dataOutput':
          dataOutputs.push(child);
          break;
        default:
          break;
      }
    });
    inSet = inputSet.beforeImport(inSet, dataInputs);
    outSet = outputSet.beforeImport(outSet, dataOutputs);
    json.children = [inSet, outSet];
    return json;
  }

  exports.get = get;
  exports.beforeImport = beforeImport;
  exports.beforeExport = beforeExport;
});
