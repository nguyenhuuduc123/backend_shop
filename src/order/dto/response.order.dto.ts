import { Order } from '@prisma/client';

export type ResponseOrder = {
  order: Order;
  productDetail: [
    {
      name: string;
      quantity: string;
      color: string;
      size: string;
    },
  ];
};
