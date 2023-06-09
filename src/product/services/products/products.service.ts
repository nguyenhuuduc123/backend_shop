import { QueryTypeDto } from './../../dtos/queryType.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from '../../dtos/create.product.dto';
import { UpdateProductDto } from 'src/product/dtos/update.product.dto';
import { convertProductDto } from 'src/utils/convertProductDto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  // create product
  async createProduct(createproductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        ...createproductDto,
      },
    });
  }
  // get all product
  async getAllProduct(dto: QueryTypeDto) {
    try {
      return this.prisma.product.findMany({
        skip: dto.skip ? Number(dto.page) * Number(dto.skip - 1) : 0,
        take: dto.take ? Number(dto.take) : 100,
        include: {
          evaluate: true,
          orders: true,
          categorys: {
            include: {
              CategoryProduct: true,
            },
          },
          productImages: true,
        },
      });
    } catch (error) {
      throw new BadRequestException('some thing went wrong');
    }
  }

  async getProductById(productId: number) {
    try {
      return await this.prisma.product.findUnique({
        where: {
          id: Number(productId),
        },
        include: {
          orders: true,
          categorys: {
            include: {
              CategoryProduct: true,
            },
          },
        },
      });
    } catch (error) {
      throw new BadRequestException('some thing went wrong');
    }
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
}