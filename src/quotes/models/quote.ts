import { CoverageType } from "../../common/models/coverageType.enum";
import { LemonadeDocument } from "../../common/models/lemonadeDocument";
import { QuoteDetails } from "./quoteDetails";

export interface Quote extends LemonadeDocument {
  premium: number;
  coverageType: CoverageType;
  quoteDetails: QuoteDetails;
}
