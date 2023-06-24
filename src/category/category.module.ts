import { Module } from '@nestjs/common';
import { CategoryController } from './controller/category/category.controller';
import { CategoryService } from './service/category/category.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
