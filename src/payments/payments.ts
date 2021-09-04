import { Injectable } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import { Quote } from 'src/models/quote';
import { QuoteInput } from 'src/models/quoteInput';
import Stripe from 'stripe';
// eslint-disable-next-line @typescript-eslint/no-var-requires
//const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');
const YOUR_DOMAIN = 'http://localhost:3000';

@Injectable()
export class PaymentService {
	public constructor(@InjectStripe() private readonly stripe: Stripe) {}

	public async processPayment(quote: Quote): Promise<any> {
		console.log('Processing Payment for ID: ' + quote.id);
		const quoteInput: QuoteInput = quote.quoteDetails.clientDetails;
		const session = this.stripe.checkout.sessions.create({
			line_items: [
				{
					// TODO: replace this with the `price` of the product you want to sell
					price_data: {
						currency: 'usd',
						unit_amount: quote.premium,
						product_data: {
							name: 'Lemonade Homeowners Insurance',
							description: `Policy for ${quoteInput.firstName} ${quoteInput.lastName} covering a home of ${quoteInput.propertySize} built in ${quoteInput.propertyYearBuilt}`,
						},
					},
					quantity: 1,
				},
			],
			payment_method_types: ['card'],
			mode: 'payment',
			success_url: `${YOUR_DOMAIN}`,
			cancel_url: `${YOUR_DOMAIN}`,
		});

		return session;
	}
}
