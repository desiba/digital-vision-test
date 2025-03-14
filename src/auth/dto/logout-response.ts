import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "../../user/user.entity";

@ObjectType()
export class LogoutResponse {
    @Field()
    loggedOut: boolean;
}