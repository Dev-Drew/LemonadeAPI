import { Module } from "@nestjs/common";
import { IDValidationService } from "src/common/services/idValidation.service";
import { DynamoService } from "src/dynamo/dynamo.service";
import { PaymentsController } from "./payments.controller";
import { PaymentService } from "./payments.service";
import { StripeService } from "./stripe/stripe.service";

@Module({
  controllers: [PaymentsController],
  providers: [
    PaymentService,
    StripeService,
    DynamoService,
    IDValidationService,
  ],
})
export class PaymentsModule {}
