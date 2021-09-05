import { Module } from "@nestjs/common";
import { HelperService } from "src/common/helper.service";
import { DyanmoService } from "src/dyanmo/dyanmo.service";
import { PaymentsController } from "./payments.controller";
import { PaymentService } from "./payments.service";
import { StripeService } from "./stripe/stripe.service";

@Module({
  controllers: [PaymentsController],
  providers: [PaymentService, StripeService, DyanmoService, HelperService],
})
export class PaymentsModule {}
