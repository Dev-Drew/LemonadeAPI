import { LemonadeDocument } from "./lemonadeDocument";

export interface PaymentConfirmation extends LemonadeDocument {
  amount: number;
  date: Date;
}
