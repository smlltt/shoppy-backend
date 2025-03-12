import { IsString, IsPositive, IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateProductRequest {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price: number;
}
