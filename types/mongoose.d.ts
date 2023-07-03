import { Document, Model } from 'mongoose';

declare module 'mongoose' {
  interface Model<TRawDocType, TQueryHelpers = {}, TInstanceMethods = {}, TVirtuals = {}, THydratedDocumentType = HydratedDocument<TRawDocType, TVirtuals & TInstanceMethods, TQueryHelpers>, TSchema = any  > {
    modelName: string;
  }
}
