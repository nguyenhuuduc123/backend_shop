import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Public } from 'src/common/decorators';

import { GetCurrentUserIdByAT } from 'src/common/decorators/get-userId-at.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateOrderDto } from 'src/order/dto';
import { CreateCartDto } from 'src/order/dto/create.cart.dto';
import { QueryProductDetail } from 'src/order/dto/query-product-detail';
import { UpdateOrderDto } from 'src/order/dto/update.order.dto';
import { OrderProductDetailService } from 'src/order/service/order/order-product-detail.service';
import { OrderService } from 'src/order/service/order/order.service';

@Controller('order')
export class OrderController {
  constructor(
    private orderService: OrderService,
    private orderProductService: OrderProductDetailService,
  ) {}
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  @Post()
  async createOrder(
    @Body() dto: CreateOrderDto,

    @GetCurrentUserIdByAT('sub') userId: string,
  ) {
    const data = await this.orderService.createOrder(Number(userId), dto);
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
      message: 'thanh cong',
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

    @GetCurrentUserIdByAT('sub') userId: string,
  ) {
    const data = await this.orderService.createCart(Number(userId), dto);
    return {
      data,
    };
  }

  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  @Get('cart')
  async getCartByUserId(@GetCurrentUserIdByAT('sub') userId: string) {
    const data = await this.orderService.getCartByUserId(Number(userId));
    return {
      data,
    };
  }

  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  @Get('user')
  async getOrderByUserId(@GetCurrentUserIdByAT('sub') userId: string) {
    const data = await this.orderService.getOrderByUserId(Number(userId));
    return {
      data,
    };
  }
  @Public()
  @Delete('deleteAllProductIntoCart/:productId')
  async deleteOrderProductDetail(
    @Param('productId') productId: string,
    @Query() query: QueryProductDetail,
  ) {
    return this.orderProductService.deleteProductDetail(
      Number(productId),
      query,
    );
  }
  @Public()
  @Delete('deleteAllProductIntoCart/:productId')
  async deleteAllOrderProductDetail(@Param('productId') productId: string) {
    return this.orderProductService.deleteAllProductDetail(Number(productId));
  }
}
