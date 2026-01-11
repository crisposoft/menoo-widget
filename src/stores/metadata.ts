import { defineStore } from "pinia";
import type { Metadata } from "../types";

export const useMetadataStore = defineStore("metadata", {
  state: () => ({
    data: null as Metadata | null,
    language: "ro" as "ro" | "en" | "ru",
  }),

  getters: {
    currency: (state) => state.data?.currency || "RON",
    showPrices: (state) => state.data?.showPrices ?? true,
  },

  actions: {
    updateMetadata(metadata: Metadata | null | undefined) {
      if (!metadata) {
        console.warn("Metadata is undefined, using defaults");
        return;
      }
      this.data = metadata;
      if (metadata.language && ["ro", "en", "ru"].includes(metadata.language)) {
        this.language = metadata.language as "ro" | "en" | "ru";
      }
    },

    setLanguage(language: "ro" | "en" | "ru") {
      this.language = language;
    },
  },
});
