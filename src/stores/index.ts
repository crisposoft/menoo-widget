import { createPinia } from "pinia";

export const pinia = createPinia();

// Export stores
export { useMenusStore } from "./menus";
export { useMetadataStore } from "./metadata";
export { useOrderStore } from "./order";
export { useRestaurantStore } from "./restaurant";
