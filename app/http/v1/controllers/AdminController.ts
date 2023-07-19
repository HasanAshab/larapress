import { Request } from "express";
import User from "app/models/User";

export default class AdminController {
  async getUsers(req: Request) {
    return await User.find({isAdmin: false}).paginateReq(req);
  }
  
  async findUser(req: Request) {
    return await User.findById(req.params.id);
  }
  
  async updateUser(req: Request) {
    return await User.findByIdAndUpdate(req.params.id, req.body);
  }
  
  async deleteUser(req: Request) {
    return await User.findByIdAndDelete(req.params.id)
  }
}

