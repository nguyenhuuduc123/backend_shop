import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { Public } from 'src/common/decorators';
import { GetCurrentUserIdByAT } from 'src/common/decorators/get-userid-at.decorator';
import { CreateOrderDto } from 'src/order/dtos';
import { UpdateOrderDto } from 'src/order/dtos/update.order.dto';
import { OrderService } from 'src/order/service/order/order.service';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}
  @Post()
  async createOrder(
    @Body() dto: CreateOrderDto,

    @GetCurrentUserIdByAT('sub') userid: string,
  ) {
    return this.orderService.createOrder(Number(userid), dto);
  }
  @Public()
  @Get('all')
  async getAllOrder() {
    return this.orderService.getAllOrder();
  }
  @Put(':id')
  async updateProduct(
    @Body() updateOrderDto: UpdateOrderDto,
    @Param('id') id: string,
  ) {
    return await this.orderService.updateOrder(Number(id), updateOrderDto);
  }
}
