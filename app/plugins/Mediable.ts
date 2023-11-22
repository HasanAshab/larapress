/*import { Schema, Document } from "mongoose";
import { UploadedFile } from "express-fileupload";
import Storage from "Storage";
import Media, { IMedia, MediaDocument } from "~/app/models/Media";

export interface ReplaceOptions {
  storagePath?: string;
  visibility?: "public" | "private";
}

export interface MediableDocument extends Document {
  media(): Media
}

class Media {
  constructor(private readonly document: Document) {
    this.document = document;
  }
  
  private get metadata() {
    return {
      mediableId: this.document._id,
      mediableType: this.document.constructor.modelName
    }
  }
  
  private async exec(op) {
    Media[op]();
  }

  const getMedia = (onFulfill, onReject) => Media.find(metadata).then(onFulfill, onReject);

  const withTag = (tag: string) => {
    const filter = { tag, ...metadata };

    const getMediaByTag = (onFulfill, onReject) => Media.find(filter).then(onFulfill, onReject);
    
    const first = () => Media.findOne(filter);

    const attach = (file: UploadedFile, storagePath = "uploads") => {
      let visibility = "public";
      let storeRefIn = null;
      
      const attachMedia = (onFulfill, onReject) => {
        Storage.putFile(storagePath, file).then(path => {
          Media.create({ path, visibility, ...filter }).catch(onReject).then(media => {
            if(storeRefIn) {
              this[storeRefIn] = media._id;
            }
            onFulfill(media);
          });
        });
      };

      function asPrivate() {
        visibility = "private";
        return this;
      };
      
      function storeRef(field = tag) {
        storeRefIn = field;
        return this;
      };
      
      return { then: attachMedia, asPrivate, storeRef };
    };
    
    const replaceBy = async (file: UploadedFile) => {
      const media = await Media.findOne(metadata);
      media && await Storage.put(media.path, file.data);
    };

    const detach = async () => {
      const media = await Media.find(filter);
      const paths = media.map((item) => item.path);
      await Storage.delete(paths);
      return Media.deleteMany(filter);
    };

    return { then: getMediaByTag, first, attach, replaceBy, detach };
  };

  return { then: getMedia, withTag };
};





export default (schema: Schema) => {
  schema.methods.media = new Media(schema)
}
*/

export default new Function