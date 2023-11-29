import { Request } from "express";
import { Document, LeanDocument } from "mongoose";
import { last } from "lodash";

export default class CursorPaginator<DocType extends Document> {
  constructor(protected req: Request, protected items: DocType[] | LeanDocument<DocType>[], protected perPage: number, protected cursor?: string) {
    this.req = req;
    this.items = items;
    this.perPage = perPage;
    this.cursor = cursor;
  }
  
  static getCursorOf(item: Document | LeanDocument) {
    return item._id.toHexString();
  }
  
  get nextCursor() {
    return CursorPaginator.getCursorOf(last(this.items));
  }
  
  get nextPageUrl() {
    const query = new URLSearchParams(this.req.query);
    query.append("cursor", this.nextCursor);
    return `${this.req.fullPath}?${query.toString()}`;
  }

  toObject() {
    return {
      data: this.items,
      links: {
        nextPage: this.nextPageUrl
      },
      meta: {
        path: this.req.fullPath,
        perPage: this.perPage,
        nextCursor: this.nextCursor
      }
    }
  }
  
  toJSON() {
    return this.toObject();
  }
}
