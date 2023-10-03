import express, { Router } from "express";
import User from "~/app/models/User";

const router: Router = express.Router();

// Endpoints for dashboard
router.get("/t1", async req => {
  res.json(await User.findOneOrFail({email: "rjdj"}))
});

router.get("/t2", req => {
  res.json({a:"oooyee"})
});

export default router;
