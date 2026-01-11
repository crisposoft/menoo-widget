import { defineStore } from "pinia";
import type { MenuData } from "../types";

export const useMenusStore = defineStore("menus", {
  state: () => ({
    data: [] as MenuData[],
  }),

  getters: {
    getAvailableMenus: (state) => state.data,

    getMenu: (state) => (id: string) => {
      return state.data.find((menu) => menu._id === id);
    },

    getMenuItems: (state) => (menuId: string) => {
      const menu = state.data.find((m) => m._id === menuId);
      if (!menu) return [];

      const items: any[] = [];
      menu.categories.forEach((category) => {
        items.push(
          ...category.items.map((item) => ({ ...item, category: category._id }))
        );
      });
      return items;
    },
  },

  actions: {
    updateMenus(menus: MenuData[]) {
      this.data = menus;
    },
  },
});
