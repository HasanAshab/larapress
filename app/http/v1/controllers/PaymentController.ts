import { Request } from "express";
import URL from "illuminate/utils/URL";
import stripe from "stripe";
import User from "app/models/User";

export default class PaymentController {
  async index() {
    const product = {
      name: "SamerBlog",
      price: 250,
      quantity: 1
    }
    const session = await stripe(process.env.STRIPE_KEY).checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
          },
          unit_amount: product.price * 100,
        },
        quantity: product.quantity,
      },
      ],
      mode: "payment",
      success_url: URL.client("/success"),
      cancel_url: URL.client("/cancel"),
    });
    return {url: session.url}
  }
  
  async test(){
    const user = await User.findOne()
    return {
      data: await user.purchase("prod_N5qz8nTqbK5Rt3", 2)
    }
  }
}