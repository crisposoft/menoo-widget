<template>
  <div ref="itemGridRef" class="item-grid">
    <div v-if="filteredCategories.length === 0" class="no-items">
      {{ t("menu.noResults") }}
    </div>
    <div
      v-for="(category, index) in filteredCategories"
      :key="category._id"
      :id="category._id"
      :ref="(el) => setCategorySectionRef(el, index)"
      class="category-section"
    >
      <h2 class="category-header">{{ category.name }}</h2>
      <div class="items-grid">
        <div
          v-for="item in category.items.filter((i) => i.available !== false)"
          :key="item._id"
          :class="[
            'item-card',
            { 'item-unavailable': item.available === false },
          ]"
          @click="handleItemClick(item)"
        >
          <img
            v-if="item.images && item.images.length > 0"
            class="item-image"
            :src="item.images[0].thumbnailUrl"
            :alt="item.name"
            loading="lazy"
          />
          <div class="item-content">
            <h3 class="item-name">{{ item.name }}</h3>
            <p v-if="item.description" class="item-description">
              {{ item.description }}
            </p>
            <div class="item-footer">
              <span class="item-price">{{ formatPrice(item.price) }}</span>
              <button
                v-if="item.available !== false"
                class="item-add-btn"
                @click.stop="handleQuickAdd(item, $event)"
              >
                {{ t("cart.add") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Item Dialog (integrated as regular Vue component) -->
    <MenooItemDialog
      v-if="selectedItem"
      :show="showDialog"
      :item="selectedItem"
      @close="closeDialog"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useActive } from "vue-use-active-scroll";
import { useCart, useFormatPrice, useRestaurant } from "../composables";
import { i18n } from "../services/i18n";
import type { Category, MenuItem } from "../types";
import MenooItemDialog from "./MenooItemDialog.vue";

const props = defineProps<{
  category?: string;
  search?: string;
}>();

const emit = defineEmits<{
  activeCategoryChange: [payload: { categoryId: string | null }];
}>();

const { addToCart } = useCart();
const { menus } = useRestaurant();
const { formatPrice } = useFormatPrice();
const itemGridRef = ref<HTMLElement>();

// Dialog state
const showDialog = ref(false);
const selectedItem = ref<MenuItem | null>(null);

const filteredCategories = computed(() => {
  let categories: Category[] = [];

  menus.value.forEach((menu) => {
    if (menu.categories) {
      categories.push(...menu.categories);
    }
  });

  // Filter by search term only (don't filter by category - that's just for scrolling)
  if (props.search) {
    const term = props.search.toLowerCase();
    categories = categories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            item.name.toLowerCase().includes(term) ||
            item.description?.toLowerCase().includes(term)
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }

  return categories.sort((a, b) => (a.order || 0) - (b.order || 0));
});

// Refs to category section elements for scroll spy
const categorySectionRefs = ref<HTMLElement[]>([]);

const setCategorySectionRef = (el: any, index: number) => {
  if (el) {
    categorySectionRefs.value[index] = el;
  }
};

// Category elements for scroll spy (use actual DOM elements instead of IDs)
const categoryElements = computed(() => {
  return categorySectionRefs.value.filter(Boolean);
});

// Clear refs when categories change to prevent stale references
watch(
  () => filteredCategories.value.length,
  () => {
    categorySectionRefs.value = [];
  }
);

// Calculate overlay height for scroll spy
const getOverlayHeight = () => {
  const categoryNav = document.querySelector(
    "menoo-category-nav"
  ) as HTMLElement;
  const stickyOffset = parseInt(
    categoryNav?.getAttribute("data-sticky-offset") || "0",
    10
  );
  const navHeight = categoryNav?.offsetHeight || 100;
  return stickyOffset + navHeight + 20;
};

// Use vue-use-active-scroll for scroll spy with actual DOM elements
const { setActive, activeId } = useActive(categoryElements, {
  overlayHeight: getOverlayHeight(),
  jumpToFirst: true,
  replaceHash: false,
});

// Watch active category and emit changes
watch(activeId, (newActiveId) => {
  // activeId contains the element's ID attribute, which is the category _id
  if (newActiveId) {
    console.log(
      "[MenooItemGrid] Active category changed via scroll:",
      newActiveId
    );
    emit("activeCategoryChange", { categoryId: newActiveId });

    // Dispatch native CustomEvent for Web Component boundary
    const event = new CustomEvent("active-category-change", {
      detail: { categoryId: newActiveId },
      bubbles: true,
      composed: true,
    });
    itemGridRef.value?.dispatchEvent(event);
  }
});

const handleItemClick = (item: MenuItem) => {
  if (item.available !== false) {
    selectedItem.value = item;
    showDialog.value = true;
  }
};

const handleQuickAdd = (item: MenuItem, event: MouseEvent) => {
  console.log("[MenooItemGrid] handleQuickAdd called", event);
  // Quick add button: if item has options, open dialog; otherwise add directly
  if (item.options && item.options.length > 0) {
    selectedItem.value = item;
    showDialog.value = true;
  } else {
    addToCart(item, [], "", 1);

    // Add success animation feedback
    const button = event.currentTarget as HTMLElement;
    console.log("[MenooItemGrid] Adding animation to button", button);
    button.classList.add("item-add-btn--success");
    setTimeout(() => {
      button.classList.remove("item-add-btn--success");
      console.log("[MenooItemGrid] Animation removed");
    }, 600);
  }
};

const closeDialog = () => {
  showDialog.value = false;
  selectedItem.value = null;
};

const t = (key: string) => i18n.t(key);

const scrollToCategory = (categoryId: string) => {
  console.log("[MenooItemGrid] scrollToCategory called with:", categoryId);

  // Find the element with this category ID
  const element = categorySectionRefs.value.find(
    (el) => el && el.id === categoryId
  );

  if (element) {
    // Calculate the scroll position accounting for sticky header
    const categoryNav = document.querySelector(
      "menoo-category-nav"
    ) as HTMLElement;
    const stickyOffset = parseInt(
      categoryNav?.getAttribute("data-sticky-offset") || "0",
      10
    );
    const navHeight = categoryNav?.offsetHeight || 100;
    const headerOffset = stickyOffset + navHeight + 100;

    const elPos = element.getBoundingClientRect().top;
    const offset = elPos + window.scrollY - headerOffset;

    // Scroll to the element
    window.scrollTo({
      top: offset,
      behavior: "smooth",
    });

    // Also update the active state
    setActive(element);
  } else {
    console.warn("[MenooItemGrid] Category element not found:", categoryId);
  }
};

// Watch for category changes and scroll to it
watch(
  () => props.category,
  (newCategory) => {
    console.log("[MenooItemGrid] Category prop changed to:", newCategory);
    if (newCategory) {
      scrollToCategory(newCategory);
    }
  }
);

defineExpose({
  scrollToCategory,
});
</script>

<style scoped>
.item-grid {
  min-height: 400px;
}

.category-section {
  margin-bottom: var(--menoo-spacing-4, 32px);
}

.category-header {
  font-size: var(--menoo-font-size-xl, 1.25rem);
  font-weight: var(--menoo-font-weight-bold, 700);
  margin-bottom: var(--menoo-spacing-2, 16px);
  color: var(--menoo-text-primary, #212121);
  padding-bottom: var(--menoo-spacing-1, 8px);
  border-bottom: 2px solid var(--menoo-border, #e0e0e0);
  margin-top: 0;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--menoo-spacing-2, 16px);
}

.item-card {
  background: var(--menoo-surface, #ffffff);
  border-radius: var(--menoo-radius-md, 8px);
  box-shadow: var(--menoo-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.12));
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  min-height: 200px;
}

.item-card:hover {
  box-shadow: var(--menoo-shadow-md, 0 4px 12px rgba(0, 0, 0, 0.15));
  transform: translateY(-4px) scale(1.02);
}

.item-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  background: var(--menoo-background, #f5f5f5);
  transition: transform 0.3s ease;
}

.item-card:hover .item-image {
  transform: scale(1.05);
}

.item-content {
  padding: var(--menoo-spacing-2, 16px);
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-name {
  font-size: var(--menoo-font-size-lg, 1.125rem);
  font-weight: var(--menoo-font-weight-medium, 500);
  margin-bottom: var(--menoo-spacing-1, 8px);
  color: var(--menoo-text-primary, #212121);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-top: 0;
}

.item-description {
  font-size: var(--menoo-font-size-sm, 0.875rem);
  color: var(--menoo-text-secondary, #757575);
  margin-bottom: var(--menoo-spacing-2, 16px);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
  margin-top: 0;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.item-price {
  font-size: var(--menoo-font-size-lg, 1.125rem);
  font-weight: var(--menoo-font-weight-bold, 700);
  color: var(--menoo-primary, #f0ac28);
}

.item-add-btn {
  padding: 6px 16px;
  background: var(--menoo-primary, #f0ac28);
  color: white;
  border: none;
  border-radius: var(--menoo-radius-md, 8px);
  font-size: var(--menoo-font-size-sm, 0.875rem);
  font-weight: var(--menoo-font-weight-medium, 500);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.item-add-btn::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.item-add-btn:active::after {
  width: 300px;
  height: 300px;
}

.item-add-btn:hover {
  background: var(--menoo-primary-dark, #996d1a);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(240, 172, 40, 0.3);
}

.item-add-btn:active {
  transform: translateY(0);
}

.item-add-btn--success {
  animation: add-to-cart-success 0.6s ease;
}

@keyframes add-to-cart-success {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.95);
  }
  50% {
    transform: scale(1.05);
    background: var(--menoo-success, #ffbe3b);
  }
  75% {
    transform: scale(1);
    background: var(--menoo-success, #ffbe3b);
  }
  100% {
    transform: scale(1);
    background: var(--menoo-primary, #f0ac28);
  }
}

.no-items {
  text-align: center;
  padding: var(--menoo-spacing-4, 32px);
  color: var(--menoo-text-secondary, #757575);
}

.item-unavailable {
  opacity: 0.6;
  cursor: not-allowed;
}

.item-unavailable:hover {
  transform: none;
  box-shadow: var(--menoo-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.12));
}

@media (max-width: 768px) {
  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .item-image {
    height: 140px;
  }

  .item-name {
    font-size: var(--menoo-font-size-md, 1rem);
  }

  .item-description {
    font-size: var(--menoo-font-size-xs, 0.75rem);
  }

  .item-content {
    padding: var(--menoo-spacing-1, 8px);
  }

  .item-footer {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }

  .item-price {
    text-align: center;
    font-size: var(--menoo-font-size-md, 1rem);
  }

  .item-add-btn {
    width: 100%;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
