import { IsNotEmpty, IsString } from "class-validator";

export class LemonadeDocument {
  @IsNotEmpty()
  @IsString()
  id: string;

  createdTime?: Date;

  lastUpdateTime?: Date;
}
