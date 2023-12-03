import CursorPaginator from "./CursorPaginator";

/**
 * Plugin for pagination support 
*/
export default function Paginate(schema: any) {
  schema.statics.paginateCursor = async function(req: Request) {
    const query = this.find();
    const exec = query.exec;
    query.exec = async function(op: string) {
      await this.paginateCursor(req);
      await exec.apply(this)
    }
    return query;
  }

  schema.query.paginateCursor = async function(req: Request) {
    const { cursor, limit } = req.query;

    if(cursor) {
      this.where("_id").gt(cursor);
    }
    
    if(limit) {
      this.limit(limit);
    }
    
    const sortOpts = this.options.sort ?? { _id: 1 };
    const documents = await this.sort(sortOpts).exec();
    return new CursorPaginator(req, documents, cursor);
  }
} 