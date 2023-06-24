import { Body, Controller, Post } from '@nestjs/common';
import { OrderProductDto } from 'src/order-product/dtos/order-product.dto';
import { OrderProductService } from 'src/order-product/service/order-product/order-product.service';

@Controller('order-product')
export class OrderProductController {
  constructor(private orderProductService: OrderProductService) {}
  @Post()
  async createOrderDto(@Body() dto: OrderProductDto) {
    const data = await this.orderProductService.createOrderProduct(dto);
    return {
      data,
    };
  }
}
