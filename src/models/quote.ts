import { CoverageType } from "./coverageType";
import { LemonadeDocument } from "./lemonadeDocument";
import { QuoteDetails } from "./quoteDetails";

export interface Quote extends LemonadeDocument {
  premium: number;
  id: string;
  lastUpdateTime?: string;
  coverageType: CoverageType;
  quoteDetails: QuoteDetails;
}
