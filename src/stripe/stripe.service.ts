import { Injectable } from '@nestjs/common';
import stripe from 'stripe';
import { Cart } from './cart.model';

import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class StripeService {
  private stripe;
  constructor(private prisma: PrismaService) {
    this.stripe = new stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });
  }
  async checkOut(cart: Cart) {
    // get all order
    const allOrderDetail = await this.prisma.orderOnProducts.findMany({
      where: {
        orderId: cart.id,
      },
    });
    // get username by order
    await this.prisma.user.findUnique({
      where: {
        id: 1,
      },
    });
    const totalprice = allOrderDetail.reduce((acc, item) => {
      return acc + item.totalPrice;
    }, 0);
    return this.stripe.paymentIntents.create({
      currency: 'vnd',
      amount: totalprice * 100,
      payment_method_types: ['card'],
    });
  }
}
