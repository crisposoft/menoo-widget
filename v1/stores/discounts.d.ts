import { DiscountOrderType, ItemDiscountPricing, PublicDiscount } from '../utils/discounts';
interface DiscountsState {
    available: boolean;
    data: PublicDiscount[];
}
export declare const useDiscountsStore: import('pinia').StoreDefinition<"discounts", DiscountsState, {
    orderTypesById(state: {
        available: boolean;
        data: {
            _id: string;
            name: string;
            description?: string | undefined;
            scope: import('../utils/discounts').DiscountScopeKind;
            reward: {
                kind: import('../utils/discounts').DiscountRewardKind;
                percentage?: number | undefined;
                maxAmount?: number | undefined;
                amount?: number | undefined;
                buy?: number | undefined;
                get?: number | undefined;
            };
            conditions: {
                orderTypes?: DiscountOrderType[] | undefined;
                minOrderValue?: number | undefined;
                startsAt?: string | undefined;
                endsAt?: string | undefined;
                schedule?: {
                    weekday: number;
                    start: number;
                    end: number;
                }[] | undefined;
                utcOffset?: number | undefined;
                firstOrderOnly?: boolean | undefined;
            };
        }[];
    } & import('pinia').PiniaCustomStateProperties<DiscountsState>): Map<string, DiscountOrderType[]>;
    visibleItemPricing(): (pricing: ItemDiscountPricing | null | undefined, orderType: DiscountOrderType) => ItemDiscountPricing | null;
}, {
    setDiscounts(discounts: PublicDiscount[]): void;
    resetDiscounts(): void;
}>;
export {};
