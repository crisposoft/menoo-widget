import { defineStore } from "pinia";
import {
  appliesToOrderType,
  type DiscountOrderType,
  type ItemDiscountPricing,
  type PublicDiscount,
} from "../utils/discounts";

interface DiscountsState {
  available: boolean;
  data: PublicDiscount[];
}

export const useDiscountsStore = defineStore("discounts", {
  state: (): DiscountsState => ({
    available: false,
    data: [],
  }),

  getters: {
    orderTypesById(state): Map<string, DiscountOrderType[]> {
      const map = new Map<string, DiscountOrderType[]>();
      for (const discount of state.data) {
        map.set(discount._id, discount.conditions?.orderTypes ?? []);
      }
      return map;
    },

    // Returns the embedded item pricing only when its discount applies to the
    // current order type (mirrors the webapp). Pricing without a matching
    // restriction is always visible.
    visibleItemPricing(): (
      pricing: ItemDiscountPricing | null | undefined,
      orderType: DiscountOrderType,
    ) => ItemDiscountPricing | null {
      const orderTypesById = this.orderTypesById;
      return (pricing, orderType) => {
        if (!pricing) {
          return null;
        }
        const restriction = orderTypesById.get(pricing.discount);
        if (restriction === undefined) {
          return pricing;
        }
        return appliesToOrderType(restriction, orderType) ? pricing : null;
      };
    },
  },

  actions: {
    setDiscounts(discounts: PublicDiscount[]) {
      this.data = discounts ?? [];
      this.available = true;
    },
    resetDiscounts() {
      this.data = [];
      this.available = false;
    },
  },
});
