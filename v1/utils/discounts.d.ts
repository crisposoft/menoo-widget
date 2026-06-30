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
    discount?: {
        discount: string;
    } | null;
}
interface ScopeMenuCategory {
    name: string;
    items?: ReadonlyArray<ScopeMenuItem>;
}
interface ScopeMenu {
    name: string;
    categories?: ReadonlyArray<ScopeMenuCategory>;
}
/** Mirrors webapp app/utils/numbers.ts roundTwoDecimals. */
export declare function roundTwoDecimals(value: number): number;
/** Short label for a reward: `-20%`, `-10.00 RON`, or `2+1`. */
export declare function rewardLabel(reward: DiscountReward, currency: string): string;
/** Reconstructs the reward shape from embedded item pricing (for badge labels). */
export declare function itemPricingReward(pricing: ItemDiscountPricing): DiscountReward;
/** True only when there is a real struck-through price to show. */
export declare function hasDiscountedPrice(pricing: ItemDiscountPricing | null | undefined): pricing is ItemDiscountPricing & {
    discountedPrice: number;
};
/** The discounted unit price, or null for badge-only (buy-x-get-y) pricing. */
export declare function discountedUnitPrice(pricing: ItemDiscountPricing | null | undefined): number | null;
/** Per-unit saving on the base price (options are never discounted). */
export declare function itemUnitSaving(pricing: ItemDiscountPricing | null | undefined): number;
/** A discount with no order-type restriction applies to every order type. */
export declare function appliesToOrderType(orderTypes: ReadonlyArray<DiscountOrderType> | null | undefined, type: DiscountOrderType): boolean;
/** Resolves the human-readable scope of a discount from the menu tree (for badges). */
export declare function resolveDiscountScope(discountId: string, scope: DiscountScopeKind, menus: ReadonlyArray<ScopeMenu> | null | undefined): ResolvedDiscountScope;
export {};
