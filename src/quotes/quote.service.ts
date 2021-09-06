import { Injectable } from "@nestjs/common";
import { CoverageType } from "src/common/models/coverageType.enum";
import { Quote } from "./models/quote";
import { QuoteInput } from "./models/quoteInput";
import { QuoteStatus } from "./constants/quoteStatus.enum";
import { SupportFunctionsService } from "src/common/services/supportFunctions.service";

@Injectable()
export class QuoteService {
  public constructor(
    private readonly supportFunctionsService: SupportFunctionsService
  ) {}
  public createQuote(quoteData: QuoteInput): Quote {
    const quote: Quote = {
      premium: 500,
      coverageType: CoverageType.HOME,
      id: "LQ" + this.supportFunctionsService.randomFixedInteger(13),
      quoteDetails: {
        status: QuoteStatus.READY,
        clientDetails: quoteData,
      },
    };
    return quote;
  }
}
