import { Schema } from "mongoose";
import Mailable from "illuminate/mails/Mailable";
import Mail from "illuminate/utils/Mail";

export type INotifiable = {
  instance: {
    notify(mailable: Mailable): Promise<void>
  }
}


export default (schema: Schema) => {
  schema.methods.notify = async function(mailable: Mailable) {
    return await Mail.to(this.email).send(mailable);
  };
}