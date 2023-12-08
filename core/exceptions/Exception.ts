import { Request, Response } from "express";
import type { Reporter, Renderer } from "./Handler";

interface Exception {
  report?: Reporter<this>;
  render?: Renderer<this>;
}

class Exception {
  shouldReport = false;
}

export default Exception;