import {
  File
} from "types";
import {
  log,
  route
} from "helpers";
import {
  Schema,
  Model
} from "mongoose";
import Media, {
  IMedia
} from "app/models/Media";
import {
  promises as fs
} from "fs";
import Storage from "illuminate/utils/Storage";

export type IMediable = {
  media: Schema.Types.ObjectId[],
  files(): Promise < (typeof Media)[] >,
  attachFile(name: string, file: File, attachLinkToModel?: boolean): Promise < typeof Media >,
  attachFiles(files: Record < string, File >, attachLinkToModel?: boolean): Promise < (typeof Media)[] >,
  getFilesByName(name: string): Promise < (typeof Media)[] >,
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

  schema.methods.files = async function (): Promise < (typeof Media)[] > {
    return await Media.find({
      mediableId: this._id,
      mediableType: (this.constructor as IMediableModel).modelName,
    });
  }

  schema.methods.attachFile = async function (name: string, file: File, attachLinkToModel = false): Promise < IMedia > {
    const path = await Storage.putFile("public/uploads", file);
    let media = new Media({
      name,
      mediableId: this._id,
      mediableType: (this.constructor as IMediableModel).modelName,
      mimetype: file.mimetype,
      path,
    });
    const link = route("file.serve", {
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

  schema.methods.attachFiles = async function (files: Record < string, File >, attachLinkToModel?: boolean): Promise < IMedia[] > {
    const allMedia: IMedia[] = [];
    for (const name of Object.keys(files)) {
      const path = await Storage.putFile("public/uploads", files[name]);
      const media = new Media({
        name,
        mediableId: this._id,
        mediableType: (this.constructor as IMediableModel).modelName,
        mimetype: files[name].mimetype,
        path,
      });
      media.link = route("file.serve", {
        id: media._id.toString()
      });
      await media.save();
      this.media.push(media._id);
      allMedia.push(media);
      if (attachLinkToModel) {
        this[`${name}Url`] = media.link;
      }
    }
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