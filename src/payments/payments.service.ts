import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DynamoService } from "src/dynamo/dynamo.service";
import { PaymentConfirmation } from "src/payments/models/paymentConfirmation";
import { Quote } from "src/quotes/models/quote";
import { QuoteStatus } from "src/quotes/constants/quoteStatus.enum";
import { PaymentInformation } from "./models/paymentInformation";
import { StripeService } from "./stripe/stripe.service";
import { IDValidationService } from "src/common/services/idValidation.service";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const open = require("open");

@Injectable()
export class PaymentService {
  public constructor(
    private readonly stripeService: StripeService,
    private readonly dynamoService: DynamoService,
    private readonly helperService: IDValidationService
  ) {}

  public async createPaymentConfirmation(
    paymentInformation: PaymentInformation
  ) {
    console.log(
      "Received Request to process payment for client: " +
        JSON.stringify(paymentInformation.id)
    );
    const quote: Quote = await this.dynamoService.getItem(
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
      console.log("Paying with Mortgage ID");
      paymentConfirmation = this.payWithMortgageId(paymentInfomartion, quote);
    } else {
      console.log("Paying with Stripe Session Token");
      const session = await this.stripeService.createCheckoutSession(quote);
      paymentConfirmation = this.getPaymentObject(quote, session);
      open(session.url);
    }

    return paymentConfirmation;
  }

  private payWithMortgageId(
    paymentInfomartion: PaymentInformation,
    quote: Quote
  ): PaymentConfirmation {
    let paymentConfirmation: PaymentConfirmation;
    if (this.helperService.isValidMortgageId(paymentInfomartion.mortgageId)) {
      paymentConfirmation = {
        id: paymentInfomartion.mortgageId,
        amount: quote.premium,
        quoteId: quote.id,
        confirmationDate: new Date(),
        success: true,
      };
    } else {
      throw new HttpException(
        `MortgageId: ${paymentInfomartion.mortgageId} is invalid. No payment will be processed by quoteId: ${quote.id}`,
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
      success: true,
    };
    return paymentConfirmation;
  }

  private canProcessImmediately(paymentInput: PaymentInformation): boolean {
    return paymentInput.mortgageId ? true : false;
  }

  private isEligibleForPayment(
    quote: Quote,
    quoteOnPayInfomartion: string
  ): boolean {
    const isValid = true;
    if (quote) {
      if (quote.quoteDetails.status !== QuoteStatus.READY) {
        throw new HttpException(
          `Quote is in Status ${quote.quoteDetails.status}, it needs to be in ${QuoteStatus.READY}`,
          HttpStatus.BAD_REQUEST
        );
      }
      if (quote.id !== quoteOnPayInfomartion) {
        throw new HttpException(
          `The quoteId on the payment confirmation ${quoteOnPayInfomartion} does not match the given the quote ${quote.id}`,
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
