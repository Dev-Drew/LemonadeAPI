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
import { PaymentConfirmation } from "./payments/models/paymentConfirmation";
import { Quote } from "./quotes/models/quote";
import { QuoteInput } from "./quotes/models/quoteInput";
import { PaymentService } from "./payments/paymentService";
import { QuoteStatus } from "./quotes/models/quoteStatus";
import { PaymentInformation } from "./payments/models/paymentProcessInput";
import { SessionService } from "./payments/sessionService";
import { PolicyService } from "./policies/policyService";
import { Policy } from "./policies/models/policy";

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
    const quote: Quote = (await this.dyanmoService.getItem(id)).data;
    const session = await this.sessionService.retrieveStripeSession(
      checkoutSession
    );

    if (this.policyService.isEligibleForPolicyCreation(quote, session)) {
      const totalPaidByCustomer: number = session.amount_total / 100;
      const policy = this.policyService.createPolicy(
        quote,
        totalPaidByCustomer
      );
      const savedPolicy: Policy = await this.dyanmoService.postItem(policy);
      await this.dyanmoService.updateItem(quote, QuoteStatus.DONE);
      return savedPolicy;
    } else {
      throw new HttpException(
        "There is an issue creating policy for quote with id: " + id,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get("/payment/failure")
  public paymentFailure(): any {
    throw new HttpException(
      "Unable to Process payment ",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
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
      const quote: Quote = (await this.dyanmoService.getItem(id)).data;
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
    const quote: Quote = (
      await this.dyanmoService.getItem(paymentInfomartion.id)
    ).data;

    console.log("Recieved quote for client with ID: " + JSON.stringify(quote));

    let paymentConfirmation: PaymentConfirmation;
    if (QuoteStatus.READY === quote.quoteDetails.status) {
      paymentConfirmation = await this.paymentService.processPayment(
        paymentInfomartion,
        quote
      );
    } else {
      throw new Error(
        `Quote is not in ${QuoteStatus.READY}, it must be in this status to process payment`
      );
    }

    return paymentConfirmation;
  }
}
