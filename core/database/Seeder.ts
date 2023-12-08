export default abstract class Seeder {
  /**
   * Insert documents into database
  */
  abstract run(): Promise<void>;
  
  /**
   * Call other seeders
  */
  async call(seeders: typeof Seeder[]) {
    seeders.forEach(Seeder => {
      const seeder = new Seeder();
      await seeder.run();
    });
  }
}