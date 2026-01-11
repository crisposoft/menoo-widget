type __VLS_Props = {
    stickyOffset?: number;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    categoryNavRef: import('vue').CreateComponentPublicInstanceWithMixins<Readonly<{}> & Readonly<{
        onCategorySelected?: ((payload: {
            categoryId: string | null;
        }) => any) | undefined;
        onCategorySearch?: ((payload: {
            searchTerm: string;
        }) => any) | undefined;
    }>, {
        getSelectedCategory: () => string | null;
        setSelectedCategory: (id: string | null) => void;
    }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
        categorySelected: (payload: {
            categoryId: string | null;
        }) => any;
        categorySearch: (payload: {
            searchTerm: string;
        }) => any;
    }, import('vue').PublicProps, {}, true, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {
        horizontal: import('vue').CreateComponentPublicInstanceWithMixins<Readonly<import('vue').ExtractPropTypes<{
            button: {
                type: BooleanConstructor;
                default: () => boolean;
            };
            buttonBetween: {
                type: BooleanConstructor;
                default: () => boolean;
            };
            scroll: {
                type: BooleanConstructor;
                default: () => boolean;
            };
            displacement: {
                type: NumberConstructor;
                default: () => number;
            };
            snap: {
                type: StringConstructor;
                default: () => string;
            };
        }>> & Readonly<{}>, {}, {
            left: number;
            width: number;
            scrollWidth: number;
            hasPrev: boolean;
            hasNext: boolean;
            debounceId: any;
        }, {}, {
            children(): HTMLCollection;
            findPrevSlot(x: number): Element | undefined;
            findNextSlot(x: number): Element | undefined;
            prev(e: Event): void;
            next(e: Event): void;
            scrollToIndex(i: number): void;
            scrollToLeft(left: number, behavior?: "smooth" | "auto"): void;
            onScroll(): void;
            onScrollDebounce(): Promise<void>;
            refresh(callback?: (data: any) => void): Promise<void>;
            calculate(): {
                left: number;
                width: number;
                scrollWidth: number;
                hasNext: boolean;
                hasPrev: boolean;
            };
        }, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, import('vue').PublicProps, {
            button: boolean;
            buttonBetween: boolean;
            scroll: boolean;
            displacement: number;
            snap: string;
        }, true, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {}, any, import('vue').ComponentProvideOptions, {
            P: {};
            B: {};
            D: {};
            C: {};
            M: {};
            Defaults: {};
        }, Readonly<import('vue').ExtractPropTypes<{
            button: {
                type: BooleanConstructor;
                default: () => boolean;
            };
            buttonBetween: {
                type: BooleanConstructor;
                default: () => boolean;
            };
            scroll: {
                type: BooleanConstructor;
                default: () => boolean;
            };
            displacement: {
                type: NumberConstructor;
                default: () => number;
            };
            snap: {
                type: StringConstructor;
                default: () => string;
            };
        }>> & Readonly<{}>, {}, {
            left: number;
            width: number;
            scrollWidth: number;
            hasPrev: boolean;
            hasNext: boolean;
            debounceId: any;
        }, {}, {
            children(): HTMLCollection;
            findPrevSlot(x: number): Element | undefined;
            findNextSlot(x: number): Element | undefined;
            prev(e: Event): void;
            next(e: Event): void;
            scrollToIndex(i: number): void;
            scrollToLeft(left: number, behavior?: "smooth" | "auto"): void;
            onScroll(): void;
            onScrollDebounce(): Promise<void>;
            refresh(callback?: (data: any) => void): Promise<void>;
            calculate(): {
                left: number;
                width: number;
                scrollWidth: number;
                hasNext: boolean;
                hasPrev: boolean;
            };
        }, {
            button: boolean;
            buttonBetween: boolean;
            scroll: boolean;
            displacement: number;
            snap: string;
        }> | null;
    }, HTMLDivElement, import('vue').ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<{}> & Readonly<{
        onCategorySelected?: ((payload: {
            categoryId: string | null;
        }) => any) | undefined;
        onCategorySearch?: ((payload: {
            searchTerm: string;
        }) => any) | undefined;
    }>, {
        getSelectedCategory: () => string | null;
        setSelectedCategory: (id: string | null) => void;
    }, {}, {}, {}, {}> | null;
    itemGridRef: import('vue').CreateComponentPublicInstanceWithMixins<Readonly<{
        category?: string;
        search?: string;
    }> & Readonly<{
        onActiveCategoryChange?: ((payload: {
            categoryId: string | null;
        }) => any) | undefined;
    }>, {
        scrollToCategory: (categoryId: string) => void;
    }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
        activeCategoryChange: (payload: {
            categoryId: string | null;
        }) => any;
    }, import('vue').PublicProps, {}, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {
        itemGridRef: HTMLDivElement;
    }, HTMLDivElement, import('vue').ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<{
        category?: string;
        search?: string;
    }> & Readonly<{
        onActiveCategoryChange?: ((payload: {
            categoryId: string | null;
        }) => any) | undefined;
    }>, {
        scrollToCategory: (categoryId: string) => void;
    }, {}, {}, {}, {}> | null;
    cartRef: import('vue').CreateComponentPublicInstanceWithMixins<Readonly<{}> & Readonly<{
        onCheckoutClicked?: (() => any) | undefined;
    }>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
        checkoutClicked: () => any;
    }, import('vue').PublicProps, {}, true, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {}, HTMLDivElement, import('vue').ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<{}> & Readonly<{
        onCheckoutClicked?: (() => any) | undefined;
    }>, {}, {}, {}, {}, {}> | null;
}, HTMLDivElement>;
export default _default;
