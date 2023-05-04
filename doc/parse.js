const { generateEndpointsFromDirTree } = require(base("illuminate/foundation"));
const doc = require(base("doc/base"));


const Joi = require("joi");
console.log(
  Joi.object({
    a: Joi.number().required(),
    b: Joi.string().required(),
  }).$_terms.keys[0].schema._flags.presence//type
);


doc.paths = {};
const docRootPath = base("doc/parts");
generateEndpointsFromDirTree(docRootPath, (endpoint, path) => {
  const pathDoc = require(path);
  pathDoc.parameters = [];
  
  doc.paths[endpoint] = pathDoc;
});

module.exports = doc;
//app.use('/docs', swaggerUi.serve, swaggerUi.setup(doc));
