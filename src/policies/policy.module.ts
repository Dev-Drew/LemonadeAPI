import { Module } from "@nestjs/common";
import { AppService } from "src/app.service";
import { IDValidationService } from "src/common/services/idValidation.service";
import { SupportFunctionsService } from "src/common/services/supportFunctions.service";
import { DyanmoService } from "src/dyanmo/dyanmo.service";
import { EmailService } from "src/email/email.service";
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
    EmailService,
    IDValidationService,
    SupportFunctionsService,
  ],
})
export class PolicyModule {}
