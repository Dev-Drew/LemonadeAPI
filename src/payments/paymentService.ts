import { Injectable } from "@nestjs/common";
import { InjectStripe } from "nestjs-stripe";
import { PaymentConfirmation } from "src/payments/models/paymentConfirmation";
import { Quote } from "src/quotes/models/quote";
import { QuoteInput } from "src/quotes/models/quoteInput";
import Stripe from "stripe";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const YOUR_DOMAIN = "http://localhost:3000";

@Injectable()
export class PaymentService {
  public constructor(@InjectStripe() private readonly stripe: Stripe) {}

  public async processPayment(quote: Quote): Promise<any> {
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
      success_url: `${YOUR_DOMAIN}/api/payment/success/${quote.id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/api/payment/failure`,
    });

    return session;
  }

  public createPaymentConfirmation(quote: Quote, session): PaymentConfirmation {
    const paymentConfirmation: PaymentConfirmation = {
      id: session.id,
      amount: session.amount_total,
      sessionCreatedDate: new Date(),
      sessionExpirationDate: session.expires_at,
      quoteId: quote.id,
    };
    return paymentConfirmation;
  }
}
