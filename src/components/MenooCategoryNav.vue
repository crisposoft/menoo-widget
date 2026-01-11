<template>
  <div class="category-nav">
    <div class="search-box">
      <input
        v-model="searchTerm"
        type="text"
        class="search-input"
        :placeholder="t('menu.search')"
        @input="handleSearch"
      />
    </div>
    <h3 class="category-title">{{ t("menu.categories") }}</h3>
    <div class="category-scroll-container">
      <button
        v-if="canScrollLeft"
        class="scroll-button scroll-left"
        @click="scrollLeft"
        aria-label="Scroll left"
      >
        ‹
      </button>
      <vue-horizontal
        ref="horizontal"
        class="category-list"
        :button="false"
        @scroll-debounce="onScrollDebounce"
      >
        <div
          v-for="category in categories"
          :key="category._id"
          class="category-item"
        >
          <button
            :class="[
              'category-button',
              { active: selectedCategory === category._id },
            ]"
            @click="selectCategory(category._id)"
          >
            {{ category.name }}
            <span class="category-count">{{
              category.items?.length || 0
            }}</span>
          </button>
        </div>
      </vue-horizontal>
      <button
        v-if="canScrollRight"
        class="scroll-button scroll-right"
        @click="scrollRight"
        aria-label="Scroll right"
      >
        ›
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import VueHorizontal from "vue-horizontal";
import { useRestaurant } from "../composables";
import { i18n } from "../services/i18n";
import type { Category } from "../types";

const emit = defineEmits<{
  categorySelected: [payload: { categoryId: string | null }];
  categorySearch: [payload: { searchTerm: string }];
}>();

const { menus } = useRestaurant();
const searchTerm = ref("");
const selectedCategory = ref<string | null>(null);
const horizontal = ref<InstanceType<typeof VueHorizontal> | null>(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);

const categories = computed(() => {
  const cats: Category[] = [];
  menus.value.forEach((menu) => {
    if (menu.categories) {
      cats.push(...menu.categories);
    }
  });
  return cats.sort((a, b) => (a.order || 0) - (b.order || 0));
});

// Watch for selected category changes and scroll to it horizontally
watch(selectedCategory, (newCategoryId) => {
  if (newCategoryId && horizontal.value) {
    const categoryIndex = categories.value.findIndex(
      (cat) => cat._id === newCategoryId
    );
    if (categoryIndex !== -1) {
      horizontal.value.scrollToIndex(categoryIndex);
    }
  }
});

const selectCategory = (categoryId: string) => {
  console.log("[MenooCategoryNav] selectCategory called with:", categoryId);
  const wasSelected = selectedCategory.value === categoryId;
  selectedCategory.value = wasSelected ? null : categoryId;
  console.log(
    "[MenooCategoryNav] Emitting categorySelected:",
    selectedCategory.value
  );
  emit("categorySelected", { categoryId: selectedCategory.value });
};

const handleSearch = () => {
  emit("categorySearch", { searchTerm: searchTerm.value });
};

const scrollLeft = () => {
  if (horizontal.value) {
    const event = new Event("click");
    horizontal.value.prev(event);
  }
};

const scrollRight = () => {
  if (horizontal.value) {
    const event = new Event("click");
    horizontal.value.next(event);
  }
};

const onScrollDebounce = ({
  left,
  width,
  scrollWidth,
}: {
  left: number;
  width: number;
  scrollWidth: number;
}) => {
  canScrollLeft.value = left > 0;
  canScrollRight.value = left + width < scrollWidth - 1;
};

const t = (key: string) => i18n.t(key);

defineExpose({
  getSelectedCategory: () => selectedCategory.value,
  setSelectedCategory: (id: string | null) => {
    selectedCategory.value = id;
  },
});
</script>

<style scoped>
.category-nav {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--menoo-surface, #ffffff);
  border-radius: var(--menoo-radius-md, 8px);
  padding: var(--menoo-spacing-2, 16px);
  box-shadow: var(--menoo-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.12));
  margin-bottom: var(--menoo-spacing-2, 16px);
}

.search-box {
  margin-bottom: var(--menoo-spacing-2, 16px);
}

.search-input {
  width: 100%;
  padding: var(--menoo-spacing-1, 8px) var(--menoo-spacing-2, 16px);
  font-size: var(--menoo-font-size-md, 1rem);
  border: 1px solid var(--menoo-border, #e0e0e0);
  border-radius: var(--menoo-radius-md, 8px);
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: var(--menoo-primary, #f0ac28);
  box-shadow: 0 0 0 3px rgba(240, 172, 40, 0.1);
  transform: translateY(-1px);
}

.category-title {
  font-size: var(--menoo-font-size-lg, 1.125rem);
  font-weight: var(--menoo-font-weight-bold, 700);
  margin-bottom: var(--menoo-spacing-2, 16px);
  color: var(--menoo-text-primary, #212121);
  margin-top: 0;
}

.category-scroll-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--menoo-spacing-1, 8px);
  padding: 8px 0;
  margin: -8px -8px;
}

.scroll-button {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--menoo-surface, #ffffff);
  border: 1px solid var(--menoo-border, #e0e0e0);
  border-radius: 50%;
  cursor: pointer;
  font-size: 24px;
  color: var(--menoo-text-primary, #212121);
  box-shadow: var(--menoo-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.12));
  transition: all 0.3s ease;
  z-index: 1;
}

.scroll-button:hover {
  background: var(--menoo-hover, #f5f5f5);
  border-color: var(--menoo-primary, #f0ac28);
  transform: scale(1.1);
}

.scroll-button:active {
  transform: scale(0.9);
}

.category-list {
  flex: 1;
  display: flex;
  gap: 12px;
  overflow: hidden;
  padding: 4px 8px;
}

.category-item {
  flex-shrink: 0;
  margin: 4px 0;
  padding: 0 4px;
}

.category-button {
  white-space: nowrap;
  padding: var(--menoo-spacing-1, 8px) var(--menoo-spacing-2, 16px);
  font-size: var(--menoo-font-size-md, 1rem);
  color: var(--menoo-text-primary, #212121);
  background: var(--menoo-hover, #f5f5f5);
  border: 1px solid var(--menoo-border, #e0e0e0);
  border-radius: var(--menoo-radius-lg, 12px);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  gap: var(--menoo-spacing-1, 8px);
}

.category-button:hover {
  background: var(--menoo-surface, #ffffff);
  border-color: var(--menoo-primary, #f0ac28);
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.category-button.active {
  background: var(--menoo-primary, #f0ac28);
  color: var(--menoo-surface, #ffffff);
  border-color: var(--menoo-primary, #f0ac28);
  font-weight: var(--menoo-font-weight-medium, 500);
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(240, 172, 40, 0.3);
}

.category-count {
  font-size: var(--menoo-font-size-sm, 0.875rem);
  opacity: 0.8;
}

@media (max-width: 768px) {
  .category-nav {
    padding: var(--menoo-spacing-1, 8px);
  }

  .scroll-button {
    display: none;
  }

  .category-list {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .category-list::-webkit-scrollbar {
    display: none;
  }
}
</style>
