import RequestHandler from "~/core/decorators/RequestHandler";
import { AuthenticRequest, Response } from "~/core/express";
import CreateContactRequest from "~/app/http/v1/requests/CreateContactRequest";
import SearchContactRequest from "~/app/http/v1/requests/SearchContactRequest";
import UpdateContactStatusRequest from "~/app/http/v1/requests/UpdateContactStatusRequest";
import Contact from "~/app/models/Contact";
import Cache from "Cache";

export default class ContactController {
  @RequestHandler
  async index(req: AuthenticRequest, res: Response) {
    res.api(await Contact.find().paginateReq(req));
  }
  
  @RequestHandler
  async create(req: CreateContactRequest, res: Response) {
    console.log(req.body)
    await Contact.create(req.body);
    res.status(201).message("Thanks for contacting us!");
  }
  
  @RequestHandler
  async search(req: SearchContactRequest, res: Response) {
    const cacheKey = `$_SEARCH(${req.query.q}:${req.query.status}:${req.query.limit}:${req.query.cursor})`;
    const cachedResults = await Cache.get(cacheKey);
    if (cachedResults)
      return res.send(cachedResults);
    const filter: any = { $text: { $search: req.query.q } };
    if (req.query.status)
      filter.status = req.query.status;

    const results = await Contact.find(filter, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
      .select('-score')
      .paginateReq(req);
    await Cache.put(cacheKey, res.api(results), 5 * 3600);
  }
  
  @RequestHandler
  async find(res: Response, id: string) {
    const contact = await Contact.findById(id);
    return contact 
      ? res.api(contact)
      : res.status(404).message();
  }
  
  @RequestHandler
  async delete(res: Response, id: string) {
    const { deletedCount } = await Contact.deleteOne({ _id: id });
    res.status(deletedCount === 1 ? 204 : 404).message();
  }

  @RequestHandler
  async updateStatus(req: UpdateContactStatusRequest, res: Response, id: string) {
    await Contact.updateOne(
      { _id: id }, 
      { status: req.body.status }
    );
    res.message(`Contact form ${req.body.status}!`);
  }

}

