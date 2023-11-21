import { Schema, Document } from "mongoose";

/**
 * Plugin to hide fields from document
*/
export default function Hidden(schema: Schema) {
  const hiddenFields = searchHiddenFields();

  schema.set('toJSON', {
    versionKey:false,
    transform: (doc, ret) => {
      console.log(doc, ret)
      ret.id = ret._id.toHexString();
      delete ret._id;
      hiddenFields.forEach(field => {
        delete ret[field];
      });
    }
  });
  
  function searchHiddenFields() {
    const hiddenFields: string[] = [];
    for(const field in schema.obj) {
      const fieldData = schema.obj[field];
      if(isPureObject(fieldData) && fieldData.hide) {
        hiddenFields.push(field);
      }
    }
    return hiddenFields;
  }
}
