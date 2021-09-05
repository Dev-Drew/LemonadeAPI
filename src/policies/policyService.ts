import { Injectable } from "@nestjs/common";
import { Policy } from "src/policies/models/policy";
import { Quote } from "src/quotes/models/quote";
import { QuoteStatus } from "src/quotes/models/quoteStatus";

@Injectable()
export class PolicyService {
  public createPolicy(quote: Quote, totalPaidBycusomter: number): Policy {
    const policyID = this.createPolicyId();
    const effectiveDate = this.determineEffectiveDate(quote);

    const policy: Policy = new Policy(
      quote.id,
      policyID,
      effectiveDate,
      quote.quoteDetails.lengthOfTerm || 12,
      quote.coverageType,
      quote.quoteDetails.deductible | 2000,
      quote.premium,
      totalPaidBycusomter
    );

    console.log("CREATED POLICY: " + policy);
    return policy;
  }

  public isEligibleForPolicyCreation(quote: Quote, session) {
    const isClientPaid = session.payment_status === "paid";
    const isStatusReady = quote.quoteDetails.status === QuoteStatus.READY;
    const isSessionValid = !session.after_expiration;
    const isCorrectPaymentAmount =
      session.amount_subtotal === quote.premium * 100;
    const policyCanBeCreated =
      isClientPaid && isStatusReady && isSessionValid && isCorrectPaymentAmount;

    if (!policyCanBeCreated) {
      console.log(
        `isClientPaid: ${isClientPaid}, isStatusReady: ${isStatusReady}, isSessionValid: ${isSessionValid}, isCorrectPaymentAmount: ${isCorrectPaymentAmount} `
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

  private randomFixedInteger(length) {
    return Math.floor(
      Math.pow(10, length - 1) +
        Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
    );
  }
}
