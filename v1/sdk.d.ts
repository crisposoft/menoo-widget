import { Cart, WidgetConfig } from './types';
import { ApiOrderItem } from './utils/cart';
export declare class MenooSDK {
    private config;
    private container;
    private initialized;
    /**
     * Initialize the Menoo Widget
     */
    init(config: WidgetConfig): Promise<void>;
    /**
     * Destroy the widget and cleanup
     */
    destroy(): void;
    /**
     * Get current cart
     */
    getCart(): Cart;
    /**
     * Get cart formatted for API submission
     */
    getCartForApi(): ApiOrderItem[];
    /**
     * Get item count in cart
     */
    getItemCount(): number;
    /**
     * Get total price
     */
    getTotalPrice(): number;
    /**
     * Clear cart
     */
    clearCart(): void;
    /**
     * Open checkout - Redirects to webapp checkout page
     */
    openCheckout(): void;
    /**
     * Add event listener
     */
    addEventListener(event: string, callback: EventListener): void;
    /**
     * Remove event listener
     */
    removeEventListener(event: string, callback: EventListener): void;
    /**
     * Update delivery mode
     */
    setMode(mode: "delivery" | "pickup"): void;
    private renderFullLayout;
    private setupEventListeners;
}
export declare const menooSDK: MenooSDK;
export default menooSDK;
