import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';

import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateProductDto } from 'src/product/dtos/create.product.dto';
import { QueryTypeDto } from 'src/product/dtos/queryType.dto';
import { UpdateProductDto } from 'src/product/dtos/update.product.dto';
import { ProductService } from 'src/product/services/products/products.service';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductService) {}

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @HttpCode(201)
  @Post('create')
  async createProduct(@Body() dto: CreateProductDto) {
    return await this.productService.createProduct(dto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get('all')
  async getAllproduct(@Query() dto: QueryTypeDto) {
    console.log(dto.orderby);
    return this.productService.getAllProduct(dto);
  }
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productService.getProductById(Number(id));
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Put(':id')
  async updateProduct(
    @Body() updateProductDto: UpdateProductDto,
    @Param('id') id: string,
  ) {
    return this.productService.updateProduct(Number(id), updateProductDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteProduct(@Param('id') id: string) {
    return await this.productService.deleteProduct(Number(id));
  }
}
