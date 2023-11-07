import Job from "~/core/abstract/Job";
import { models } from "mongoose";
import DB from "DB";

export default class PruneDatabase extends Job {
  async handle() {
    await DB.connect();
    await Promise.all(
      Object.entries(models).map(async ([name, Model]) => {
        for(const field in Model.schema.obj) {
          const fieldData: any = Model.schema.obj[field];
          if(fieldData.cascade)
            await this.pruneModel(name, fieldData.ref, field);
        }
      })
    );
  }
  
  private async pruneModel(name: string, parent: string, localField: string) {
    const Model = models[name];
    const ParentModel = models[parent];
    const parentIds = await ParentModel.distinct('_id').exec();
    const { deletedCount } = await Model.deleteMany({ [localField]: { $nin: parentIds } }).exec();
  }
}