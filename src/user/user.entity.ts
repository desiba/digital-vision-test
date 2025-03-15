import { Field, HideField, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class User { 
    @Field(() => Int)
    id: number;

    @Field()
    email: string;

    @Field({ nullable: true })
    biometricKey?: string;

    @Field({ nullable: true })
    @HideField()
    biometricImage?: string;
}