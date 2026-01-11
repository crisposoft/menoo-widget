import { computed } from "vue";
import {
  useMenusStore,
  useMetadataStore,
  useOrderStore,
  useRestaurantStore,
} from "../stores";
import type { MenuItem, OptionSelection } from "../types";
import { transformCartForApi, type ApiOrderItem } from "../utils/cart";

export function useCart() {
  const orderStore = useOrderStore();

  const cart = computed(() => orderStore.getCart);

  const deliveryFee = computed(() => {
    const restaurantStore = useRestaurantStore();
    const restaurant = restaurantStore.data;
    const mode = orderStore.type;

    if (!restaurant || mode !== "delivery") return 0;

    const threshold = restaurant.delivery.feeThreshold || 0;
    const fee = restaurant.delivery.fee || 0;

    return cart.value.totalPrice >= threshold ? 0 : fee;
  });

  const totalWithDelivery = computed(
    () => cart.value.totalPrice + deliveryFee.value
  );

  const getCartForApi = (): ApiOrderItem[] => {
    return transformCartForApi(cart.value.items);
  };

  const addToCart = (
    item: MenuItem,
    options: OptionSelection[] = [],
    note: string = "",
    quantity: number = 1
  ) => {
    orderStore.addOrder(item, options, note, quantity);
  };

  const updateCartItemQuantity = (index: number, newQuantity: number) => {
    orderStore.updateCartItemQuantity(index, newQuantity);
  };

  const removeFromCart = (index: number) => {
    orderStore.removeOrder(index);
  };

  const clearCart = () => {
    orderStore.clearCart();
  };

  return {
    cart,
    deliveryFee,
    totalWithDelivery,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    getCartForApi,
  };
}

export function useRestaurant() {
  const restaurantStore = useRestaurantStore();
  const menusStore = useMenusStore();

  const restaurant = computed(() => restaurantStore.data);
  const menus = computed(() => menusStore.data);

  return {
    restaurant,
    menus,
  };
}

export function useFormatPrice() {
  const metadataStore = useMetadataStore();

  const formatPrice = (price: number): string => {
    const currency = metadataStore.currency;
    return `${price.toFixed(2)} ${currency}`;
  };

  return {
    formatPrice,
  };
}
