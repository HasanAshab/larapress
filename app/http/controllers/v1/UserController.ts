import Controller from "~/app/http/controllers/Controller";
import { RequestHandler } from "~/core/decorators";
import { AuthenticRequest, Response } from "~/core/express";
import User from "~/app/models/User";
import UpdateProfileRequest from "~/app/http/requests/v1/UpdateProfileRequest";
import DocumentNotFoundException from "~/app/exceptions/DocumentNotFoundException";

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
    const user = req.user;
    Object.assign(user, req.body);
    if(req.body.email){
      user.verified = false;
    }
    if (req.files.profile) {
      await user.media().withTag("profile").replaceBy(req.files.profile);
    }
    await user.save();
    if(!req.body.email) 
      return "Profile updated!";
    await user.sendVerificationNotification("v1");
    return "Verification email sent to your new email!";
  };
  
  @RequestHandler
  async show(username: string) {
    return await User.findOneOrFail({ username }).select("-email -phoneNumber").lean();
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

