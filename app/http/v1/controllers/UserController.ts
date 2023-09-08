import { controller } from "~/core/decorators/class";
import { Request, Response } from "express";
import User from "~/app/models/User";
import { log } from "helpers";

@controller
export default class UserController {
  async index(req: Request, res: Response) {
    res.api(await User.find({ role: "novice" }).paginateReq(req));
  }
  
  async profile(req: Request, res: Response){
    res.api(req.user);
  };

  async updateProfile(req: Request, res: Response){
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
    if(!req.body.email) return res.message("Profile updated!");
    user.sendVerificationEmail().catch(log);
    res.message("Verification email sent to your new email!");
  };
  
  async deleteAccount(req: Request, res: Response) {
    const { deletedCount } = await User.deleteOne({ _id: req.user._id });
    res.status(deletedCount === 1 ? 204 : 404).message();
  }
  
  async find(req: Request, res: Response) {
    const user = await User.findOne(req.params);
    if(!user) return res.status(404).message();
    res.api(user.safeDetails());
  }
  
  async delete(req: Request, res: Response) {
    const user = await User.findOne(req.params);
    if(!user) return res.status(404).message();
    if(!await req.user.can("delete", user))
      return res.status(403).message();
    const { deletedCount } = await User.deleteOne(req.params);
    res.status(deletedCount === 1 ? 204 : 500).message();
  }
  
  async makeAdmin(req: Request, res: Response){
    const { modifiedCount } = await User.updateOne(req.params, { role: "admin" });
    modifiedCount === 1
      ? res.message("Admin role granted!")
      : res.status(404).message();
  }
}

