import { Model } from "mongoose";

export default abstract class Factory {
  private total = 1;
  private stateCustomizers = [];
  private externalCallbacks = [];
  
  constructor(private Model: Model<any>, protected options: Record<string, unknown> = {}) {
    this.Model = Model;
    this.options = options;
  }
  
  abstract definition(): Record<string, any>;
  
  count(total: number) {
    this.total = total;
    return this;
  }
  
  protected state(cb) {
    this.stateCustomizers.push(cb);
    return this;
  }
  
  protected external(cb) {
    this.externalCallbacks.push(cb);
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
    await this.runExternalCallbacks(Array.isArray(docs) ? docs : [docs]);
    return docs;
  }
  
  private async generateState(data?: Record<string, any>) {
    const docData = this.customizeState(this.definition());
    data && this.overrideFields(docData, data);
    return docData;
  }

  private overrideFields(docData: Record<string, any>, data: Record<string, any>) {
    for (const field in data){
      if(typeof data[field] !== "undefined")
        docData[field] = data[field];
    }
    return docData;
  };
  
  private customizeState(docData) {
    this.stateCustomizers.forEach(customizer => {
      docData = customizer(docData)
    });
    return docData;
  }
  
  private runExternalCallbacks(docs) {
    const promises = this.externalCallbacks.map(cb => cb(docs));
    return Promise.all(promises);
  }
}