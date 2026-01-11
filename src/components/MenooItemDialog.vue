<template>
  <Transition name="dialog-fade" appear>
    <div v-if="show" class="dialog-overlay" @click.self="handleClose">
      <Transition name="dialog-slide">
        <div v-if="show" class="dialog-container">
          <button class="dialog-close" @click="handleClose">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div class="dialog-content">
            <!-- Item Image -->
            <div
              v-if="item.images && item.images.length > 0"
              class="dialog-image"
            >
              <img :src="item.images[0].url" :alt="item.name" />
            </div>

            <!-- Item Details -->
            <div class="dialog-body">
              <h2 class="dialog-title">{{ item.name }}</h2>
              <p v-if="item.description" class="dialog-description">
                {{ item.description }}
              </p>

              <!-- Options Selection -->
              <MenooItemOptions
                v-if="item.options && item.options.length > 0"
                :options="item.options"
                @update:selection="handleOptionsChange"
              />

              <!-- Note Field -->
              <div class="dialog-note">
                <label class="note-label">{{ t("dialog.note") }}</label>
                <textarea
                  v-model="note"
                  class="note-input"
                  :placeholder="t('dialog.notePlaceholder')"
                  rows="2"
                ></textarea>
              </div>

              <!-- Action Buttons -->
              <div class="dialog-actions">
                <div class="quantity-controls">
                  <button
                    class="qty-btn"
                    :disabled="quantity <= 1"
                    @click="quantity--"
                  >
                    −
                  </button>
                  <span class="quantity-value">{{ quantity }}</span>
                  <button class="qty-btn" @click="quantity++">+</button>
                </div>

                <button
                  class="add-to-cart-btn"
                  :disabled="!isValid"
                  @click="handleAddToCart"
                >
                  {{
                    t("dialog.addToCart", {
                      price: formatPrice(totalPrice),
                    })
                  }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useCart, useFormatPrice } from "../composables";
import { i18n } from "../services/i18n";
import type { MenuItem, OptionSelection } from "../types";
import MenooItemOptions from "./MenooItemOptions.vue";

const props = defineProps<{
  show: boolean;
  item: MenuItem;
}>();

const emit = defineEmits<{
  close: [];
}>();

const { addToCart } = useCart();
const { formatPrice } = useFormatPrice();
const { t } = i18n.global;

const quantity = ref(1);
const note = ref("");
const selectedOptions = ref<OptionSelection[]>([]);
const optionsValid = ref(true);

// Calculate total price including options
const totalPrice = computed(() => {
  let price = props.item.price;

  // Add options prices
  if (selectedOptions.value.length > 0 && props.item.options) {
    selectedOptions.value.forEach((selection) => {
      const option = props.item.options?.find(
        (o) => o._id === selection.option
      );
      if (option) {
        selection.choices.forEach((choiceId) => {
          const choice = option.values.find((c) => c._id === choiceId);
          if (choice) {
            price += choice.price;
          }
        });
      }
    });
  }

  return price * quantity.value;
});

// Validate options
const isValid = computed(() => {
  if (!props.item.options || props.item.options.length === 0) {
    return true;
  }

  // Check all required options are selected
  return props.item.options
    .filter((opt) => opt.required)
    .every((opt) => {
      const selection = selectedOptions.value.find((s) => s.option === opt._id);
      return selection && selection.choices.length > 0;
    });
});

const handleOptionsChange = (options: OptionSelection[], valid: boolean) => {
  selectedOptions.value = options;
  optionsValid.value = valid;
};

const handleAddToCart = () => {
  if (!isValid.value) return;

  addToCart(props.item, selectedOptions.value, note.value, quantity.value);
  handleClose();
};

const handleClose = () => {
  // Emit as custom event for Web Components
  const event = new CustomEvent("close", {
    bubbles: true,
    composed: true,
  });

  // Get the host element (the custom element itself)
  const host = document.querySelector("menoo-item-dialog") as any;
  if (host) {
    host.dispatchEvent(event);
  }

  // Also emit for Vue (in case used in Vue context)
  emit("close");

  // Reset state
  quantity.value = 1;
  note.value = "";
  selectedOptions.value = [];
};

// Reset state when item changes
watch(
  () => props.item,
  () => {
    quantity.value = 1;
    note.value = "";
    selectedOptions.value = [];
  }
);
</script>

