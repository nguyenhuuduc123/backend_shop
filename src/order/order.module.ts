import { Module } from '@nestjs/common';
import { OrderController } from './controller/order/order.controller';
import { OrderService } from './service/order/order.service';
import { OrderProductDetailServiceService } from './service/order/order-product-detail-service.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderProductDetailServiceService],
})
export class OrderModule {}
