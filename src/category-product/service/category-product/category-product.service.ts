import { ConvertColor } from './../../../utils/convertColor';
import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateCategoryDto } from 'src/category-product/dtos/create.category.dto';
import { EditCategoryDto } from 'src/category-product/dtos/edit.category.dto';
import { QueryCategoryDto } from 'src/category-product/dtos/query.category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConvertSize } from 'src/utils/convertSize';

@Injectable()
export class CategoryProductService {
  constructor(private prisma: PrismaService) {}
  async createCategory(dto: CreateCategoryDto) {
    //
    if (ConvertColor.convertColor(dto.color) == null) {
      throw new BadRequestException('nhap mau chua phu hop');
    }
    if (ConvertSize.convertSize(dto.size) == null) {
      throw new BadRequestException('nhap size chua phu hop');
    }
    return await this.prisma.categoryProductDetail.create({
      data: {
        quantity: Number(dto.quantity),
        size: ConvertSize.convertSize(dto.size),
        colors: ConvertColor.convertColor(dto.color),
        remainAmount: 50,
      },
    });
  }
  async updateCategoryProduct(categoryId: number, productId: number) {
    return await this.prisma.categoryProductDetail.update({
      where: {
        id: categoryId,
      },
      data: {
        products: {
          create: {
            product: {
              connect: {
                id: productId,
              },
            },
          },
        },
      },
      include: {
        products: true,
      },
    });
  }
  // update category
  async updateCategory(categoryId: number, edit: EditCategoryDto) {
    try {
      await this.prisma.categoryProductDetail.update({
        where: {
          id: categoryId,
        },
        data: {
          size:
            edit.size != null ? ConvertSize.convertSize(edit.size) : undefined,
          colors:
            edit.color != null
              ? ConvertColor.convertColor(edit.color)
              : undefined,
          quantity: edit.quantity != null ? edit.quantity : undefined,
        },
      });
      return {
        message: 'update thanh cong',
      };
    } catch (error) {
      throw new BadRequestException('update khong thanh cong');
    }
  }
  async getallProductByCate(query: QueryCategoryDto) {
    if (ConvertColor.convertColor(query.color) == null) {
      throw new BadRequestException('nhap mau chua phu hop');
    }
    if (ConvertSize.convertSize(query.size) == null) {
      throw new BadRequestException('nhap size chua phu hop');
    }
    try {
      const query1 = await this.prisma.categoryProductDetail.findMany({
        where: {
          size:
            ConvertSize.convertSize(query.size) != null
              ? ConvertSize.convertSize(query.size)
              : undefined,
          colors:
            ConvertColor.convertColor(query.color) != null
              ? ConvertColor.convertColor(query.color)
              : undefined,
        },
        include: {
          products: {
            include: {
              product: true,
            },
          },
        },
      });
      return query1;
    } catch (error) {}
  }
}
