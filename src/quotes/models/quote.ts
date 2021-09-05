import { CoverageType } from "../../models/coverageType.enum";
import { LemonadeDocument } from "../../models/lemonadeDocument";
import { QuoteDetails } from "./quoteDetails";

export interface Quote extends LemonadeDocument {
  premium: number;
  id: string;
  lastUpdateTime?: Date;
  coverageType: CoverageType;
  quoteDetails: QuoteDetails;
}
