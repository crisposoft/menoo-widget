import { defineStore } from "pinia";
import type { Cart, CartItem, MenuItem, OptionSelection } from "../types";

const STORAGE_KEY = "menoo-order";

function loadFromStorage() {
  if (typeof window === "undefined" || !window.localStorage) {
    return null;
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    return null;
  }
}

function saveToStorage(state: any) {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }
  try {
    const data = {
      type: state.type,
      restaurant: state.restaurant,
      cart: state.cart,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {}
}

export const useOrderStore = defineStore("order", {
  state: () => {
    const stored = loadFromStorage();
    if (stored) {
      return {
        type: (stored.type as "delivery" | "pickup") || "delivery",
        restaurant: (stored.restaurant as string) || "",
        cart: (stored.cart as Cart) || {
          items: [],
          totalPrice: 0,
          totalCount: 0,
        },
      };
    }
    return {
      type: "delivery" as "delivery" | "pickup",
      restaurant: "" as string,
      cart: {
        items: [],
        totalPrice: 0,
        totalCount: 0,
      } as Cart,
    };
  },

  getters: {
    getCart: (state) => state.cart,
    hasItems: (state) => state.cart.items.length > 0,
    itemCount: (state) => state.cart.totalCount,
  },

  actions: {
    initCart(restaurantId: string) {
      // Only clear cart if switching to a different restaurant
      if (this.restaurant && this.restaurant !== restaurantId) {
        this.clearCart();
        this.restaurant = restaurantId;
      } else if (!this.restaurant) {
        // First time initialization - set restaurant ID
        this.restaurant = restaurantId;
      }
      // If restaurant matches existing, do nothing - keep the cart as is
    },

    addOrder(
      item: MenuItem,
      options: OptionSelection[] = [],
      note: string = "",
      quantity: number = 1
    ) {
      const existingIndex = this.cart.items.findIndex((cartItem) =>
        this.isSameCartItem(cartItem, item, options, note)
      );

      const itemPrice = this.calculateItemPrice(item, options);

      if (existingIndex >= 0) {
        // Update existing item quantity
        this.cart.items[existingIndex].quantity += quantity;
        this.cart.items[existingIndex].price =
          itemPrice * this.cart.items[existingIndex].quantity;
      } else {
        // Add new item
        const cartItem: CartItem = {
          item,
          quantity,
          options,
          note,
          price: itemPrice * quantity,
        };
        this.cart.items.push(cartItem);
      }

      this.recalculateCart();
      saveToStorage(this.$state);
    },

    removeOrder(index: number) {
      if (index >= 0 && index < this.cart.items.length) {
        this.cart.items.splice(index, 1);
        this.recalculateCart();
        saveToStorage(this.$state);
      }
    },

    updateCartItemQuantity(index: number, quantity: number) {
      if (index >= 0 && index < this.cart.items.length) {
        if (quantity <= 0) {
          this.cart.items.splice(index, 1);
        } else {
          const item = this.cart.items[index];
          const basePrice = item.price / item.quantity;
          item.quantity = quantity;
          item.price = basePrice * quantity;
        }
        this.recalculateCart();
        saveToStorage(this.$state);
      }
    },

    clearCart() {
      this.cart = {
        items: [],
        totalPrice: 0,
        totalCount: 0,
      };
      localStorage.removeItem(STORAGE_KEY);
    },

    // Helper methods
    calculateItemPrice(item: MenuItem, options?: OptionSelection[]): number {
      let price = item.price;

      if (options && item.options) {
        options.forEach((selection) => {
          const option = item.options?.find((o) => o._id === selection.option);
          if (option) {
            selection.choices.forEach((choiceId) => {
              const choice = option.values.find((c) => c._id === choiceId);
              if (choice) {
                price += choice.price;
              }
            });
          }
        });
      }

      return price;
    },

    isSameCartItem(
      cartItem: CartItem,
      item: MenuItem,
      options?: OptionSelection[],
      note?: string
    ): boolean {
      if (cartItem.item._id !== item._id) return false;
      if (cartItem.note !== note) return false;
      return this.optionsEqual(cartItem.options, options);
    },

    optionsEqual(
      options1?: OptionSelection[],
      options2?: OptionSelection[]
    ): boolean {
      if (!options1 && !options2) return true;
      if (!options1 || !options2) return false;
      if (options1.length !== options2.length) return false;

      const sorted1 = this.sortOptions(options1);
      const sorted2 = this.sortOptions(options2);

      return JSON.stringify(sorted1) === JSON.stringify(sorted2);
    },

    sortOptions(options: OptionSelection[]): OptionSelection[] {
      return options
        .map((opt) => ({
          ...opt,
          choices: [...opt.choices].sort(),
        }))
        .sort((a, b) => a.option.localeCompare(b.option));
    },

    recalculateCart() {
      this.cart.totalPrice = this.cart.items.reduce(
        (sum, item) => sum + item.price,
        0
      );
      this.cart.totalCount = this.cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
    },
  },
});
