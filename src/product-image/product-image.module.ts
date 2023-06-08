import { Module } from '@nestjs/common';
import { ProductImageController } from './controller/product-image/product-image.controller';
import { ProductImageService } from './service/product-image/product-image.service';

@Module({
  controllers: [ProductImageController],
  providers: [ProductImageService],
})
export class ProductImageModule {}
