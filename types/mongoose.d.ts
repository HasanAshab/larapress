import { Document, Model } from 'mongoose';

declare module 'mongoose' {
  interface Model<T extends Document> {
    modelName: string;
  }
}
