import { Cart } from './cart.model';

import { Body, Controller, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}
  @Post()
  checkout(@Body() body: { cart: Cart }) {
    try {
      return this.stripeService.checkOut(body.cart);
    } catch (error) {
      return error;
    }
  }
}
