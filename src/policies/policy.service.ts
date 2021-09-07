import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DynamoService } from "src/dynamo/dynamo.service";
import { PaymentConfirmation } from "src/payments/models/paymentConfirmation";
import { StripeService } from "src/payments/stripe/stripe.service";
import { Policy } from "src/policies/models/policy";
import { Quote } from "src/quotes/models/quote";
import { QuoteStatus } from "src/quotes/constants/quoteStatus.enum";
import { Stripe } from "stripe";
import { PolicyStatus } from "./constants/policyStatus.enum";
import { AppService } from "src/app.service";
import { EmailService } from "src/email/email.service";
import { IDValidationService } from "src/common/services/idValidation.service";
import { SupportFunctionsService } from "src/common/services/supportFunctions.service";

@Injectable()
export class PolicyService {
  public constructor(
    private readonly appService: AppService,
    private readonly stripeService: StripeService,
    private readonly dynamoService: DynamoService,
    private readonly emailService: EmailService,
    private readonly idValidationService: IDValidationService,
    private readonly supportFunctionsService: SupportFunctionsService
  ) {}

  public async createPolicy(
    paymentConfirmation: PaymentConfirmation
  ): Promise<Policy> {
    const quote: Quote = await this.appService.getItem(
      paymentConfirmation.quoteId
    );

    if (await this.isEligibleForPolicyCreation(paymentConfirmation, quote)) {
      const policy = this.createPolicyObject(quote);
      const savedPolicy: Policy = await this.dynamoService.postItem(policy);
      await this.dynamoService.updateItem(quote, QuoteStatus.DONE);
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
  ): Promise<boolean> {
    let isEligible = false;

    if (
      this.isQuoteEligibleForPolicyCreation(quote, paymentConfirmation.quoteId)
    ) {
      if (this.idValidationService.isValidMortgageId(paymentConfirmation.id)) {
        isEligible = true;
      } else {
        isEligible = await this.isStripePaymentEligible(
          quote,
          paymentConfirmation
        );
      }
    }
    return isEligible;
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
  ): Promise<boolean> {
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
    const policyId = "LP" + this.supportFunctionsService.randomFixedInteger(13);
    return policyId;
  }

  private isQuoteEligibleForPolicyCreation(
    quote: Quote,
    paymentConfirmationQuoteId: string
  ): boolean {
    let isEligible = false;
    if (quote) {
      const isCorrectQuoteForPolicy = paymentConfirmationQuoteId === quote.id;
      const isStatusReady = quote.quoteDetails.status === QuoteStatus.READY;
      isEligible = isCorrectQuoteForPolicy && isStatusReady;
    }

    if (!isEligible) {
      throw new HttpException(
        `Quote can not be created policy for this quote, make the quoteId on the payment confirmation matches and this quote is in Status ${QuoteStatus.READY} `,
        HttpStatus.BAD_REQUEST
      );
    }
    return isEligible;
  }

  private determineEffectiveDate(quote: Quote): Date {
    return quote.quoteDetails.effectiveDate || new Date();
  }
}
