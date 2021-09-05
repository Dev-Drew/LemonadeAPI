import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { TableNames } from "src/dyanmo/constants/TableNames.enum";
import { DyanmoService } from "src/dyanmo/dyanmo.service";
import { PaymentConfirmation } from "src/payments/models/paymentConfirmation";
import { Policy } from "./models/policy";
import { PolicyService } from "./policy.service";

@Controller()
export class PolicyController {
  constructor(
    private readonly policyService: PolicyService,
    private readonly dyanmoService: DyanmoService
  ) {}

  @Post("/policy")
  @UsePipes(new ValidationPipe({ transform: true }))
  public async Policy(
    @Body() paymentConfirmation: PaymentConfirmation
  ): Promise<Policy> {
    console.log("Creating policy..");
    const policy: Policy = await this.policyService.createPolicy(
      paymentConfirmation
    );
    console.log("Returning Policy: " + JSON.stringify(policy));
    return policy;
  }

  @Get("/policies")
  public async getAllPolicies(): Promise<any> {
    console.log("Retrieve all clients from table");
    const data = await this.dyanmoService.getAllItems(TableNames.POLICY_TABLE);
    console.log("Returning Items from table " + JSON.stringify(data));
    return data;
  }
}
