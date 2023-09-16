import { Schema, Document } from "mongoose";
import { UploadedFile } from "express-fileupload";
import Storage from "Storage"
import URL from "URL"
import { promises as fs } from "fs"
import { log } from "helpers";

export interface FileMeta {
  name: string;
  url: string;
}

export interface AttachableDocument extends Document {
  attach(field: string, file: UploadedFile): Promise<FileMeta>;
  detach(field: string): void;
}


export interface FieldOptions {
  multiple?: boolean
}

export default (schema: Schema, options: Record<string, FieldOptions>) => {
  schema.add(generateAttachableFields());
  
  schema.pre(["deleteOne", "deleteMany"], async function(next) {
    const query = this.getQuery();
    const method = (this as any).op === "deleteMany" ? "find" : "findOne";
    let docs = await (this.model as any)[method](query, Object.keys(options));
    next();
    docs = Array.isArray(docs) ? docs : [docs];
    docs.forEach(doc => {
      for(const field in doc.toObject()) {
        if(field !== "_id")
          deleteFile(doc[field]).catch(log)
      }
    });
  });

  schema.methods.attach = async function (field: string, file: UploadedFile) {
    const fileMeta = {};
    fileMeta.name = await Storage.putFile("public/uploads", file);
    fileMeta.url = await URL.signedRoute("file.serve", { path: "uploads/" + fileMeta.name });
    if(Array.isArray(this[field]))
      this[field].push(fileMeta)
    else
      this[field] = fileMeta;
    return fileMeta;
  }
  
  schema.methods.detach = function (field: string) {
    if(Array.isArray(this[field])) { 
      for (const fileMeta of this[field]) {
        deleteFile(fileMeta).catch(log);
      }
      this[field] = [];
    }
    else {
      console.log(this)
      deleteFile(this[field]).catch(log);
      this[field] = null;
    }
  }

  function generateAttachableFields() {
    const attachableFields = {};
    for(const field in options) {
      if(options[field].multiple){
        attachableFields[field] = {
          type: [{
            _id: false,
            name: String,
            url: String
          }],
          default: []
        }
      }
      else {
        attachableFields[field] = {
          type: {
            _id: false,
            name: String,
            url: String
          },
          default: null
        }
      }
    }
    return attachableFields;
  }
  
  function deleteFile(meta: FileMeta) {
    if(!Storage.isMocked)
      return fs.unlink("storage/public/uploads/" + meta.name);
  }

}