import { Module } from "@nestjs/common";
import { IDValidationService } from "src/common/idValidation.service";
import { DyanmoService } from "src/dyanmo/dyanmo.service";
import { PaymentsController } from "./payments.controller";
import { PaymentService } from "./payments.service";
import { StripeService } from "./stripe/stripe.service";

@Module({
  controllers: [PaymentsController],
  providers: [PaymentService, StripeService, DyanmoService, IDValidationService],
})
export class PaymentsModule {}
