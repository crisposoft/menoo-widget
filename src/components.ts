import { defineCustomElement } from "vue";
import MenooWidgetVue from "./components/MenooWidget.vue";

// Define custom element from Vue component
export const MenooWidget = defineCustomElement(MenooWidgetVue);

// Register the single widget component
export function registerComponents() {
  if (typeof customElements !== "undefined") {
    if (!customElements.get("menoo-widget")) {
      customElements.define("menoo-widget", MenooWidget);
    }
  }
}

// Auto-register when imported
registerComponents();

// Export core services and stores
export { apiClient } from "./core/api-client";
export { i18n } from "./services/i18n";
export * from "./stores";

// Export types
export type * from "./types";
