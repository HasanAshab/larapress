import { Request } from "express";
import Category from "app/models/Category";

export default class CategoryController {
  async index(req: Request) {
    return await Category.find().paginateReq(req);
  }
  
  async find(req: Request) {
    return await Category.findById(req.params.id);
  }
  
  async create(req: Request) {
    if(await Category.findOne({ slug: req.validated.slug }))
      return { status: 400, message: "Slug must be unique" };
    const category = await Category.create(req.validated);
    const icon = req.files!.icon;
    if (icon && !Array.isArray(icon)) 
      await category.attach("icon", icon, true);
    return { status: 201, message: "Category successfully created!"};
  }
  
  async update(req: Request) {
    const { updatedCount } = await Category.updateOne({_id: req.params.id}, req.body);
    return updatedCount === 1
      ? { status: 200 }
      : { status: 404 };
  }
  
  async delete(req: Request) {
    const { deletedCount } = await Category.deleteOne({_id: req.params.id});
    return deletedCount === 1
      ? { status: 204 }
      : { status: 404 };
  }
}

