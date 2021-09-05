import { LemonadeDocument } from "../../models/lemonadeDocument";

export interface PaymentConfirmation extends LemonadeDocument {
  amount: number;
  sessionCreatedDate: Date;
  sessionExpirationDate: Date;
  quoteId: string;
}
