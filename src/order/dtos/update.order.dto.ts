export class UpdateOrderDto {
  orderStatus: string;
  paied: boolean;
  ordered: boolean;
  productIds: number[];
  numberOf: number[];
  totalPrice: number[];
}
