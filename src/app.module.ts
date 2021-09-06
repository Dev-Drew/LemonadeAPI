import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { StripeModule } from "nestjs-stripe";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DyanmoService } from "./dyanmo/dyanmo.service";
import { PaymentsModule } from "./payments/payments.module";
import { PolicyModule } from "./policies/policy.module";
import { QuoteModule } from "./quotes/quote.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    StripeModule.forRoot({
      apiKey: process.env.STRIPE_TEST_KEY,
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
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [DyanmoService, AppService],
})
export class AppModule {}
