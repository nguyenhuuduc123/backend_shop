import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryDto } from 'src/category/dto/category.dto';
import { CategoryService } from 'src/category/service/category/category.service';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  @Post('create')
  async createCategory(@Body() dto: CategoryDto) {
    const data = await this.categoryService.createCategory(dto);
    return {
      data,
    };
  }
  @Put('update/:id')
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CategoryDto,
  ) {
    const data = await this.categoryService.editCategory(id, dto);
    return {
      data,
    };
  }
}
