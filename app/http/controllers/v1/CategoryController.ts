import Controller from "~/app/http/controllers/Controller";
import { RequestHandler } from "~/core/decorators";
import { Request, AuthenticRequest, Response } from "~/core/express";
import Category, { ICategory } from "~/app/models/Category";
import CategoryRequest from "~/app/http/requests/v1/CategoryRequest";
import UpdateCategoryRequest from "~/app/http/requests/v1/UpdateCategoryRequest";
import URL from "URL";

import formidable from 'formidable';


export default class CategoryController extends Controller {
  @RequestHandler
  async index(req: AuthenticRequest) {
    return await Category.find().paginateReq(req);
  }

  @RequestHandler
  async show(rawCategory: ICategory) {
    return rawCategory;
  }
  /*
  icon: {
    name: '.gitignore',
    data: <Buffer 6e 6f 64 65 5f 6d 6f 64 75 6c 65 73 0a 2f 70 61 63 6b 61 67 65 2d 6c 6f 63 6b 2e 6a 73 6f 6e 0a 2f 64 69 73 74 0a 2e 65 6e 76 0a>,
    size: 43,
    encoding: '7bit',
    tempFilePath: '',
    truncated: false,
    mimetype: 'application/octet-stream',
    md5: 'f9bdd180c301986fd3f4899776ccba12',
    mv: [Function: mv]
  }
  */
  @RequestHandler
  async store(req: Request, res: Response) {
    const form = formidable({});
    const [_, files] = await form.parse(req)
        return {}

    req.files = {};

    log(req.files)
    return req.files
    
    const category = new Category(req.body);
    await category.media().attach(req.files.icon).saveRef();
    const { _id } = await category.save();
    const categoryUrl = URL.route("v1_categories.show", { id: _id });
    res.header("Location", categoryUrl).status(201).message("Category successfully created!");
  }
  
  @RequestHandler
  async update(req: UpdateCategoryRequest, res: Response, id: string) {
    const category = await Category.findByIdAndUpdateOrFail(id, req.body);
    if(req.files.icon) {
      await category.media().replaceBy(req.files.icon);
    }
    return "Category updated!";
  }
  
  @RequestHandler
  async delete(res: Response, id: string) {
    await Category.deleteOneByIdOrFail(id);
    res.sendStatus(204);
  }
}

