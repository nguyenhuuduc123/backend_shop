import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from '../../dto';
import { UpdateOrderDto } from 'src/order/dto/update.order.dto';
import { ProductType } from 'src/order/dto/product.type';
import { CreateCartDto } from 'src/order/dto/create.cart.dto';
import { ConvertSize } from 'src/utils/convertSize';
import { ConvertColor } from 'src/utils/convertColor';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}
  async createOrder(userId: number, createDto: CreateOrderDto) {
    // check user exits
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
        throw new BadRequestException('quantity must be ');
      const totalPrice =
        queryProduct.price *
        createDto.numberOf[i] *
        queryProduct.discount *
        0.01;
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
        if (!queryProduct) throw new BadRequestException('productId not found');
        // delte from gio hang
        //
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
          //
          console.log(createDto.color.includes(value.color));
          console.log(createDto.color.includes(value.size));
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
  async updateProductAfterDeleteOrder(quantity: number, productId: number) {
    // find product
    try {
      const findProduct = await this.prisma.product.findUnique({
        where: {
          id: productId,
        },
      });
      // if khong ton tai , tra ve loi,
      if (!findProduct) {
        throw new BadRequestException('not found product info');
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
  // cart
  async createCart(userId: number, createDto: CreateCartDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) throw new BadRequestException('user not found');

      const cart1 = await this.prisma.order.findMany({
        where: {
          flat: true,
        },
      });
      if (cart1.length == 0) {
        const cart = await this.prisma.order.create({
          data: {
            orderStatus: createDto.orderStatus,
            paid: createDto.paid,
            ordered: createDto.ordered,
            userId: userId,
            flat: true,
          },
        });
        if (createDto.productId != null) {
          const kq = await this.getCategoryByProduct(createDto.productId);
          if (
            kq.colors.includes(ConvertColor.convertColor(createDto.color)) &&
            kq.sizes.includes(ConvertSize.convertSize(createDto.size))
          ) {
            console.log(kq);
            await this.prisma.order.update({
              where: {
                id: cart.id,
              },
              data: {
                products: {
                  create: {
                    numberOf: createDto.numberOf,
                    size: createDto.size,
                    color: createDto.color,
                    product: {
                      connect: {
                        id: createDto.productId,
                      },
                    },
                  },
                },
              },
            });
            return {
              message: 'create order success',
            };
          }
        }
      } else {
        const kq = await this.getCategoryByProduct(createDto.productId);
        if (
          kq.colors.includes(ConvertColor.convertColor(createDto.color)) &&
          kq.sizes.includes(ConvertSize.convertSize(createDto.size))
        ) {
          await this.prisma.order.update({
            where: {
              id: cart1[0].id,
            },
            data: {
              products: {
                create: {
                  numberOf: createDto.numberOf,
                  size: createDto.size,
                  color: createDto.color,
                  product: {
                    connect: {
                      id: createDto.productId,
                    },
                  },
                },
              },
            },
          });
          return {
            message: 'update success',
          };
        }
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async getCategoryByProduct(productId: number) {
    const productF = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        categoryProduct: {
          include: {
            categoryProductDetail: {
              select: {
                colors: true,
                size: true,
                quantity: true,
                remainAmount: true,
              },
            },
          },
        },
      },
    });
    return {
      colors: productF.categoryProduct.map(
        (value) => value.categoryProductDetail.colors,
      ),
      sizes: productF.categoryProduct.map(
        (value) => value.categoryProductDetail.size,
      ),
    };
  }
  async getCartByUserId(userId: number) {
    try {
      const orderAll = await this.prisma.order.findMany({
        where: {
          flat: true,
          userId: userId,
        },
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
                },
              },
            },
          },
        },
      });
      return orderAll;
    } catch (error) {}
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
              color: true,
              size: true,
              numberOf: true,
              product: {
                select: {
                  productName: true,
                  price: true,
                },
              },
            },
          },
        },
      });
      return orderAll;
    } catch (error) {}
  }
}
