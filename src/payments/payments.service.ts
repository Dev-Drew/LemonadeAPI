import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DyanmoService } from "src/dyanmo/dyanmo.service";
import { PaymentConfirmation } from "src/payments/models/paymentConfirmation";
import { Quote } from "src/quotes/models/quote";
import { QuoteStatus } from "src/quotes/constants/quoteStatus.enum";
import { PaymentInformation } from "./models/paymentInformation";
import { StripeService } from "./stripe/stripe.service";
import { HelperService } from "src/common/helper.service";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const open = require("open");

@Injectable()
export class PaymentService {
  public constructor(
    private readonly stripeService: StripeService,
    private readonly dyanmoService: DyanmoService,
    private readonly helperService: HelperService
  ) {}

  public async createPaymentConfirmation(
    paymentInformation: PaymentInformation
  ) {
    console.log(
      "Received Request to process payment for client: " +
        JSON.stringify(paymentInformation.id)
    );
    const quote: Quote = await this.dyanmoService.getItem(
      paymentInformation.id
    );

    console.log("Recieved quote for client with ID: " + JSON.stringify(quote));

    let paymentConfirmation: PaymentConfirmation;
    if (this.isEligibleForPayment(quote, paymentInformation.id)) {
      paymentConfirmation = await this.processPayment(
        paymentInformation,
        quote
      );
    }
    return paymentConfirmation;
  }

  public async processPayment(
    paymentInfomartion: PaymentInformation,
    quote: Quote
  ): Promise<PaymentConfirmation> {
    let paymentConfirmation: PaymentConfirmation;
    if (this.canProcessImmediately(paymentInfomartion)) {
      console.log("Paying with Mortage ID");
      paymentConfirmation = this.payWithMortageId(paymentInfomartion, quote);
    } else {
      console.log("Paying with Stripe Session Token");
      const session = await this.stripeService.createCheckoutSession(quote);
      paymentConfirmation = this.getPaymentObject(quote, session);
      open(session.url);
    }

    return paymentConfirmation;
  }

  private payWithMortageId(
    paymentInfomartion: PaymentInformation,
    quote: Quote
  ): PaymentConfirmation {
    let paymentConfirmation: PaymentConfirmation;
    if (this.helperService.isValidMortageId(paymentInfomartion.mortageId)) {
      paymentConfirmation = {
        id: paymentInfomartion.mortageId,
        amount: quote.premium,
        quoteId: quote.id,
        confirmationDate: new Date(),
      };
    } else {
      throw new HttpException(
        `MortageId: ${paymentInfomartion.mortageId} is invalid. No payment will be processed by quoteId: ${quote.id}`,
        HttpStatus.BAD_REQUEST
      );
    }

    return paymentConfirmation;
  }

  private getPaymentObject(quote: Quote, session): PaymentConfirmation {
    const paymentConfirmation: PaymentConfirmation = {
      id: session.id,
      amount: session.amount_total / 100,
      confirmationDate: new Date(),
      sessionExpirationDate: session.expires_at,
      quoteId: quote.id,
    };
    return paymentConfirmation;
  }

  private canProcessImmediately(paymentInput: PaymentInformation): boolean {
    return paymentInput.mortageId ? true : false;
  }

  private isEligibleForPayment(
    quote: Quote,
    quoteOnPayInfomartion: string
  ): boolean {
    let isValid = false;
    if (quote) {
      if (this.helperService.isValidQuoteId(quote.id)) {
        if (quote.quoteDetails.status === QuoteStatus.READY) {
          isValid = true;
        } else {
          throw new HttpException(
            `Quote is no in the ready status`,
            HttpStatus.BAD_REQUEST
          );
        }
      } else {
        throw new HttpException(
          `ID is not a valid quote id: ${quote.id}`,
          HttpStatus.BAD_REQUEST
        );
      }
    } else {
      throw new HttpException(
        `No quote found with ID: ${quoteOnPayInfomartion}`,
        HttpStatus.BAD_REQUEST
      );
    }
    return isValid;
  }
}
