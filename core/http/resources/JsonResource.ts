import { Request } from "~/core/express";
import { Document, LeanDocument } from "mongoose";
import CursorPaginator from "DB/plugins/Paginate/CursorPaginator";

export default abstract class JsonResource<DocType extends Document> {
  wrap = "data";
  
  constructor(protected readonly document: DocType | LeanDocument<DocType>) {
    this.document = document;
  }
  
  static make(document: DocType | LeanDocument<DocType>) {
    return new this(document);
  }
  
  static collection(items: DocType[] | LeanDocument<DocType>[] | CursorPaginator<DocType>) {
    if(items instanceof CursorPaginator) {
      const paginated = items.toObject();
      paginated.data = paginated.data.map(item => new this(item));
      return paginated;
    }
    return items.map(item => new this(item));
  }
  
  public abstract toObject(req: Request): object; 
}
