import { model, Schema, InferSchemaType } from 'mongoose';
import bcrypt from "bcryptjs";
import Timestamps, { ITimestamps } from "app/traits/Timestamps";

const TokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
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

TokenSchema.pre('save', async function(next) {
  const bcryptRounds = Number(process.env.BCRYPT_ROUNDS);
  if (!this.isModified("token")) {
    return next();
  }
  const hash = await bcrypt.hash(this.token, bcryptRounds);
  this.token = hash;
  next();
});

TokenSchema.plugin(Timestamps);

export type IToken = InferSchemaType<typeof TokenSchema> & ITimestamps;
export default model("Token", TokenSchema);