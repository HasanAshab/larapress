import { model, Model } from "mongoose";

export default abstract class Factory {
  private total = 1;
  private Model: Model;
  private stateCallbacks = [];
  
  constructor(modelName: string) {
    this.Model = model(modelName);
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
  make(data: Record<string, any>) {
    const docsData = [];
    for(let i = 0; i < this.total; i++) {
      const docData = this.definition();
      data && this.overrideFields(docData, data);
      this.runStateCallbacks(docData);
      docsData.push(docData);
    }
    return this.total === 1 
      ? docsData[0]
      : docsData;
  }
  
  async create(data: Record<string, any>) {
    const docsData = this.make(data);
    const method = this.total === 1 
      ? "create"
      : "insertMany";
    return await this.Model[method](docsData);
  }
  
  private overrideFields(docData: Record<string, any>, data: Record<string, any>) {
    for (const field in data){
      if(typeof data[field] !== "undefined")
        docData[field] = data[field];
    }
    return docData;
  };
  
  private runStateCallbacks(docData: object) {
    for(const cb of this.stateCallbacks) {
      cb(docData);
    }
  }
}