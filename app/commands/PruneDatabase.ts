import { Command } from "samer-artisan";
import DB from "DB";
import { models } from "mongoose";

export default class PruneDatabase extends Command {
  signature = "db:prune";
  description = "Prunes orphan documents";

  async handle(){
    await DB.connect();
    await Promise.all(
      Object.entries(models).map(async ([name, Model]) => {
        for(const field in Model.schema.obj) {
          const fieldData = Model.schema.obj[field];
          if(fieldData.cascade)
            await this.pruneModel(name, fieldData.ref, field);
        }
      })
    );
    this.success("Cascade deleted successfully!");
  }
  
  private async pruneModel(name: string, parent: string, localField: string) {
    const Model = models[name];
    const ParentModel = models[parent];
    const parentIds = await ParentModel.distinct('_id').exec();
    const { deletedCount } = await Model.deleteMany({ [localField]: { $nin: parentIds } }).exec();
    this.info(`Deleted ${deletedCount} records from ${name} where ${localField} was not in ${parent}.`);
  }
}