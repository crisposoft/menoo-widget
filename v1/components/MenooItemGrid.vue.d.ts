type __VLS_Props = {
    category?: string;
    search?: string;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {
    scrollToCategory: (categoryId: string) => void;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    activeCategoryChange: (payload: {
        categoryId: string | null;
    }) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onActiveCategoryChange?: ((payload: {
        categoryId: string | null;
    }) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    itemGridRef: HTMLDivElement;
}, HTMLDivElement>;
export default _default;
