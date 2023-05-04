const { generateEndpointsFromDirTree } = require(base("illuminate/foundation"));
const doc = require(base("doc/base"));

const Joi = require("joi");
// console.log(
//   Joi.object({
//     a: Joi.number().required(),
//     b: Joi.string().required(),
//   }).$_terms.keys[0].schema._flags.presence //type
// );

doc.paths = {};
const subDocRootPath = base("doc/parts");
generateEndpointsFromDirTree(subDocRootPath, (endpoint, path) => {
  const pathDoc = require(path);
  for (const [method, methodDoc] of Object.entries(pathDoc)) {
    methodDoc.parameters = [];
    try {
      const Validation = require(methodDoc.validationPath);
      const { urlencoded, multipart } = Validation.schema;
      if (typeof urlencoded !== "undefined") {
        for (const param of urlencoded.rules.$_terms.keys) {
          const parameter = {
            name: param.key,
            in: urlencoded.target,
            type: param.schema.type,
            required: param.schema._flags.presence === "required",
          };
          methodDoc.parameters.push(parameter);
        }
      }
      if (typeof multipart !== "undefined") {
        methodDoc.consumes = [
          "multipart/form-data"
        ];
        for (const [name, {rules}] of Object.entries(multipart.object)) {
          const parameter = {
            name,
            in: 'formData',
            type: rules.mimetypes.join(' || '),
            required: rules.required,
          };
          methodDoc.parameters.push(parameter);
        }
      }
    } catch (e){
      continue;
    }
    pathDoc[method] = methodDoc;
  }
           // console.log(pathDoc)

  doc.paths[endpoint] = pathDoc;
});

module.exports = doc;