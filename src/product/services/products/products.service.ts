import { QueryTypeDto } from '../../dto/queryType.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from '../../dto/create.product.dto';
import { UpdateProductDto } from 'src/product/dto/update.product.dto';
import { convertProductDto } from 'src/utils/convertProductDto';
import { createSuccessResponse } from 'src/config/config.response';
import { INTERNAL_MESSAGE, INTERNAL_STATUS } from 'src/constant';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) { }
  // create product
  async createProduct(createProductDto: CreateProductDto) {

    const product_create = await this.prisma.product.create({
      data: {
        ...createProductDto,
        categoryId: Number(createProductDto.categoryId)
      },
    });
    return createSuccessResponse(INTERNAL_STATUS.OK, INTERNAL_MESSAGE.OK, product_create)
  }

  async getAllProduct(dto: QueryTypeDto) {

    const page = dto.page == null ? 1 : dto.page;
    const product_query = this.prisma.product.findMany({
      skip: dto.skip ? Number(page - 1) * Number(dto.skip) : 0,
      take: dto.take ? Number(dto.take) : undefined,
      where: {
        productName: {
          contains: dto.productName,
        },
      },
      orderBy: {
        price: dto.orderby == 'true' ? 'asc' : 'desc',
      },
      include: {
        evaluate: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
        orders: true,
        categoryProduct: {
          include: {
            categoryProductDetail: true,
          },
        },
        productImages: true,
      },
    });
    return createSuccessResponse(INTERNAL_STATUS.OK, INTERNAL_MESSAGE.OK, product_query)
  }

  async getProductById(productId: number) {

    return await this.prisma.product.findUnique({
      where: {
        id: Number(productId),
      },
      include: {
        orders: true,
        productImages: true,
        evaluate: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
        categoryProduct: {
          include: {
            categoryProductDetail: true,
          },
        },
      },
    });

  }
  async updateProduct(productId: number, updateProductDto: UpdateProductDto) {
    try {
      return await this.prisma.product.update({
        where: {
          id: productId,
        },
        data: convertProductDto(updateProductDto),
      });
    } catch (error) {
      throw new BadRequestException('something went wrong');
    }
  }
  async deleteProduct(productId: number) {
    try {
      await this.prisma.product.delete({
        where: {
          id: productId,
        },
      });
    } catch (error) {
      throw new BadRequestException('something went wrong or id not found');
    }
  }
  async queryProduct(productName: string) {

    return await this.prisma.product.findMany({
      where: {
        productName: {
          contains: productName != null ? productName : undefined,
        },
      },
      include: {
        orders: true,
        productImages: true,
        evaluate: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
        categoryProduct: {
          include: {
            categoryProductDetail: true,
          },
        },
      },
    });

  }
}
