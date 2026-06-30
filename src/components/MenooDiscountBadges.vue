<template>
  <div v-if="discountsStore.data.length" class="menoo-discounts">
    <span
      v-for="discount in discountsStore.data"
      :key="discount._id"
      class="menoo-discount-chip"
    >
      <svg
        class="menoo-discount-chip__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
        />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
      <span class="menoo-discount-chip__reward">{{ reward(discount) }}</span>
      <span class="menoo-discount-chip__scope">{{ scope(discount) }}</span>
      <span
        v-if="orderTypes(discount)"
        class="menoo-discount-chip__types"
      >· {{ orderTypes(discount) }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { i18n } from "../services/i18n";
import { useDiscountsStore, useMenusStore, useMetadataStore } from "../stores";
import {
  resolveDiscountScope,
  rewardLabel,
  type PublicDiscount,
} from "../utils/discounts";

const MAX_NAMES = 2;

const discountsStore = useDiscountsStore();
const metadataStore = useMetadataStore();
const menusStore = useMenusStore();

const t = (key: string, replacements?: Record<string, string | number>) =>
  i18n.t(key, replacements);

const reward = (discount: PublicDiscount): string =>
  rewardLabel(discount.reward, metadataStore.currency);

const scope = (discount: PublicDiscount): string => {
  const resolved = resolveDiscountScope(
    discount._id,
    discount.scope,
    menusStore.data,
  );

  if (resolved.kind === "order") {
    return t("cart.discount.badge.scope.order");
  }
  if (!resolved.names.length) {
    return t("cart.discount.badge.scope.items");
  }

  const shown = resolved.names.slice(0, MAX_NAMES);
  const extra = resolved.names.length - shown.length;
  const names =
    extra > 0
      ? t("cart.discount.badge.more", { names: shown.join(", "), count: extra })
      : shown.join(", ");
  const plurality = resolved.names.length > 1 ? "many" : "one";

  return t(`cart.discount.badge.target.${resolved.kind}.${plurality}`, {
    names,
  });
};

const orderTypes = (discount: PublicDiscount): string => {
  const types = discount.conditions?.orderTypes ?? [];
  if (!types.length || types.length >= 3) {
    return "";
  }
  return types
    .map((type) => t(`cart.discount.badge.orderType.${type}`))
    .join(", ");
};
</script>

<style scoped>
.menoo-discounts {
  display: flex;
  flex-wrap: wrap;
  gap: var(--menoo-spacing-1, 8px);
  margin-top: var(--menoo-spacing-2, 16px);
}

.menoo-discount-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  font-size: var(--menoo-font-size-sm, 0.875rem);
  line-height: 1.4;
  color: var(--menoo-primary-dark, #996d1a);
  background: var(--menoo-primary-light, #fdf5e8);
  border-radius: var(--menoo-radius-sm, 4px);
}

.menoo-discount-chip__icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.menoo-discount-chip__reward {
  font-weight: var(--menoo-font-weight-medium, 500);
}

.menoo-discount-chip__types {
  color: var(--menoo-text-secondary, #757575);
}
</style>
