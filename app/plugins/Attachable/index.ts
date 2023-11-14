import { Schema, Document } from "mongoose";
import { UploadedFile } from "express-fileupload";
import Storage from "Storage";
import URL from "URL";
import Media, { IMedia } from "~/app/models/Media";

export interface AttachableDocument extends Document {
  attach(field: string, file: UploadedFile): Promise<FileMeta>;
  detach(field: string): Promise<void>;
}

export default function AttachablePlugin(schema: Schema) {
  schema.methods.media = function() {
    const metadata = {
      mediableId: this._id,
      mediableType: this.constructor.modelName
    };

    const query = Media.find(metadata);
    
    const then = (res, rej) => query.exec().then(res, rej);

    const withTag = (tag: string) => {
      const then = (res, rej) => query.where("tag").equals(tag).exec().then(res, rej);
      const first = (res, rej) => query.findOne({ tag }).exec().then(res, rej);
      
      const attach = (file: UploadedFile, storagePath: string) => {
        let visibility = "public";
        const then = (res, rej) => {
          return Storage.putFile(storagePath, file).then(path => {
            Media.create({ tag, path, visibility, ...metadata }).then(res, rej);
          });
        }
        
        const asPrivate = () => {
          visibility = "private";
          return then();
        }
        return { then, asPrivate };
      }
      
      const detach = () => {
        return query.deleteMany({ tag });
      }
      
      return { then, first, attach, detach };
    }
    
    return { then, withTag }
  }
}