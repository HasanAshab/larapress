import { Schema, Document } from "mongoose";
import { UploadedFile } from "express-fileupload";
import Storage from "Storage"
import URL from "URL"
import { promises as fs } from "fs"

export interface AttachableDocument extends Document {
  attachments: AttachmentQuery;
  attach(name: string, file: UploadedFile, attachLinkToModel?: boolean): Promise<IAttachment>;
  attachMany(files: Record<string, UploadedFile>, attachLinkToModel?: boolean): Promise<IAttachment[]>;
  detach(name: string): Promise<void>;
  detachAll(): Promise<void>;
}

export default (schema: Schema, attachmentFields: string[]) => {
  schema.methods.attach = async function (field: string, file: UploadedFile) {
    Storage.mock()
    const fileMeta = {};
    fileMeta.path = await Storage.putFile("public/uploads", file);
    /*fileMeta.url = await URL.signedRoute("file.serve", {
      id: attachment._id.toString()
    });*/
   // console.log(this[field].push({foo: 2}))
    if(Array.isArray(schema.tree[field]))
      this[field].push(fileMeta)
    else
      this[field] = fileMeta;


   //return fileMeta;
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