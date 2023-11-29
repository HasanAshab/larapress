import { Request } from "~/core/express";
import { Document, LeanDocument } from "mongoose";
import CursorPaginator from "DB/plugins/Paginate/CursorPaginator";
import AnonymousResourceCollection from "./AnonymousResourceCollection";

export default abstract class JsonResource<DocType extends Document> {
  static wrap = "data";
  
  constructor(protected readonly resource: DocType | LeanDocument<DocType>) {
    this.resource = resource;
  }
  
  static make(resource: DocType | LeanDocument<DocType>) {
    return new this(resource);
  }
  
  static collection(resource: DocType[] | LeanDocument<DocType>[] | CursorPaginator<DocType>) {
    return new AnonymousResourceCollection(resource, this);
  }
  
  transform(req: Request, isRoot = true) {
    return isRoot 
      ? { [this.c.wrap]: this.toObject(req) }
      : this.toObject(req);
  }

  public abstract toObject(req: Request): object; 
}
