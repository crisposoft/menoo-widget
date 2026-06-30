import { MaybeRefOrGetter } from 'vue';
import { MenuItem, OptionSelection } from '../types';
import { ApiOrderItem } from '../utils/cart';
import { ItemDiscountPricing } from '../utils/discounts';
export declare function useCart(): {
    cart: import('vue').ComputedRef<{
        items: {
            item: {
                _id: string;
                name: string;
                description?: string | undefined;
                price: number;
                images?: {
                    url: string;
                    thumbnailUrl: string;
                }[] | undefined;
                options?: {
                    _id: string;
                    title: string;
                    type: "single" | "multiple";
                    required: boolean;
                    values: {
                        _id: string;
                        name: string;
                        price: number;
                    }[];
                }[] | undefined;
                category: string;
                available?: boolean | undefined;
                discount?: {
                    discount: string;
                    rewardKind: import('../utils/discounts').DiscountRewardKind;
                    originalPrice: number;
                    discountedPrice: number | null;
                    percentage?: number | undefined;
                    buy?: number | undefined;
                    get?: number | undefined;
                } | undefined;
            };
            quantity: number;
            options?: {
                option: string;
                choices: string[];
            }[] | undefined;
            note?: string | undefined;
            price: number;
        }[];
        totalPrice: number;
        totalCount: number;
    }>;
    deliveryFee: import('vue').ComputedRef<number>;
    totalWithDelivery: import('vue').ComputedRef<number>;
    addToCart: (item: MenuItem, options?: OptionSelection[], note?: string, quantity?: number) => void;
    updateCartItemQuantity: (index: number, newQuantity: number) => void;
    removeFromCart: (index: number) => void;
    clearCart: () => void;
    getCartForApi: () => ApiOrderItem[];
};
export declare function useRestaurant(): {
    restaurant: import('vue').ComputedRef<{
        _id: string;
        slug?: string | undefined;
        name: string;
        address?: {
            city?: string | undefined;
        } | undefined;
        delivery: {
            fee: number;
            feeThreshold: number;
            types: Array<"delivery" | "pickup">;
            supportedPayments: Array<"COD" | "online">;
            schedule?: {
                monday?: {
                    open: string;
                    close: string;
                }[] | undefined;
                tuesday?: {
                    open: string;
                    close: string;
                }[] | undefined;
                wednesday?: {
                    open: string;
                    close: string;
                }[] | undefined;
                thursday?: {
                    open: string;
                    close: string;
                }[] | undefined;
                friday?: {
                    open: string;
                    close: string;
                }[] | undefined;
                saturday?: {
                    open: string;
                    close: string;
                }[] | undefined;
                sunday?: {
                    open: string;
                    close: string;
                }[] | undefined;
            } | undefined;
        };
        schedule?: {
            monday?: {
                open: string;
                close: string;
            }[] | undefined;
            tuesday?: {
                open: string;
                close: string;
            }[] | undefined;
            wednesday?: {
                open: string;
                close: string;
            }[] | undefined;
            thursday?: {
                open: string;
                close: string;
            }[] | undefined;
            friday?: {
                open: string;
                close: string;
            }[] | undefined;
            saturday?: {
                open: string;
                close: string;
            }[] | undefined;
            sunday?: {
                open: string;
                close: string;
            }[] | undefined;
        } | undefined;
        status?: "open" | "closed" | undefined;
    } | null>;
    menus: import('vue').ComputedRef<{
        _id: string;
        name: string;
        categories: {
            _id: string;
            name: string;
            items: {
                _id: string;
                name: string;
                description?: string | undefined;
                price: number;
                images?: {
                    url: string;
                    thumbnailUrl: string;
                }[] | undefined;
                options?: {
                    _id: string;
                    title: string;
                    type: "single" | "multiple";
                    required: boolean;
                    values: {
                        _id: string;
                        name: string;
                        price: number;
                    }[];
                }[] | undefined;
                category: string;
                available?: boolean | undefined;
                discount?: {
                    discount: string;
                    rewardKind: import('../utils/discounts').DiscountRewardKind;
                    originalPrice: number;
                    discountedPrice: number | null;
                    percentage?: number | undefined;
                    buy?: number | undefined;
                    get?: number | undefined;
                } | undefined;
            }[];
            order?: number | undefined;
        }[];
    }[]>;
};
export declare function useFormatPrice(): {
    formatPrice: (price: number) => string;
};
export declare function useItemDiscount(item: MaybeRefOrGetter<MenuItem>): {
    pricing: import('vue').ComputedRef<ItemDiscountPricing | null>;
    discountedUnitPrice: import('vue').ComputedRef<number | null>;
    badgeLabel: import('vue').ComputedRef<string>;
};
export interface CartLineDiscount {
    hasDiscount: boolean;
    lineSaving: number;
    originalLineTotal: number;
    discountedLineTotal: number;
}
export declare function useCartDiscounts(): {
    lineDiscounts: import('vue').ComputedRef<CartLineDiscount[]>;
    totalSavings: import('vue').ComputedRef<number>;
    discountedSubtotal: import('vue').ComputedRef<number>;
    hasAnyDiscount: import('vue').ComputedRef<boolean>;
};
