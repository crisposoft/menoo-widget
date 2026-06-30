// Discount domain types + pure display helpers.
//
// These mirror the public contract served by the API
// (api/src/utils/discounts/menuPricing.ts) and the webapp's
// app/utils/discounts.ts, so the widget shows the exact same
// automatic, restaurant-configured discounts the webapp does.
//
// DISPLAY ONLY: the widget never computes authoritative checkout
// totals (it redirects to the webapp for checkout). It renders the
// per-item pricing the API already embedded and the restaurant-level
// discounts the API already returned.

export type DiscountRewardKind = "percentage" | "fixed" | "buy-x-get-y";
export type DiscountScopeKind = "order" | "products" | "menus" | "categories";
export type DiscountOrderType = "delivery" | "pickup" | "table";

export interface DiscountReward {
  kind: DiscountRewardKind;
  percentage?: number;
  maxAmount?: number;
  amount?: number;
  buy?: number;
  get?: number;
}

export interface DiscountScheduleEntry {
  weekday: number;
  start: number;
  end: number;
}

export interface DiscountConditions {
  orderTypes?: DiscountOrderType[];
  minOrderValue?: number;
  startsAt?: string;
  endsAt?: string;
  schedule?: DiscountScheduleEntry[];
  utcOffset?: number;
  firstOrderOnly?: boolean;
}

/** Restaurant-level automatic discount returned by the public API. */
export interface PublicDiscount {
  _id: string;
  name: string;
  description?: string;
  scope: DiscountScopeKind;
  reward: DiscountReward;
  conditions: DiscountConditions;
}

/** Promotional pricing for one menu item, embedded by the API as `item.discount`. */
export interface ItemDiscountPricing {
  discount: string;
  rewardKind: DiscountRewardKind;
  originalPrice: number;
  discountedPrice: number | null;
  percentage?: number;
  buy?: number;
  get?: number;
}

export interface ResolvedDiscountScope {
  kind: "order" | "menus" | "categories" | "products" | "items";
  names: string[];
}

interface ScopeMenuItem {
  name: string;
  discount?: { discount: string } | null;
}
interface ScopeMenuCategory {
  name: string;
  items?: ReadonlyArray<ScopeMenuItem>;
}
interface ScopeMenu {
  name: string;
  categories?: ReadonlyArray<ScopeMenuCategory>;
}

/** Mirrors the webapp's money formatter: `"12.34 RON"`. */
function formatMoney(amount: number, currency: string): string {
  return `${amount.toFixed(2)} ${currency}`;
}

/** Mirrors webapp app/utils/numbers.ts roundTwoDecimals. */
export function roundTwoDecimals(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Short label for a reward: `-20%`, `-10.00 RON`, or `2+1`. */
export function rewardLabel(reward: DiscountReward, currency: string): string {
  if (reward.kind === "percentage") {
    return `-${reward.percentage ?? 0}%`;
  }
  if (reward.kind === "fixed") {
    return `-${formatMoney(reward.amount ?? 0, currency)}`;
  }
  return `${reward.buy ?? 0}+${reward.get ?? 0}`;
}

/** Reconstructs the reward shape from embedded item pricing (for badge labels). */
export function itemPricingReward(pricing: ItemDiscountPricing): DiscountReward {
  if (pricing.rewardKind === "percentage") {
    return { kind: "percentage", percentage: pricing.percentage };
  }
  if (pricing.rewardKind === "buy-x-get-y") {
    return { kind: "buy-x-get-y", buy: pricing.buy, get: pricing.get };
  }
  const amount =
    pricing.discountedPrice != null
      ? roundTwoDecimals(pricing.originalPrice - pricing.discountedPrice)
      : 0;
  return { kind: "fixed", amount };
}

/** True only when there is a real struck-through price to show. */
export function hasDiscountedPrice(
  pricing: ItemDiscountPricing | null | undefined,
): pricing is ItemDiscountPricing & { discountedPrice: number } {
  return (
    !!pricing &&
    pricing.discountedPrice != null &&
    pricing.discountedPrice < pricing.originalPrice
  );
}

/** The discounted unit price, or null for badge-only (buy-x-get-y) pricing. */
export function discountedUnitPrice(
  pricing: ItemDiscountPricing | null | undefined,
): number | null {
  return hasDiscountedPrice(pricing) ? pricing.discountedPrice : null;
}

/** Per-unit saving on the base price (options are never discounted). */
export function itemUnitSaving(
  pricing: ItemDiscountPricing | null | undefined,
): number {
  if (!hasDiscountedPrice(pricing)) {
    return 0;
  }
  return roundTwoDecimals(pricing.originalPrice - pricing.discountedPrice);
}

/** A discount with no order-type restriction applies to every order type. */
export function appliesToOrderType(
  orderTypes: ReadonlyArray<DiscountOrderType> | null | undefined,
  type: DiscountOrderType,
): boolean {
  return !orderTypes?.length || orderTypes.includes(type);
}

/** Resolves the human-readable scope of a discount from the menu tree (for badges). */
export function resolveDiscountScope(
  discountId: string,
  scope: DiscountScopeKind,
  menus: ReadonlyArray<ScopeMenu> | null | undefined,
): ResolvedDiscountScope {
  if (scope === "order") {
    return { kind: "order", names: [] };
  }

  const menuNames = new Set<string>();
  const categoryNames = new Set<string>();
  const productNames = new Set<string>();

  for (const menu of menus ?? []) {
    for (const category of menu.categories ?? []) {
      let matched = false;
      for (const item of category.items ?? []) {
        if (item.discount?.discount === discountId) {
          productNames.add(item.name);
          matched = true;
        }
      }
      if (matched) {
        menuNames.add(menu.name);
        categoryNames.add(category.name);
      }
    }
  }

  if (scope === "menus" && menuNames.size) {
    return { kind: "menus", names: [...menuNames] };
  }
  if (scope === "categories" && categoryNames.size) {
    return { kind: "categories", names: [...categoryNames] };
  }
  if (scope === "products" && productNames.size) {
    return { kind: "products", names: [...productNames] };
  }
  return { kind: "items", names: [] };
}
