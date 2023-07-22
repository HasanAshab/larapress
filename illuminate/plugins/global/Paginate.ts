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
  schema.query.paginateReq = async function (req: Request) {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`
    const { limit, cursor } = req.query;
    const paginatedData = await this.paginate(typeof limit === "string" ? Number(limit) : 20, typeof cursor === "string" ? cursor : undefined);
    paginatedData.nextCursor = paginatedData.next;
    paginatedData.next = paginatedData.next ? `${fullUrl}?limit=${limit}&cursor=${paginatedData.next}` : null;
    return paginatedData
  }
}