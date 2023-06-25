export class UpdateOrderDto {
  orderStatus: string;
  paid: boolean;
  ordered: boolean;
  productIds: number[];
  numberOf: number[];
}
