export default abstract class Seeder {
  abstract run(): Promise<void>;
  
  async call(seedersName: string[]) {
    for(const name of seedersName) {
      const seeder = await this.getSeeder(name);
      await seeder.run();
    }
  }
  
  async getSeeder(name: string) {
    const { default: Seeder } = await import("~/database/seeders/" + name);
    return new Seeder();
  }
}