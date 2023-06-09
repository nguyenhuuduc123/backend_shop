import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from '../../dtos';
import { ProductType } from 'src/order/dtos/product.type';
import { UpdateOrderDto } from 'src/order/dtos/update.order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}
  async createOrder(userId: number, createDto: CreateOrderDto) {
    // check user exits chua
    const userExsit = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!userExsit)
      throw new BadRequestException(
        'id khong khong hop hoac user khong ton tai',
      );
    // bo san pham vo gio hanf;
    const kq: ProductType[] = createDto.productIds.map((value, index) => {
      return {
        productId: createDto.productIds[index],
        numberOf: createDto.numberOf[index],
        totalPrice: createDto.totalPrice[index],
      };
    });
    const orderByUser = await this.prisma.order.create({
      data: {
        orderStatus: createDto.orderStatus,
        paied: createDto.paied,
        ordered: createDto.ordered,
        userId: userId,
        products: {
          createMany: {
            data: kq,
          },
        },
      },
    });
    return orderByUser;
  }
  // update order

  async removeOrder(orderId: number) {
    // check co order nao co id do khong
    return await this.prisma.order.delete({
      where: {
        id: orderId,
      },
    });
  }
  async getAllOrder() {
    return await this.prisma.order.findMany({
      include: {
        products: true,
        user: true,
      },
    });
  }
  async deleteOrder(orderId: number) {
    await this.prisma.order.delete({
      where: {
        id: orderId,
      },
    });
    try {
    } catch (error) {
      throw new BadRequestException('id khong ton tai hoac khong hop le');
    }
  }
  // update
  async updateOrder(orderId: number, updateOrderDto: UpdateOrderDto) {
    // get all san pham

    const u = await this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        orderStatus: updateOrderDto.orderStatus,
        paied: updateOrderDto.paied,
        ordered: updateOrderDto.ordered,
        products: {
          updateMany: {
            where: {
              productId: 1,
            },
            data: {
              numberOf: 100,
              totalPrice: 100,
            },
          },
        },
      },
    });
    return u;
  }
  // add product into order
}
