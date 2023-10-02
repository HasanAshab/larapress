import { Schema, Document } from "mongoose";
import { UploadedFile } from "express-fileupload";
import Storage from "Storage"
import URL from "URL"
import { promises as fs } from "fs"
import { log } from "~/core/utils";

export interface FileMeta {
  name: string;
  url: string;
}

export interface AttachableDocument<T extends object> extends Document {
  attach(field: keyof T, file: UploadedFile): Promise<FileMeta>;
  detach(field: keyof T): void;
}


export interface FieldOptions {
  multiple?: boolean
}

export default (schema: Schema, options: Record<string, FieldOptions>) => {
  const attachableFieldsName = Object.keys(options);
  schema.add(generateAttachableFields());
  
  schema.pre(["deleteOne", "deleteMany"], async function(next) {
    const method = (this as any).op === "deleteMany" ? "find" : "findOne";
    const query = attachableFieldsName.reduce((query, attachableField) => {
      query[attachableField] = {
        $ne: null
      }
      return query;
    }, { ...this.getQuery() });
    
    let docs = await (this.model as any)[method](query).select(attachableFieldsName);
    next();
    docs = Array.isArray(docs) ? docs : [docs];
    for(const doc of docs) {
      for(const field in doc.toObject()) {
        if(field !== "_id")
          deleteFile(doc[field]).catch(log)
      }
    }
  });

  schema.methods.attach = async function (field: string, file: UploadedFile) {
    const fileMeta: FileMeta = { name: '', url: '' };
    fileMeta.name = await Storage.putFile("public/uploads", file);
    fileMeta.url = await URL.signedRoute("file.serve", { path: "uploads/" + fileMeta.name });
    if(Array.isArray(this[field]!))
      this[field]!.push(fileMeta)
    else
      this[field]! = fileMeta;
    return fileMeta;
  }
  
  schema.methods.detach = function (field: string) {
    if(Array.isArray(this[field]!)) { 
      for (const fileMeta of this[field]) {
        deleteFile(fileMeta!).catch(log);
      }
      this[field] = [];
    }
    else {
      deleteFile(this[field]!).catch(log);
      this[field] = null;
    }
  }

  function generateAttachableFields() {
    const attachableFields: Record<string, object> = {};
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
  
/*  function assertAttachable(field: string): asserts  {
    
  }
  */
  async function deleteFile(meta: FileMeta) {
    if(!(Storage as any).isMocked)
      await fs.unlink("storage/public/uploads/" + meta.name);
  }

}