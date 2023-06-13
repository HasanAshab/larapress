import { model, Schema, Document, InferSchemaType } from "mongoose";
import bcrypt from "bcryptjs";
import Timestamps, { ITimestamps } from "app/plugins/Timestamps";

const TokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  token: {
    type: String,
    required: true
  },
  for: {
    type: String,
    required: true
  }
});

TokenSchema.pre("save", async function(next) {
  const bcryptRounds = Number(process.env.BCRYPT_ROUNDS);
  if (!this.isModified("token")) {
    return next();
  }
  const hash = await bcrypt.hash(this.token, bcryptRounds);
  this.token = hash;
  next();
});

TokenSchema.plugin(Timestamps);

export interface IToken extends Document, InferSchemaType<typeof TokenSchema>, ITimestamps {};

export default model<IToken>("Token", TokenSchema);