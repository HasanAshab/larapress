import ComponentGenerator from "~/core/component/ComponentGenerator";

export default class MakeSeeder extends ComponentGenerator {
  static signature = "make:seeder {name}";
  
  protected template() {
    return "seeder";
  }
  
  protected dist() {
    return `database/seeders/${this.argument(`name`)}Seeder.ts`;
  }
}