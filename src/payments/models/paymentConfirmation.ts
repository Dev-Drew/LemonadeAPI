import {
  Contains,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from "class-validator";
import { IDPrefixes } from "src/common/constants/IDPrefixes.enum";
import { LemonadeDocument } from "../../common/models/lemonadeDocument";

export class PaymentConfirmation extends LemonadeDocument {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  @Contains(IDPrefixes.QUOTE_PREFIX)
  @Length(15, 15)
  quoteId: string;

  @IsBoolean()
  success: boolean;

  confirmationDate?: Date;

  sessionExpirationDate?: Date;
}
