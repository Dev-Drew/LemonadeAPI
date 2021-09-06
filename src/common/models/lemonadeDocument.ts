import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class LemonadeDocument {
  @IsNotEmpty()
  @IsString()
  @MinLength(15)
  id: string;

  @IsOptional()
  @IsDateString()
  createdTime?: string;

  @IsOptional()
  @IsDateString()
  lastUpdateTime?: string;
}
