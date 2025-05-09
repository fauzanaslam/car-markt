import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: async () => {
      const mod = await import('./home/home.component.js');
      return mod.HomeComponent;
    }
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
];
