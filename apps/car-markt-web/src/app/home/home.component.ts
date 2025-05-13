import { Component, inject } from '@angular/core';
import { ProductCardComponent } from '../components/product-card/product-card.component';
import { RouterLink } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Product } from '../../../../car-markt-be/prisma/app/generated/prisma/client';
import { ProductStore } from '../stores/product.store';
import { CartStore } from '../stores/cart.store';

@Component({
  selector: 'app-home',
  imports: [ProductCardComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  productStore = inject(ProductStore);
  cartStore = inject(CartStore);

  constructor() {
    this.productStore.getFeaturedProducts(true);
  }

  onAddToCart(product: Product) {
    this.cartStore.addToCart(product);
  }
}
