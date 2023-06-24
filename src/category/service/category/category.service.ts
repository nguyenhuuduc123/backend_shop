import { CategoryDto } from './../../dto/category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}

  async createCategory(dto: CategoryDto) {
    try {
      const createCategory = await this.prismaService.category.create({
        data: {
          ...dto,
        },
      });
      return createCategory;
    } catch (error) {}
  }
  async editCategory(cateId: number, dto: CategoryDto) {
    try {
      await this.prismaService.category.update({
        where: {
          id: cateId,
        },
        data: {
          categoryName: dto.categoryName != null ? dto.categoryName : undefined,
          isClothing: dto.isClothing != null ? dto.isClothing : undefined,
        },
      });
    } catch (error) {}
  }
}
