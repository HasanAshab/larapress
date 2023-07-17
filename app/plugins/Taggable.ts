import { Schema, Document, Model } from "mongoose";

export interface TaggableDocument extends Document {
  tags: string[];
  addTags(tags: string[]): Promise<Schema>;
  removeTags(tags: string[]): Promise<Schema>;
}

export interface TaggableModel extends Model<TaggableDocument> {
  addTags(id: string, tags: string[]): Promise<Schema>;
  removeTags(id: string, tags: string[]): Promise<Schema>;
}


export default (schema: Schema) => {
  schema.add({
    tags: [String]
  });
  
  schema.index({ tags: "text" });
  
  schema.methods.addTags = async function (tags: string[]) {
    this.tags.push(...tags);
    await this.save();
    return this;
  };

  schema.methods.removeTags = async function (tags: string[]) {
    this.tags = this.tags.filter((tag: string) => !tags.includes(tag));
    await this.save();
    return this;
  };

  schema.statics.addTags = async function (id: string, tags: string[]) {
    const doc = await this.findById(id);
    if (!doc) {
      throw new Error("Document not found");
    }

    doc.tags.push(...tags);
    await doc.save();
    return doc;
  };

  schema.statics.removeTags = async function (id: string, tags: string[]) {
    const doc = await this.findById(id);
    if (!doc) {
      throw new Error("Document not found");
    }

    doc.tags = doc.tags.filter((tag: string) => !tags.includes(tag));
    await doc.save();
    return doc;
  };
};