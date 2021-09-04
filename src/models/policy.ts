import { CoverageType } from "./coverageType";
import { LemonadeDocument } from "./lemonadeDocument";

export class Policy implements LemonadeDocument {
  public id: string;
  private quoteId: string;
  private effectiveDate: string;
  private lengthOfTerm: number;
  private coverageType: CoverageType;
  private deductible: number;
  private preimum: number;
  private lastUpdateTime?: string;

  public constructor(
    quoteId,
    policyId,
    effectiveDate,
    lengthOfTerm,
    coverageType,
    deductible,
    preimum
  ) {
    this.quoteId = quoteId;
    this.deductible = deductible;
    this.id = policyId;
    this.effectiveDate = effectiveDate;
    this.lengthOfTerm = lengthOfTerm;
    this.coverageType = coverageType;
    this.preimum = preimum;
  }
}
