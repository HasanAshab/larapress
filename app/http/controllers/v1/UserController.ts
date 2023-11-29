import Controller from "~/app/http/controllers/Controller";
import { RequestHandler } from "~/core/decorators";
import { AuthenticRequest, Response } from "~/core/express";
import User from "~/app/models/User";
import UpdateProfileRequest from "~/app/http/requests/v1/UpdateProfileRequest";
import UserProfileResource from "~/app/http/resources/v1/user/UserProfileResource";
import ListUserResource from "~/app/http/resources/v1/user/ListUserResource";

export default class UserController extends Controller {
  @RequestHandler
  async index(req: AuthenticRequest) {
    return ListUserResource.collection(
      await User.find({ role: "novice" }).lean().paginateCursor(req)
    );
  }
  
  @RequestHandler
  async profile(req: AuthenticRequest) {
    return UserProfileResource.make(req.user);
  }
  
  @RequestHandler
  async updateProfile(req: UpdateProfileRequest) {
    const user = req.user;
    const profile = req.files.profile;

    Object.assign(user, req.body);
    if(req.body.email)
      user.verified = false;

    if (profile) {
      if(user.profile) {
        await user.media().withTag("profile").replaceBy(profile);
      }
      else {
        await user.media().withTag("profile").attach(profile).storeRef();
      }
    }
    
    await user.save();
    
    if(!req.body.email) 
      return "Profile updated!";
    await user.sendVerificationNotification("v1");
    return "Verification email sent to your new email!";
  };
  
  @RequestHandler
  async show(username: string) {
    const user = await User.findOneOrFail({ username }).select("-email -phoneNumber").lean();
    return UserProfileResource.make(user);
  }
  
  @RequestHandler
  async delete(req: AuthenticRequest, res: Response, username: string) {
    const user = await User.findOneOrFail({ username });
    if(!req.user.can("delete", user))
      return res.status(403).message();
    await user.delete();
    res.sendStatus(204);
  }
  
  @RequestHandler
  async makeAdmin(res: Response, username: string) {
    const { modifiedCount } = await User.updateOne({ username }, { role: "admin" });
    modifiedCount === 1
      ? res.message("Admin role granted!")
      : res.status(404).message();
  }
}

