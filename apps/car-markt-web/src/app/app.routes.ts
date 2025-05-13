import { Route } from '@angular/router';
import { authGuard } from './auth/auth.guard.js';

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
    canActivate: [authGuard],
  },
  {
    path: 'products',
    loadComponent: async () => {
      const mod = await import('./products/products.component.js');
      return mod.ProductsComponent;
    },
    canActivate: [authGuard],
  },
  {
    path: 'cart',
    loadComponent: async () => {
      const mod = await import('./cart/cart.component.js');
      return mod.CartComponent;
    },
    canActivate: [authGuard],
  },
  {
    path: 'checkout',
    loadComponent: async () => {
      const mod = await import('./checkout/checkout.component.js');
      return mod.CheckoutComponent;
    },
    canActivate: [authGuard],
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
    path: 'auth/login',
    loadComponent: () =>
      import('./auth/login/login.component.js').then((c) => c.LoginComponent),
  },
  {
    path: 'auth/signup',
    loadComponent: () =>
      import('./auth/signup/signup.component.js').then(
        (c) => c.SignupComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
