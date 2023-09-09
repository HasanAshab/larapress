import Seeder from "~/core/abstract/Seeder";
import Role from "~/app/models/Role";

export default class RoleSeeder extends Seeder {
  async run() {
    await Role.insertMany([
      { name: "novice" },
      { name: "admin" }
    ]);
  }
}