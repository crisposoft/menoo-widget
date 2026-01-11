import { CartItem } from '../types';
export interface ApiOrderItem {
    item: string;
    quantity: number;
    note?: string;
    options?: Array<{
        _id: string;
        title: string;
        values: Array<{
            _id: string;
            name: string;
            price: number;
        }>;
    }>;
}
export declare function transformCartItemForApi(cartItem: CartItem): ApiOrderItem;
export declare function transformCartForApi(cartItems: CartItem[]): ApiOrderItem[];
