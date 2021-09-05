import { Injectable } from "@nestjs/common";
import { CoverageType } from "src/models/coverageType.enum";
import { Quote } from "./quote";
import { QuoteInput } from "./quoteInput";
import { QuoteStatus } from "./quoteStatus";

@Injectable()
export class QuoteService {
  public createQuote(quoteData: QuoteInput): Quote {
    const quote: Quote = {
      premium: 500,
      coverageType: CoverageType.HOME,
      id: "LQ" + Date.now().toString(),
      quoteDetails: {
        status: QuoteStatus.READY,
        clientDetails: quoteData,
      },
    };
    return quote;
  }
}
