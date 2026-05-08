import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsInt, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateProductInput {
  @IsString()
  @Field()
  name: string;

  @IsNumber()
  @Field(() => Float)
  price: number;

  @IsInt()
  @Field(() => Int)
  categoryId: number;
}