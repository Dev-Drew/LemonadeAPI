/* eslint-disable @typescript-eslint/no-var-requires */
import { GetItemOutput } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { HttpStatus } from '@nestjs/common';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { AWSError } from 'aws-sdk/lib/error';
import { Quote } from 'src/models/quote';

const AWS = require('aws-sdk');

export class DyanmoService {
	constructor(private client: DynamoDBDocumentClient) {}

	public async postItem(quote: Quote): Promise<any> {
		const docClient = new AWS.DynamoDB.DocumentClient();

		const params = {
			TableName: 'ClientQuotesTEST',
			Item: {
				id: quote.id,
				quote: quote,
			},
		};

		console.log('Adding a new item... : ' + JSON.stringify(params));
		return new Promise((resolve, reject) => {
			docClient.put(params, function (err) {
				if (err) {
					console.error(
						'Unable to add item. Error JSON:',
						JSON.stringify(err, null, 2),
						reject(err),
					);
				} else {
					resolve(quote);
					console.log('Added item:', JSON.stringify(quote, null, 2));
				}
			});
		}).then((data) => {
			return data;
		});
	}

	public async getItem(id: string): Promise<any> {
		console.log('Querying table for quote with id ' + id);
		const params = {
			TableName: 'ClientQuotesTEST',
			Key: {
				id: id,
			},
		};
		return this.makeDBGetCall(params);
	}

	private async makeDBGetCall(params): Promise<any> {
		const docClient: DocumentClient = new AWS.DynamoDB.DocumentClient();

		return new Promise((resolve, reject) => {
			docClient.get(params, (error: AWSError, data: GetItemOutput) => {
				if (error) {
					console.log('ERROR: ' + JSON.stringify(error));
					reject(error);
				} else {
					if (data.Item?.quote) {
						resolve(data.Item?.quote);
					}
				}
			});
		}).then((data) => {
			return data;
		});
	}

	public async getAllItems(): Promise<any> {
		const params = {
			TableName: 'ClientQuotesTEST',
		};
		return this.makeDBScanCall(params);
	}

	private makeDBScanCall(params): Promise<any> {
		const docClient: DocumentClient = new AWS.DynamoDB.DocumentClient();

		return new Promise((resolve, reject) => {
			docClient.scan(params, (error: AWSError, data) => {
				if (error) {
					reject(error);
				} else {
					resolve(data);
				}
			});
		}).then((data) => {
			return data;
		});
	}

	public async updateItem(quote: Quote): Promise<any> {
		quote.lastUpdateTime = Date.now().toString();
		const params = {
			TableName: 'ClientQuotesTEST',
			Item: {
				id: quote.id,
				quote: quote,
			},
		};
		return this.makeDBPutCall(params);
	}

	private makeDBPutCall(params): Promise<any> {
		const docClient: DocumentClient = new AWS.DynamoDB.DocumentClient();

		return new Promise((resolve, reject) => {
			docClient.put(params, (error: AWSError) => {
				if (error) {
					reject(error);
				} else {
					resolve(HttpStatus.OK);
				}
			});
		}).then((data) => {
			return data;
		});
	}

	public async deleteItem(id: string): Promise<any> {
		const docClient: DocumentClient = new AWS.DynamoDB.DocumentClient();
		const params = {
			TableName: 'ClientQuotesTEST',
			Key: {
				id: id,
			},
		};

		console.log('Trying to delete quote with id ' + id);
		return new Promise((resolve, reject) => {
			docClient.delete(params, (error: AWSError, data) => {
				if (error) {
					console.log('ERROR: ' + JSON.stringify(error));
					reject(error);
				} else {
					console.log('DATA: ' + JSON.stringify(data));
					resolve(HttpStatus.OK);
				}
			});
		}).then((data) => {
			return data;
		});
	}
}
