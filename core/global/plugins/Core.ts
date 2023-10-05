import { Schema, Model, Document } from "mongoose";
import DocumentNotFoundException from "~/app/exceptions/DocumentNotFoundException";

export default (schema: Schema) => {
  function assertExists(doc: unknown) {
    if(!doc)
      throw new DocumentNotFoundException();
  }
  
  Model.findOneOrFail = async function(...args: Parameters<Model<Document>["findOne"]>) {
    const doc = await this.findOne(...args) 
    assertExists(doc);
    return doc;
  }
  
  Model.findByIdOrFail = async function(id: string) {
    const doc = await this.findById(id)
    assertExists(doc);
    return doc;
  }
}