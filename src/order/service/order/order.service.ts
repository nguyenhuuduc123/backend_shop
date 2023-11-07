import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from '../../dto';
import { UpdateOrderDto } from 'src/order/dto/update.order.dto';
import { ProductType } from 'src/order/dto/product.type';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) { }
  async createOrder(userId: number, createDto: CreateOrderDto) {
    // check user exits
    try {
      const userExist = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!userExist && userExist.isBlocked == true)
        throw new BadRequestException('id not found or user blocked');

      const kq: ProductType[] = [];
      for (let i = 0; i < createDto.productIds.length; i++) {
        const queryProduct = await this.prisma.product.findUnique({
          where: {
            id: createDto.productIds[i],
          },
        });
        if (!queryProduct) throw new BadRequestException('productId not found');
        if (queryProduct.quantitySold < createDto.numberOf[i])
          throw new BadRequestException(
            'quantity must be less than product number ',
          );
        const totalPrice =
          queryProduct.price *
          createDto.numberOf[i] *
          queryProduct.discount *
          0.01;
        await this.prisma.product.update({
          where: {
            id: createDto.productIds[i],
          },
          data: {
            saleNumber: queryProduct.saleNumber + createDto.numberOf[i],
          },
        });
        kq.push({
          productId: createDto.productIds[i],
          numberOf: createDto.numberOf[i],
          totalPrice: totalPrice,
          size: createDto.size[i],
          color: createDto.color[i],
        });
      }
      const orderByUser = await this.prisma.order.create({
        data: {
          orderStatus: createDto.orderStatus,
          paid: createDto.paid,
          ordered: createDto.ordered,
          userId: userId,
          flat: false,
          products: {
            createMany: {
              data: kq,
            },
          },
        },
      });
      if (orderByUser) {
        for (let i = 0; i < createDto.productIds.length; i++) {
          const queryProduct = await this.prisma.product.findUnique({
            where: {
              id: createDto.productIds[i],
            },
          });
          if (!queryProduct)
            throw new BadRequestException('productId not found');

          const findProduct = await this.prisma.order.findMany({
            where: {
              flat: true,
            },
            include: {
              products: {
                include: {
                  product: true,
                },
              },
            },
          });
          findProduct[0].products.forEach(async (value) => {
            if (
              createDto.color.includes(value.color) &&
              createDto.size.includes(value.size)
            ) {
              await this.prisma.orderOnProducts.delete({
                where: {
                  id: value.id,
                },
              });
            }
          });

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
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async removeOrder(orderId: number) {
    const orderDelete = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

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
        this.updateProductAfterDeleteOrder(
          orderProducts[i].numberOf,
          orderProducts[i].productId,
        );

        const orderDelete1 = await this.prisma.order.delete({
          where: {
            id: orderId,
          },
        });
        if (!orderDelete1)
          throw new BadRequestException('not found product deleted');
      }
    }
  }

  async getAllOrder() {
    try {
      return await this.prisma.order.findMany({
        include: {
          products: {
            select: {
              color: true,
              size: true,
              numberOf: true,
              product: {
                select: {
                  productName: true,
                  price: true,
                  productImages: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  // update
  async updateOrder(orderId: number, updateOrderDto: UpdateOrderDto) {
    const u = await this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        orderStatus: updateOrderDto.orderStatus,
        paid: updateOrderDto.paid,
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

  async updateProductAfterDeleteOrder(quantity: number, productId: number) {
    try {
      const findProduct = await this.prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

      if (!findProduct) {
        throw new BadRequestException('not found product info');
      }
      await this.prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          quantitySold: findProduct.quantitySold + quantity,
          saleNumber: findProduct.saleNumber - quantity,
        },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
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

  async getOrderByUserId(userId: number) {
    try {
      const orderAll = await this.prisma.order.findMany({
        where: {
          flat: false,
          userId: userId,
        },
        include: {
          products: {
            select: {
              productId: true,
              color: true,
              size: true,
              numberOf: true,
              product: {
                select: {
                  productName: true,
                  price: true,
                  productImages: true,
                },
              },
            },
          },
        },
      });
      return orderAll;
    } catch (error) { }
  }
}
