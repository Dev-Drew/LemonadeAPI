import { IsString } from "class-validator";
import { LemonadeDocument } from "src/common/models/lemonadeDocument";

export class PaymentInformation extends LemonadeDocument {
  @IsString()
  mortageId: string;
}
