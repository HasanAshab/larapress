import { Schema, Document } from "mongoose";
import { UploadedFile } from "express-fileupload";
import Storage from "Storage";
import Media, { IMedia, MediaDocument } from "~/app/models/Media";

export interface ReplaceOptions {
  storagePath?: string;
  visibility?: "public" | "private";
}

export interface MediableDocument extends Document {
  media(): {
    then(onFulfill?: ((value: MediaDocument[]) => void) | undefined, onReject?: ((reason: any) => void) | undefined): Promise<MediaDocument[]>;
    withTag(tag: string): {
      then(onFulfill?: ((value: MediaDocument[]) => void) | undefined, onReject?: ((reason: any) => void) | undefined): Promise<MediaDocument[]>;
      first(onFulfill?: ((value: MediaDocument | null) => void) | undefined, onReject?: ((reason: any) => void) | undefined): Promise<MediaDocument | null>;
      attach(file: UploadedFile, storagePath: string): {
        then(onFulfill?: ((value: MediaDocument) => void) | undefined, onReject?: ((reason: any) => void) | undefined);
        asPrivate(): Promise<MediaDocument>;
      };
      replaceBy(file: UploadedFile, options?: ReplaceOptions): Promise<MediableDocument>;
      detach(): Promise<any>;
    };
  };
}

export default (schema: Schema) => {
  schema.methods.media = function (this: MediableDocument) {
    const metadata = {
      mediableId: this._id,
      mediableType: this.constructor.modelName,
    };

    const getMedia = (onFulfill, onReject) => Media.find(metadata).then(onFulfill, onReject);

    const withTag = (tag: string) => {
      const filter = { tag, ...metadata };

      const getMediaByTag = (onFulfill, onReject) => Media.find(filter).then(onFulfill, onReject);
      
      const first = () => Media.findOne(filter);

      const attach = (file: UploadedFile, storagePath: string) => {
        let visibility = "public";

        const attachMedia = (onFulfill, onReject) => {
          Storage.putFile(storagePath, file).then((path) => {
            Media.create({ path, visibility, ...filter }).then(onFulfill, onReject);
          });
        };

        const asPrivate = () => {
          return new Promise<MediableDocument>((resolve, reject) => {
            visibility = "private";
            attachMedia(resolve, reject);
          });
        };
        return { then: attachMedia, asPrivate };
      };
      
      const replaceBy = async (file: UploadedFile) => {
        const media = await Media.findOne(metadata);
        await Storage.put(media.path, file.data);
        
      };


      const detach = async () => {
        const media = await Media.find(filter);
        const paths = media.map((item) => item.path);
        await Storage.delete(paths);
        return Media.deleteMany(filter);
      };

      return { then: getMediaByTag, first, attach, detach };
    };

    return { then: getMedia, withTag };
  };
}
