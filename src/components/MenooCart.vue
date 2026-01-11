<template>
  <div class="cart-container">
    <h2 class="cart-header">{{ t("cart.title") }}</h2>

    <Transition name="cart-transition" mode="out-in">
      <div v-if="cart.items.length === 0" key="empty" class="cart-empty">
        {{ t("cart.empty") }}
      </div>
      <div v-else key="full" class="cart-full">
        <div class="cart-items">
          <TransitionGroup name="cart-item">
            <div
              v-for="(cartItem, index) in cart.items"
              :key="`${cartItem.item._id}-${index}`"
              class="cart-item"
            >
              <div class="item-details">
                <div class="item-name">{{ cartItem.item.name }}</div>
                <div v-if="getOptionsText(cartItem)" class="item-options">
                  {{ getOptionsText(cartItem) }}
                </div>
                <div v-if="cartItem.note" class="item-note">
                  {{ cartItem.note }}
                </div>
                <div class="item-price">{{ formatPrice(cartItem.price) }}</div>
              </div>
              <div class="item-quantity">
                <button class="qty-btn" @click="decreaseQuantity(index)">
                  −
                </button>
                <span
                  class="qty-value"
                  :class="{ 'qty-animate': animatingItems.has(index) }"
                >
                  {{ cartItem.quantity }}
                </span>
                <button class="qty-btn" @click="increaseQuantity(index)">
                  +
                </button>
              </div>
            </div>
          </TransitionGroup>
        </div>

        <div class="cart-summary">
          <div class="summary-row">
            <span class="summary-label">{{ t("cart.subtotal") }}</span>
            <span class="summary-value">{{
              formatPrice(cart.totalPrice)
            }}</span>
          </div>
        </div>

        <button
          class="checkout-btn"
          :disabled="!isRestaurantOpen"
          @click="handleCheckout"
        >
          {{ t("cart.checkout") }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useCart, useFormatPrice } from "../composables";
import { i18n } from "../services/i18n";
import { useRestaurantStore } from "../stores";
import type { CartItem } from "../types";

const emit = defineEmits<{
  checkoutClicked: [];
}>();

const { cart, updateCartItemQuantity } = useCart();
const { formatPrice } = useFormatPrice();
const restaurantStore = useRestaurantStore();

const animatingItems = ref<Set<number>>(new Set());

const isRestaurantOpen = computed(
  () => restaurantStore.data?.status === "open"
);

const getOptionsText = (cartItem: CartItem): string => {
  if (!cartItem.options || cartItem.options.length === 0) return "";

  const texts: string[] = [];
  cartItem.options.forEach((selection) => {
    const option = cartItem.item.options?.find(
      (o) => o._id === selection.option
    );
    if (option) {
      const choiceNames = selection.choices
        .map((choiceId) => {
          const choice = option.values.find((c) => c._id === choiceId);
          return choice?.name;
        })
        .filter(Boolean)
        .join(", ");

      if (choiceNames) {
        texts.push(`${option.title}: ${choiceNames}`);
      }
    }
  });

  return texts.join(" • ");
};

const increaseQuantity = (index: number) => {
  const item = cart.value.items[index];
  if (item) {
    animatingItems.value = new Set(animatingItems.value).add(index);
    updateCartItemQuantity(index, item.quantity + 1);

    setTimeout(() => {
      const newSet = new Set(animatingItems.value);
      newSet.delete(index);
      animatingItems.value = newSet;
    }, 300);
  }
};

const decreaseQuantity = (index: number) => {
  const item = cart.value.items[index];
  if (item) {
    if (item.quantity === 1) {
      updateCartItemQuantity(index, item.quantity - 1);
    } else {
      animatingItems.value = new Set(animatingItems.value).add(index);
      updateCartItemQuantity(index, item.quantity - 1);

      setTimeout(() => {
        const newSet = new Set(animatingItems.value);
        newSet.delete(index);
        animatingItems.value = newSet;
      }, 300);
    }
  }
};

const handleCheckout = () => {
  // Emit event to trigger checkout (SDK will handle the redirect)
  emit("checkoutClicked");
};

const t = (key: string, replacements?: Record<string, string | number>) =>
  i18n.t(key, replacements);
</script>

