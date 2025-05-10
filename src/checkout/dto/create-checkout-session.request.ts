import { Type } from 'class-transformer';
import { IsNumber, IsNotEmpty } from 'class-validator';
export class CreateCheckoutSessionRequest {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  id: number;
}
