import type { RestaurantResponse, Schedule } from "../types";

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl =
      baseUrl ||
      import.meta.env.VITE_API_BASE_URL ||
      (import.meta.env.DEV ? "http://localhost:3000" : "https://api.menoo.ro");
  }

  private calculateRestaurantStatus(apiSchedule: any): "open" | "closed" {
    if (!apiSchedule || !apiSchedule.days) return "closed";

    const now = new Date();
    const dayNames = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const currentDay = dayNames[now.getDay()];
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    const todaySchedule = apiSchedule.days[currentDay];
    if (!todaySchedule || !todaySchedule.open) return "closed";

    // Check if current time is within opening hours
    if (
      currentTime >= todaySchedule.start &&
      currentTime <= todaySchedule.end
    ) {
      return "open";
    }

    return "closed";
  }

  private transformSchedule(apiSchedule: any): Schedule | undefined {
    if (!apiSchedule || !apiSchedule.days) return undefined;

    const schedule: Schedule = {};
    const dayNames = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ] as const;

    for (const day of dayNames) {
      const daySchedule = apiSchedule.days[day];
      if (daySchedule && daySchedule.open) {
        schedule[day] = [
          {
            open: daySchedule.start,
            close: daySchedule.end,
          },
        ];
      }
    }

    return schedule;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async fetchRestaurant(
    restaurantId: string,
    language: string = "ro",
    publicApi: boolean = true
  ): Promise<RestaurantResponse> {
    const endpoint = publicApi
      ? `/v1/public/restaurants/${restaurantId}?lang=${language}`
      : `/v1/clients/restaurants/${restaurantId}?lang=${language}`;

    const response = await this.request<{
      restaurant: {
        data: RestaurantResponse["data"];
        metadata: RestaurantResponse["metadata"];
        type?: string;
      };
      menus: RestaurantResponse["menus"];
    }>(endpoint);

    // Transform API response to match expected structure
    const apiMetadata = response.restaurant.metadata as any;
    const transformedSchedule = this.transformSchedule(apiMetadata?.schedule);
    const status = this.calculateRestaurantStatus(apiMetadata?.schedule);

    return {
      data: {
        ...response.restaurant.data,
        schedule: transformedSchedule,
        status,
      },
      metadata: response.restaurant.metadata,
      menus: response.menus,
      isPremium:
        !!response.restaurant.type && response.restaurant.type !== "standard",
    };
  }
}

export const apiClient = new ApiClient();
