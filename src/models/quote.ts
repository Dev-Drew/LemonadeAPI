import { CoverageType } from "./coverageType.enum";
import { LemonadeDocument } from "./lemonadeDocument";
import { QuoteDetails } from "./quoteDetails";

export interface Quote extends LemonadeDocument {
  premium: number;
  id: string;
  lastUpdateTime?: Date;
  coverageType: CoverageType;
  quoteDetails: QuoteDetails;
}
