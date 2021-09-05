import { Module } from "@nestjs/common";
import { StripeModule } from "nestjs-stripe";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { HelperService } from "./common/helper.service";
import { DyanmoService } from "./dyanmo/dyanmo.service";
import { PaymentsModule } from "./payments/payments.module";
import { PolicyModule } from "./policies/policy.module";
import { QuoteModule } from "./quotes/quote.module";

@Module({
  imports: [
    StripeModule.forRoot({
      apiKey:
        "sk_test_51JVNu0LvFtdPa1wmNLgNXZy3whQzCa7ojb3DG8aMEWmxfwNCXTlz2yWvp27aRQLQFL0pFecfJol7kPvo87DWlrZC00kO6GJOhM",
      apiVersion: "2020-08-27",
    }),
    PolicyModule,
    PaymentsModule,
    QuoteModule,
  ],
  controllers: [AppController],
  providers: [DyanmoService, HelperService, AppService],
})
export class AppModule {}
