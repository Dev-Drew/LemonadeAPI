import { Injectable } from "@nestjs/common";
import { InjectStripe } from "nestjs-stripe";
import Stripe from "stripe";

@Injectable()
export class SessionService {
  public constructor(@InjectStripe() private readonly stripe: Stripe) {}

  public async retrieveStripeSession(sessionid: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionid);
    return session;
  }
}
