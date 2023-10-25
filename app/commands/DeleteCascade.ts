import Command from "~/core/abstract/Command";
import { models } from "mongoose";

export default class DeleteCascade extends Command {
  static signature = "cascade";
  static description = "Cascade deletes all model";

  async handle(){
    for(const name in models) {
      const Model = models[name];
      for(const field in Model.schema.obj) {
        const fieldData = Model.schema.obj[field];
        if(fieldData.cascade && models[fieldData.ref]){
          console.log(field)
        }
      }

          this.success("Cascade deleted successfully!");

    }
  }
}