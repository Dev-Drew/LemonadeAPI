import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DyanmoService } from "src/dyanmo/dyanmo.service";
import { PaymentConfirmation } from "src/payments/models/paymentConfirmation";
import { StripeService } from "src/payments/stripe/stripe.service";
import { Policy } from "src/policies/models/policy";
import { Quote } from "src/quotes/models/quote";
import { QuoteStatus } from "src/quotes/constants/quoteStatus.enum";
import { Stripe } from "stripe";
import { PolicyStatus } from "./constants/policyStatus.enum";
import { AppService } from "src/app.service";
import { EmailService } from "src/email/email.service";

@Injectable()
export class PolicyService {
  public constructor(
    private readonly appService: AppService,
    private readonly stripeService: StripeService,
    private readonly dyanmoService: DyanmoService,
    private readonly emailService: EmailService
  ) {}

  public async createPolicy(
    paymentConfirmation: PaymentConfirmation
  ): Promise<Policy> {
    const quote: Quote = await this.appService.getItem(
      paymentConfirmation.quoteId
    );

    if (this.isEligibleForPolicyCreation(paymentConfirmation, quote)) {
      const policy = this.createPolicyObject(quote);
      const savedPolicy: Policy = await this.dyanmoService.postItem(policy);
      await this.dyanmoService.updateItem(quote, QuoteStatus.DONE);
      this.emailService.sendEmail(
        policy,
        quote.quoteDetails.clientDetails.email,
        quote.quoteDetails.clientDetails.firstName
      );
      return savedPolicy;
    } else {
      throw new HttpException(
        `There is an issue with Payment confirmation id: ${paymentConfirmation.id}. No policy wil be created for quote with  id ${quote.id}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  private async isEligibleForPolicyCreation(
    paymentConfirmation: PaymentConfirmation,
    quote: Quote
  ) {
    let isEligible = false;
    if (quote) {
      if (paymentConfirmation.quoteId === quote.id) {
        if (this.isIncludedWithMortage(paymentConfirmation.id)) {
          isEligible = true;
        } else {
          isEligible = await this.isStripePaymentEligible(
            quote,
            paymentConfirmation
          );
        }
        return isEligible;
      } else {
        return Error(
          "This payment confirmation does not match the Id on the quote"
        );
      }
    }
  }

  private createPolicyObject(quote: Quote): Policy {
    const policyID: string = this.createPolicyId();
    const effectiveDate: Date = this.determineEffectiveDate(quote);

    const policy: Policy = {
      id: policyID,
      quoteId: quote.id,
      effectiveDate: effectiveDate,
      lengthOfTerm: quote.quoteDetails.lengthOfTerm || 12,
      coverageType: quote.coverageType,
      deductible: quote.quoteDetails.deductible | 2000,
      preimum: quote.premium,
      policyStatus: PolicyStatus.ACTIVE,
    };

    return policy;
  }

  private async isStripePaymentEligible(
    quote: Quote,
    paymentConfirmation: PaymentConfirmation
  ) {
    const session: Stripe.Response<Stripe.Checkout.Session> =
      await this.stripeService.retrieveStripeSession(paymentConfirmation.id);
    const isClientPaid = session.payment_status === "paid";
    const isStatusReady = quote.quoteDetails.status === QuoteStatus.READY;

    const isCorrectPaymentAmount =
      session.amount_subtotal === quote.premium * 100;
    const policyCanBeCreated =
      isClientPaid && isStatusReady && isCorrectPaymentAmount;

    if (!policyCanBeCreated) {
      console.log(
        `isClientPaid: ${isClientPaid}, isStatusReady: ${isStatusReady}, isCorrectPaymentAmount: ${isCorrectPaymentAmount} `
      );
    }

    return policyCanBeCreated;
  }

  private createPolicyId(): string {
    const policyId = "LP" + this.randomFixedInteger(13);
    return policyId;
  }

  private determineEffectiveDate(quote: Quote): Date {
    return quote.quoteDetails.effectiveDate || new Date();
  }

  private isIncludedWithMortage(id: string) {
    return id.slice(0, 3) === "MID" ? true : false;
  }

  private randomFixedInteger(length) {
    return Math.floor(
      Math.pow(10, length - 1) +
        Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
    );
  }
}
