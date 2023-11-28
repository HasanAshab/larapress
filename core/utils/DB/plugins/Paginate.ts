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
  
  get nextCursor() {
    return last(this.items)._id.toHexString();
  }
  
  get nextPageUrl() {
    const querySeparator = this.req.fullUrl.includes("?") ? "&" : "?";
    const cursorQuery = this.cursor ? "&cursor=" + this.cursor : "";
    return `${this.req.fullUrl}${querySeparator}limit=${this.perPage}${cursorQuery}`;
  }

  toJSON() {
    return {
      "data": this.items,
      "path": this.req.path,
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
  
  schema.query.paginate = async function (req: Request) {
    const baseUrl = req.baseUrl;
    const originalUrl = req.originalUrl;
    const hasQuery = originalUrl.includes("?");
    const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 20;
    const querySeparator = hasQuery ? "&" : "?";
    const paginatedData = await this.paginate(limit, req.query.cursor);
    paginatedData.nextCursor = paginatedData.next;
    paginatedData.next = paginatedData.next ? `${baseUrl}${originalUrl}${querySeparator}limit=${limit}&cursor=${paginatedData.next}` : null;
    return paginatedData;
  }
}