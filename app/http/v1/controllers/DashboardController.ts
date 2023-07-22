import { Request } from "express";

export default class DashboardController {
  async index() {
    return {
      message: "DashboardController works!"
    }
  }
}

