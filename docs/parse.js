const { base, url, getVersion } = require("../helpers");
global.base = base;
global.url = url;
const path = require("path");
const fs = require("fs");
const { generateEndpointsFromDirTree } = require(base("illuminate/utils"));
const baseDoc = require(base("docs/base"));

const rootDoc = {};
const subDocRootPath = base("docs/parts");
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
      methodDoc.parameters = [];
      try {
        const version = getVersion(docPath);
        const Validation = require(base(
          path.join(
            `app/http/${version}/validations/`,
            methodDoc.validationPath
          )
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
