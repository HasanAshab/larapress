import Controller from "~/app/http/controllers/Controller";
import { RequestHandler } from "~/core/decorators";
import { AuthenticRequest, Response } from "~/core/express";
import ContactRequest from "~/app/http/requests/v1/ContactRequest";
import SearchContactRequest from "~/app/http/requests/v1/SearchContactRequest";
import UpdateContactStatusRequest from "~/app/http/requests/v1/UpdateContactStatusRequest";
import Contact, { IContact } from "~/app/models/Contact";
import User from "~/app/models/User";
import ListContactResource from "~/app/http/resources/v1/contact/ListContactResource";
import ShowContactResource from "~/app/http/resources/v1/contact/ShowContactResource";
import Cache from "Cache";

export default class ContactController extends Controller {
  @RequestHandler
  async index(req: AuthenticRequest) {
    return ListContactResource.collection(
     // await Contact.paginateCursor(req).lean()
     await Contact.find().lean().paginateCursor(req)
    );
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

    const results = await Contact
      .find(filter, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
      .select('-score')
      .cursorPaginate(req);
    Cache.put(cacheKey, results, 5 * 3600).then(log);
    return results;
  }
  
  @RequestHandler
  async show(rawContact: IContact) {
    return rawContact;
  }
  
  @RequestHandler
  async delete(res: Response, id: string) {
    await Contact.deleteByIdOrFail(id);
    res.sendStatus(204);
  }

  @RequestHandler
  async updateStatus(req: UpdateContactStatusRequest, id: string) {
    await Contact.updateByIdOrFail(id, req.body);
    return `Contact form ${req.body.status}!`;
  }
}

