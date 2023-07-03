export class CreateProductDto {
  productName: string;
  description: string;
  price: number;
  quantitySold: number;
  popularProduct: string[];
  discount: number;
  status: boolean;
}
