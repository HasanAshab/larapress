import { Schema } from "mongoose";

/**
 * Plugin to exclude (deselect) hidden fields from query
 */
export default function Hidden(schema: Schema) {
  const hiddenFields = searchHiddenFields(schema).reduce((acc: object, field) => {
    acc[field] = 0;
    return acc;
  }, {});
  
  schema.pre(["find", "findOne"], function() {
    this.select(hiddenFields);
  });
  
  /*
  schema.set('toJSON', {
    versionKey:false,
    transform: (doc, ret) => {
      ret.id = ret._id.toHexString();
      delete ret._id;
      hiddenFields.forEach(field => {
        delete ret[field];
      });
    }
  });
  */

}

/**
 * Search fields that have a options `{ hide: true }` in the schema
 */
function searchHiddenFields(schema: Schema) {
  const hiddenFields: string[] = [];
  for(const field in schema.obj) {
    const fieldData = schema.obj[field];
    if(isPureObject(fieldData) && fieldData.hide) {
      hiddenFields.push(field);
    }
  }
  return hiddenFields;
}
