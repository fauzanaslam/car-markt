import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Product } from '../../../../../car-markt-be/src/generated/prisma/client';
@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  product = input.required<Product>();
  addToCart = output<Product>();

  onAddToCart(product: Product) {
    this.addToCart.emit(product)
  }
}
