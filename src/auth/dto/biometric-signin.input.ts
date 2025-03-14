import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class BiometricSignInInput {

  @IsNotEmpty()
  @IsString()
  @Field()
  biometricKey: string;
}