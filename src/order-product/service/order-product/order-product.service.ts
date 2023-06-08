import { Injectable } from '@nestjs/common';
import { OrderProductDto } from 'src/order-product/dtos/order-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderProductService {
  constructor(private prisma: PrismaService) {}
  async createOrderProduct(dto: OrderProductDto) {
    return await this.prisma.orderOnProducts.create({
      data: {
        productId: Number(dto.productId),
        orderId: Number(dto.orderId),
        numberOf: Number(dto.numberOf),
        totalPrice: Number(dto.totalPrice),
      },
    });
  }
  async updatePrderProduct(orderProductId: number, dto: OrderProductDto) {
    try {
      return this.prisma.orderOnProducts.update({
        where: {
          id: orderProductId,
        },
        data: {
          numberOf: dto.numberOf ? Number(dto.numberOf) : undefined,
          orderId: dto.orderId ? Number(dto.orderId) : undefined,
          totalPrice: dto.totalPrice ? Number(dto.totalPrice) : undefined,
          productId: dto.productId ? Number(dto.productId) : undefined,
        },
      });
    } catch (error) {}
  }
  async deleteOrderProduct(orderProductId: number) {
    try {
      await this.prisma.orderOnProducts.delete({
        where: {
          id: orderProductId,
        },
      });
    } catch (error) {}
  }
}
