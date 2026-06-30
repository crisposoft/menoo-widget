import { computed, toValue, type MaybeRefOrGetter } from "vue";
import {
  useDiscountsStore,
  useMenusStore,
  useMetadataStore,
  useOrderStore,
  useRestaurantStore,
} from "../stores";
import type { MenuItem, OptionSelection } from "../types";
import { transformCartForApi, type ApiOrderItem } from "../utils/cart";
import {
  hasDiscountedPrice,
  itemPricingReward,
  itemUnitSaving,
  rewardLabel,
  roundTwoDecimals,
  type ItemDiscountPricing,
} from "../utils/discounts";

export function useCart() {
  const orderStore = useOrderStore();

  const cart = computed(() => orderStore.getCart);

  const deliveryFee = computed(() => {
    const restaurantStore = useRestaurantStore();
    const restaurant = restaurantStore.data;
    const mode = orderStore.type;

    if (!restaurant || mode !== "delivery") return 0;

    const threshold = restaurant.delivery.feeThreshold || 0;
    const fee = restaurant.delivery.fee || 0;

    return cart.value.totalPrice >= threshold ? 0 : fee;
  });

  const totalWithDelivery = computed(
    () => cart.value.totalPrice + deliveryFee.value
  );

  const getCartForApi = (): ApiOrderItem[] => {
    return transformCartForApi(cart.value.items);
  };

  const addToCart = (
    item: MenuItem,
    options: OptionSelection[] = [],
    note: string = "",
    quantity: number = 1
  ) => {
    orderStore.addOrder(item, options, note, quantity);
  };

  const updateCartItemQuantity = (index: number, newQuantity: number) => {
    orderStore.updateCartItemQuantity(index, newQuantity);
  };

  const removeFromCart = (index: number) => {
    orderStore.removeOrder(index);
  };

  const clearCart = () => {
    orderStore.clearCart();
  };

  return {
    cart,
    deliveryFee,
    totalWithDelivery,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    getCartForApi,
  };
}

export function useRestaurant() {
  const restaurantStore = useRestaurantStore();
  const menusStore = useMenusStore();

  const restaurant = computed(() => restaurantStore.data);
  const menus = computed(() => menusStore.data);

  return {
    restaurant,
    menus,
  };
}

export function useFormatPrice() {
  const metadataStore = useMetadataStore();

  const formatPrice = (price: number): string => {
    const currency = metadataStore.currency;
    return `${price.toFixed(2)} ${currency}`;
  };

  return {
    formatPrice,
  };
}

export function useItemDiscount(item: MaybeRefOrGetter<MenuItem>) {
  const orderStore = useOrderStore();
  const discountsStore = useDiscountsStore();
  const metadataStore = useMetadataStore();

  const pricing = computed<ItemDiscountPricing | null>(() =>
    discountsStore.visibleItemPricing(toValue(item).discount, orderStore.type)
  );

  const discountedUnitPrice = computed<number | null>(() =>
    hasDiscountedPrice(pricing.value) ? pricing.value.discountedPrice : null
  );

  const badgeLabel = computed<string>(() =>
    pricing.value
      ? rewardLabel(itemPricingReward(pricing.value), metadataStore.currency)
      : ""
  );

  return { pricing, discountedUnitPrice, badgeLabel };
}

export interface CartLineDiscount {
  hasDiscount: boolean;
  lineSaving: number;
  originalLineTotal: number;
  discountedLineTotal: number;
}

export function useCartDiscounts() {
  const orderStore = useOrderStore();
  const discountsStore = useDiscountsStore();

  const lineDiscounts = computed<CartLineDiscount[]>(() => {
    const raw = orderStore.cart.items.map((cartItem) => {
      const pricing = discountsStore.visibleItemPricing(
        cartItem.item.discount,
        orderStore.type
      );
      return {
        originalLineTotal: cartItem.price,
        discountId: pricing?.discount ?? null,
        rawSaving: roundTwoDecimals(itemUnitSaving(pricing) * cartItem.quantity),
      };
    });

    const groups = new Map<string, number[]>();
    raw.forEach((line, index) => {
      if (line.discountId && line.rawSaving > 0) {
        const existing = groups.get(line.discountId);
        if (existing) {
          existing.push(index);
        } else {
          groups.set(line.discountId, [index]);
        }
      }
    });

    const saving = new Array<number>(raw.length).fill(0);

    for (const [discountId, indices] of groups) {
      const rawTotal = roundTwoDecimals(
        indices.reduce((sum, i) => sum + raw[i].rawSaving, 0)
      );
      const discount = discountsStore.data.find((d) => d._id === discountId);
      const cap =
        discount?.reward.kind === "percentage"
          ? discount.reward.maxAmount
          : undefined;
      const cappedTotal =
        cap != null ? roundTwoDecimals(Math.min(rawTotal, cap)) : rawTotal;

      if (cappedTotal >= rawTotal) {
        for (const i of indices) {
          saving[i] = raw[i].rawSaving;
        }
        continue;
      }

      // A percentage maxAmount caps the discount's TOTAL saving across all
      // units, so split the capped budget across its lines in whole cents by
      // the largest-remainder method (proportional to each line's raw saving,
      // ties broken by cart order) to mirror the checkout engine's allocation.
      const totalCents = Math.round(cappedTotal * 100);
      const shares = indices.map((i) => ({
        index: i,
        cents: Math.round(raw[i].rawSaving * 100),
        allocated: 0,
        remainder: 0,
      }));
      const rawTotalCents = shares.reduce((sum, s) => sum + s.cents, 0);

      let distributed = 0;
      for (const share of shares) {
        const exact =
          rawTotalCents > 0 ? (share.cents / rawTotalCents) * totalCents : 0;
        share.allocated = Math.floor(exact);
        share.remainder = exact - share.allocated;
        distributed += share.allocated;
      }

      let leftover = totalCents - distributed;
      const byRemainder = [...shares].sort(
        (a, b) => b.remainder - a.remainder || a.index - b.index
      );
      for (let k = 0; k < byRemainder.length && leftover > 0; k++) {
        byRemainder[k].allocated += 1;
        leftover -= 1;
      }

      for (const share of shares) {
        saving[share.index] = roundTwoDecimals(share.allocated / 100);
      }
    }

    return raw.map((line, index) => ({
      hasDiscount: saving[index] > 0,
      lineSaving: saving[index],
      originalLineTotal: line.originalLineTotal,
      discountedLineTotal: roundTwoDecimals(
        line.originalLineTotal - saving[index]
      ),
    }));
  });

  const totalSavings = computed(() =>
    roundTwoDecimals(
      lineDiscounts.value.reduce((sum, line) => sum + line.lineSaving, 0)
    )
  );

  const discountedSubtotal = computed(() =>
    roundTwoDecimals(orderStore.cart.totalPrice - totalSavings.value)
  );

  const hasAnyDiscount = computed(() => totalSavings.value > 0);

  return { lineDiscounts, totalSavings, discountedSubtotal, hasAnyDiscount };
}
