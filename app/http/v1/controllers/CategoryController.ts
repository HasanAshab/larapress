import { controller } from "~/core/decorators/class";
import { Request, Response } from "express";
import Category from "~/app/models/Category";

@controller
export default class CategoryController {
  async index(req: Request, res: Response) {
    res.api(await Category.find().paginateReq(req));
  }
  
  async find(req: Request, res: Response) {
    const category = await Category.findById(req.params.id);
    return category 
      ? res.api(category)
      : res.status(404).message();
  }
  
  async create(req: Request, res: Response) {
    const category = await Category.create(req.body);
    const icon = req.files?.icon;
    if (icon && !Array.isArray(icon)) 
      await category.attach("icon", icon, true);
    res.status(201).message("Category successfully created!");
  }
  
  async update(req: Request, res: Response) {
    const icon = req.files?.icon;
    if(!icon){
      const { modifiedCount } = await Category.updateOne({_id: req.params.id}, req.body);
      return modifiedCount === 1
        ? res.message("Category updated!")
        : res.status(404).message();
    }
    const category = await Category.findById(req.params.id);
    if(!category) return res.status(404).message();
    Object.assign(category, req.body);
    await category.detach("icon");
    await category.attach("icon", icon as any, true);
    await category.save();
    res.message("Category updated!");
  }
  
  async delete(req: Request, res: Response) {
    const { deletedCount } = await Category.deleteOne({_id: req.params.id});
    res.status(deletedCount === 1 ? 204 : 404).message();
  }
}

