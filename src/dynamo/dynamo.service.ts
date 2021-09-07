/* eslint-disable @typescript-eslint/no-var-requires */
import { GetItemOutput } from "@aws-sdk/client-dynamodb";
import { HttpStatus } from "@nestjs/common";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { AWSError } from "aws-sdk/lib/error";
import { LemonadeDocument } from "src/common/models/lemonadeDocument";
import { PolicyStatus } from "src/policies/constants/policyStatus.enum";
import { QuoteStatus } from "src/quotes/constants/quoteStatus.enum";
import { TableNames } from "./constants/TableNames.enum";

const AWS = require("aws-sdk");

export class DynamoService {
  public async postItem(itemToBeSaved: LemonadeDocument): Promise<any> {
    const docClient = new AWS.DynamoDB.DocumentClient();

    const params = this.createParams(itemToBeSaved.id, itemToBeSaved);
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
    });
  }

  public async getItem(id: string): Promise<any> {
    const docClient: DocumentClient = new AWS.DynamoDB.DocumentClient();
    console.log("Querying table for quote with id " + id);
    const params = this.createParams(id);
    return new Promise((resolve, reject) => {
      docClient.get(params, (error: AWSError, getItemOutput: GetItemOutput) => {
        if (error) {
          reject(error);
        } else {
          resolve(getItemOutput?.Item?.data);
        }
      });
    });
  }

  public async getAllItems(tableName: TableNames): Promise<any> {
    const docClient: DocumentClient = new AWS.DynamoDB.DocumentClient();
    const params = {
      TableName: tableName,
    };
    return new Promise((resolve, reject) => {
      docClient.scan(params, (error: AWSError, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data?.Items);
        }
      });
    });
  }

  public async updateItem(
    item: LemonadeDocument,
    status?: QuoteStatus | PolicyStatus
  ): Promise<any> {
    const docClient: DocumentClient = new AWS.DynamoDB.DocumentClient();

    item.lastUpdateTime = new Date().toDateString();

    item = this.updateStatus(item, status);
    const params = this.createParams(item.id, item);
    return new Promise((resolve, reject) => {
      docClient.put(params, (error: AWSError) => {
        if (error) {
          reject(error);
        } else {
          resolve(HttpStatus.OK);
        }
      });
    });
  }

  public async deleteItem(id: string): Promise<any> {
    const docClient: DocumentClient = new AWS.DynamoDB.DocumentClient();
    const params = this.createParams(id);

    return new Promise((resolve, reject) => {
      docClient.delete(params, (error: AWSError) => {
        if (error) {
          reject(error);
        } else {
          resolve(HttpStatus.OK);
        }
      });
    });
  }

  private createParams(id: string, item?: any): any {
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
    return params;
  }

  private determineTableName(id: string): string {
    let tableName = TableNames.QUOTE_TABLE;
    if (id.slice(0, 2) === "LP") {
      tableName = TableNames.POLICY_TABLE;
    }
    return tableName;
  }

  private updateStatus(
    item: any,
    status: QuoteStatus | PolicyStatus
  ): LemonadeDocument {
    if (status) {
      if (item.quoteDetails) {
        item.quoteDetails.status = status;
      } else if (item.effectiveDate) {
        item.policyStatus = status;
      }
    }
    return item;
  }
}
