import { middleware, controller } from "helpers";
import express, { Router } from "express";

const router: Router = express.Router();
const PaymentController = controller("PaymentController");


// Endpoints for payment
router.get("/", PaymentController.test);

router.post("/create-checkout-session", PaymentController.index);


export default router;
