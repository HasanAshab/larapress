import { Document, Model } from 'mongoose';

declare module 'mongoose' {
  interface Schema<T extends Document> {
    statics: Model<T> & {
      modelName: string;
    };
  }
}