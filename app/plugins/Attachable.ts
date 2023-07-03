import { Schema } from "mongoose";
import Attachment, { IAttachment } from "app/models/Attachment";
import { UploadedFile } from "express-fileupload";
import Storage from "illuminate/utils/Storage"
import URL from "illuminate/utils/URL"
import { promises as fs } from "fs"
export type IAttachable = {
  instance: {
    attachments: IAttachable[];
    getAttachmentsByName(name?: string): Promise<IAttachable[]>;
    attach(name: string, file: UploadedFile, attachLinkToModel?: boolean): Promise<IAttachment>;
    attach(files: Record<string, UploadedFile>, attachLinkToModel?: boolean): Promise<IAttachment[]>;
    detach(name?: string): Promise<void>;
  }
}

export default (schema: Schema) => {
  schema.virtual('attachments').get(function () {
    return Attachment.find({
      attachableId: this._id,
      attachableType: (this.constructor as any).modelName,
    });
  });

  schema.methods.getAttachmentsByName = function (name?: string) {
    return name ? this.attachments.where("name").equals(name) : this.attachments;
  }

  schema.methods.attach = async function (name: string, file: UploadedFile, attachLinkToModel = false) {
    const path = await Storage.putFile("public/uploads", file);
    let attachment = new Attachment({
      name,
      attachableId: this._id,
      attachableType: (this.constructor as any).modelName,
      mimetype: file.mimetype,
      path,
    });
    const link = URL.signedRoute("file.serve", {
      id: attachment._id.toString()
    });
    attachment.link = link;
    await attachment.save()
    if (attachLinkToModel) {
      this[`${name}Url`] = link;
    }
    return attachment;
  }
  
  schema.methods.attach = async function (files: Record<string, UploadedFile>, attachLinkToModel = false) {
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
      attachment.link = URL.signedRoute("file.serve", {
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
    const files = await this.getAttachmentsByName(name);
    if (process.env.NODE_ENV !== "test") {
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

}