import { Module } from "@nestjs/common";
import { StripeModule } from "nestjs-stripe";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DyanmoService } from "./dyanmo/dyanmoService";
import { PaymentService } from "./payments/payments";
import { SessionService } from "./payments/sessionService";
import { PolicyService } from "./policies/policyService";

@Module({
  imports: [
    StripeModule.forRoot({
      apiKey:
        "sk_test_51JVNu0LvFtdPa1wmNLgNXZy3whQzCa7ojb3DG8aMEWmxfwNCXTlz2yWvp27aRQLQFL0pFecfJol7kPvo87DWlrZC00kO6GJOhM",
      apiVersion: "2020-08-27",
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DyanmoService,
    PaymentService,
    SessionService,
    PolicyService,
  ],
})
export class AppModule {}
