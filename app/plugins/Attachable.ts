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
  detach(field: string): Promise<void>;
}

export default (schema: Schema) => {
  function deleteFile(meta: FileMeta) {
    if(!Storage.isMocked)
      return fs.unlink("storage/public/uploads/" + meta.name);
  }
  
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
  
  schema.methods.detach = async function (field: string) {
    if(Array.isArray(this[field])) { 
      for (const fileMeta of this[field]) {
        deleteFile(fileMeta).catch(log);
      }
      this[field] = [];
    }
    else {
      deleteFile(this[field]).catch(log);
      this[field] = null;
    }
  }

}