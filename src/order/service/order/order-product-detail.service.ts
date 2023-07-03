import { CreateCartDto } from 'src/order/dto/create.cart.dto';
import { QueryProductDetail } from './../../dto/query-product-detail';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConvertColor } from 'src/utils/convertColor';
import { ConvertSize } from 'src/utils/convertSize';

@Injectable()
export class OrderProductDetailService {
  constructor(private prisma: PrismaService) {}
  async deleteProductDetail(
    productId: number,
    productDetail: QueryProductDetail,
  ) {
    try {
      const findProduct = await this.prisma.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          categoryProduct: {
            include: {
              categoryProductDetail: true,
            },
          },
        },
      });
      findProduct.categoryProduct.forEach(async (value) => {
        if (
          value.categoryProductDetail.colors ==
            ConvertColor.convertColor(productDetail.color) &&
          value.categoryProductDetail.size ==
            ConvertSize.convertSize(productDetail.size)
        ) {
          await this.prisma.orderOnProducts.deleteMany({
            where: {
              size: ConvertSize.convertSize(productDetail.size),
              color: ConvertColor.convertColor(productDetail.color),
            },
          });
        }
      });
      return {
        message: 'delete success',
      };
    } catch (error) {}
  }
  async deleteAllProductDetail() {
    try {
      await this.prisma.order.deleteMany({
        where: {
          flat: true,
        },
      });
      return {
        message: 'delete success',
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
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
          AND: [
            {
              flat: true,
            },
            {
              userId: userId,
            },
          ],
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
          AND: [
            {
              flat: true,
            },
            {
              userId: userId,
            },
          ],
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
      return orderAll[0];
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
