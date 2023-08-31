import { Request } from "express";

export default class ContactController {
  async index() {
    return {
      message: "ContactController works!"
    }
  }
}

