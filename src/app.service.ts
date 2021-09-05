import { Injectable } from "@nestjs/common";
import { CoverageType } from "./models/coverageType.enum";
import { Quote } from "./quotes/models/quote";
import { QuoteInput } from "./quotes/models/quoteInput";
import { QuoteStatus } from "./quotes/models/quoteStatus";

@Injectable()
export class AppService {
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
  //TODO : Determine preimum dynamically
}