<style scoped>
.cart-container {
  background: var(--menoo-surface, #ffffff);
  border-radius: var(--menoo-radius-md, 8px);
  box-shadow: var(--menoo-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.12));
  padding: var(--menoo-spacing-2, 16px);
  position: sticky;
  top: var(--menoo-cart-top, 0);
  max-height: calc(100vh - var(--menoo-cart-top, 0) - 32px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.cart-header {
  font-size: var(--menoo-font-size-xl, 1.25rem);
  font-weight: var(--menoo-font-weight-bold, 700);
  margin-bottom: var(--menoo-spacing-2, 16px);
  padding-bottom: var(--menoo-spacing-1, 8px);
  border-bottom: 2px solid var(--menoo-border, #e0e0e0);
  margin-top: 0;
}

.cart-empty {
  text-align: center;
  padding: var(--menoo-spacing-4, 32px) var(--menoo-spacing-2, 16px);
  color: var(--menoo-text-secondary, #757575);
}

.cart-transition-enter-active,
.cart-transition-leave-active {
  transition: all 0.3s ease;
}

.cart-transition-enter-from,
.cart-transition-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.cart-full {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  margin-bottom: var(--menoo-spacing-2, 16px);
}

/* Cart item transitions */
.cart-item-move {
  transition: transform 0.2s ease;
}

.cart-item-enter-active {
  transition: all 0.2s ease;
}

.cart-item-leave-active {
  transition: all 0.2s ease;
  position: absolute;
  width: calc(100% - var(--menoo-spacing-2, 16px) * 2);
}

.cart-item-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.cart-item-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.cart-item {
  display: flex;
  gap: var(--menoo-spacing-2, 16px);
  padding: var(--menoo-spacing-2, 16px);
  border-bottom: 1px solid var(--menoo-border, #e0e0e0);
  background: var(--menoo-surface, #ffffff);
}

.cart-item:last-child {
  border-bottom: none;
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-weight: var(--menoo-font-weight-medium, 500);
  margin-bottom: 4px;
}

.item-options {
  font-size: var(--menoo-font-size-sm, 0.875rem);
  color: var(--menoo-text-secondary, #757575);
  margin-bottom: 4px;
}

.item-note {
  font-size: var(--menoo-font-size-sm, 0.875rem);
  color: var(--menoo-text-secondary, #757575);
  font-style: italic;
}

.item-price {
  font-weight: var(--menoo-font-weight-bold, 700);
  color: var(--menoo-primary, #f0ac28);
  margin-top: 4px;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: var(--menoo-spacing-1, 8px);
}

.qty-btn {
  width: 28px;
  height: 28px;
  border: 1px solid var(--menoo-border, #e0e0e0);
  border-radius: var(--menoo-radius-sm, 4px);
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--menoo-transition-fast, 150ms);
  font-size: 16px;
  padding: 0;
}

.qty-btn:hover {
  background: var(--menoo-hover, #f5f5f5);
  transform: scale(1.1);
}

.qty-btn:active {
  transform: scale(0.95);
}

.qty-value {
  min-width: 24px;
  text-align: center;
  font-weight: var(--menoo-font-weight-medium, 500);
  transition: all 0.3s ease;
}

.qty-value.qty-animate {
  animation: qtyAnimation 0.3s ease;
}

@keyframes qtyAnimation {
  0% {
    transform: scale(1);
    color: inherit;
  }
  50% {
    transform: scale(1.3);
    color: var(--menoo-primary, #f0ac28);
    font-weight: var(--menoo-font-weight-bold, 700);
  }
  100% {
    transform: scale(1);
    color: inherit;
  }
}

.cart-summary {
  border-top: 2px solid var(--menoo-border, #e0e0e0);
  padding-top: var(--menoo-spacing-2, 16px);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--menoo-spacing-1, 8px);
  font-size: var(--menoo-font-size-md, 1rem);
}

.summary-label {
  color: var(--menoo-text-secondary, #757575);
}

.summary-value {
  font-weight: var(--menoo-font-weight-medium, 500);
}

.summary-total {
  font-size: var(--menoo-font-size-lg, 1.125rem);
  font-weight: var(--menoo-font-weight-bold, 700);
  margin-top: var(--menoo-spacing-1, 8px);
  padding-top: var(--menoo-spacing-1, 8px);
  border-top: 1px solid var(--menoo-border, #e0e0e0);
}

.summary-total .summary-value {
  color: var(--menoo-primary, #f0ac28);
}

.checkout-btn {
  width: 100%;
  padding: var(--menoo-spacing-2, 16px);
  margin-top: var(--menoo-spacing-2, 16px);
  background: var(--menoo-primary, #f0ac28);
  color: white;
  border: none;
  border-radius: var(--menoo-radius-md, 8px);
  font-size: var(--menoo-font-size-md, 1rem);
  font-weight: var(--menoo-font-weight-bold, 700);
  cursor: pointer;
  transition: all 0.3s ease;
}

.checkout-btn:hover:not(:disabled) {
  background: var(--menoo-primary-dark, #996d1a);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(240, 172, 40, 0.4);
}

.checkout-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(240, 172, 40, 0.3);
}

.checkout-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--menoo-text-secondary, #757575);
}

.delivery-hint {
  font-size: var(--menoo-font-size-xs, 0.75rem);
  color: var(--menoo-success, #388e3c);
  margin-top: 4px;
}

@media (max-width: 768px) {
  .cart-container {
    position: static;
    max-height: none;
  }
}
</style>
