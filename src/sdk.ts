import { apiClient } from "./core/api-client";
import { i18n } from "./services/i18n";
import {
  pinia,
  useMenusStore,
  useMetadataStore,
  useOrderStore,
  useRestaurantStore,
} from "./stores";
import type { Cart, WidgetConfig } from "./types";
import { transformCartForApi, type ApiOrderItem } from "./utils/cart";

// Import and register components
import { registerComponents } from "./components";

// Ensure components are registered
registerComponents();

export class MenooSDK {
  private config: WidgetConfig | null = null;
  private container: HTMLElement | null = null;
  private initialized = false;

  /**
   * Initialize the Menoo Widget
   */
  async init(config: WidgetConfig): Promise<void> {
    if (this.initialized) {
      console.warn("Menoo Widget is already initialized");
      return;
    }

    this.config = config;

    // Resolve container
    if (typeof config.container === "string") {
      this.container = document.querySelector(config.container);
    } else if (config.container instanceof HTMLElement) {
      this.container = config.container;
    } else {
      this.container = document.getElementById("menoo-widget");
    }

    if (!this.container) {
      throw new Error("Container element not found");
    }

    // Set language
    const language = config.language || "ro";
    await i18n.setLanguage(language);

    // Initialize metadata store
    const metadataStore = useMetadataStore(pinia);
    metadataStore.setLanguage(language);

    // Set mode
    if (config.mode) {
      const orderStore = useOrderStore(pinia);
      orderStore.type = config.mode;
    }

    // Load restaurant data
    try {
      const data = await apiClient.fetchRestaurant(
        config.restaurantId,
        language,
        true
      );

      // Initialize stores
      const restaurantStore = useRestaurantStore(pinia);
      const menusStore = useMenusStore(pinia);
      const metadataStore = useMetadataStore(pinia);
      const orderStore = useOrderStore(pinia);

      restaurantStore.updateRestaurant(data.data);
      menusStore.updateMenus(data.menus);
      metadataStore.updateMetadata(data.metadata);
      orderStore.initCart(config.restaurantId);

      // Render layout
      this.renderFullLayout();

      // Setup event listeners
      this.setupEventListeners();

      this.initialized = true;

      // Emit ready event
      window.dispatchEvent(
        new CustomEvent("menoo:ready", {
          detail: { restaurantId: config.restaurantId },
        })
      );
    } catch (error) {
      console.error("Failed to initialize Menoo Widget:", error);
      // Emit error event
      window.dispatchEvent(
        new CustomEvent("menoo:error", {
          detail: { error, phase: "initialization" },
        })
      );
      throw error;
    }
  }

  /**
   * Destroy the widget and cleanup
   */
  destroy(): void {
    if (!this.initialized || !this.container) return;

    this.container.innerHTML = "";
    this.initialized = false;
    this.config = null;
  }

  /**
   * Get current cart
   */
  getCart(): Cart {
    const orderStore = useOrderStore(pinia);
    return orderStore.getCart;
  }

  /**
   * Get cart formatted for API submission
   */
  getCartForApi(): ApiOrderItem[] {
    const orderStore = useOrderStore(pinia);
    return transformCartForApi(orderStore.getCart.items);
  }

  /**
   * Get item count in cart
   */
  getItemCount(): number {
    const orderStore = useOrderStore(pinia);
    return orderStore.itemCount;
  }

  /**
   * Get total price
   */
  getTotalPrice(): number {
    const orderStore = useOrderStore(pinia);
    const restaurantStore = useRestaurantStore(pinia);
    const cart = orderStore.getCart;
    const restaurant = restaurantStore.data;
    const mode = orderStore.type;

    let deliveryFee = 0;
    if (restaurant && mode === "delivery") {
      const threshold = restaurant.delivery.feeThreshold || 0;
      const fee = restaurant.delivery.fee || 0;
      deliveryFee = cart.totalPrice >= threshold ? 0 : fee;
    }

    return cart.totalPrice + deliveryFee;
  }

  /**
   * Clear cart
   */
  clearCart(): void {
    const orderStore = useOrderStore(pinia);
    orderStore.clearCart();
  }

  /**
   * Open checkout - Redirects to webapp checkout page
   */
  openCheckout(): void {
    const restaurantStore = useRestaurantStore(pinia);
    const restaurantId = restaurantStore.data?._id || this.config?.restaurantId;
    const language = i18n.getLanguage();

    if (restaurantId) {
      window.location.href = `https://menoo.ro/${language}/embedded/widget/${restaurantId}?mode=checkout`;
    } else {
      console.error("Cannot open checkout: Restaurant ID not found");
    }
  }

  /**
   * Add event listener
   */
  addEventListener(event: string, callback: EventListener): void {
    window.addEventListener(event, callback);
  }

  /**
   * Remove event listener
   */
  removeEventListener(event: string, callback: EventListener): void {
    window.removeEventListener(event, callback);
  }

  private renderFullLayout(): void {
    if (!this.container) return;

    // Simple render with single widget component
    this.container.innerHTML = `
      <menoo-widget sticky-offset="${
        this.config?.stickyOffset || 0
      }"></menoo-widget>
    `;
  }

  private setupEventListeners(): void {
    if (!this.container) return;

    // Listen for checkout event from widget
    const widget = this.container.querySelector("menoo-widget");
    if (widget) {
      widget.addEventListener("checkout-clicked", () => {
        this.openCheckout();
      });
    }
  }
}

// Export singleton instance
export const menooSDK = new MenooSDK();

// Global API for script tag usage
if (typeof window !== "undefined") {
  (window as any).MenooSDK = menooSDK;
}

export default menooSDK;
