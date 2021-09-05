/* eslint-disable @typescript-eslint/no-var-requires */
import { GetItemOutput } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { HttpStatus } from "@nestjs/common";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { AWSError } from "aws-sdk/lib/error";
import { LemonadeDocument } from "src/models/lemonadeDocument";
import { Quote } from "src/models/quote";
import { TableNames } from "./TableNames.enum";

const AWS = require("aws-sdk");

export class DyanmoService {
  constructor(private client: DynamoDBDocumentClient) {}

  public async postItem(itemToBeSaved: LemonadeDocument): Promise<any> {
    const docClient = new AWS.DynamoDB.DocumentClient();

    const params = this.createParams(itemToBeSaved.id);
    console.log("Adding a new item... : " + JSON.stringify(params));
    return new Promise((resolve, reject) => {
      docClient.put(params, function (err) {
        if (err) {
          console.error(
            "Unable to add item. Error JSON:",
            JSON.stringify(err, null, 2),
            reject(err)
          );
        } else {
          resolve(itemToBeSaved);
          console.log("Added item:", JSON.stringify(itemToBeSaved, null, 2));
        }
      });
    }).then((data) => {
      return data;
    });
  }

  public async getItem(id: string): Promise<any> {
    const docClient: DocumentClient = new AWS.DynamoDB.DocumentClient();
    console.log("Querying table for quote with id " + id);
    const params = this.createParams(id);
    console.log("PARAMS: " + JSON.stringify(params));
    return new Promise((resolve, reject) => {
      docClient.get(params, (error: AWSError, data: GetItemOutput) => {
        if (error) {
          console.log("ERROR: " + JSON.stringify(error));
          reject(error);
        } else {
          resolve(data.Item);
        }
      });
    }).then((data) => {
      return data;
    });
  }

  public async getAllItems(): Promise<any> {
    const docClient: DocumentClient = new AWS.DynamoDB.DocumentClient();
    const params = {
      TableName: TableNames.QUOTE_TABLE,
    };
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

  public async updateItem(quote: Quote, status?: any): Promise<any> {
    const docClient: DocumentClient = new AWS.DynamoDB.DocumentClient();
    quote.lastUpdateTime = new Date();

    if (status) {
      quote.quoteDetails.status = status;
    }
    const params = this.createParams(quote.id, quote);
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
    const params = this.createParams(id);

    console.log("Trying to delete quote with id " + id);
    return new Promise((resolve, reject) => {
      docClient.delete(params, (error: AWSError, data) => {
        if (error) {
          console.log("ERROR: " + JSON.stringify(error));
          reject(error);
        } else {
          console.log("DATA: " + JSON.stringify(data));
          resolve(HttpStatus.OK);
        }
      });
    }).then((data) => {
      return data;
    });
  }

  private createParams(id: string, item?: LemonadeDocument): any {
    console.log("entering create params");
    const tableName = this.determineTableName(id);
    const params = {
      TableName: tableName,
      Item: {
        id: id,
        data: item,
      },
      Key: {
        id: id,
      },
    };
    console.log("EXITING PARAMS ");
    return params;
  }

  private determineTableName(id: string): string {
    let tableName = TableNames.QUOTE_TABLE;
    if (id.slice(0, 2) === "LP") {
      tableName = TableNames.POLICY_TABLE;
    }
    return tableName;
  }
}
