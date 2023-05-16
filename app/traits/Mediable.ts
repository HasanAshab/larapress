import { File } from "types";
import { route } from "helpers";
import mongoose, { Schema, Model } from "mongoose";
import Media from "app/models/Media";
import Storage from "illuminate/utils/Storage";

export type IMediable = {
  files(): Promise<(typeof Media)[]>;
  attachFile(name: string, file: File, attachLinkToModel?: boolean): Promise<typeof Media>;
  attachFiles(files: Record<string, File>, attachLinkToModel?: boolean): Promise<(typeof Media)[]>;
  getFilesByName(name: string): Promise<(typeof Media)[]>;
  removeFiles(name?: string): Promise<any>;
}

interface IMediableModel extends Model<IMediable> {
  modelName: string;
}

export default (schema: Schema) => {
  schema.add({
    media: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
    }],
  });

  schema.methods.files = async function (): Promise<(typeof Media)[]> {
    return await Media.find({
      mediableId: this._id,
      mediableType: (this.constructor as IMediableModel).modelName,
    });
  }

  schema.methods.attachFile = async function (name: string, file: File, attachLinkToModel = false): Promise<typeof Media> {
    const path = await Storage.putFile("public/uploads", file);
    const media = new Media({
      name,
      mediableId: this._id,
      mediableType: (this.constructor as IMediableModel).modelName,
      mimetype: file.mimetype,
      path,
    });
    const link = route("file.serve", { id: media._id });
    media.link = link;
    await media.save();
    if(attachLinkToModel){
      this[`${name}Url`] = link;
    }
    this.media.push(media._id);
    await this.save();
    return media;
  }

  schema.methods.attachFiles = async function (files: Record<string, File>, attachLinkToModel?: boolean): Promise<(typeof Media)[]> {
    const allMedia: (typeof Media)[] = [];
    for (const name of Object.keys(files)) {
      const path = await Storage.putFile("public/uploads", files[name]);
      const media = new Media({
        name,
        mediableId: this._id,
        mediableType: (this.constructor as IMediableModel).modelName,
        mimetype: files[name].mimetype,
        path,
      });
      media.link = route("file.serve", { id: media._id });
      await media.save();
      this.media.push(media._id);
      allMedia.push(media);
      if(attachLinkToModel){
        this[`${name}Url`] = media.link;
      }
    }
    await this.save();
    return allMedia;
  }

  schema.methods.getFilesByName = async function (name: string): Promise<(typeof Media)[]> {
    return await Media.find({
        name,
        mediableType: (this.constructor as IMediableModel).modelName,
        mediableId: this._id,
      });
  }

  schema.methods.removeFiles = async function (name?: string): Promise<any> {
    if(!name){
      return await Media.deleteMany({
        mediableType: (this.constructor as IMediableModel).modelName,
        mediableId: this._id,
      });
    }
    return await Media.deleteMany({
      name,
      mediableType: (this.constructor as IMediableModel).modelName,
      mediableId: this._id,
    });
  }
}
