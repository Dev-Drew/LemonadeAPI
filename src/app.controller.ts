import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { AppService } from "./app.service";
import { DyanmoService } from "./dyanmo/dyanmoService";
import { PaymentConfirmation } from "./models/paymentConfirmation";
import { Quote } from "./models/quote";
import { QuoteInput } from "./models/quoteInput";
import { PaymentService } from "./payments/payments";
import open from "open";
import { QuoteStatus } from "./models/quoteStatus";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dyanmoService: DyanmoService,
    private readonly paymentService: PaymentService
  ) {}

  @Get("/")
  public async getQuotes(): Promise<any> {
    console.log("Retrieve all clients from table");
    const data = await this.dyanmoService.getAllItems();
    console.log("All items from table: ");
    return data;
  }

  @Post("/")
  public async createQuote(@Body() quoteInput: QuoteInput): Promise<Quote> {
    console.log("Recieved request for Quote: " + JSON.stringify(quoteInput));
    const quote: Quote = this.appService.createQuote(quoteInput);
    console.log("Returning Quote: " + JSON.stringify(quote));
    const savedQuote: Quote = await this.dyanmoService.postItem(quote);
    return savedQuote;
  }

  @Get("/:id")
  public async getOneItem(@Param() params): Promise<Quote> {
    const id = params.id;
    if (id) {
      console.log("Request recieved for item with ID:  " + id);
      const quote: Quote = await this.dyanmoService.getItem(id);
      console.log(
        "Returning quote with id: " + id + "quote: " + JSON.stringify(quote)
      );
      return quote;
    } else {
      console.error("Invalid ID supplied: " + id);
    }
  }

  @Put("/:id")
  public async updateItem(
    @Body() updatedQuote: Quote,
    @Param() params
  ): Promise<HttpStatus> {
    if (params.id === updatedQuote.id) {
      console.log("Request recieved for item with ID:  " + params);
      const response: HttpStatus = await this.dyanmoService.updateItem(
        updatedQuote
      );
      console.log("Quote has been updated: " + JSON.stringify(response));
      return response;
    } else {
      console.log("Error, invalid quote supplied: " + JSON.stringify(params));
    }
  }

  @Delete("/:id")
  public async delete(@Param() params): Promise<HttpStatus> {
    if (params.id) {
      console.log("Request recieved to delete item with ID: " + params.id);
      const response: HttpStatus = await this.dyanmoService.deleteItem(
        params.id
      );
      return response;
    } else {
      console.log(
        "Recieved invalid request to delete quote with ID: " + params
      );
    }
  }

  @Post("/payment")
  public async processPayment(
    @Body() id: string
  ): Promise<PaymentConfirmation> {
    console.log("Received Request to process payment for client: " + id);
    const quote: Quote = await this.dyanmoService.getItem(id);

    // eslint-disable-next-line prettier/prettier
		if (quote.quoteDetails.status === QuoteStatus.READY) {
      const checkoutSession = await this.paymentService.processPayment(quote);
      console.log("checkoutSession: " + JSON.stringify(checkoutSession));
      open(checkoutSession.url);
    } else {
      throw new Error(
        `Quote is not in ${QuoteStatus.READY}, it must be in this status to process payment`
      );
    }
    const paymentConfirmation: PaymentConfirmation = {
      id: quote.id,
      amount: quote.premium,
      date: new Date(),
    };

    console.log(
      "Returning payment confirmation: " + JSON.stringify(paymentConfirmation)
    );

    return paymentConfirmation;
  }
}
