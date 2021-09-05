import { Body, Controller, Get, Post } from "@nestjs/common";
import { TableNames } from "src/dyanmo/constants/TableNames.enum";
import { DyanmoService } from "src/dyanmo/dyanmo.service";
import { Quote } from "./models/quote";
import { QuoteInput } from "./models/quoteInput";
import { QuoteService } from "./quote.service";

@Controller()
export class QuoteController {
  constructor(
    private readonly quoteService: QuoteService,
    private readonly dyanmoService: DyanmoService
  ) {}

  @Post("/quote")
  public async createQuote(@Body() quoteInput: QuoteInput): Promise<Quote> {
    console.log("Recieved request for Quote: " + JSON.stringify(quoteInput));
    const quote: Quote = this.quoteService.createQuote(quoteInput);
    console.log("Returning Quote: " + JSON.stringify(quote));
    const savedQuote: Quote = await this.dyanmoService.postItem(quote);
    return savedQuote;
  }
  @Get("/quotes")
  public async getAllQuotes(): Promise<any> {
    console.log("Retrieve all clients from table");
    const data = await this.dyanmoService.getAllItems(TableNames.QUOTE_TABLE);
    console.log("All items from table: " + JSON.stringify(data));
    return data;
  }
}
