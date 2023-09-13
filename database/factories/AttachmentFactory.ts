import Factory from "~/core/abstract/Factory";
import { storage } from "helpers"; 
import User, { IUser } from "~/app/models/User";
import { IAttachment } from "~/app/models/Attachment";

export default class AttachmentFactory extends Factory {
  definition() {
    return {
      name: "file.png",
      attachableId: new User()._id,
      attachableType: "User",
      mimetype: "image/png",
      path: storage("test_files/image.png"),
      link: "example.com"
    };
  };
  
  belongsTo(user: IUser) {
    return this.on("made", (attachment: IAttachment) => {
      attachment.userId = user._id;
    });
  }

}