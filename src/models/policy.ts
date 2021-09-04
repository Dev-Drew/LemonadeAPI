import { PolicyType } from "aws-sdk/clients/applicationautoscaling";

export class Policy {
  private quoteId: string;
  private policyId: string;
  private effectiveDate: string;
  private lengthOfTerm: number;
  private policyType: PolicyType[] = [];
  private deductible: number;
  private preimum: number;
  private lastUpdateTime?: string;

  public constructor(
    quoteId,
    policyId,
    effectiveDate,
    lengthOfTerm,
    policyType,
    deductible,
    preimum
  ) {
    this.quoteId = quoteId;
    this.deductible = deductible;
    this.policyId = policyId;
    this.effectiveDate = effectiveDate;
    this.lengthOfTerm = lengthOfTerm;
    this.policyType.push(policyType);
    this.preimum = preimum;
  }
}
