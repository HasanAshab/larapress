import { Request } from "express";
import Contact from "~/app/models/Contact";

export default class ContactController {
  async index(req: Request) {
    return await Contact.find().paginateReq(req);
  }
  
  async create(req: Request) {
    await Contact.create(req.body);
    return { 
      status: 201,
      message: "Thanks for contacting us!" 
    }
  }
  
  async search(req: Request) {
    const filter = {
      $text: { $search: req.query.query as string }, 
    }
    if(req.query.status)
      filter.status = req.query.status
    return await Contact.find(filter, { score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } }).paginateReq(req);
  }

  async find(req: Request) {
    return {
      data: await Contact.findById(req.params.id)
    }
  }
  
  async delete(req: Request) {
    const { deletedCount } = await Contact.deleteOne({ _id: req.params.id });
    return deletedCount === 1
      ? { message: "Contact form deleted!" }
      : { status: 404 }
  }

  async updateStatus(req: Request) {
    await Contact.updateOne(
      { _id: req.params.id }, 
      { status: req.body.status }
    );
    return { message: `Contact form ${req.body.status}!` };
  }

}

