import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { IDPrefixes } from "../constants/quotePrefixes.enum";

export const IsValidQuoteOrPolicyID = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    const id = req.params.id;
    const isValid = isValidQuoteOrPolicy(id);

    if (isValid) {
      return id;
    } else {
      throw new HttpException(
        `There is an issue with ID ${id}, this is not a valid quote or policy ID. The ID must be 15 characters long and start with LQ or LP`,
        HttpStatus.BAD_REQUEST
      );
    }
  }
);

function isValidQuoteOrPolicy(id: string): boolean {
  return isValidQuoteId(id) || isValidPolicyId(id);
}
function isValidQuoteId(id: string): boolean {
  const correctPrefix: boolean = isQuote(id);
  const correctLength = isCorrectLenth(id, 15);
  return correctPrefix && correctLength;
}

function isValidPolicyId(id: string): boolean {
  const correctPrefix = isPolicy(id);
  const correctLength = isCorrectLenth(id, 15);
  return correctPrefix && correctLength;
}

function isPolicy(id: string): boolean {
  return id.slice(0, 2) === IDPrefixes.POLICY_PREFIX ? true : false;
}

function isQuote(id: string): boolean {
  return id.slice(0, 2) === IDPrefixes.QUOTE_PREFIX ? true : false;
}

function isCorrectLenth(id: string, correctLength: number) {
  return id.length === correctLength;
}
