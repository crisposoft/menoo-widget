export interface Restaurant {
    _id: string;
    name: string;
    city: string;
    address?: string;
    delivery: DeliveryConfig;
    schedule?: Schedule;
    status?: "open" | "closed";
}
export interface DeliveryConfig {
    fee: number;
    feeThreshold: number;
    types: Array<"delivery" | "pickup">;
    supportedPayments: Array<"COD" | "online">;
    schedule?: Schedule;
}
export interface Schedule {
    monday?: TimeSlot[];
    tuesday?: TimeSlot[];
    wednesday?: TimeSlot[];
    thursday?: TimeSlot[];
    friday?: TimeSlot[];
    saturday?: TimeSlot[];
    sunday?: TimeSlot[];
}
export interface TimeSlot {
    open: string;
    close: string;
}
export interface MenuData {
    _id: string;
    name: string;
    categories: Category[];
}
export interface Category {
    _id: string;
    name: string;
    items: MenuItem[];
    order?: number;
}
export interface MenuItem {
    _id: string;
    name: string;
    description?: string;
    price: number;
    images?: Array<{
        url: string;
        thumbnailUrl: string;
    }>;
    options?: ItemOption[];
    category: string;
    available?: boolean;
}
export interface ItemOption {
    _id: string;
    title: string;
    type: "single" | "multiple";
    required: boolean;
    values: OptionChoice[];
}
export interface OptionChoice {
    _id: string;
    name: string;
    price: number;
}
export interface OptionSelection {
    option: string;
    choices: string[];
}
export interface CartItem {
    item: MenuItem;
    quantity: number;
    options?: OptionSelection[];
    note?: string;
    price: number;
}
export interface Cart {
    items: CartItem[];
    totalPrice: number;
    totalCount: number;
}
export interface Metadata {
    currency: string;
    language: string;
    showPrices: boolean;
    useDelivery: boolean;
}
export interface WidgetConfig {
    restaurantId: string;
    container?: string | HTMLElement;
    language?: "ro" | "en" | "ru";
    stickyOffset?: number;
}
export interface RestaurantResponse {
    data: Restaurant;
    menus: MenuData[];
    metadata: Metadata;
    isPremium: boolean;
}
export interface WidgetEvents {
    "menoo:ready": {
        restaurantId: string;
    };
    "menoo:cart-changed": {
        cart: Cart;
    };
    "menoo:item-added": {
        item: CartItem;
    };
    "menoo:item-removed": {
        item: CartItem;
    };
    "menoo:checkout-started": {
        cart: Cart;
    };
    "menoo:error": {
        error: Error;
        context: string;
    };
    "menoo:mode-changed": {
        mode: "delivery" | "pickup";
    };
    "menoo:language-changed": {
        language: "ro" | "en" | "ru";
    };
}
export interface WidgetState {
    restaurant: Restaurant | null;
    menus: MenuData[];
    metadata: Metadata | null;
    cart: Cart;
    mode: "delivery" | "pickup";
    language: "ro" | "en" | "ru";
}
