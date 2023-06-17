import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from '../../dtos';
import { UpdateOrderDto } from 'src/order/dtos/update.order.dto';
import { ProductType } from 'src/order/dtos/product.type';

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
    if (!userExsit && userExsit.isBlocked == true)
      throw new BadRequestException('id khong khong hop hoac user da bi chan');

    const kq: ProductType[] = [];
    for (let i = 0; i < createDto.productIds.length; i++) {
      const queryProduct = await this.prisma.product.findUnique({
        where: {
          id: createDto.productIds[i],
        },
      });
      if (!queryProduct)
        throw new BadRequestException('productid khong ton tai');
      if (queryProduct.quantitySold < createDto.numberOf[i])
        throw new BadRequestException(
          'so luong order phaienho hon so luong trong kho',
        );
      const totalprice =
        queryProduct.price *
        createDto.numberOf[i] *
        queryProduct.discount *
        0.01;
      kq.push({
        productId: createDto.productIds[i],
        numberOf: createDto.numberOf[i],
        totalPrice: totalprice,
      });
    }
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
    if (orderByUser) {
      // cap nhap lai so san pham
      for (let i = 0; i < createDto.productIds.length; i++) {
        const queryProduct = await this.prisma.product.findUnique({
          where: {
            id: createDto.productIds[i],
          },
        });
        if (!queryProduct)
          throw new BadRequestException('productid khong ton tai');
        // cap nhap lai so luong
        await this.prisma.product.update({
          where: {
            id: createDto.productIds[i],
          },
          data: {
            quantitySold: queryProduct.quantitySold - createDto.numberOf[i],
          },
        });
      }
    }
    return orderByUser;
  }

  async removeOrder(orderId: number) {
    // find order
    const orderDelete = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });
    // flat = false == da thanh toan, xoa luon lich su
    // flat = true == chua thanh toan, trong 24h huy
    if (orderDelete.flat == false) {
      await this.prisma.order.delete({
        where: {
          id: orderId,
        },
      });
    } else {
      const orderProducts = await this.prisma.orderOnProducts.findMany({
        where: {
          orderId: orderDelete.id,
        },
      });
      for (let i = 0; i < orderProducts.length; i++) {
        this.updateProductAffterDeteleOrder(
          orderProducts[i].numberOf,
          orderProducts[i].productId,
        );

        const orderDelete1 = await this.prisma.order.delete({
          where: {
            id: orderId,
          },
        });
        if (!orderDelete1)
          throw new BadRequestException('khong tin thay san pham xoa');
      }
    }
  }

  async getAllOrder() {
    return await this.prisma.order.findMany({
      include: {
        products: true,
        user: true,
      },
    });
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
      },
    });
    // get all order-product
    const orderProducts = await this.prisma.orderOnProducts.findMany({
      where: {
        orderId: orderId,
      },
    });
    for (let index = 0; index < orderProducts.length; index++) {
      // find product
      const quey_product = await this.prisma.product.findUnique({
        where: {
          id: orderProducts[index].productId,
        },
      });
      // tinh total price
      const totalPrice =
        quey_product.discount *
        0.01 *
        quey_product.price *
        updateOrderDto.numberOf[index];
      await this.prisma.orderOnProducts.update({
        where: {
          id: orderProducts[index].id,
        },
        data: {
          numberOf: updateOrderDto.numberOf[index],
          totalPrice: totalPrice,
        },
      });
    }
    return u;
  }
  // add product into order
  async updateProductAffterDeteleOrder(quantity: number, productId: number) {
    // find product
    try {
      const findProduct = await this.prisma.product.findUnique({
        where: {
          id: productId,
        },
      });
      // if khong ton tai , tra ve loi,
      if (!findProduct) {
        throw new BadRequestException('khong tin thay san pham');
      }
      await this.prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          quantitySold: findProduct.quantitySold + quantity,
        },
      });
    } catch (error) {}
  }
  async getAllOrderByUserId(userId: number) {
    try {
      const allOrder = await this.prisma.order.findMany({
        where: {
          userId: userId,
        },
      });
      return allOrder;
    } catch (error) {
      throw new BadRequestException('some thing went wrong');
    }
  }
  // change flat theo 2 truong hop
  // sau 24 khi thanh thanh toan
  async updateFlatOrder(orderId: number) {
    await this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        flat: false,
      },
    });
  }
}
// flat == true , flat = false
// get all order by userid : history order
