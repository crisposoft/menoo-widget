import { MenuData } from '../types';
export declare const useMenusStore: import('pinia').StoreDefinition<"menus", {
    data: MenuData[];
}, {
    getAvailableMenus: (state: {
        data: {
            _id: string;
            name: string;
            categories: {
                _id: string;
                name: string;
                items: {
                    _id: string;
                    name: string;
                    description?: string | undefined;
                    price: number;
                    images?: {
                        url: string;
                        thumbnailUrl: string;
                    }[] | undefined;
                    options?: {
                        _id: string;
                        title: string;
                        type: "single" | "multiple";
                        required: boolean;
                        values: {
                            _id: string;
                            name: string;
                            price: number;
                        }[];
                    }[] | undefined;
                    category: string;
                    available?: boolean | undefined;
                }[];
                order?: number | undefined;
            }[];
        }[];
    } & import('pinia').PiniaCustomStateProperties<{
        data: MenuData[];
    }>) => {
        _id: string;
        name: string;
        categories: {
            _id: string;
            name: string;
            items: {
                _id: string;
                name: string;
                description?: string | undefined;
                price: number;
                images?: {
                    url: string;
                    thumbnailUrl: string;
                }[] | undefined;
                options?: {
                    _id: string;
                    title: string;
                    type: "single" | "multiple";
                    required: boolean;
                    values: {
                        _id: string;
                        name: string;
                        price: number;
                    }[];
                }[] | undefined;
                category: string;
                available?: boolean | undefined;
            }[];
            order?: number | undefined;
        }[];
    }[];
    getMenu: (state: {
        data: {
            _id: string;
            name: string;
            categories: {
                _id: string;
                name: string;
                items: {
                    _id: string;
                    name: string;
                    description?: string | undefined;
                    price: number;
                    images?: {
                        url: string;
                        thumbnailUrl: string;
                    }[] | undefined;
                    options?: {
                        _id: string;
                        title: string;
                        type: "single" | "multiple";
                        required: boolean;
                        values: {
                            _id: string;
                            name: string;
                            price: number;
                        }[];
                    }[] | undefined;
                    category: string;
                    available?: boolean | undefined;
                }[];
                order?: number | undefined;
            }[];
        }[];
    } & import('pinia').PiniaCustomStateProperties<{
        data: MenuData[];
    }>) => (id: string) => {
        _id: string;
        name: string;
        categories: {
            _id: string;
            name: string;
            items: {
                _id: string;
                name: string;
                description?: string | undefined;
                price: number;
                images?: {
                    url: string;
                    thumbnailUrl: string;
                }[] | undefined;
                options?: {
                    _id: string;
                    title: string;
                    type: "single" | "multiple";
                    required: boolean;
                    values: {
                        _id: string;
                        name: string;
                        price: number;
                    }[];
                }[] | undefined;
                category: string;
                available?: boolean | undefined;
            }[];
            order?: number | undefined;
        }[];
    } | undefined;
    getMenuItems: (state: {
        data: {
            _id: string;
            name: string;
            categories: {
                _id: string;
                name: string;
                items: {
                    _id: string;
                    name: string;
                    description?: string | undefined;
                    price: number;
                    images?: {
                        url: string;
                        thumbnailUrl: string;
                    }[] | undefined;
                    options?: {
                        _id: string;
                        title: string;
                        type: "single" | "multiple";
                        required: boolean;
                        values: {
                            _id: string;
                            name: string;
                            price: number;
                        }[];
                    }[] | undefined;
                    category: string;
                    available?: boolean | undefined;
                }[];
                order?: number | undefined;
            }[];
        }[];
    } & import('pinia').PiniaCustomStateProperties<{
        data: MenuData[];
    }>) => (menuId: string) => any[];
}, {
    updateMenus(menus: MenuData[]): void;
}>;
