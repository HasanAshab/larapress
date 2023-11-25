import { Request } from "~/core/express";

export default abstract class JsonResource<DocType> {
  wrap = "data";
  
  constructor(protected readonly document: DocType) {
    this.document = document;
  }
  
  static make(document: DocType) {
    return new this(document);
  }
  
  static collection(documents: DocType[]) {
    return documents.map(document => new this(document));
  }
  
  public abstract toObject(req: Request): object; 
}
