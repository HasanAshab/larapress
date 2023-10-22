import Controller from "~/core/abstract/Controller";
import RequestHandler from "~/core/decorators/RequestHandler";
import { AuthenticRequest, Response } from "~/core/express";
import User from "~/app/models/User";
import UpdateProfileRequest from "~/app/http/v1/requests/UpdateProfileRequest";

export default class UserController extends Controller {
  @RequestHandler
  async index(req: AuthenticRequest) {
    return await User.find({ role: "novice" }).paginateReq(req);
  }
  
  @RequestHandler
  async profile(req: AuthenticRequest) {
    return req.user;
  };
  
  @RequestHandler
  async updateProfile(req: UpdateProfileRequest) {
    const profile = req.files.profile;
    const user = req.user;
    Object.assign(user, req.body);
    if(req.body.email){
      user.verified = false;
    }
    if (profile) {
      user.detach("profile");
      await user.attach("profile", profile);
    }
    await user.save();
    if(!req.body.email) 
      return "Profile updated!";
    await user.sendVerificationNotification();
    return "Verification email sent to your new email!";
  };
  
  @RequestHandler
  async show(username: string) {
    const user = await User.findOneOrFail({ username });
    return user.safeDetails();
  }
  
  @RequestHandler
  async delete(req: AuthenticRequest, res: Response, username: string) {
    const user = await User.findOneOrFail({ username });
    if(!req.user.can("delete", user))
      return res.status(403).message();
    await User.deleteOne({ username });
    res.status(204).message();
  }
  
  @RequestHandler
  async makeAdmin(res: Response, username: string) {
    const { modifiedCount } = await User.updateOne({ username }, { role: "admin" });
    modifiedCount === 1
      ? res.message("Admin role granted!")
      : res.status(404).message();
  }
}

