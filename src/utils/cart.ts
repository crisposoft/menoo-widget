import type { CartItem } from "../types";

export interface ApiOrderItem {
  item: string;
  quantity: number;
  note?: string;
  options?: Array<{
    _id: string;
    title: string;
    values: Array<{
      _id: string;
      name: string;
      price: number;
    }>;
  }>;
}

export function transformCartItemForApi(cartItem: CartItem): ApiOrderItem {
  const apiItem: ApiOrderItem = {
    item: cartItem.item._id,
    quantity: cartItem.quantity,
  };

  if (cartItem.note) {
    apiItem.note = cartItem.note;
  }

  if (cartItem.options && cartItem.options.length > 0) {
    apiItem.options = cartItem.options
      .map((selection) => {
        const option = cartItem.item.options?.find(
          (o) => o._id === selection.option
        );

        if (!option) return null;

        const selectedValues = selection.choices
          .map((choiceId) => {
            const choice = option.values.find((c) => c._id === choiceId);
            return choice
              ? {
                  _id: choice._id,
                  name: choice.name,
                  price: choice.price,
                }
              : null;
          })
          .filter((v) => v !== null) as Array<{
          _id: string;
          name: string;
          price: number;
        }>;

        if (selectedValues.length === 0) return null;

        return {
          _id: option._id,
          title: option.title,
          values: selectedValues,
        };
      })
      .filter((o) => o !== null) as Array<{
      _id: string;
      title: string;
      values: Array<{
        _id: string;
        name: string;
        price: number;
      }>;
    }>;
  }

  return apiItem;
}

export function transformCartForApi(cartItems: CartItem[]): ApiOrderItem[] {
  return cartItems.map(transformCartItemForApi);
}
