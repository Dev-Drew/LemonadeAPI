import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { StripeModule } from "nestjs-stripe";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
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
    MailerModule.forRoot({
      transport: {
        service: "mailtrap",
        host: "smtp://smtp.mailtrap.io",
        port: 2525,
        ignoreTLS: true,
        secure: false,
        auth: {
          user: "2a798c947a2ebe",
          pass: "8eb3c831254231",
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [DyanmoService, AppService],
})
export class AppModule {}
