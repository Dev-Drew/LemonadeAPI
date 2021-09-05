import { CoverageType } from "../../common/models/coverageType.enum";
import { LemonadeDocument } from "../../common/models/lemonadeDocument";
import { PolicyStatus } from "../constants/policyStatus.enum";

export interface Policy extends LemonadeDocument {
  quoteId: string;
  deductible: number;
  effectiveDate: Date;
  lengthOfTerm: number;
  coverageType: CoverageType;
  preimum: number;
  policyStatus: PolicyStatus;
}
