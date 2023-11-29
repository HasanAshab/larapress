import CursorPaginator from "./CursorPaginator";

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