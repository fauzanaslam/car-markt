import { patchState, signalStore, withComputed, withMethods, withState} from "@ngrx/signals"
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Product } from "../../../../car-markt-be/src/generated/prisma"
import { computed } from "@angular/core";

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
    withState(() => initialState),
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
        },
        updateQuantity(productId: string, quantity: number) {
            const updatedItems = store
                .items()
                .map((item) => (item.id === productId ? { ...item, quantity } : item));
            patchState(store, {
                items: updatedItems,
            });
        },
        removeFromCart(productId: string) {
            const updatedItems = store
            .items()
            .filter((item) => item.id !== productId);
            patchState(store, {
                items: updatedItems,
            });
        },
        clearCart() {
            patchState(store, {
                items: [],
            });
        }
    }))
)