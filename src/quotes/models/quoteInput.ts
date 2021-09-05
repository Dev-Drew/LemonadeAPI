import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class QuoteInput {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  birthDate: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  propertySize: string;

  @IsNotEmpty()
  @IsString()
  propertyYearBuilt: string;
}
