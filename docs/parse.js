const { base, getVersion, generateEndpointsFromDirTree } = require("helpers");
const path = require("~/path");
const fs = require("~/fs");
const baseDoc = require("~/docs/base");

const rootDoc = {};
const subDocRootPath = "docs/parts";
const versions = fs.readdirSync(subDocRootPath);
for (const version of versions) {
  baseDoc.basePath += version;
  baseDoc.info.version = version;
  const endpointPathPair = generateEndpointsFromDirTree(
    path.join(subDocRootPath, version)
  );
  for (const [endpoint, docPath] of Object.entries(endpointPathPair)) {
    const pathDoc = require(docPath);
    for (const [method, methodDoc] of Object.entries(pathDoc)) {
      delete methodDoc.admin;
      delete methodDoc.auth;
      delete methodDoc.benchmark;
      
      methodDoc.parameters = [];
      try {
        const version = getVersion(docPath);
        const Validation = require(
          path.join(
            `app/http/${version}/validations/`,
            methodDoc.validationPath
          
        )).default;
        const { urlencoded, multipart } = Validation;
        if (typeof urlencoded !== "undefined") {
          for (const param of urlencoded.rules.$_terms.keys) {
            const parameter = {
              name: param.key,
              in: urlencoded.target,
              type: param.schema.type,
              required: param.schema._flags.presence === "required",
            };
            if(param.schema.type === "object"){
              parameter.properties = {};
              for(const nestedParam of param.schema.$_terms.keys){
                parameter.properties[nestedParam.key] = {
                  type: nestedParam.schema.type,
                }
              }
            }
            methodDoc.parameters.push(parameter);
          }
        }
        if (typeof multipart !== "undefined") {
          methodDoc.consumes = ["multipart/form-data"];
          for (const [name, { rules }] of Object.entries(multipart.object)) {
            const parameter = {
              name,
              in: "formData",
              type: rules.mimetypes.join(", "),
              required: rules.required,
            };
            methodDoc.parameters.push(parameter);
          }
        }
      } catch (e) {
        continue;
      }
      pathDoc[method] = methodDoc;
    }

    baseDoc.paths[endpoint] = pathDoc;
  }
  rootDoc[version] = baseDoc;
}

module.exports = rootDoc;
