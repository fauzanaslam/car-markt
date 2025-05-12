import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  Order,
  OrderItem,
  Product,
} from '../../../../car-markt-be/prisma/app/generated/prisma/client';
import { Apollo, gql } from 'apollo-angular';
import { inject } from '@angular/core';
import { tap } from 'rxjs';

const GET_ORDER = gql`
  query GetOrder($id: String!) {
    order(id: $id) {
      id
      totalAmount
      status
      items {
        id
        quantity
        price
        product {
          id
          name
          image
        }
      }
      createdAt
    }
  }
`;

export type OrderItemWithProduct = OrderItem & {
  product: Product;
};

export type OrderWithItems = Order & {
  items: OrderItemWithProduct[];
};

type OrderState = {
  orders: OrderWithItems[];
  orderDetail: OrderWithItems | null;
  error: string | null;
};

const initialState: OrderState = {
  orders: [],
  orderDetail: null,
  error: null,
};

export const OrderStore = signalStore(
  {
    providedIn: 'root',
  },
  withState(() => initialState),
  withMethods((store, apollo = inject(Apollo)) => ({
    getOrder(id: string) {
      patchState(store, { error: null });
      return apollo
        .query<{ order: OrderWithItems }>({
          query: GET_ORDER,
          variables: {
            id,
          },
        })
        .pipe(
          tap({
            next: ({ data }) => patchState(store, { orderDetail: data.order }),
            error: (error) => patchState(store, { error: error.message }),
          })
        );
    },
    setError(error: string) {
      patchState(store, {
        error,
      });
    },
  }))
);
