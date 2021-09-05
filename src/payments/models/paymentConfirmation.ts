import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { LemonadeDocument } from "../../common/models/lemonadeDocument";

export class PaymentConfirmation extends LemonadeDocument {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  quoteId: string;

  @IsBoolean()
  success: boolean;

  confirmationDate?: Date;

  sessionExpirationDate?: Date;
}
