import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderStore } from '../../stores/order.store';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-checkout-success',
  imports: [CommonModule],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.css',
})
export class CheckoutSuccessComponent implements OnInit {
  orderStore = inject(OrderStore);
  route = inject(ActivatedRoute);

  ngOnInit() {
    const orderId = this.route.snapshot.queryParamMap.get('orderId');
    if(!orderId) {
      this.orderStore.setError('No order ID found');
      return;
    }
    this.orderStore.getOrder(orderId).subscribe();
  }
}
