import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Policy } from "aws-sdk/clients/efs";
import { HelperService } from "./common/helper.service";
import { LemonadeDocument } from "./common/models/lemonadeDocument";
import { DyanmoService } from "./dyanmo/dyanmo.service";
import { Quote } from "./quotes/models/quote";

@Injectable()
export class AppService {
  constructor(
    private readonly dyanmoService: DyanmoService,
    private readonly helperService: HelperService
  ) {}

  public async getItem(id: string): Promise<any> {
    console.log("Request recieved for item with ID:  " + id);
    const item: Quote | Policy = await this.dyanmoService.getItem(id);
    console.log(
      "Returning quote with id: " + id + "quote: " + JSON.stringify(item)
    );

    if (item) {
      return item;
    } else {
      throw new HttpException(
        "No item found with ID: " + id,
        HttpStatus.NOT_FOUND
      );
    }
  }

  public async updateItem(id, updatedItem: LemonadeDocument) {
    if (
      this.helperService.isValidQuoteOrPolicy(id) &&
      this.helperService.isValidQuoteOrPolicy(updatedItem.id)
    ) {
      if (id === updatedItem.id) {
        console.log("Request recieved for item with ID:  " + id);
        const response: HttpStatus = await this.dyanmoService.updateItem(
          updatedItem
        );
        console.log("Quote has been updated: " + JSON.stringify(response));
        return response;
      } else {
        throw new HttpException(
          `ID supplied ${id} does not match with id on item being updated ${updatedItem.id}`,
          HttpStatus.BAD_REQUEST
        );
      }
    }
  }

  public async deleteItem(id) {
    if (id) {
      console.log("Request recieved to delete item with ID: " + id);
      const response: HttpStatus = await this.dyanmoService.deleteItem(id);
      return response;
    } else {
      console.log("Recieved invalid request to delete quote with ID: " + id);
    }
  }
}