<style scoped>
/* Overlay fade transition */
.dialog-fade-enter-active {
  transition: opacity 0.3s ease;
}

.dialog-fade-leave-active {
  transition: opacity 0.25s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

/* Dialog container slide transition */
.dialog-slide-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dialog-slide-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.6, 1);
}

.dialog-slide-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}

.dialog-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: var(--menoo-spacing-2, 16px);
  overflow-y: auto;
}

.dialog-container {
  background: var(--menoo-surface, #ffffff);
  border-radius: var(--menoo-radius-lg, 12px);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
}

.dialog-close {
  position: absolute;
  top: var(--menoo-spacing-2, 16px);
  right: var(--menoo-spacing-2, 16px);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  transition: transform 0.2s;
}

.dialog-close:hover {
  transform: scale(1.1);
}

.dialog-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
}

.dialog-image {
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.dialog-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dialog-body {
  padding: var(--menoo-spacing-3, 24px);
  box-sizing: border-box;
  width: 100%;
}

.dialog-title {
  font-size: var(--menoo-font-size-xl, 1.5rem);
  font-weight: var(--menoo-font-weight-bold, 700);
  margin: 0 0 var(--menoo-spacing-2, 16px) 0;
  color: var(--menoo-text-primary, #212121);
}

.dialog-description {
  font-size: var(--menoo-font-size-md, 1rem);
  color: var(--menoo-text-secondary, #757575);
  line-height: 1.5;
  margin-bottom: var(--menoo-spacing-3, 24px);
}

.dialog-note {
  margin-top: var(--menoo-spacing-3, 24px);
}

.note-label {
  display: block;
  font-size: var(--menoo-font-size-sm, 0.875rem);
  font-weight: var(--menoo-font-weight-medium, 500);
  margin-bottom: var(--menoo-spacing-1, 8px);
  color: var(--menoo-text-primary, #212121);
}

.note-input {
  width: 100%;
  padding: var(--menoo-spacing-2, 16px);
  border: 1px solid var(--menoo-border, #e0e0e0);
  border-radius: var(--menoo-radius-md, 8px);
  font-size: var(--menoo-font-size-md, 1rem);
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.note-input:focus {
  outline: none;
  border-color: var(--menoo-primary, #f0ac28);
  transition: border-color 0.2s ease;
}

.dialog-actions {
  display: flex;
  align-items: center;
  gap: var(--menoo-spacing-2, 16px);
  margin-top: var(--menoo-spacing-3, 24px);
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: var(--menoo-spacing-2, 16px);
  padding: var(--menoo-spacing-1, 8px) var(--menoo-spacing-2, 16px);
  border: 1px solid var(--menoo-border, #e0e0e0);
  border-radius: var(--menoo-radius-md, 8px);
}

.qty-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--menoo-primary, #f0ac28);
  background: transparent;
  color: var(--menoo-primary, #f0ac28);
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.qty-btn:not(:disabled):hover {
  background: var(--menoo-primary, #f0ac28);
  color: white;
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.quantity-value {
  min-width: 24px;
  text-align: center;
  font-weight: var(--menoo-font-weight-medium, 500);
}

.add-to-cart-btn {
  flex: 1;
  padding: var(--menoo-spacing-2, 16px) var(--menoo-spacing-3, 24px);
  background: var(--menoo-primary, #f0ac28);
  color: white;
  border: none;
  border-radius: var(--menoo-radius-md, 8px);
  font-size: var(--menoo-font-size-md, 1rem);
  font-weight: var(--menoo-font-weight-medium, 500);
  cursor: pointer;
  transition: all 0.2s;
}

.add-to-cart-btn:not(:disabled):hover {
  background: var(--menoo-primary-dark, #d89a1f);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(240, 172, 40, 0.3);
}

.add-to-cart-btn:not(:disabled):active {
  transform: translateY(0);
}

.add-to-cart-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .dialog-overlay {
    padding: 0;
    align-items: flex-end;
  }

  .dialog-container {
    max-width: 100%;
    max-height: 95vh;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .dialog-image {
    height: 200px;
  }

  .dialog-actions {
    flex-direction: column;
  }

  .quantity-controls {
    width: 100%;
    justify-content: center;
  }

  .add-to-cart-btn {
    width: 100%;
  }
}
</style>
