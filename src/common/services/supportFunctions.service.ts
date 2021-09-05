import { Injectable } from "@nestjs/common";

@Injectable()
export class SupportFunctionsService {
  public randomFixedInteger(length): number {
    return Math.floor(
      Math.pow(10, length - 1) +
        Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
    );
  }
}
