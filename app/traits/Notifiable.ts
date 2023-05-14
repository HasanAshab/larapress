import { Schema, Document, Model } from 'mongoose';
import Mailable from "illuminate/mails/Mailable";
import Mail from "illuminate/utils/Mail";

export default function (schema: Schema){
  schema.methods.notify = async function(mailable: Mailable) {
    return await Mail.to(this.email).send(mailable);
  };
}