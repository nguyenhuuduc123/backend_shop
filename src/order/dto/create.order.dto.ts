export class CreateOrderDto {
  orderStatus: string;
  paid: boolean;
  ordered: boolean;
  productIds: number[];
  numberOf: number[];
  size: string[];
  color: string[];
}
