import Factory from "~/core/factories/Factory";
import { storage } from "helpers"; 
import User from "~/app/models/User";

export default class AttachmentFactory implements Factory {
  definition() {
    return {
      name: "file",
      attachableId: new User()._id,
      attachableType: "User",
      mimetype: "image/png",
      path: storage("test_files/image.png"),
      link: "example.com"
    };
  };
}