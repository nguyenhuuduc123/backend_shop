import { Module } from '@nestjs/common';
import { CategoryProductController } from './controller/category-product/category-product.controller';
import { CategoryProductService } from './service/category-product/category-product.service';

@Module({
  controllers: [CategoryProductController],
  providers: [CategoryProductService],
})
export class CategoryProductModule {}
