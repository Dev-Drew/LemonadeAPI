import { Injectable } from "@nestjs/common";
import { InjectStripe } from "nestjs-stripe";
import { PaymentConfirmation } from "src/payments/models/paymentConfirmation";
import { Quote } from "src/quotes/models/quote";
import { QuoteInput } from "src/quotes/models/quoteInput";
import Stripe from "stripe";
import { PaymentInformation } from "./models/paymentProcessInput";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const YOUR_DOMAIN = "http://localhost:3000";

@Injectable()
export class PaymentService {
  public constructor(@InjectStripe() private readonly stripe: Stripe) {}

  public async processPayment(
    paymentInfomartion: PaymentInformation,
    quote: Quote
  ): Promise<PaymentConfirmation> {
    let paymentConfirmation: PaymentConfirmation;
    if (this.canProcessImmediately(paymentInfomartion)) {
      paymentConfirmation = this.payWithMortageId(paymentInfomartion, quote);
    } else {
      const session = await this.createCheckoutSession(quote);
      paymentConfirmation = this.createPaymentConfirmation(quote, session);
    }

    return paymentConfirmation;
  }

  private payWithMortageId(
    paymentInfomartion: PaymentInformation,
    quote: Quote
  ): PaymentConfirmation {
    const paymentConfirmation: PaymentConfirmation = {
      id: paymentInfomartion.mortgageId,
      amount: quote.premium,
      quoteId: quote.id,
      confirmationDate: new Date(),
    };
    return paymentConfirmation;
  }
  public createPaymentConfirmation(quote: Quote, session): PaymentConfirmation {
    const paymentConfirmation: PaymentConfirmation = {
      id: session.id,
      amount: session.amount_total,
      confirmationDate: new Date(),
      sessionExpirationDate: session.expires_at,
      quoteId: quote.id,
    };
    return paymentConfirmation;
  }
  private async createCheckoutSession(quote: Quote): Promise<any> {
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

  private canProcessImmediately(paymentInput: PaymentInformation): boolean {
    return paymentInput.mortgageId ? true : false;
  }
}
