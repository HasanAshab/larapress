import {
  Document,
  Schema
} from 'mongoose';
import Mailable from "illuminate/mails/Mailable";
import Mail from "illuminate/utils/Mail";
import { IUser } from "app/models/User";

declare module "app/models/User" {
  interface IUser {
    notify(mailable: Mailable): Promise < void >;
  }
}

export default function(schema: Schema) {
  schema.methods.notify = async function(mailable: Mailable) {
    return await Mail.to(this.email).send(mailable);
  };
}