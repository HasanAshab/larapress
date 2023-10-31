import Controller from "~/app/http/controllers/Controller";
import { RequestHandler } from "~/core/decorators";
import { AuthenticRequest, Response } from "~/core/express";
import ContactRequest from "~/app/http/requests/v1/ContactRequest";
import SearchContactRequest from "~/app/http/requests/v1/SearchContactRequest";
import UpdateContactStatusRequest from "~/app/http/requests/v1/UpdateContactStatusRequest";
import Contact from "~/app/models/Contact";
import User from "~/app/models/User";
import Cache from "Cache";

export default class ContactController extends Controller {
  @RequestHandler
  async index(req: AuthenticRequest) {
    return await Contact.find().paginateReq(req);
  }
  
  @RequestHandler
  async store(req: ContactRequest, res: Response) {
    await Contact.create(req.body);
    res.status(201).message("Thanks for contacting us!");
  }
  
  @RequestHandler
  async search(req: SearchContactRequest) {
    const cacheKey = `$_SEARCH(${req.query.q}:${req.query.status}:${req.query.limit}:${req.query.cursor})`;
    const cachedResults = await Cache.get(cacheKey);
    if (cachedResults)
      return cachedResults;
    const filter: any = { $text: { $search: req.query.q } };
    if (req.query.status)
      filter.status = req.query.status;

    const results = await Contact.find(filter, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
      .select('-score')
      .paginateReq(req);
    Cache.put(cacheKey, results, 5 * 3600).then(log);
    return results;
  }
  
  @RequestHandler
  async show(id: string) {
    return await Contact.findByIdOrFail(id);
  }
  
  @RequestHandler
  async delete(res: Response, id: string) {
    const { deletedCount } = await Contact.deleteOne({ _id: id });
    res.status(deletedCount === 1 ? 204 : 404).message();
  }

  @RequestHandler
  async updateStatus(req: UpdateContactStatusRequest, id: string) {
    await Contact.updateOne(
      { _id: id }, 
      { status: req.body.status }
    );
    return `Contact form ${req.body.status}!`;
  }
}

