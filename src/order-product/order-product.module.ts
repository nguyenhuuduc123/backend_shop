import { Module } from '@nestjs/common';
import { OrderProductController } from './controller/order-product/order-product.controller';
import { OrderProductService } from './service/order-product/order-product.service';

@Module({
  controllers: [OrderProductController],
  providers: [OrderProductService],
})
export class OrderProductModule {}
