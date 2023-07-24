import { Request } from "express";
import User from "app/models/User";

export default class UserController {
  async index(req: Request) {
    return await User.find({isAdmin: false}).paginateReq(req);
  }
  
  async find(req: Request) {
    const user = await User.findOne({ username: req.params.username });
    if(!user) return { status: 404 };
    return user.safeDetails();
  }
  
  async delete(req: Request) {
    const user = await User.findById(req.params.id);
    if(!user) return { status: 404 };
    if(!req.user.can("delete", user)) return { status: 401 };
    const { deletedCount } = await User.deleteOne({_id: user._id});
    return deletedCount === 1
      ? { status: 204 }
      : { status: 500 };
  }
  
  async makeAdmin(req: Request){
    const { modifiedCount } = await User.updateOne({_id: req.params.id}, {isAdmin: true});
    return modifiedCount === 1
        ? { status: 200, message: "Admin role granted!" }
        : { status: 404 };
  }

}

