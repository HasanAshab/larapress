import { Schema, Document } from "mongoose";
import config from "config";
import bcrypt from "bcryptjs";


export interface AuthenticatableDocument extends Document {
  setPassword(password: string): Promise<void>;
  attempt(password: string): Promise<boolean>;
}

export default (schema: Schema) => {
  const bcryptRounds = config.get<number>("bcrypt.rounds");

  schema.methods.setPassword = async function (password: string) {
    this.password = await bcrypt.hash(password, bcryptRounds);
  }
  
  schema.methods.attempt = function (password: string) {
    return bcrypt.compare(password, this.password);
  }
};
