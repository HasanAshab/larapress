import RequestHandler from "~/core/decorators/RequestHandler";
import { AuthenticRequest, Response } from "~/core/express";
import User from "~/app/models/User";
import UpdateProfileRequest from "~/app/http/v1/requests/UpdateProfileRequest";

export default class UserController {
  @RequestHandler
  async index(req: AuthenticRequest, res: Response) {
    res.api(await User.find({ role: "novice" }).paginateReq(req));
  }
  
  @RequestHandler
  async profile(req: AuthenticRequest, res: Response) {
    res.api(req.user);
  };
  
  @RequestHandler
  async updateProfile(req: UpdateProfileRequest, res: Response) {
    const logo = req.files.logo;
    const user = req.user;
    Object.assign(user, req.body);
    if(req.body.email){
      user.verified = false;
    }
    if (logo) {
      user.detach("logo");
      await user.attach("logo", logo);
    }
    await user.save();
    if(!req.body.email) return res.message("Profile updated!");
    user.sendVerificationEmail().catch(log);
    res.message("Verification email sent to your new email!");
  };
  
  @RequestHandler
  async deleteAccount(req: AuthenticRequest, res: Response) {
    const { deletedCount } = await User.deleteOne({ _id: req.user._id });
    res.status(deletedCount === 1 ? 204 : 404).message();
  }
  
  @RequestHandler
  async find(res: Response, username: string) {
    const user = await User.findOne({ username });
    if(!user) return res.status(404).message();
    res.api(user.safeDetails());
  }
  
  @RequestHandler
  async delete(res: Response, username: string) {
    const user = await User.findOne({ username });
    if(!user) return res.status(404).message();
    if(!req.user.can("delete", user))
      return res.status(403).message();
    const { deletedCount } = await User.deleteOne({ username });
    res.status(deletedCount === 1 ? 204 : 500).message();
  }
  
  @RequestHandler
  async makeAdmin(res: Response, username: string) {
    const { modifiedCount } = await User.updateOne({ username }, { role: "admin" });
    modifiedCount === 1
      ? res.message("Admin role granted!")
      : res.status(404).message();
  }
}

