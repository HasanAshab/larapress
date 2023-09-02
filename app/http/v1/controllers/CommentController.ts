import { Request } from "express";
//import Comment, { IComment } from "~/app/models/Comment";
import { isCommentableDocument } from "~/app/plugins/Commentable";
import { model } from "mongoose";

export default class CommentController {
  async index(req: Request) {
    /*
    const { modelName, id } = req.params;
    const doc = model(modelName).findById(id);
    if(!isCommentableDocument(doc)) return { status: 404 };
    if(await req.user.can("readComments", doc)){
      return await doc.comments;
    }
    return {
      status: 401,
      message: "Unauthorized"
    }*/
  }
}

