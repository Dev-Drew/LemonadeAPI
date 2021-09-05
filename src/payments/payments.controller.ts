import {
  Controller,
  HttpStatus,
  Post,
  Get,
  HttpException,
  Body,
} from "@nestjs/common";
import { PaymentConfirmation } from "./models/paymentConfirmation";
import { PaymentInformation } from "./models/paymentInformation";
import { PaymentService } from "./payments.service";

@Controller()
export class PaymentsController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get("/payment/success")
  public paymentSuccessMessage(): any {
    return HttpStatus.OK;
  }

  @Get("/payment/failure")
  public paymentFailure(): any {
    throw new HttpException(
      "Unable to Process payment ",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }

  @Post("/paymentConfirmation")
  public async processPayment(
    @Body() paymentInfomartion: PaymentInformation
  ): Promise<PaymentConfirmation> {
    const paymentConfirmation =
      await this.paymentService.createPaymentConfirmation(paymentInfomartion);
    return paymentConfirmation;
  }
}
