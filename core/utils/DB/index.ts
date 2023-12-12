import { connect, disconnect, syncIndexes, model, modelNames, ConnectOptions, Document } from "mongoose";
import Config from "Config";

export default class DB {
  static async connect(sync = true) {
    await connect(Config.get("database.url"), Config.get("database.options"));
    sync && await syncIndexes();
  }
  
  static async disconnect() {
    await disconnect();
  }
  
  static async reset(models = modelNames()) {
    const promises = [];
    for (const name of models)
      promises.push(model(name).deleteMany());
    await Promise.all(promises);
  }
}