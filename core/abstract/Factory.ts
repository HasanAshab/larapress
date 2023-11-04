import { Model } from "mongoose";

export default abstract class Factory {
  /**
   * Number of documents to be generated
  */
  private total = 1;

  /**
   * Callbacks that customizes document's state
  */
  private stateCustomizers = [];
 
  /**
   * Callbacks to perform external async operations
   * such as creating relational documents.
  */
  private externalCallbacks = [];
  
  /**
   * Create factory instance
  */
  constructor(private Model: Model<any>, protected options: Record<string, unknown> = {}) {
    this.Model = Model;
    this.options = options;
  }
  
  /**
   * Return the initial state of documents
  */
  abstract definition(): Record<string, any>;
  
  /**
   * Specify the number of documents to be generated
  */
  count(total: number) {
    this.total = total;
    return this;
  }
  
  /**
   * Adds state customizer
  */
  protected state(cb) {
    this.stateCustomizers.push(cb);
    return this;
  }
  
  /**
   * Adds external operations callback
  */
  protected external(cb) {
    this.externalCallbacks.push(cb);
    return this;
  }
  

  /**
   * Generates all documents raw data
  */
  make(data?: object) {
    return this.total === 1
      ? this.generateDocumentData(data)
      : Array.from({ length: this.total }, () => this.generateDocumentData(data));
  }
  
  /**
   * Inserts all generated documents into database
  */
  async create(data: Record<string, any>) {
    const docsData = await this.make(data);
    const method = this.total === 1 
      ? "create"
      : "insertMany";
    const docs = await (this.Model as any)[method](docsData);
    await this.runExternalCallbacks(Array.isArray(docs) ? docs : [docs]);
    return docs;
  }
  
  /**
   * Generates single document data 
  */
  private generateDocumentData(data?: Record<string, any>) {
    const docData = this.customizeState(this.definition());
    data && this.overrideFields(docData, data);
    return docData;
  }
  
  /**
   * Overrides generated document data
  */
  private overrideFields(docData: Record<string, any>, data: Record<string, any>) {
    for (const field in data){
      if(typeof data[field] !== "undefined")
        docData[field] = data[field];
    }
    return docData;
  };
  
  /**
   * Runs all state customizers
  */
  private customizeState(docData) {
    this.stateCustomizers.forEach(customizer => {
      docData = customizer(docData)
    });
    return docData;
  }
  
  /**
   * Runs all external callbacks
  */
  private runExternalCallbacks(docs) {
    const promises = this.externalCallbacks.map(cb => cb(docs));
    return Promise.all(promises);
  }
}