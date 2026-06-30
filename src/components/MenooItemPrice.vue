<template>
  <span class="menoo-price">
    <span class="menoo-price__main">{{ mainPriceLabel }}</span>
    <span
      v-if="discountedUnitPrice !== null"
      class="menoo-price__original"
    >{{ formatPrice(item.price) }}</span>
    <span v-if="badgeLabel" class="menoo-price__badge">{{ badgeLabel }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useFormatPrice, useItemDiscount } from "../composables";
import type { MenuItem } from "../types";

const props = defineProps<{ item: MenuItem }>();

const { formatPrice } = useFormatPrice();
const { discountedUnitPrice, badgeLabel } = useItemDiscount(() => props.item);

const mainPriceLabel = computed(() =>
  formatPrice(discountedUnitPrice.value ?? props.item.price),
);
</script>

<style scoped>
.menoo-price {
  display: inline-flex;
  align-items: center;
  gap: var(--menoo-spacing-1, 8px);
  flex-wrap: wrap;
}

.menoo-price__main {
  font-size: var(--menoo-font-size-lg, 1.125rem);
  font-weight: var(--menoo-font-weight-bold, 700);
  color: var(--menoo-primary, #f0ac28);
}

.menoo-price__original {
  font-size: var(--menoo-font-size-sm, 0.875rem);
  color: var(--menoo-text-secondary, #757575);
  text-decoration: line-through;
}

.menoo-price__badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  font-size: var(--menoo-font-size-xs, 0.75rem);
  font-weight: var(--menoo-font-weight-medium, 500);
  line-height: 1.4;
  color: #ffffff;
  background: var(--menoo-primary, #f0ac28);
  border-radius: var(--menoo-radius-sm, 4px);
  white-space: nowrap;
}
</style>
