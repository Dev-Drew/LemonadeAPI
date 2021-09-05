import { Body, Controller, Delete, Get, HttpStatus, Put } from "@nestjs/common";
import { AppService } from "./app.service";
import { LemonadeDocument } from "./common/models/lemonadeDocument";
import { IsValidQuoteOrPolicyID } from "./common/valadtion/customIDValidator";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("item/:id")
  public async getOneItem(
    @IsValidQuoteOrPolicyID("id") id: string
  ): Promise<any> {
    return await this.appService.getItem(id);
  }

  @Put("item/:id")
  public async updateItem(
    @IsValidQuoteOrPolicyID("id") id: string,
    @Body() updatedItem: LemonadeDocument
  ): Promise<HttpStatus> {
    return await this.appService.updateItem(id, updatedItem);
  }

  @Delete("item/:id")
  public async delete(
    @IsValidQuoteOrPolicyID("id") id: string
  ): Promise<HttpStatus> {
    return await this.appService.deleteItem(id);
  }
}
