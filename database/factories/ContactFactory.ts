import Factory from "~/core/abstract/Factory";
import { faker } from "@faker-js/faker";
import { IContact, ContactDocument } from "~/app/models/Contact";

export default class ContactFactory extends Factory<IContact, ContactDocument> {
  definition() {
    return {
      email: faker.internet.email(),
      subject: faker.lorem.words(5),
      message: faker.lorem.words(15),
      status: "opened" as const
    };
  };
  
  closed() {
    return this.state((contact: IContact) => {
      contact.status = "closed";
      return contact;
    });
  }
}