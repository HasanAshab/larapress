import { faker } from "@faker-js/faker";

export default abstract class Factory {
  config: Record<string, unknown> = { events: true };
  faker = faker;
  
  setConfig(config: object) {
    Object.assign(this.config, config);
  }

  abstract definition(): Record<string, any>;
  abstract post(documents: any[]): Promise<void>;
}