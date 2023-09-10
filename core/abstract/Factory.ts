import { Model } from "mongoose";
import AwaitEventEmitter from "await-event-emitter"
 
export default abstract class Factory extends AwaitEventEmitter {
  private total = 1;
  private eventsEnabled = true;
  private stateCallbacks = [];

  constructor(private Model: Model, protected options: Record<string, unknown> = {}) {
    super();
    this.Model = Model;
    this.options = options;
  }
  
  abstract definition(): Record<string, any>;
  
  state(cb) {
    this.stateCallbacks.push(cb);
    return this;
  }
  
  count(total: number) {
    this.total = total;
    return this;
  }
  
  withoutEvents() {
    this.eventsEnabled = false;
    return this;
  }
  
  
  async make(data?: object) {
    const generateStates = [];
    for(let i = 0; i < this.total; i++) {
      generateStates.push(this.generateState(data))
    }
    const docsData = await Promise.all(generateStates);
    this.eventsEnabled && await this.emit("made", docsData);
    return this.total === 1 
      ? docsData[0]
      : docsData;
  }
  
  async create(data: Record<string, any>) {
    const docsData = await this.make(data);
    const method = this.total === 1 
      ? "create"
      : "insertMany";
    const docs = await this.Model[method](docsData);
    this.eventsEnabled && await this.emit("created", Array.isArray(docs) ? docs : [docs]);
    return docs;
  }
  
  private async generateState(data?: Record<string, any>) {
    const docData = this.definition();
    await this.customizeState(docData);
    data && this.overrideFields(docData, data);
    return docData;
  }

  private async customizeState(docData: object) {
    const promises = [];
    for(const cb of this.stateCallbacks) {
      const returnValue = cb(docData);
      returnValue instanceof Promise && 
        promises.push(returnValue);
    }
    await Promise.all(promises);
  }

  private overrideFields(docData: Record<string, any>, data: Record<string, any>) {
    for (const field in data){
      if(typeof data[field] !== "undefined")
        docData[field] = data[field];
    }
    return docData;
  };
  
}