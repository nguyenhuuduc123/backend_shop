import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { CreateCategoryDto } from 'src/category-product/dtos/create.category.dto';
import { EditCategoryDto } from 'src/category-product/dtos/edit.category.dto';
import { QueryCategoryDto } from 'src/category-product/dtos/query.category.dto';
import { UpdateCategoryDto } from 'src/category-product/dtos/update.category.dto';
import { CategoryProductService } from 'src/category-product/service/category-product/category-product.service';
import { Public } from 'src/common/decorators';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('category-product')
export class CategoryProductController {
  constructor(private categoryService: CategoryProductService) {}
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post('')
  async createCategory(@Body() createCategory: CreateCategoryDto) {
    return await this.categoryService.createCategory(createCategory);
  }
  @Public()
  @Put(':id')
  async updateCategory(
    @Body() updateCategory: UpdateCategoryDto,
    @Param('id') id: string,
  ) {
    const data = await this.categoryService.updateCategoryProduct(
      Number(id),
      Number(updateCategory.productId),
    );
    return {
      data,
    };
  }
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  @Put('edit/:id')
  async editCategory(@Body() edit: EditCategoryDto, @Param('id') id: string) {
    const data = await this.categoryService.updateCategory(Number(id), edit);
    return {
      data,
    };
  }
  @Get('filter')
  async getallProductByCategory(@Query() query: QueryCategoryDto) {
    const data = await this.categoryService.getallProductByCate(query);
    return {
      data,
    };
  }
}
