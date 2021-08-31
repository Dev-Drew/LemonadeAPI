let count = 0;

function createQuote(quoteData) {
	count++;
	return {
		id: 'LQ' + count,
		status: 'ready',
		premium: 500,
		address: quoteData.address,
		firstName: quoteData.firstName,
		lastName: quoteData.lastName,
		email: quoteData.email,
		birthdate: quoteData.birthdate,
		propertySize: quoteData.propertySize,
		propertyYearBuilt: quoteData.propertyYearBuilt,
	};
}

function createPolicy(policyData) {
	count++;
	return {
		id: 'LP' + count,
		status: 'active',
		premium: 500,
		address: policyData.address,
		firstName: policyData.firstName,
		lastName: policyData.lastName,
		email: policyData.email,
		birthdate: policyData.birthdate,
		propertySize: policyData.propertySize,
		propertyYearBuilt: policyData.propertyYearBuilt,
	};
}

function payWithMortgage(paymentData) {
	return {
		mortgageId: paymentData.mortgageId,
		quoteId: paymentData.quoteId,
		success: true,
	};
}

module.exports = { createQuote, createPolicy, payWithMortgage };
