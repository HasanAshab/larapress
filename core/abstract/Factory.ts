import { Model } from "mongoose";
import AwaitEventEmitter from "await-event-emitter"
 
export default abstract class Factory extends AwaitEventEmitter {
  private total = 1;
  private eventsEnabled = true;

  constructor(private Model: Model<any>, protected options: Record<string, unknown> = {}) {
    super();
    this.Model = Model;
    this.options = options;
  }
  
  abstract definition(): Record<string, any>;
  
  count(total: number) {
    this.total = total;
    return this;
  }
  
  withoutEvents() {
    this.eventsEnabled = false;
    return this;
  }
  
  async make(data?: object) {
    const generateStates = Array.from({ length: this.total }, () => this.generateState(data));
    const docsData = await Promise.all(generateStates);
    return this.total === 1 
      ? docsData[0]
      : docsData;
  }
  
  async create(data: Record<string, any>) {
    const docsData = await this.make(data);
    const method = this.total === 1 
      ? "create"
      : "insertMany";
    const docs = await (this.Model as any)[method](docsData);
    this.eventsEnabled && await this.emit("created", Array.isArray(docs) ? docs : [docs]);
    return docs;
  }
  
  private async generateState(data?: Record<string, any>) {
    const docData = this.definition();
    data && this.overrideFields(docData, data);
    this.eventsEnabled && await this.emit("made", docData);
    return docData;
  }

  private overrideFields(docData: Record<string, any>, data: Record<string, any>) {
    for (const field in data){
      if(typeof data[field] !== "undefined")
        docData[field] = data[field];
    }
    return docData;
  };
  
}