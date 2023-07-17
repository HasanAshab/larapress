import { model, Schema, Model, Document, InferSchemaType } from "mongoose";
import HasFactory, { HasFactoryModel } from "app/plugins/HasFactory";
import Polymorphable from "app/plugins/Polymorphable";
import { IUser } from "app/models/User";

const VoteSchema = new Schema({
  reaction: {
    required: true,
    type: String,
    enum: ["like", "dislike"]
  }
},
{ timestamps: true }
);


VoteSchema.plugin(HasFactory);
VoteSchema.plugin(Polymorphable, "voteable");
VoteSchema.plugin(Polymorphable, "voter");

export interface IVote extends Document, InferSchemaType<typeof VoteSchema> {
  voteable: Document;
  voter: IUser;
};

interface VoteModel extends Model<IVote>, HasFactoryModel {};
export default model<IVote, VoteModel>("Vote", VoteSchema);