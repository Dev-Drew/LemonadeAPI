import { Injectable } from "@nestjs/common";
import { InjectStripe } from "nestjs-stripe";
import { Quote } from "src/quotes/models/quote";
import { QuoteInput } from "src/quotes/models/quoteInput";
import Stripe from "stripe";

//move this an env file or a constant;
const DOMAIN = "http://localhost:3000";

@Injectable()
export class StripeService {
  public constructor(@InjectStripe() private readonly stripe: Stripe) {}

  public async retrieveStripeSession(
    sessionid: string
  ): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    const session = await this.stripe.checkout.sessions.retrieve(sessionid);
    return session;
  }

  public async createCheckoutSession(quote: Quote): Promise<any> {
    console.log("Processing Payment for ID: " + quote.id);
    const quoteInput: QuoteInput = quote.quoteDetails.clientDetails;
    const session = this.stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: quote.premium * 100,
            product_data: {
              name: `Lemonade ${quote.coverageType.toLocaleUpperCase()} Insurance`,
              description: `Policy for ${quoteInput.firstName} ${quoteInput.lastName} covering residence at ${quoteInput.address}`,
            },
          },
          quantity: 1,
        },
      ],
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${DOMAIN}/api/payment/success`,
      cancel_url: `${DOMAIN}/api/payment/failure`,
    });

    return session;
  }
}
