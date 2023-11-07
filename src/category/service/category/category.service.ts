import { CategoryDto } from './../../dto/category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { createSuccessResponse } from 'src/config/config.response';
import { INTERNAL_MESSAGE, INTERNAL_STATUS } from 'src/constant';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}

  async createCategory(dto: CategoryDto) {
      // check category is existing
      const check_category = await this.prismaService.category.findUnique({
        where : {
          categoryName: dto.categoryName
        }
      })
      if(check_category) throw new BadRequestException('category already exists')
      const createCategory = await this.prismaService.category.create({
        data: {
          categoryName : dto.categoryName
        },
      });
      return createSuccessResponse(INTERNAL_STATUS.CREATED,INTERNAL_MESSAGE.CREATED,createCategory);
    }

  async getAllCategory() {
    const all_category = await this.prismaService.category.findMany({});
    return createSuccessResponse(INTERNAL_STATUS.CREATED, INTERNAL_MESSAGE.CREATED, all_category);
  }

  async deleteCategory(categoryName : string){
    await this.prismaService.category.delete({
      where : {
        categoryName : categoryName
      }
    })
    return createSuccessResponse(INTERNAL_STATUS.OK, INTERNAL_MESSAGE.OK);
  }
  }

 
