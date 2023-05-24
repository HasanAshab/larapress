import Factory from "illuminate/factories/Factory";
import { storage, route } from "helpers"; 
import User from "app/models/User";

export default class MediaFactory extends Factory {
  definition(): Record<string, any> {
    return {
      name: "file",
      mediableId: new User()._id,
      mediableType: "User",
      mimetype: "image/png",
      path: storage("test_files/image.png"),
      link: route("file.serve")
    };
  };
}