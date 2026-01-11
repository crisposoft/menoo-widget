import { defineStore } from "pinia";
import type { Restaurant } from "../types";

export const useRestaurantStore = defineStore("restaurant", {
  state: () => ({
    data: null as Restaurant | null,
  }),

  getters: {
    getRestaurant: (state) => state.data,
    isOpen: (state) => state.data?.status === "open",
  },

  actions: {
    updateRestaurant(restaurant: Restaurant) {
      this.data = restaurant;
    },
  },
});
