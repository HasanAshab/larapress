import { Request } from "express";

export default (schema: any) => {
  schema.query.paginate = async function (pageSize: number, cursor?: string) {
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
  schema.query.paginateReq = async function (req) {
    const baseUrl = req.baseUrl;
    const originalUrl = req.originalUrl;
    const hasQuery = originalUrl.includes('?');
    const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 20;
    const querySeparator = hasQuery ? '&' : '?';
    const paginatedData = await this.paginate(limit, req.query.cursor);
    paginatedData.nextCursor = paginatedData.next;
    paginatedData.next = paginatedData.next ? `${baseUrl}${originalUrl}${querySeparator}limit=${limit}&cursor=${paginatedData.next}` : null;
    return paginatedData;
  }
}