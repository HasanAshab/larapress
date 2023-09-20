import { Request, Response } from "express";
import Contact from "~/app/models/Contact";
import Cache from "Cache";

export default class ContactController {
  async index(req: Request, res: Response) {
    res.api(await Contact.find().paginateReq(req));
  }
  
  async create(req: Request, res: Response) {
    await Contact.create(req.body);
    res.status(201).message("Thanks for contacting us!");
  }
  
  async search(req: Request, res: Response) {
    const cacheKey = `search:${req.query.query}:${req.query.status}:${req.query.limit}:${req.query.cursor}`;
    const cachedResults = await Cache.get(cacheKey);
    if (cachedResults)
      return res.send(cachedResults);
    const filter: any = { $text: { $search: req.query.query } };
    if (req.query.status)
      filter.status = req.query.status;

    const results = await Contact.find(filter, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
      .select('-score')
      .paginateReq(req);
    await Cache.put(cacheKey, res.api(results), 5 * 3600);
  }

  async find(req: Request, res: Response) {
    const contact = await Contact.findById(req.params.id);
    return contact 
      ? res.api(contact)
      : res.status(404).message();
  }
  
  async delete(req: Request, res: Response) {
    const { deletedCount } = await Contact.deleteOne({ _id: req.params.id });
    res.status(deletedCount === 1 ? 204 : 404).message();
  }

  async updateStatus(req: Request, res: Response) {
    await Contact.updateOne(
      { _id: req.params.id }, 
      { status: req.body.status }
    );
    res.message(`Contact form ${req.body.status}!`);
  }

}

