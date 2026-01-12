import { Restaurant } from '../types';
export declare const useRestaurantStore: import('pinia').StoreDefinition<"restaurant", {
    data: Restaurant | null;
}, {
    getRestaurant: (state: {
        data: {
            _id: string;
            slug?: string | undefined;
            name: string;
            address?: {
                city?: string | undefined;
            } | undefined;
            delivery: {
                fee: number;
                feeThreshold: number;
                types: Array<"delivery" | "pickup">;
                supportedPayments: Array<"COD" | "online">;
                schedule?: {
                    monday?: {
                        open: string;
                        close: string;
                    }[] | undefined;
                    tuesday?: {
                        open: string;
                        close: string;
                    }[] | undefined;
                    wednesday?: {
                        open: string;
                        close: string;
                    }[] | undefined;
                    thursday?: {
                        open: string;
                        close: string;
                    }[] | undefined;
                    friday?: {
                        open: string;
                        close: string;
                    }[] | undefined;
                    saturday?: {
                        open: string;
                        close: string;
                    }[] | undefined;
                    sunday?: {
                        open: string;
                        close: string;
                    }[] | undefined;
                } | undefined;
            };
            schedule?: {
                monday?: {
                    open: string;
                    close: string;
                }[] | undefined;
                tuesday?: {
                    open: string;
                    close: string;
                }[] | undefined;
                wednesday?: {
                    open: string;
                    close: string;
                }[] | undefined;
                thursday?: {
                    open: string;
                    close: string;
                }[] | undefined;
                friday?: {
                    open: string;
                    close: string;
                }[] | undefined;
                saturday?: {
                    open: string;
                    close: string;
                }[] | undefined;
                sunday?: {
                    open: string;
                    close: string;
                }[] | undefined;
            } | undefined;
            status?: "open" | "closed" | undefined;
        } | null;
    } & import('pinia').PiniaCustomStateProperties<{
        data: Restaurant | null;
    }>) => {
        _id: string;
        slug?: string | undefined;
        name: string;
        address?: {
            city?: string | undefined;
        } | undefined;
        delivery: {
            fee: number;
            feeThreshold: number;
            types: Array<"delivery" | "pickup">;
            supportedPayments: Array<"COD" | "online">;
            schedule?: {
                monday?: {
                    open: string;
                    close: string;
                }[] | undefined;
                tuesday?: {
                    open: string;
                    close: string;
                }[] | undefined;
                wednesday?: {
                    open: string;
                    close: string;
                }[] | undefined;
                thursday?: {
                    open: string;
                    close: string;
                }[] | undefined;
                friday?: {
                    open: string;
                    close: string;
                }[] | undefined;
                saturday?: {
                    open: string;
                    close: string;
                }[] | undefined;
                sunday?: {
                    open: string;
                    close: string;
                }[] | undefined;
            } | undefined;
        };
        schedule?: {
            monday?: {
                open: string;
                close: string;
            }[] | undefined;
            tuesday?: {
                open: string;
                close: string;
            }[] | undefined;
            wednesday?: {
                open: string;
                close: string;
            }[] | undefined;
            thursday?: {
                open: string;
                close: string;
            }[] | undefined;
            friday?: {
                open: string;
                close: string;
            }[] | undefined;
            saturday?: {
                open: string;
                close: string;
            }[] | undefined;
            sunday?: {
                open: string;
                close: string;
            }[] | undefined;
        } | undefined;
        status?: "open" | "closed" | undefined;
    } | null;
    isOpen: (state: {
        data: {
            _id: string;
            slug?: string | undefined;
            name: string;
            address?: {
                city?: string | undefined;
            } | undefined;
            delivery: {
                fee: number;
                feeThreshold: number;
                types: Array<"delivery" | "pickup">;
                supportedPayments: Array<"COD" | "online">;
                schedule?: {
                    monday?: {
                        open: string;
                        close: string;
                    }[] | undefined;
                    tuesday?: {
                        open: string;
                        close: string;
                    }[] | undefined;
                    wednesday?: {
                        open: string;
                        close: string;
                    }[] | undefined;
                    thursday?: {
                        open: string;
                        close: string;
                    }[] | undefined;
                    friday?: {
                        open: string;
                        close: string;
                    }[] | undefined;
                    saturday?: {
                        open: string;
                        close: string;
                    }[] | undefined;
                    sunday?: {
                        open: string;
                        close: string;
                    }[] | undefined;
                } | undefined;
            };
            schedule?: {
                monday?: {
                    open: string;
                    close: string;
                }[] | undefined;
                tuesday?: {
                    open: string;
                    close: string;
                }[] | undefined;
                wednesday?: {
                    open: string;
                    close: string;
                }[] | undefined;
                thursday?: {
                    open: string;
                    close: string;
                }[] | undefined;
                friday?: {
                    open: string;
                    close: string;
                }[] | undefined;
                saturday?: {
                    open: string;
                    close: string;
                }[] | undefined;
                sunday?: {
                    open: string;
                    close: string;
                }[] | undefined;
            } | undefined;
            status?: "open" | "closed" | undefined;
        } | null;
    } & import('pinia').PiniaCustomStateProperties<{
        data: Restaurant | null;
    }>) => boolean;
}, {
    updateRestaurant(restaurant: Restaurant): void;
}>;
