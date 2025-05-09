import { patchState, signalStore, withComputed, withMethods, withState} from "@ngrx/signals"
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Product } from "../../../../car-markt-be/src/generated/prisma"
import { computed } from "@angular/core";

const CART_LOCALSTORAGE_KEY = 'car_markt_cart';

type cartItem = Product & {
    quantity: number;
}

type CartState = {
    items: cartItem[]
}

const initialState: CartState = {
    items: [],
}

export const CartStore = signalStore(
    {
        providedIn: 'root',
    },
    withState(() => {
        if ('localStorage' in globalThis) {
            return {
                ...initialState,
                items: JSON.parse(localStorage.getItem(CART_LOCALSTORAGE_KEY) ?? '[]') as cartItem[],
            }
        }
        return initialState;
    }),
    withComputed((store) => ({
        totalItems: computed(() =>
            store.items().reduce((acc, item) => {
                return acc + item.quantity;
            }, 0)
        ),
        totalAmount: computed(() =>
            store.items().reduce((acc, item) => {
                return acc + item.quantity * item.price;
            }, 0)
        )
    })),
    withMethods((store) => ({
        addToCart(product: Product, quantity = 1) {
            const currentItems = store.items();
            const existingItem = currentItems.find(cartItem => cartItem.id === product.id );

            if (existingItem) {
                const updatedItems = store.items().map((cartItem) => {
                    if (cartItem.id === product.id) {
                        return {
                            ...cartItem,
                            quantity: cartItem.quantity + quantity
                        }
                    }
                    return cartItem;
                });
                patchState(store, {
                    items: updatedItems,
                })
            } else {
                patchState(store, {
                    items: [ ...store.items(), {
                        ...product,
                        quantity
                    }]
                })
            }

            localStorage.setItem(CART_LOCALSTORAGE_KEY, JSON.stringify(store.items()));
        },
        updateQuantity(productId: string, quantity: number) {
            const updatedItems = store
                .items()
                .map((item) => (item.id === productId ? { ...item, quantity } : item));
            patchState(store, {
                items: updatedItems,
            });
            localStorage.setItem(CART_LOCALSTORAGE_KEY, JSON.stringify(updatedItems));
        },
        removeFromCart(productId: string) {
            const updatedItems = store
            .items()
            .filter((item) => item.id !== productId);
            patchState(store, {
                items: updatedItems,
            });
            localStorage.setItem(CART_LOCALSTORAGE_KEY, JSON.stringify(updatedItems));
        },
        clearCart() {
            patchState(store, {
                items: [],
            });
            localStorage.removeItem(CART_LOCALSTORAGE_KEY);
        }
    }))
)