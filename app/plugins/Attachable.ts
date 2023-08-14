import { Schema, Document } from "mongoose";
import Attachment, { IAttachment, AttachmentQuery } from "app/models/Attachment";
import { UploadedFile } from "express-fileupload";
import Storage from "illuminate/utils/Storage"
import URL from "illuminate/utils/URL"
import { promises as fs } from "fs"

export interface AttachableDocument extends Document {
  attachments: AttachmentQuery;
  attach(name: string, file: UploadedFile, attachLinkToModel?: boolean): Promise<IAttachment>;
  attachMany(files: Record<string, UploadedFile>, attachLinkToModel?: boolean): Promise<IAttachment[]>;
  detach(name: string): Promise<void>;
  detachAll(): Promise<void>;
}

export default (schema: Schema) => {
  schema.virtual('attachments').get(function () {
    return Attachment.find({
      attachableId: this._id,
      attachableType: (this.constructor as any).modelName,
    });
  });
  
  schema.pre<AttachableDocument>(["deleteOne", "deleteMany"], function(next) {
    Attachment.deleteMany({
      attachableId: this._id,
      attachableType: (this.constructor as any).modelName,
    });
    next();
  });

  schema.methods.attach = async function (name: string, file: UploadedFile, attachLinkToModel = false) {
    const path = await Storage.putFile("public/uploads", file);
    let attachment = new Attachment({
      name,
      attachableId: this._id,
      attachableType: (this.constructor as any).modelName,
      mimetype: file.mimetype,
      path
    });
    const link = await URL.signedRoute("file.serve", {
      id: attachment._id.toString()
    });
    attachment.link = link;
    await attachment.save()
    if (attachLinkToModel) {
      this[`${name}Url`] = link;
    }
    return attachment;
  }
  
  schema.methods.attachMany = async function (files: Record<string, UploadedFile>, attachLinkToModel = false) {
    const attachments: IAttachment[] = [];
    for (const [name, file] of Object.entries(files)) {
      const path = await Storage.putFile("public/uploads", file);
      const attachment = new Attachment({
        name,
        attachableId: this._id,
        attachableType: (this.constructor as any).modelName,
        mimetype: file.mimetype,
        path,
      });
      attachment.link = await URL.signedRoute("file.serve", {
        id: attachment._id.toString()
      });
      attachments.push(attachment);
      if (attachLinkToModel) {
        this[`${name}Url`] = attachment.link;
      }
    }
    await Attachment.insertMany(attachments);
    return attachments;
  }
  
  schema.methods.detach = async function (name?: string) {
    const files = await this.attachments.where("name").equals(name);
    if (!(Storage as any).isMocked) {
      for (const file of files) {
        await fs.unlink(file.path);
      }
    }
    await Attachment.deleteMany({
      name,
      attachableType: (this.constructor as any).modelName,
      attachableId: this._id,
    });
  }

  schema.methods.detachAll = async function () {
    const files = await this.attachments;
    if (!(Storage as any).isMocked) {
      for (const file of files) {
        await fs.unlink(file.path);
      }
    }
    await this.attachments.deleteMany();
  }
}