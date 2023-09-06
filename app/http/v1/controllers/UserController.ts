import { Request } from "express";
import User from "~/app/models/User";
import { log } from "helpers";

export default class UserController {
  async index(req: Request) {
    return await User.find({ role: "novice" }).paginateReq(req);
  }
  
  async profile(req: Request){
    return req.user;
  };

  async updateProfile(req: Request){
    const logo = req.files?.logo;
    const user = req.user;
    Object.assign(user, req.body);
    if(req.body.email){
      user.verified = false;
    }
    if (logo && !Array.isArray(logo)) {
      await user.detach("logo");
      await user.attach("logo", logo, true);
    }
    await user.save();
    if(!req.body.email) return { message: "Profile updated!" };
    user.sendVerificationEmail().catch(log);
    return { message: "Verification email sent to new email!" };
  };
  
  async deleteAccount(req: Request) {
    const { deletedCount } = await User.deleteOne({ _id: req.user._id });
    return deletedCount === 1
      ? { status: 204 }
      : { status: 500 };
  }
  
  async find(req: Request) {
    const user = await User.findOne(req.params);
    if(!user) return { status: 404 };
    return user.safeDetails();
  }
  
  async delete(req: Request) {
    const user = await User.findOne(req.params);
    if(!user) return { status: 404 };
    if(await req.user.can("delete", user)) {
      const { deletedCount } = await User.deleteOne(req.params);
      return deletedCount === 1
        ? { status: 204 }
        : { status: 500 };
    }
    return { 
      status: 403,
      message: "Your have not enough privilege to perfom this action!"
    };
  }
  
  async makeAdmin(req: Request){
    const { modifiedCount } = await User.updateOne(req.params, { role: "admin" });
    return modifiedCount === 1
        ? { status: 200, message: "Admin role granted!" }
        : { status: 404 };
  }
}

