import { Injectable } from '@nestjs/common';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { OrdersService } from '../orders/orders.service';
import midtransClient from 'midtrans-client';

const midtransServerKey = 'SB-Mid-server-QjkbVXUHZ2WkdUqGaeJgoALp';
const midtransClientKey = 'SB-Mid-client-ep61NmLiMhdEmi7M';

if (!midtransServerKey || !midtransClientKey) {
  throw new Error('Missing Midtrans configuration');
}

const snap = new midtransClient.Snap({
  serverKey: midtransServerKey,
  clientKey: midtransClientKey,
});

@Injectable()
export class CheckoutService {
  constructor(private ordersService: OrdersService) {}

  async create(createCheckoutDto: CreateCheckoutDto) {
    const order = await this.ordersService.create({
      items: createCheckoutDto.items,
      totalAmount: createCheckoutDto.totalAmount,
    });

    const session = await snap.createTransaction({
      transaction_details: {
        order_id: `ORDER-${order.id}`,
        gross_amount: Math.round(createCheckoutDto.totalAmount),
      },
      item_details: createCheckoutDto.items.map((item) => ({
        id: item.productId?.toString() || item.name,
        name: item.name,
        quantity: item.quantity,
        price: Math.round(item.price),
      })),
      custom_field1: order.id.toString(),
      callbacks: {
        finish: `http://82.112.240.66:4009/checkout/success?orderId=${order.id}`,
      },
    });

    return {
      url: session.redirect_url,
      sessionId: session.token,
      orderId: order.id,
    };
  }
}
