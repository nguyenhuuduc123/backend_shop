import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { CreateCategoryDto } from 'src/category-product/dtos/create.category.dto';
import { UpdateCategoryDto } from 'src/category-product/dtos/update.category.dto';
import { CategoryProductService } from 'src/category-product/service/category-product/category-product.service';
import { Public } from 'src/common/decorators';

@Controller('category-product')
export class CategoryProductController {
  constructor(private categoryService: CategoryProductService) {}
  @Public()
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
    return this.categoryService.updateCategoryProduct(
      Number(id),
      Number(updateCategory.productId),
    );
  }
}
