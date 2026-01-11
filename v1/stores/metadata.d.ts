import { Metadata } from '../types';
export declare const useMetadataStore: import('pinia').StoreDefinition<"metadata", {
    data: Metadata | null;
    language: "ro" | "en" | "ru";
}, {
    currency: (state: {
        data: {
            currency: string;
            language: string;
            showPrices: boolean;
            useDelivery: boolean;
        } | null;
        language: "ro" | "en" | "ru";
    } & import('pinia').PiniaCustomStateProperties<{
        data: Metadata | null;
        language: "ro" | "en" | "ru";
    }>) => string;
    showPrices: (state: {
        data: {
            currency: string;
            language: string;
            showPrices: boolean;
            useDelivery: boolean;
        } | null;
        language: "ro" | "en" | "ru";
    } & import('pinia').PiniaCustomStateProperties<{
        data: Metadata | null;
        language: "ro" | "en" | "ru";
    }>) => boolean;
}, {
    updateMetadata(metadata: Metadata | null | undefined): void;
    setLanguage(language: "ro" | "en" | "ru"): void;
}>;
