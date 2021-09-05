import { Injectable } from "@nestjs/common";
import { CoverageType } from "src/common/models/coverageType.enum";
import { Quote } from "./models/quote";
import { QuoteInput } from "./models/quoteInput";
import { QuoteStatus } from "./constants/quoteStatus.enum";

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
