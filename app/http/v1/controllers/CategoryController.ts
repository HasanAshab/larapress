import RequestHandler from "~/core/decorators/RequestHandler";
import { Request, AuthenticRequest } from "~/core/express";
import Category from "~/app/models/Category";
import CreateCategoryRequest from "~/app/http/v1/requests/CreateCategoryRequest";
import UpdateCategoryRequest from "~/app/http/v1/requests/UpdateCategoryRequest";

export default class CategoryController {
  @RequestHandler
  async index(req: AuthenticRequest) {
    return await Category.find().paginateReq(req);
  }
  
  @RequestHandler
  async find(id: string) {
    return await Category.findByIdOrFail(id);
  }
  
  @RequestHandler
  async create(req: CreateCategoryRequest) {
    const icon = req.files.icon;
    const category = new Category(req.body);
    icon && await category.attach("icon", icon);
    await category.save();
    res.status(201).message("Category successfully created!");
  }
  
  @RequestHandler
  async update(req: UpdateCategoryRequest, id: string) {
    const icon = req.files.icon;
    if(!icon) {
      const { modifiedCount } = await Category.updateOne({_id: id}, req.body);
      return modifiedCount === 1
        ? res.message("Category updated!")
        : res.status(404).message();
    }
    const category = await Category.findByIdOrFail(id);
    Object.assign(category, req.body);
    category.detach("icon");
    await category.attach("icon", icon);
    await category.save();
    return "Category updated!";
  }
  
  @RequestHandler
  async delete(id: string) {
    const { deletedCount } = await Category.deleteOne({ _id: id });
    res.status(deletedCount === 1 ? 204 : 404).message();
  }
}

