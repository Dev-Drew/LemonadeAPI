import { CoverageType } from "../../models/coverageType.enum";
import { LemonadeDocument } from "../../models/lemonadeDocument";
import { PolicyStatus } from "../constants/policyStatus.enum";

export class Policy implements LemonadeDocument {
  public id: string;
  private quoteId: string;
  private effectiveDate: string;
  private lengthOfTerm: number;
  private coverageType: CoverageType;
  private deductible: number;
  private preimum: number;
  private totalPaidByCustomer: number;
  private policyStatus: PolicyStatus;
  private lastUpdateTime?: string;

  public constructor(
    quoteId,
    policyId,
    effectiveDate,
    lengthOfTerm,
    coverageType,
    deductible,
    preimum,
    totalPaidByCustomer
  ) {
    this.quoteId = quoteId;
    this.deductible = deductible;
    this.id = policyId;
    this.effectiveDate = effectiveDate;
    this.lengthOfTerm = lengthOfTerm;
    this.coverageType = coverageType;
    this.preimum = preimum;
    this.totalPaidByCustomer = totalPaidByCustomer;
    this.policyStatus = PolicyStatus.ACTIVE;
  }
}
