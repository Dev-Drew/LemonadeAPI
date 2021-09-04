import { Injectable } from "@nestjs/common";
import { CoverageType } from "./models/coverageType";
import { Quote } from "./models/quote";
import { QuoteInput } from "./models/quoteInput";
import { QuoteStatus } from "./models/quoteStatus";

@Injectable()
export class AppService {
  public createQuote(quoteData: QuoteInput): Quote {
    const quote: Quote = {
      premium: 500,
      quoteType: CoverageType.HOME,
      id: "LQ" + Date.now().toString(),
      quoteDetails: {
        status: QuoteStatus.READY,
        clientDetails: quoteData,
      },
    };

    return quote;
  }
}
