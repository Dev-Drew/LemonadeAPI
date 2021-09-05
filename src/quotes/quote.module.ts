import { Module } from "@nestjs/common";
import { DyanmoService } from "src/dyanmo/dyanmo.service";
import { QuoteController } from "./quote.controller";
import { QuoteService } from "./quote.service";

@Module({
  controllers: [QuoteController],
  providers: [QuoteService, DyanmoService],
})
export class QuoteModule {}
