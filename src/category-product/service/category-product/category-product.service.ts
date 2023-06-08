import { Injectable } from '@nestjs/common';

import { CreateCategoryDto } from 'src/category-product/dtos/create.category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConvertColor } from 'src/utils/convertColor';

@Injectable()
export class CategoryProductService {
  constructor(private prisma: PrismaService) {}
  async createCategory(dto: CreateCategoryDto) {
    // check mau

    return await this.prisma.categoryProduct.create({
      data: {
        quantity: Number(dto.quantity),
        colors: ConvertColor.convertColor(dto.color),
      },
    });
  }
  async updateCategoryProduct(categoryId: number, productId: number) {
    return await this.prisma.categoryProduct.update({
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
}
