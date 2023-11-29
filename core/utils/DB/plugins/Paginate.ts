import { Request } from "express";
import { Document } from "mongoose";
import { last } from "lodash";

class CursorPaginator {
  constructor(req: Request, items: Document[], perPage: string, cursor?: string) {
    this.req = req;
    this.items = items;
    this.perPage = perPage;
    this.cursor = cursor;
  }
  
  static getCursorOf(item: Document) {
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

  toJSON() {
    return {
      "data": this.items,
      "path": this.req.fullPath,
      "perPage": this.perPage,
      "nextCursor": this.nextCursor,
      "nextPageUrl": this.nextPageUrl
    }
  }
}

/**
 * Plugin for pagination support 
*/
export default function Paginate(schema: any) {
  schema.query.paginateCursor = async function (req: Request) {
    const { cursor, limit } = req.query;
    if(cursor) {
      this.where("_id").gt(cursor);
    }
    
    const sortOpts = this.options.sort ?? { _id: 1 };
    const documents = await this.sort(sortOpts).limit(limit).exec();

    return new CursorPaginator(req, documents, limit, cursor);
  };
}