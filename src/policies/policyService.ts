import { Injectable } from "@nestjs/common";
import { Policy } from "src/models/policy";
import { Quote } from "src/models/quote";

@Injectable()
export class PolicyService {
  public createPolicy(quote: Quote): Policy {
    const policyID = this.createPolicyId();
    const effectiveDate = this.determineEffectiveDate(quote);

    const policy: Policy = new Policy(
      quote.id,
      policyID,
      effectiveDate,
      quote.quoteDetails.lengthOfTerm || 12,
      quote.coverageType,
      quote.quoteDetails.deductible | 2000,
      quote.premium
    );

    console.log("CREATED POLICY: " + policy);
    return policy;
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
