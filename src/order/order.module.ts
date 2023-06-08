import { Module } from '@nestjs/common';
import { OrderController } from './controller/order/order.controller';
import { OrderService } from './service/order/order.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
