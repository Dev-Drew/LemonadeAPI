import { QuoteDetails } from './quoteDetails';

export interface Quote {
	premium: number;
	id: string;
	lastUpdateTime?: string;
	quoteDetails: QuoteDetails;
}
