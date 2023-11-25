import { Schema } from "mongoose";

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


/**
 * Plugin to exclude (deselect) hidden fields from query
 */
export default function Hidden(schema: Schema) {
  const hiddenFields = searchHiddenFields(schema).reduce((acc: Record<string, number>, field) => {
    acc[field] = 0;
    return acc;
  }, {});
  
  schema.pre(/find*/, function() {
    this.select(hiddenFields);
  });
  
  function transformDocument() {
    this.id = this._id.toHexString();
    delete this._id;
    delete this.__v;
    return this;
  }

  
  schema.post(/find/, function(result) {
    if(this._mongooseOptions.lean) {
      if(Array.isArray(result))
        result.forEach(doc => doc.toJSON = transformDocument);
      else result.toJSON = transformDocument;
    }
    this.select(hiddenFields);
  });
  
  schema.set('toJSON', {
    transform: (doc, ret) => transformDocument.apply(ret)
  });
}