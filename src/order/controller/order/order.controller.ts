import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';

import { GetCurrentUserIdByAT } from 'src/common/decorators/get-userid-at.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateOrderDto } from 'src/order/dtos';
import { UpdateOrderDto } from 'src/order/dtos/update.order.dto';
import { OrderService } from 'src/order/service/order/order.service';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  @Post()
  async createOrder(
    @Body() dto: CreateOrderDto,

    @GetCurrentUserIdByAT('sub') userid: string,
  ) {
    return this.orderService.createOrder(Number(userid), dto);
  }
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  @Get('all')
  async getAllOrder() {
    return this.orderService.getAllOrder();
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Put(':id')
  async updateOrder(
    @Body() updateOrderDto: UpdateOrderDto,
    @Param('id') id: string,
  ) {
    return await this.orderService.updateOrder(Number(id), updateOrderDto);
  }
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async deleteOrder(@Param('id') id: string) {
    return await this.orderService.removeOrder(Number(id));
  }
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Put('flat/:id')
  async updateFlatProduct(@Param('id') id: string) {
    return await this.orderService.updateFlatOrder(Number(id));
  }
}
