export class CreateProductDto {
  productName: string;
  description: string;
  price: number;
  popularProduct: string[];
  quantitySold: number;
  averageEvaluate: number;
  SumComment: number;
  sumEvaluate: number;
  discount: number;
  status: boolean;
}
