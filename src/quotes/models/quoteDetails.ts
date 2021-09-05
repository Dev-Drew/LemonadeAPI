import { QuoteInput } from "./quoteInput";
import { QuoteStatus } from "../constants/quoteStatus.enum";

export interface QuoteDetails {
  status: QuoteStatus;
  clientDetails: QuoteInput;
  lengthOfTerm?: number;
  deductible?: number;
  effectiveDate?: Date;
}
