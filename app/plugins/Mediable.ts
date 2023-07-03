import { log } from "helpers";
import { Schema } from "mongoose";
import { UploadedFile } from "express-fileupload";
import URL from "illuminate/utils/URL"
import Media, { IMedia } from "app/models/Media";
import { promises as fs } from "fs";
import Storage from "illuminate/utils/Storage";

export type IMediable = {
  instance: {
    media: IMedia[],
    files(): Promise < IMedia[] >,
    attachFile(name: string, file: UploadedFile, attachLinkToModel?: boolean): Promise < IMedia >,
    attachFiles(files: Record < string, UploadedFile >, attachLinkToModel?: boolean): Promise < IMedia[] >,
    getFilesByName(name: string): Promise < IMedia[] >,
    removeFiles(name?: string): Promise < void >
  }
}

export default (schema: Schema) => {
  schema.virtual('media').get(function () {
      return Media.find({
        mediableId: this._id,
        mediableType: this.constructor.modelName,
      });
  });

  schema.methods.attachFile = async function (name: string, file: UploadedFile, attachLinkToModel = false): Promise <IMedia> {
    const path = await Storage.putFile("public/uploads", file);
    let media = new Media({
      name,
      mediableId: this._id,
      mediableType: this.modelName,
      mimetype: file.mimetype,
      path,
    });
    const link = URL.signedRoute("file.serve", {
      id: media._id.toString()
    });
    media.link = link;
    await media.save()
    if (attachLinkToModel) {
      this[`${name}Url`] = link;
    }
    return media;
  }
  
  schema.methods.attachFiles = async function (files: Record<string, UploadedFile>, attachLinkToModel?: boolean): Promise < IMedia[] > {
    const allMedia: IMedia[] = [];
    for (const [name, file] of Object.entries(files)) {
      const path = await Storage.putFile("public/uploads", file);
      const media = new Media({
        name,
        mediableId: this._id,
        mediableType: this.modelName,
        mimetype: file.mimetype,
        path,
      });
      media.link = URL.signedRoute("file.serve", {
        id: media._id.toString()
      });
      allMedia.push(media);
      if (attachLinkToModel) {
        this[`${name}Url`] = media.link;
      }
    }
    await Media.insertMany(allMedia);
    return allMedia;
  }

  schema.methods.getFiles = function (name?: string): Promise < (typeof Media)[] > {
    return name ? this.media.where("name").equals(name) : this.media;
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
      mediableType: this.modelName,
      mediableId: this._id,
    });
  }
}