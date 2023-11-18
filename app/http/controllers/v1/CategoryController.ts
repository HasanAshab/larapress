import Controller from "~/app/http/controllers/Controller";
import { RequestHandler } from "~/core/decorators";
import { Request, AuthenticRequest, Response } from "~/core/express";
import Category from "~/app/models/Category";
import CategoryRequest from "~/app/http/requests/v1/CategoryRequest";
import UpdateCategoryRequest from "~/app/http/requests/v1/UpdateCategoryRequest";
import URL from "URL";

export default class CategoryController extends Controller {
  @RequestHandler
  async index(req: AuthenticRequest) {
    return await Category.find().paginateReq(req);
  }
  
  @RequestHandler
  async show(id: string) {
    return await Category.findByIdOrFail(id).lean();
  }
  
  @RequestHandler
  async store(req: CategoryRequest, res: Response) {
    const category = new Category(req.body);
    if(req.files.icon) {
      await category.media().attach(req.files.icon).saveRef();
    }
    const { _id } = await category.save();
    const categoryUrl = URL.route("v1_categories.show", { id: _id });
    res.header("Location", categoryUrl).status(201).message("Category successfully created!");
  }
  
  @RequestHandler
  async update(req: UpdateCategoryRequest, res: Response, id: string) {
    const icon = req.files.icon;
    if(!icon) {
      const { modifiedCount } = await Category.updateOne({ _id: id }, req.body);
      return modifiedCount === 1
        ? "Category updated!"
        : res.status(404).message();
    }
    const category = await Category.findByIdOrFail(id);
    Object.assign(category, req.body);
    // TODO reduce query
    await category.media().replaceBy(icon);
    await category.save();
    return "Category updated!";
  }
  
  @RequestHandler
  async delete(res: Response, id: string) {
    const { deletedCount } = await Category.deleteOne({ _id: id });
    res.status(deletedCount === 1 ? 204 : 404).message();
  }
}

