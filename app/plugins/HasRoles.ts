import { Schema, Document } from "mongoose";
import Role from "~/app/models/Role";

export interface HasRolesDocument extends Document {
  //
}

export interface HasRolesModel {
  //
}

export default (schema: Schema) => {
  schema.methods.hasRole = async function(name: string) {
    const role = await Role.findOne({ name });
    return role 
      ? this.roles.includes(role._id.toString())
      : false;
  }
  
  schema.methods.addRole = async function(name: string) {
    const role = await Role.findOne({ name });
    if(!role) 
      throw new Error("Role: " + name + " doesn't exist");
    this.roles.push(role._id);
    await this.save();
  }
  
  schema.methods.removeRole = async function(name: string) {
    const role = await Role.findOne({ name });
    const index = this.roles.indexOf(role._id.toString());
    if (index !== -1) {
      this.roles.splice(index, 1);
      await this.save();
    }
  }
}