import { Cart, CartItem, MenuData, MenuItem, OptionSelection } from '../types';
export declare const useOrderStore: import('pinia').StoreDefinition<"order", {
    type: "delivery" | "pickup";
    restaurant: string;
    cart: Cart;
}, {
    getCart: (state: {
        type: "delivery" | "pickup";
        restaurant: string;
        cart: {
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
        };
    } & import('pinia').PiniaCustomStateProperties<{
        type: "delivery" | "pickup";
        restaurant: string;
        cart: Cart;
    }>) => {
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
    };
    hasItems: (state: {
        type: "delivery" | "pickup";
        restaurant: string;
        cart: {
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
        };
    } & import('pinia').PiniaCustomStateProperties<{
        type: "delivery" | "pickup";
        restaurant: string;
        cart: Cart;
    }>) => boolean;
    itemCount: (state: {
        type: "delivery" | "pickup";
        restaurant: string;
        cart: {
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
        };
    } & import('pinia').PiniaCustomStateProperties<{
        type: "delivery" | "pickup";
        restaurant: string;
        cart: Cart;
    }>) => number;
}, {
    initCart(restaurantId: string): void;
    syncItemsWithMenu(menus: MenuData[]): void;
    addOrder(item: MenuItem, options?: OptionSelection[], note?: string, quantity?: number): void;
    removeOrder(index: number): void;
    updateCartItemQuantity(index: number, quantity: number): void;
    clearCart(): void;
    calculateItemPrice(item: MenuItem, options?: OptionSelection[]): number;
    isSameCartItem(cartItem: CartItem, item: MenuItem, options?: OptionSelection[], note?: string): boolean;
    optionsEqual(options1?: OptionSelection[], options2?: OptionSelection[]): boolean;
    sortOptions(options: OptionSelection[]): OptionSelection[];
    recalculateCart(): void;
}>;
