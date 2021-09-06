import { Injectable } from "@nestjs/common";
import { IDPrefixes } from "../constants/IDPrefixes.enum";

@Injectable()
export class IDValidationService {
  public isValidQuoteOrPolicy(id: string): boolean {
    return this.isValidQuoteId(id) || this.isValidPolicyId(id);
  }

  public isValidMortageId(id: string): boolean {
    const correctPrefix: boolean = this.isMortageId(id);
    const correctLength = this.isCorrectLenth(id, 15);
    return correctPrefix && correctLength;
  }

  public isValidQuoteId(id: string): boolean {
    const correctPrefix: boolean = this.isQuote(id);
    const correctLength = this.isCorrectLenth(id, 15);
    return correctPrefix && correctLength;
  }

  public isValidPolicyId(id: string): boolean {
    const correctPrefix = this.isPolicy(id);
    const correctLength = this.isCorrectLenth(id, 15);
    return correctPrefix && correctLength;
  }

  public isPolicy(id: string): boolean {
    return id.slice(0, 2) === IDPrefixes.POLICY_PREFIX ? true : false;
  }

  public isQuote(id: string): boolean {
    return id.slice(0, 2) === IDPrefixes.QUOTE_PREFIX ? true : false;
  }

  public isMortageId(id: string): boolean {
    return id.slice(0, 3) === IDPrefixes.MORTAGE_PREFIX ? true : false;
  }

  private isCorrectLenth(id: string, correctLength: number) {
    return id.length === correctLength;
  }
}
