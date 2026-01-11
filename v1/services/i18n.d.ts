declare class I18nService {
    private currentLanguage;
    private translations;
    get global(): {
        t: (key: string, replacements?: Record<string, string | number>) => string;
    };
    t(key: string, replacements?: Record<string, string | number>): string;
    setLanguage(lang: "ro" | "en" | "ru"): Promise<void>;
    getLanguage(): "ro" | "en" | "ru";
    translate(key: string, replacements?: Record<string, string | number>): string;
}
export declare const i18n: I18nService;
export {};
