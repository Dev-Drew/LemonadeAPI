import { Module } from "@nestjs/common";
import { SupportFunctionsService } from "src/common/services/supportFunctions.service";
import { DyanmoService } from "src/dyanmo/dyanmo.service";
import { QuoteController } from "./quote.controller";
import { QuoteService } from "./quote.service";

@Module({
  controllers: [QuoteController],
  providers: [QuoteService, DyanmoService, SupportFunctionsService],
})
export class QuoteModule {}
