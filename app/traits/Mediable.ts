import {
  log
} from "helpers";
import {
  Schema,
  Model
} from "mongoose";
import { UploadedFile } from "express-fileupload";
import URL from "illuminate/utils/URL"
import Media, {
  IMedia
} from "app/models/Media";
import {
  promises as fs
} from "fs";
import Storage from "illuminate/utils/Storage";

export type IMediable = {
  media: Schema.Types.ObjectId[],
  files(): Promise < IMedia[] >,
  attachFile(name: string, file: UploadedFile, attachLinkToModel?: boolean): Promise < IMedia >,
  attachFiles(files: Record < string, UploadedFile >, attachLinkToModel?: boolean): Promise < IMedia[] >,
  getFilesByName(name: string): Promise < IMedia[] >,
  removeFiles(name?: string): Promise < void >,
}

interface IMediableModel extends Model < IMediable > {
  modelName: string;
}

export default (schema: Schema) => {
  schema.add({
    media: [{
      type: Schema.Types.ObjectId,
      ref: "Media",
    }],
  });

  schema.methods.files = async function (): Promise <IMedia[]> {
    return await Media.find({
      mediableId: this._id,
      mediableType: (this.constructor as IMediableModel).modelName,
    });
  }

  schema.methods.attachFile = async function (name: string, file: UploadedFile, attachLinkToModel = false): Promise <IMedia> {
    const path = await Storage.putFile("public/uploads", file);
    let media = new Media({
      name,
      mediableId: this._id,
      mediableType: (this.constructor as IMediableModel).modelName,
      mimetype: file.mimetype,
      path,
    });
    const link = URL.route("file.serve", {
      id: media._id.toString()
    });
    media.link = link;
    await media.save()
    if (attachLinkToModel) {
      this[`${name}Url`] = link;
    }
    this.media.push(media._id);
    await this.save();
    return media;
  }
  
  schema.methods.attachFiles = async function (files: Record<string, UploadedFile>, attachLinkToModel?: boolean): Promise < IMedia[] > {
    const allMedia: IMedia[] = [];
    for (const [name, file] of Object.entries(files)) {
      const path = await Storage.putFile("public/uploads", file);
      const media = new Media({
        name,
        mediableId: this._id,
        mediableType: (this.constructor as IMediableModel).modelName,
        mimetype: file.mimetype,
        path,
      });
      media.link = URL.route("file.serve", {
        id: media._id.toString()
      });
      this.media.push(media._id);
      allMedia.push(media);
      if (attachLinkToModel) {
        this[`${name}Url`] = media.link;
      }
    }
    await Media.insertMany(allMedia);
    await this.save();
    return allMedia;
  }

  schema.methods.getFiles = async function (name?: string): Promise < (typeof Media)[] > {
    return await Media.find({
      name,
      mediableType: (this.constructor as IMediableModel).modelName,
      mediableId: this._id,
    });
  }

  schema.methods.removeFiles = async function (name?: string) {
    const files = await this.getFiles(name);
    if (process.env.NODE_ENV !== "test") {
      for (const file of files) {
        try {
          await fs.unlink(file.path);
        }
        catch(err: any) {
          log(err);
        }
      }
    }
    await Media.deleteMany({
      name,
      mediableType: (this.constructor as IMediableModel).modelName,
      mediableId: this._id,
    });
  }
}