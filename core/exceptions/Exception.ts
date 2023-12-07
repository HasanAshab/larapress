import { Request, Response } from "express";

interface Exception {
  report: Reporter<this>;
  render?: Renderer<this>;
}

class Exception {
  shouldReport = false;
}

export default Exception;