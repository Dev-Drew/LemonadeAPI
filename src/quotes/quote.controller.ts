import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { TableNames } from "src/dynamo/constants/TableNames.enum";
import { DynamoService } from "src/dynamo/dynamo.service";
import { Quote } from "./models/quote";
import { QuoteInput } from "./models/quoteInput";
import { QuoteService } from "./quote.service";

@Controller()
export class QuoteController {
  constructor(
    private readonly quoteService: QuoteService,
    private readonly dynamoService: DynamoService
  ) {}

  @Post("/quote")
  @UsePipes(new ValidationPipe({ transform: true }))
  public async createQuote(@Body() quoteInput: QuoteInput): Promise<Quote> {
    console.log("Recieved request for Quote: " + JSON.stringify(quoteInput));
    const quote: Quote = this.quoteService.createQuote(quoteInput);
    console.log("Returning Quote: " + JSON.stringify(quote));
    const savedQuote: Quote = await this.dynamoService.postItem(quote);
    return savedQuote;
  }
  @Get("/quote")
  public async getAllQuotes(): Promise<any> {
    console.log("Retrieve all clients from table");
    const data = await this.dynamoService.getAllItems(TableNames.QUOTE_TABLE);
    console.log("All items from table: " + JSON.stringify(data));
    return data;
  }
}
