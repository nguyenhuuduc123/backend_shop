import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderProductDetailServiceService {
  constructor(private prisma: PrismaService) {}
  async deleteProductDetail(orderProductDetailId: number) {
    try {
      await this.prisma.orderOnProducts.delete({
        where: {
          id: orderProductDetailId,
        },
      });
      return {
        message: 'delete success',
      };
    } catch (error) {}
  }
}
