import { Module } from "@nestjs/common";
import { AppService } from "src/app.service";
import { HelperService } from "src/common/helper.service";
import { DyanmoService } from "src/dyanmo/dyanmo.service";
import { StripeService } from "src/payments/stripe/stripe.service";
import { PolicyController } from "./policy.controller";
import { PolicyService } from "./policy.service";

@Module({
  controllers: [PolicyController],
  providers: [
    PolicyService,
    DyanmoService,
    StripeService,
    AppService,
    HelperService,
  ],
})
export class PolicyModule {}
