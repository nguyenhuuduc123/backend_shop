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
import { CreateCartDto } from 'src/order/dtos/create.cart.dto';
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
    const data = await this.orderService.createOrder(Number(userid), dto);
    return {
      data,
    };
  }
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  @Get('all')
  async getAllOrder() {
    const data = await this.orderService.getAllOrder();
    return {
      data,
    };
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Put(':id')
  async updateOrder(
    @Body() updateOrderDto: UpdateOrderDto,
    @Param('id') id: string,
  ) {
    const data = await this.orderService.updateOrder(
      Number(id),
      updateOrderDto,
    );
    return {
      data,
    };
  }
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async deleteOrder(@Param('id') id: string) {
    const data = await this.orderService.removeOrder(Number(id));
    return {
      messsage: 'thanh cong',
      data: data,
    };
  }
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Put('flat/:id')
  async updateFlatProduct(@Param('id') id: string) {
    const data = await this.orderService.updateFlatOrder(Number(id));
    return {
      data,
    };
  }
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  @Post('cart')
  async createCart(
    @Body() dto: CreateCartDto,

    @GetCurrentUserIdByAT('sub') userid: string,
  ) {
    const data = await this.orderService.createCart(Number(userid), dto);
    return {
      data,
    };
  }

  @Get('cart')
  async getCartByUserId(@GetCurrentUserIdByAT('sub') userid: string) {
    const data = await this.orderService.getCartByUserid(Number(userid));
    return {
      data,
    };
  }
}
