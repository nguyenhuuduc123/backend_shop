import { IsNotEmpty } from "class-validator";

export class CreateProductDto {
  productName: string;
  description: string;
  price: number;
  quantitySold: number;
  popularProduct: string[];
  discount: number;
  status: boolean;
  @IsNotEmpty()
  categoryId: number
}
