import { QuoteInput } from "./quoteInput";
import { QuoteStatus } from "./quoteStatus";

export interface QuoteDetails {
  status: QuoteStatus;
  clientDetails: QuoteInput;
  lengthOfTerm?: string;
  deductible?: number;
  effectiveDate?: Date;
}
