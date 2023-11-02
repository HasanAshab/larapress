export default abstract class Seeder {
  /**
   * Insert documents into database
  */
  abstract run(): Promise<void>;
  
  /**
   * Call other seeders
  */
  async call(seedersName: string[]) {
    for(const name of seedersName) {
      const { default: Seeder } = await import("~/database/seeders/" + name);
      const seeder = new Seeder();
      await seeder.run();
    }
  }
}