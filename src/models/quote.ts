import { PolicyType } from "aws-sdk/clients/applicationautoscaling";
import { QuoteDetails } from "./quoteDetails";

export interface Quote {
  premium: number;
  id: string;
  lastUpdateTime?: string;
  quoteType: PolicyType;
  quoteDetails: QuoteDetails;
}
