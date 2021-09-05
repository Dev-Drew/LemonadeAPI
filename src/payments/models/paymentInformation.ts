import { IsOptional, IsString } from "class-validator";
import { LemonadeDocument } from "src/common/models/lemonadeDocument";

export class PaymentInformation extends LemonadeDocument {
  @IsOptional()
  @IsString()
  mortageId?: string;
}
