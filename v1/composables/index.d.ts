import { MenuItem, OptionSelection } from '../types';
import { ApiOrderItem } from '../utils/cart';
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
        name: string;
        city: string;
        address?: string | undefined;
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
            }[];
            order?: number | undefined;
        }[];
    }[]>;
};
export declare function useFormatPrice(): {
    formatPrice: (price: number) => string;
};
