<template>
  <div v-if="options && options.length > 0" class="options-container">
    <div v-for="option in options" :key="option._id" class="option-group">
      <div class="option-header">
        <span class="option-title">{{ option.title }}</span>
        <span v-if="option.required" class="option-required">
          {{ t("dialog.options.required") }}
        </span>
        <span v-else class="option-optional">
          {{ t("dialog.options.optional") }}
        </span>
      </div>

      <div class="option-subtitle">
        {{
          option.type === "single"
            ? t("dialog.options.singleChoice")
            : t("dialog.options.multipleChoice")
        }}
      </div>

      <!-- Single Choice (Radio) -->
      <div v-if="option.type === 'single'" class="option-choices">
        <label
          v-for="choice in option.values"
          :key="choice._id"
          class="choice-item"
        >
          <input
            type="radio"
            :name="`option-${option._id}`"
            :value="choice._id"
            @change="handleSingleSelection(option, choice._id)"
            class="choice-radio"
          />
          <span class="choice-label">{{ choice.name }}</span>
          <span v-if="choice.price !== 0" class="choice-price">
            {{ choice.price > 0 ? "+" : "" }}{{ formatPrice(choice.price) }}
          </span>
        </label>
      </div>

      <!-- Multiple Choice (Checkbox) -->
      <div v-else class="option-choices">
        <label
          v-for="choice in option.values"
          :key="choice._id"
          class="choice-item"
        >
          <input
            type="checkbox"
            :value="choice._id"
            @change="handleMultipleSelection(option, choice._id, $event)"
            class="choice-checkbox"
          />
          <span class="choice-label">{{ choice.name }}</span>
          <span v-if="choice.price !== 0" class="choice-price">
            {{ choice.price > 0 ? "+" : "" }}{{ formatPrice(choice.price) }}
          </span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useFormatPrice } from "../composables";
import { i18n } from "../services/i18n";
import type { ItemOption, OptionSelection } from "../types";

const props = defineProps<{
  options: ItemOption[];
}>();

// Debug logging
onMounted(() => {
  console.log("[MenooItemOptions] Options received:", props.options);
  console.log(
    "[MenooItemOptions] Raw options:",
    JSON.parse(JSON.stringify(props.options))
  );
  props.options.forEach((opt, idx) => {
    console.log(`[MenooItemOptions] Option ${idx}:`, {
      id: opt._id,
      title: opt.title,
      type: opt.type,
      required: opt.required,
      valuesCount: opt.values?.length || 0,
      values: opt.values,
      rawOption: JSON.parse(JSON.stringify(opt)),
    });
  });
});

const emit = defineEmits<{
  "update:selection": [options: OptionSelection[], valid: boolean];
}>();

const { formatPrice } = useFormatPrice();
const { t } = i18n.global;

const selections = ref<Map<string, Set<string>>>(new Map());

const handleSingleSelection = (option: ItemOption, choiceId: string) => {
  selections.value.set(option._id, new Set([choiceId]));
  emitSelections();
};

const handleMultipleSelection = (
  option: ItemOption,
  choiceId: string,
  event: Event
) => {
  const checked = (event.target as HTMLInputElement).checked;
  const current = selections.value.get(option._id) || new Set();

  if (checked) {
    current.add(choiceId);
  } else {
    current.delete(choiceId);
  }

  selections.value.set(option._id, current);
  emitSelections();
};

const emitSelections = () => {
  const optionSelections: OptionSelection[] = [];

  selections.value.forEach((choices, optionId) => {
    if (choices.size > 0) {
      optionSelections.push({
        option: optionId,
        choices: Array.from(choices),
      });
    }
  });

  // Validate: check all required options are selected
  const valid = props.options
    .filter((opt) => opt.required)
    .every((opt) => {
      const selection = selections.value.get(opt._id);
      return selection && selection.size > 0;
    });

  emit("update:selection", optionSelections, valid);
};

// Validate on mount
watch(
  () => props.options,
  () => {
    selections.value.clear();
    emitSelections();
  },
  { immediate: true }
);
</script>

<style scoped>
.options-container {
  margin-top: var(--menoo-spacing-3, 24px);
  border-top: 1px solid var(--menoo-border, #e0e0e0);
  padding-top: var(--menoo-spacing-3, 24px);
}

.option-group {
  margin-bottom: var(--menoo-spacing-4, 32px);
}

.option-group:last-child {
  margin-bottom: 0;
}

.option-header {
  display: flex;
  align-items: center;
  gap: var(--menoo-spacing-1, 8px);
  margin-bottom: var(--menoo-spacing-1, 8px);
}

.option-title {
  font-size: var(--menoo-font-size-md, 1rem);
  font-weight: var(--menoo-font-weight-medium, 500);
  color: var(--menoo-text-primary, #212121);
}

.option-required {
  padding: 2px 8px;
  background: #fff2d7;
  color: var(--menoo-primary, #f0ac28);
  font-size: var(--menoo-font-size-xs, 0.75rem);
  font-weight: var(--menoo-font-weight-medium, 500);
  border-radius: var(--menoo-radius-sm, 4px);
  text-transform: uppercase;
}

.option-optional {
  padding: 2px 8px;
  background: var(--menoo-surface-variant, #f5f5f5);
  color: var(--menoo-text-secondary, #757575);
  font-size: var(--menoo-font-size-xs, 0.75rem);
  border-radius: var(--menoo-radius-sm, 4px);
}

.option-subtitle {
  font-size: var(--menoo-font-size-sm, 0.875rem);
  color: var(--menoo-text-secondary, #757575);
  margin-bottom: var(--menoo-spacing-2, 16px);
}

.option-choices {
  display: flex;
  flex-direction: column;
  gap: var(--menoo-spacing-2, 16px);
}

.choice-item {
  display: flex;
  align-items: center;
  gap: var(--menoo-spacing-2, 16px);
  padding: var(--menoo-spacing-2, 16px);
  border: 1px solid var(--menoo-border, #e0e0e0);
  border-radius: var(--menoo-radius-md, 8px);
  cursor: pointer;
  transition: all 0.2s;
}

.choice-item:hover {
  border-color: var(--menoo-primary, #f0ac28);
  background: var(--menoo-surface-variant, #f5f5f5);
}

.choice-radio,
.choice-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: var(--menoo-primary, #f0ac28);
}

.choice-label {
  flex: 1;
  font-size: var(--menoo-font-size-md, 1rem);
  color: var(--menoo-text-primary, #212121);
}

.choice-price {
  font-size: var(--menoo-font-size-sm, 0.875rem);
  font-weight: var(--menoo-font-weight-medium, 500);
  color: var(--menoo-primary, #f0ac28);
}

/* Checked state styling */
.choice-item:has(input:checked) {
  border-color: var(--menoo-primary, #f0ac28);
  background: #fff8e6;
}

@media (max-width: 768px) {
  .option-header {
    flex-wrap: wrap;
  }

  .choice-item {
    padding: var(--menoo-spacing-1, 8px) var(--menoo-spacing-2, 16px);
  }
}
</style>
