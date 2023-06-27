import { IsNotEmpty } from 'class-validator';

export class QueryProductDetail {
  @IsNotEmpty()
  size: string;
  @IsNotEmpty()
  color: string;
}
