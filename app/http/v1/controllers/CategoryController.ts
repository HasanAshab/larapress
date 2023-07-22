import { Request } from "express";
import Category from "app/models/Category";

export default class CategoryController {
  async index(req: Request) {
    return await Category.find().paginateReq(req);
  }
  
  async find(req: Request) {
    return await Category.findById(req.params.id) ?? { status: 404 };
  }
  
  async create(req: Request) {
    if(await Category.findOne({ slug: req.validated.slug }))
      return { status: 400, message: "Slug must be unique" };
    const category = await Category.create(req.validated);
    const icon = req.files?.icon;
    if (icon && !Array.isArray(icon)) 
      await category.attach("icon", icon, true);
    return { status: 201, message: "Category successfully created!"};
  }
  
  async update(req: Request) {
    const icon = req.files?.icon;
    if(!icon){
      const { modifiedCount } = await Category.updateOne({_id: req.params.id}, req.validated);
      return modifiedCount === 1
        ? { status: 200, "Category updated!" }
        : { status: 404 };
    }
    const category = await Category.findById(req.params.id);
    if(!category) return { status: 404 };
    Object.assign(category, req.validated);
    await category.detach("icon");
    await category.attach("icon", icon as any, true);
    await category.save();
    return { message: "Category updated!" };
  }
  
  async delete(req: Request) {
    const { deletedCount } = await Category.deleteOne({_id: req.params.id});
    return deletedCount === 1
      ? { status: 204 }
      : { status: 404 };
  }
}

