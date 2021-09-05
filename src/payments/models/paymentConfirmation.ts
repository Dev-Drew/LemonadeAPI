import { LemonadeDocument } from "../../models/lemonadeDocument";

export interface PaymentConfirmation extends LemonadeDocument {
  amount: number;
  quoteId: string;
  confirmationDate: Date;
  sessionExpirationDate?: Date;
}
