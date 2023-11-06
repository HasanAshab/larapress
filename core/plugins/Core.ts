import { Schema, Model, Document } from "mongoose";
import DocumentNotFoundException from "~/app/exceptions/DocumentNotFoundException";

/**
 * Core plugin to add base helpers
*/
export default (schema: Schema) => {
  function assertExists(doc: unknown) {
    if(!doc) {
      throw new DocumentNotFoundException();
    }
  }
  
  schema.statics.findOneOrFail = async function(...args: Parameters<Model<Document>["findOne"]>) {
    const doc = await this.findOne(...args) 
    assertExists(doc);
    return doc;
  }
  
  schema.statics.findByIdOrFail = async function(id: string) {
    const doc = await this.findById(id)
    assertExists(doc);
    return doc;
  }
  
  schema.methods.refresh = async function() {
    const latestData = await (this.constructor as typeof Model).findById(this._id);
    return Object.assign(this, latestData._doc);
  }
}