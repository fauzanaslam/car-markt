import { Injectable } from '@nestjs/common';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { OrdersService } from '../orders/orders.service';
import {stripe} from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY;

if (!stripeSecret) {
  throw new Error('Missing Stripe secret key');
}

const stripe = new stripe(stripeSecret);

@Injectable()
export class CheckoutService {
  constructor(private ordersService: OrdersService) {}

  async create(createCheckoutDto: CreateCheckoutDto) {
    const order = await this.ordersService.create({
      items: createCheckoutDto.items,
      totalAmount: createCheckoutDto.totalAmount,
    });
  }

  const session = await stripe.Checkout.sessions.create({
    line_items: createCheckoutDto.items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/checkout/success?orderID=${order.id}`,
    cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
    metadata: {
      orderId: order.id,
    },
  });

  return {
    url: session.url,
    sessionId: session.id,
    orderId: order.id,
  }
}
