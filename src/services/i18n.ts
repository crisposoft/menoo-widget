import enTranslations from "../locales/en.json";
import roTranslations from "../locales/ro.json";
import ruTranslations from "../locales/ru.json";

type Translations = {
  [key: string]: string | Translations;
};

type LanguageData = {
  [lang: string]: Translations;
};

class I18nService {
  private currentLanguage: "ro" | "en" | "ru" = "ro";
  private translations: LanguageData = {
    en: enTranslations,
    ro: roTranslations,
    ru: ruTranslations,
  };

  // Add global property for compatibility
  get global() {
    return {
      t: this.translate.bind(this),
    };
  }

  // Alias for translate
  t(key: string, replacements?: Record<string, string | number>): string {
    return this.translate(key, replacements);
  }

  async setLanguage(lang: "ro" | "en" | "ru"): Promise<void> {
    this.currentLanguage = lang;
  }

  getLanguage(): "ro" | "en" | "ru" {
    return this.currentLanguage;
  }

  translate(
    key: string,
    replacements?: Record<string, string | number>
  ): string {
    const keys = key.split(".");
    let value: any = this.translations[this.currentLanguage];

    // Navigate through nested keys
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found
        if (this.currentLanguage !== "en") {
          value = this.translations["en"];
          for (const k2 of keys) {
            if (value && typeof value === "object" && k2 in value) {
              value = value[k2];
            } else {
              return key; // Return key if not found in fallback
            }
          }
          break;
        }
        return key; // Return key if translation not found
      }
    }

    if (typeof value !== "string") {
      return key;
    }

    // Replace placeholders
    if (replacements) {
      return value.replace(/\{(\w+)\}/g, (match, placeholder) => {
        return placeholder in replacements
          ? String(replacements[placeholder])
          : match;
      });
    }

    return value;
  }
}

export const i18n = new I18nService();
