<template>
  <div class="menoo-widget-container">
    <MenooRestaurant />
    <MenooCategoryNav
      ref="categoryNavRef"
      :data-sticky-offset="stickyOffset"
      @category-selected="handleCategorySelected"
      @category-search="handleCategorySearch"
    />
    <div class="menoo-widget-main">
      <MenooItemGrid
        ref="itemGridRef"
        :category="selectedCategory"
        :search="searchTerm"
        @active-category-change="handleActiveCategoryChange"
      />
      <MenooCart ref="cartRef" @checkout-clicked="handleCheckoutClicked" />
    </div>

    <!-- Floating cart button for mobile -->
    <Transition name="floating-cart">
      <button
        v-if="cart.items.length > 0"
        class="floating-cart-btn"
        @click="scrollToCart"
        aria-label="View cart"
      >
        <svg
          class="cart-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"
          />
        </svg>
        <span class="cart-badge">{{ cart.items.length }}</span>
      </button>
    </Transition>

    <!-- Footer -->
    <div class="menoo-footer">
      <a
        href="https://parteneri.menoo.ro"
        target="_blank"
        class="menoo-footer-link"
      >
        Powered by Menoo
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useCart } from "../composables";
import MenooCart from "./MenooCart.vue";
import MenooCategoryNav from "./MenooCategoryNav.vue";
import MenooItemGrid from "./MenooItemGrid.vue";
import MenooRestaurant from "./MenooRestaurant.vue";

const props = defineProps<{
  stickyOffset?: number;
}>();

// Refs for child components
const categoryNavRef = ref<InstanceType<typeof MenooCategoryNav> | null>(null);
const itemGridRef = ref<InstanceType<typeof MenooItemGrid> | null>(null);
const cartRef = ref<InstanceType<typeof MenooCart> | null>(null);

// Local state
const selectedCategory = ref<string>("");
const searchTerm = ref<string>("");

// Cart state
const { cart } = useCart();

// Event handlers
function handleCategorySelected(payload: { categoryId: string | null }) {
  const categoryId = payload?.categoryId || "";
  selectedCategory.value = categoryId;

  // Scroll to category after a brief delay
  if (categoryId && itemGridRef.value) {
    setTimeout(() => {
      (itemGridRef.value as any)?.scrollToCategory?.(categoryId);
    }, 100);
  }
}

function handleActiveCategoryChange(payload: { categoryId: string | null }) {
  const categoryId = payload?.categoryId || "";

  // Update category nav to reflect the active category
  if (categoryNavRef.value) {
    (categoryNavRef.value as any)?.setSelectedCategory?.(categoryId);
  }
}

function handleCategorySearch(payload: { searchTerm: string }) {
  searchTerm.value = payload?.searchTerm || "";
}

function handleCheckoutClicked() {
  // Emit checkout event to parent (SDK)
  const event = new CustomEvent("checkout-clicked", {
    bubbles: true,
    composed: true,
  });
  // Get the host element and dispatch from there
  const host = (cartRef.value?.$el as HTMLElement)?.getRootNode();
  if (host && (host as any).host) {
    (host as any).host.dispatchEvent(event);
  }
}

function scrollToCart() {
  if (cartRef.value?.$el) {
    const cartElement = cartRef.value.$el as HTMLElement;
    const categoryNav = categoryNavRef.value?.$el;
    const stickyOffset = props.stickyOffset || 0;
    const navHeight = categoryNav?.offsetHeight || 100;
    const headerOffset = stickyOffset + navHeight + 20;

    const cartPos = cartElement.getBoundingClientRect().top;
    const offset = cartPos + window.scrollY - headerOffset;

    window.scrollTo({
      top: offset,
      behavior: "smooth",
    });
  }
}

// Update cart sticky position after mount
onMounted(() => {
  updateCartStickyPosition();
});

// Watch for sticky offset changes
watch(
  () => props.stickyOffset,
  () => {
    setTimeout(updateCartStickyPosition, 100);
  }
);

function updateCartStickyPosition() {
  const categoryNav = categoryNavRef.value?.$el;
  const cart = cartRef.value?.$el;

  if (categoryNav && cart) {
    const stickyOffset = props.stickyOffset || 0;
    const navHeight = categoryNav.offsetHeight || 0;
    const cartTop = stickyOffset + navHeight + 16; // 16px gap

    cart.style.setProperty("--menoo-cart-top", `${cartTop}px`);
  }
}
</script>

<style scoped>
.menoo-widget-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.menoo-widget-main {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 16px;
  align-items: start;
}

.menoo-widget-main :deep(menoo-cart),
.menoo-widget-main > *:last-child {
  position: sticky;
  top: var(--menoo-cart-top, calc(v-bind(stickyOffset + "px") + 100px));
  max-height: calc(
    100vh - var(--menoo-cart-top, calc(v-bind(stickyOffset + "px") + 100px)) -
      32px
  );
  overflow-y: auto;
}

@media (max-width: 1024px) {
  .menoo-widget-main {
    grid-template-columns: 1fr;
  }

  .menoo-widget-main :deep(menoo-cart),
  .menoo-widget-main > *:last-child {
    position: relative;
    top: 0;
    max-height: none;
    order: 1;
  }

  .menoo-widget-main > *:first-child {
    order: 2;
  }
}

.floating-cart-btn {
  display: none;
}

@media (max-width: 1024px) {
  .floating-cart-btn {
    display: flex;
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--menoo-primary, #f0ac28);
    color: white;
    border: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .floating-cart-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  }

  .floating-cart-btn:active {
    transform: scale(0.95);
  }

  .cart-icon {
    width: 28px;
    height: 28px;
  }

  .cart-badge {
    position: absolute;
    top: 6px;
    right: 6px;
    background: #ff4444;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: bold;
    border: 2px solid white;
  }

  .floating-cart-enter-active,
  .floating-cart-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .floating-cart-enter-from {
    opacity: 0;
    transform: scale(0.8);
  }

  .floating-cart-enter-to {
    opacity: 1;
    transform: scale(1);
  }

  .floating-cart-leave-from {
    opacity: 1;
    transform: scale(1);
  }

  .floating-cart-leave-to {
    opacity: 0;
    transform: scale(0.8);
  }
}

.menoo-footer {
  text-align: center;
  padding: var(--menoo-spacing-2, 16px);
  margin-top: var(--menoo-spacing-3, 24px);
}

.menoo-footer-link {
  color: var(--menoo-text-secondary, #757575);
  font-size: var(--menoo-font-size-sm, 0.875rem);
  text-decoration: none;
  transition: color 0.2s ease;
}

.menoo-footer-link:hover {
  color: var(--menoo-text-primary, #212121);
}
</style>
