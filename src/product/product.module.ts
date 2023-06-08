import { Module } from '@nestjs/common';
import { ProductsController } from './controllers/products/products.controller';
import { ProductService } from './services/products/products.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductService],
})
export class ProductModule {}
