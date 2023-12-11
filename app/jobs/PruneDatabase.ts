import Job from "~/core/abstract/Job";
import mongoose from "mongoose";
import DB from "DB";


class PruneDatabase extends Job {
  async handle() {
    await DB.connect();
    
    const prunePromises = Object.entries(mongoose.models).map(([name, Model]) => {
      const fieldBasedPrunePromises = Object.entries(Model.schema.obj).map(([field, fieldData]) => {
        if(fieldData.cascade)
          return this.pruneModel(name, fieldData.ref, field);
      });
      return Promise.all(fieldBasedPrunePromises);
    });

    await Promise.all(prunePromises);
  }
  
  private async pruneModel(name: string, parent: string, localField: string) {
    const { [name]: Model, [parent]: ParentModel } = mongoose.models;
    const parentIds = await ParentModel.distinct('_id').exec();
    const { deletedCount } = await Model.deleteMany({ [localField]: { $nin: parentIds } }).exec();
  }
}

export default new PruneDatabase;