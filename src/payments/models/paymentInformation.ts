import { Contains, IsOptional, IsString, Length } from "class-validator";
import { IDPrefixes } from "src/common/constants/IDPrefixes.enum";
import { LemonadeDocument } from "src/common/models/lemonadeDocument";

export class PaymentInformation extends LemonadeDocument {
  @IsOptional()
  @IsString()
  @Contains(IDPrefixes.MORTGAGE_PREFIX)
  @Length(15, 15)
  mortgageId?: string;
}
