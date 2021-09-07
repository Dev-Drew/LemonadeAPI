import { Module } from "@nestjs/common";
import { SupportFunctionsService } from "src/common/services/supportFunctions.service";
import { DynamoService } from "src/dynamo/dynamo.service";
import { QuoteController } from "./quote.controller";
import { QuoteService } from "./quote.service";

@Module({
  controllers: [QuoteController],
  providers: [QuoteService, DynamoService, SupportFunctionsService],
})
export class QuoteModule {}
