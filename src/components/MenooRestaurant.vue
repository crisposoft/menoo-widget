<template>
  <div class="restaurant-header">
    <div class="restaurant-info">
      <div>
        <h1 class="restaurant-name">{{ restaurant?.name || "Loading..." }}</h1>
        <a
          v-if="restaurant?._id"
          :href="menooUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="menoo-link"
        >
          {{ i18n.t("restaurant.seeOnMenoo") }} →
        </a>
        <p v-if="restaurant?.city" class="restaurant-city">
          {{ restaurant.city }}
        </p>
      </div>
      <div v-if="restaurant" class="restaurant-meta">
        <div :class="['restaurant-status', statusClass]">
          <span class="status-dot"></span>
          <span>{{ statusText }}</span>
        </div>
        <p v-if="todayHours" class="restaurant-hours">
          {{ todayHours }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRestaurant } from "../composables";
import { i18n } from "../services/i18n";

const { restaurant } = useRestaurant();

const isOpen = computed(() => restaurant.value?.status === "open");
const statusClass = computed(() =>
  isOpen.value ? "status-open" : "status-closed"
);
const statusText = computed(() =>
  i18n.t(`restaurant.${isOpen.value ? "open" : "closed"}`)
);

const menooUrl = computed(() => {
  if (!restaurant.value) return "#";

  const lang = i18n.getLanguage();
  const city = restaurant.value.city?.toLowerCase().replace(/\s+/g, "-") || "";
  const slug = restaurant.value.slug || restaurant.value._id;

  return `https://menoo.ro/${lang}/${city}/${slug}`;
});

const todayHours = computed(() => {
  if (!restaurant.value?.schedule) return null;

  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ] as const;
  const today = days[new Date().getDay()];
  const schedule =
    restaurant.value.schedule[today as keyof typeof restaurant.value.schedule];

  if (!schedule || schedule.length === 0) {
    return i18n.t("restaurant.closed_today");
  }

  const hours = schedule
    .map(
      (slot: { open: string; close: string }) => `${slot.open} - ${slot.close}`
    )
    .join(", ");

  return `${i18n.t("restaurant.today")}: ${hours}`;
});
</script>

<style scoped>
.restaurant-header {
  background: var(--menoo-surface, #ffffff);
  padding: var(--menoo-spacing-2, 16px);
  border-radius: var(--menoo-radius-md, 8px);
  box-shadow: var(--menoo-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.12));
  margin-bottom: var(--menoo-spacing-2, 16px);
}

.restaurant-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--menoo-spacing-1, 8px);
}

.restaurant-name {
  font-size: var(--menoo-font-size-xl, 1.25rem);
  font-weight: var(--menoo-font-weight-bold, 700);
  color: var(--menoo-text-primary, #212121);
  margin: 0;
}

.restaurant-city {
  font-size: var(--menoo-font-size-sm, 0.875rem);
  color: var(--menoo-text-secondary, #757575);
  margin: 4px 0 0 0;
}

.restaurant-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.restaurant-hours {
  font-size: var(--menoo-font-size-sm, 0.875rem);
  color: var(--menoo-text-secondary, #757575);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.restaurant-hours::before {
  content: "🕐";
  font-size: 14px;
}

.restaurant-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: var(--menoo-radius-lg, 12px);
  font-size: var(--menoo-font-size-sm, 0.875rem);
  font-weight: var(--menoo-font-weight-medium, 500);
}

.status-open {
  background: #e8f5e9;
  color: var(--menoo-success, #388e3c);
}

.status-closed {
  background: #ffebee;
  color: var(--menoo-error, #d32f2f);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.menoo-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--menoo-font-size-sm, 0.875rem);
  font-weight: var(--menoo-font-weight-medium, 500);
  color: white;
  text-decoration: none;
  padding: 6px 12px;
  margin-top: 6px;
  margin-bottom: 4px;
  border-radius: var(--menoo-radius-md, 8px);
  background: var(--menoo-primary, #f0ac28);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  border: none;
  position: relative;
  overflow: hidden;
}

.menoo-link::after {
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

.menoo-link:active::after {
  width: 300px;
  height: 300px;
}

.menoo-link:hover {
  background: var(--menoo-primary-dark, #996d1a);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(240, 172, 40, 0.3);
}

.menoo-link:active {
  transform: translateY(0);
}
</style>
