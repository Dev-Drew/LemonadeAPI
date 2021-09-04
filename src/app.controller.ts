import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { AppService } from "./app.service";
import { DyanmoService } from "./dyanmo/dyanmoService";
import { PaymentConfirmation } from "./models/paymentConfirmation";
import { Quote } from "./models/quote";
import { QuoteInput } from "./models/quoteInput";
import { PaymentService } from "./payments/payments";
import { QuoteStatus } from "./models/quoteStatus";
import { PaymentInformation } from "./models/paymentProcessInput";
import { SessionService } from "./payments/sessionService";
import { PolicyService } from "./policies/policyService";
import { Policy } from "./models/policy";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const open = require("open");

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dyanmoService: DyanmoService,
    private readonly paymentService: PaymentService,
    private readonly sessionService: SessionService,
    private readonly policyService: PolicyService
  ) {}

  @Post("/payment/success/:id?")
  public async paymentSuccess(
    @Param("id") id,
    @Query("session_id") checkoutSession
  ): Promise<any> {
    console.log("params: " + id);
    console.log("session_id: " + checkoutSession);

    const quote: Quote = await this.dyanmoService.getItem(id);
    const session = await this.sessionService.retrieveStripeSession(
      checkoutSession
    );
    console.log("session: " + JSON.stringify(session));
    console.log("quote: " + JSON.stringify(quote));

    if (
      session.payment_status === "paid" &&
      quote.quoteDetails.status === QuoteStatus.READY
    ) {
      const policy = this.policyService.createPolicy(quote);
      const savedPolicy: Policy = await this.dyanmoService.postItem(policy);
      return savedPolicy;
    } else {
      throw new HttpException(
        "This quote has not been paid for " + id,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get("/payment/failure")
  public paymentFailure(): any {
    return "Payment Failure";
  }

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

      if (!quote) {
        throw new HttpException(
          "No Quote found with ID: " + id,
          HttpStatus.NOT_FOUND
        );
      } else {
        return quote;
      }
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

  @Post("/createCheckOutSession")
  public async processPayment(
    @Body() paymentInfomartion: PaymentInformation
  ): Promise<PaymentConfirmation> {
    console.log(
      "Received Request to process payment for client: " +
        JSON.stringify(paymentInfomartion.id)
    );
    const quote: Quote = await this.dyanmoService.getItem(
      paymentInfomartion.id
    );
    console.log("Recieved quote for client with ID: " + paymentInfomartion.id);
    let checkoutSession;
    if (quote.quoteDetails.status === QuoteStatus.READY) {
      checkoutSession = await this.paymentService.processPayment(quote);
      console.log("checkoutSession: " + JSON.stringify(checkoutSession));
      open(checkoutSession.url);
    } else {
      throw new Error(
        `Quote is not in ${QuoteStatus.READY}, it must be in this status to process payment`
      );
    }

    return checkoutSession;
  }
}
