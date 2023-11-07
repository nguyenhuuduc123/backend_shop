import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { CategoryDto } from 'src/category/dto/category.dto';
import { CategoryService } from 'src/category/service/category/category.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) { }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post('create')
  async createCategory(@Body() dto: CategoryDto) {
    return await this.categoryService.createCategory(dto);
  }
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get('getAll')
  async getAllCategory() {
    return await this.categoryService.getAllCategory();
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get('delete/category')
  async deleteCategory(@Body() dto: CategoryDto) {
    return await this.categoryService.deleteCategory(dto.categoryName);
  }
}