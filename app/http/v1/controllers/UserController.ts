import { Request } from "express";
import User from "app/models/User";

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
    Object.assign(user, req.validated);
    if(req.validated.email){
      user.verified = false;
    }
    if (logo && !Array.isArray(logo)) {
      await user.detach("logo");
      await user.attach("logo", logo, true);
    }
    await user.save();
    if(!req.validated.email) return { message: "Profile updated!" };
    await user.sendVerificationEmail();
    return { message: "Verification email sent to new email!" };
  };
  
  async find(req: Request) {
    const user = await User.findOne(req.params);
    if(!user) return { status: 404 };
    return user.safeDetails();
  }
  
  async delete(req: Request) {
    const user = await User.findOne(req.params);
    if(!user) return { status: 404 };
    if(!req.user.can("delete", user)) {
      return { 
        status: 403,
        message: "Your have not enough privilege to perfom this action!"
      };
    }
    console.log(user)
    const { deletedCount } = await User.deleteOne(req.params);
    console.log(deletedCount)
    return deletedCount === 1
      ? { status: 204 }
      : { status: 500 };
  }
  
  async makeAdmin(req: Request){
    const { modifiedCount } = await User.updateOne(req.params, { role: "admin" });
    return modifiedCount === 1
        ? { status: 200, message: "Admin role granted!" }
        : { status: 404 };
  }
}

