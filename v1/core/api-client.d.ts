import { RestaurantResponse } from '../types';
export declare class ApiClient {
    private baseUrl;
    constructor(baseUrl?: string);
    private calculateRestaurantStatus;
    private transformSchedule;
    private request;
    fetchRestaurant(restaurantId: string, language?: string, publicApi?: boolean): Promise<RestaurantResponse>;
    setBaseUrl(url: string): void;
}
export declare const apiClient: ApiClient;
