import Controller from "~/app/http/controllers/Controller";
import { RequestHandler } from "~/core/decorators";
import { AuthenticRequest, Response } from "~/core/express";
import User from "~/app/models/User";
import UpdateProfileRequest from "~/app/http/requests/v1/UpdateProfileRequest";
import UserProfileResource from "~/app/http/resources/v1/user/UserProfileResource";
import ShowUserResource from "~/app/http/resources/v1/user/ShowUserResource";
import ListUserResource from "~/app/http/resources/v1/user/ListUserResource";

export default class UserController extends Controller {
  @RequestHandler
  async index(req: AuthenticRequest) {
    return ListUserResource.collection(
      await User.where("role").equals("novice").lean().paginateCursor(req)
    );
  }
  
  @RequestHandler
  async profile(req: AuthenticRequest) {
    return UserProfileResource.make(req.user);
  }
  
  @RequestHandler
  async updateProfile(req: UpdateProfileRequest) {
    const user = req.user;
    const profile = req.file("profile");

    Object.assign(user, req.body);
    
    if(req.body.email) {
      user.verified = false;
    }
    
    if (profile) {
      if(user.profile) {
        await user.media().withTag("profile").replaceBy(profile);
      }
      else {
        await user.media().withTag("profile").attach(profile).storeLink();
      }
    }
    
    await user.save();
    
    if(!req.body.email) 
      return "Profile updated!";
      
    await user.sendVerificationNotification("v1");
    return "Verification email sent to your new email address!";
  };
  
  @RequestHandler
  async show(username: string) {
    return ShowUserResource.make(
      await User.findOneOrFail({ username }).select("-email -phoneNumber").lean()
    );
  }
  
  @RequestHandler
  async delete(req: AuthenticRequest, res: Response, username: string) {
    const user = await User.findOneOrFail({ username });
    if(req.user.cannot("delete", user))
      return res.status(403).message();
    await user.delete();
    res.sendStatus(204);
  }
  
  @RequestHandler
  async makeAdmin(username: string) {
    await User.updateOneOrFail({ username }, { role: "admin" });
    return "Admin role granted!";
  }
}

