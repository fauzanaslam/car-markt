import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    loadComponent: async () => {
      const mod = await import('./home/home.component.js');
      return mod.HomeComponent;
    },
  },
  {
    path: 'products',
    loadComponent: async () => {
      const mod = await import('./products/products.component.js');
      return mod.ProductsComponent;
    },
  },
  {
    path: 'cart',
    loadComponent: async () => {
      const mod = await import('./cart/cart.component.js');
      return mod.CartComponent;
    },
  },
  {
    path: 'checkout',
    loadComponent: async () => {
      const mod = await import('./checkout/checkout.component.js');
      return mod.CheckoutComponent;
    },
  },
  {
    path: 'checkout/cancel',
    loadComponent: async () => {
      const mod = await import(
        './checkout/checkout-failure/checkout-failure.component.js'
      );
      return mod.CheckoutFailureComponent;
    },
  },
  {
    path: 'checkout/success',
    loadComponent: async () => {
      const mod = await import(
        './checkout/checkout-success/checkout-success.component.js'
      );
      return mod.CheckoutSuccessComponent;
    },
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
