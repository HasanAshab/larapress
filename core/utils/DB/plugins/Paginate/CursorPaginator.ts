import { Request } from "express";
import { Document, LeanDocument } from "mongoose";
import { last } from "lodash";

export default class CursorPaginator<DocType extends Document> {
  constructor(req: Request, items: DocType[] | LeanDocument<DocType>[], perPage: string, cursor?: string) {
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
    const separator = this.req.fullUrl.includes("?") ? "&" : "?";
    const cursorQuery = this.cursor ? `${separator}cursor=${this.cursor}` : "";
    return `${this.req.fullUrl}${cursorQuery}`;
  }

  toObject() {
    return {
      "data": this.items,
      "path": this.req.fullPath,
      "perPage": this.perPage,
      "nextCursor": this.nextCursor,
      "nextPageUrl": this.nextPageUrl
    }
  }
  
  toJSON() {
    return this.toObject();
  }
}
