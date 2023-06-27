import { Module } from '@nestjs/common';
import { OrderController } from './controller/order/order.controller';
import { OrderService } from './service/order/order.service';
import { OrderProductDetailService } from './service/order/order-product-detail.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderProductDetailService],
})
export class OrderModule {}
