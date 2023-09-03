import { Request } from "express";
import Contact from "~/app/models/Contact";

export default class ContactController {
  async index(req: Request) {
    return await Contact.find().paginateReq(req);
  }
  
  async create(req: Request) {
    // samitize TODO
    await Contact.create(req.body);
    return { message: "Thanks for contacting us!" }
  }
  
  async find(req: Request) {
    return await Contact.findById(req.params.id);
  }
  
  async delete(req: Request) {
    const { deletedCount } = await Contact.deleteById(req.params.id);
    return deletedCount === 1
      ? { message: "Contact form deleted!" }
      : { status: 404 }
  }
  
  async search(req: Request) {
    return Contact.find({$text: {$search: searchString}}).paginateReq(req);
  }

}

