import { Schema } from "mongoose";
import { Request } from "express";
//import Token from "illuminate/utils/Token";


export default (schema: Schema) => {
  /*
  schema.query.paginate = async function (pageSize: number, cursor?: string) {
    let decoded = null;
    try{
      decoded = Token.decode(cursor);
      this.where('_id')[decoded.type](decoded.id);
    } catch {
      cursor = undefined;
    }
    let docs = await this.sort({_id: decoded?.type === "lt"?-1:1}).limit(pageSize+1);
    if(decoded?.type === "lt") docs = docs.reverse()
    const root = decoded ? decoded.root : docs[0]._id.toString();
    let next = null;
    let previous = null;
    console.log(docs.length)
    console.log(root)
    if (decoded?.type === "lt" || docs.length > pageSize) {
      const cursorData = {
        root,
        id: docs[pageSize - 1]._id.toString(),
        type: "gt"
      }
      console.log(decoded, cursorData)
      next = Token.encode(cursorData)
      docs.length > pageSize && docs.pop();
    }
    console.log(decoded && decoded.root !== docs[0]._id.toString())
    console.log(decoded?.root, docs[0]._id.toString())
    if (decoded && decoded.root !== docs[0]._id.toString()) {
      previous = Token.encode({
        root,
        id: docs[0]._id.toString(),
        type: "lt"
      });
    }
    return {
      count: docs.length,
      data: docs,
      next,
      previous
    };
  };
  */
  (schema.query as any).paginate = async function (this: any, pageSize: number, cursor?: string) {
    if(cursor){
      this.where('_id').gt(cursor);
    } 
    let docs = await this.sort({_id: 1}).limit(pageSize+1);
    let next = null;
    if (docs.length > pageSize) {
      next = docs[pageSize - 1]._id;
      docs.splice(pageSize);
    }
    return {
      data: docs,
      next
    };
  };
  (schema.query as any).paginateReq = function (this: any, req: Request) {
    const { limit, cursor } = req.query;
    return this.paginate(typeof limit === "string" ? Number(limit) : 20, typeof cursor === "string" ? cursor : undefined);
  }
}