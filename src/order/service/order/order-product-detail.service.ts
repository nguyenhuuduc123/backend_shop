import { QueryProductDetail } from './../../dto/query-product-detail';
import { Injectable } from '@nestjs/common';
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
          await this.prisma.orderOnProducts.delete({
            where: {
              id: value.categoryProductDetail.id,
            },
          });
        }
      });
      return {
        message: 'delete success',
      };
    } catch (error) {}
  }
  // delete all product in cart
  async deleteAllProductDetail(productId: number) {
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
        {
          await this.prisma.orderOnProducts.delete({
            where: {
              id: value.categoryProductDetail.id,
            },
          });
        }
      });
      return {
        message: 'delete success',
      };
    } catch (error) {}
  }
}
