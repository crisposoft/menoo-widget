# Menoo Widget SDK

A lightweight, framework-agnostic JavaScript SDK for embedding Menoo restaurant ordering into any website. Built with Vue 3 and Web Components, the widget provides a complete menu browsing experience with cart management, automatically redirecting to the Menoo webapp for secure checkout.

## ✨ Features

- 🍕 **Complete Menu Display** - Restaurant header, horizontal scrolling categories, searchable items grid
- 🛒 **Smart Shopping Cart** - Sticky cart with quantity controls, localStorage persistence across page reloads
- 🌍 **Multi-language** - Romanian, English, Russian with automatic detection
- 📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile devices
- ⚡ **Lightweight** - Only ~114KB gzipped (includes Vue 3 + Pinia)
- 🔧 **Framework Agnostic** - Works with React, Vue, Angular, WordPress, or vanilla JavaScript
- 🎯 **Type-safe** - Built with TypeScript for excellent developer experience
- ♿ **Accessible** - Keyboard navigation and screen reader support
- 🔄 **Seamless Checkout** - Automatic redirect to Menoo webapp for authentication and payment

## 📦 Quick Start

### CDN (Recommended)

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <!-- Widget container -->
    <div id="menoo-widget"></div>

    <!-- Initialize widget -->
    <script type="module">
      import MenooSDK from "https://cdn.menoo.ro/v1/menoo-sdk.js";

      await MenooSDK.init({
        restaurantId: "demo", // Replace with your restaurant ID
        container: "#menoo-widget",
        language: "ro",
      });
    </script>
  </body>
</html>
```

## ⚙️ Configuration

### Basic Configuration

```javascript
await MenooSDK.init({
  restaurantId: "demo", // Required: Your unique restaurant ID
  container: "#menoo-widget", // Optional: CSS selector or HTMLElement (default: '#menoo-widget')
  language: "ro", // Optional: 'ro' | 'en' | 'ru' (default: 'ro')
  stickyOffset: 0, // Optional: Top offset in pixels if you have a fixed header (default: 0)
});
```

### Configuration Options Explained

| Option         | Type                    | Default           | Description                                                                               |
| -------------- | ----------------------- | ----------------- | ----------------------------------------------------------------------------------------- |
| `restaurantId` | `string`                | **Required**      | Your unique restaurant identifier from Menoo dashboard                                    |
| `container`    | `string \| HTMLElement` | `'#menoo-widget'` | DOM element or CSS selector where the widget will render                                  |
| `language`     | `'ro' \| 'en' \| 'ru'`  | `'ro'`            | Interface language for menu and cart                                                      |
| `stickyOffset` | `number`                | `0`               | Top offset in pixels for sticky category nav and cart (useful if you have a fixed header) |

### Example with Fixed Header

If your website has a fixed header (e.g., 80px tall), set `stickyOffset` so the widget's sticky elements position correctly:

```javascript
await MenooSDK.init({
  restaurantId: "demo",
  container: "#menoo-widget",
  stickyOffset: 80, // Height of your fixed header
});
```

## 📚 API Reference

### Initialize Widget

```javascript
await MenooSDK.init(config: WidgetConfig): Promise<void>
```

Initializes the widget with the provided configuration. This method is asynchronous and loads restaurant data from the API.

**Example:**

```javascript
try {
  await MenooSDK.init({
    restaurantId: "demo",
    language: "en",
  });
  console.log("Widget initialized successfully");
} catch (error) {
  console.error("Failed to initialize widget:", error);
}
```

### Get Cart Information

```javascript
// Get complete cart object
const cart = MenooSDK.getCart();
// Returns: { items: CartItem[], totalPrice: number, totalCount: number }

// Get item count
const itemCount = MenooSDK.getItemCount();
// Returns: number (total quantity of all items)

// Get total price (includes delivery fee)
const totalPrice = MenooSDK.getTotalPrice();
// Returns: number (in restaurant's currency)
```

**Example:**

```javascript
const cart = MenooSDK.getCart();
console.log(`Cart has ${cart.totalCount} items`);
console.log(`Total: ${cart.totalPrice} RON`);

cart.items.forEach((item) => {
  console.log(`${item.item.name} x${item.quantity} = ${item.price} RON`);
});
```

### Manage Cart

```javascript
// Clear all items from cart
MenooSDK.clearCart();

// Trigger checkout (redirects to webapp)
MenooSDK.openCheckout();
```

### Cleanup

```javascript
// Destroy widget and cleanup resources
MenooSDK.destroy();
```

Call this when removing the widget from the page to prevent memory leaks.

## 🎨 Customization

### CSS Variables

Customize the widget appearance using CSS custom properties:

```css
#menoo-widget {
  /* Brand Colors */
  --menoo-primary: #f0ac28; /* Primary brand color (buttons, active states) */
  --menoo-success: #388e3c; /* Success messages */
  --menoo-error: #d32f2f; /* Error messages */

  /* Background Colors */
  --menoo-surface: #ffffff; /* Card backgrounds */
  --menoo-background: #f5f5f5; /* Page background */
  --menoo-hover: #f5f5f5; /* Hover states */

  /* Text Colors */
  --menoo-text-primary: #212121; /* Primary text */
  --menoo-text-secondary: #757575; /* Secondary text */

  /* Borders & Shadows */
  --menoo-border: #e0e0e0; /* Border color */
  --menoo-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12); /* Small shadow */

  /* Border Radius */
  --menoo-radius-sm: 4px; /* Small radius */
  --menoo-radius-md: 8px; /* Medium radius */
  --menoo-radius-lg: 12px; /* Large radius */

  /* Spacing */
  --menoo-spacing-1: 8px; /* Small spacing */
  --menoo-spacing-2: 16px; /* Medium spacing */
  --menoo-spacing-3: 24px; /* Large spacing */
  --menoo-spacing-4: 32px; /* Extra large spacing */

  /* Typography */
  --menoo-font-size-sm: 0.875rem; /* Small text */
  --menoo-font-size-md: 1rem; /* Normal text */
  --menoo-font-size-lg: 1.125rem; /* Large text */
  --menoo-font-size-xl: 1.25rem; /* Extra large text */
  --menoo-font-weight-medium: 500; /* Medium weight */
  --menoo-font-weight-bold: 700; /* Bold weight */

  /* Transitions */
  --menoo-transition-fast: 150ms; /* Fast transition */
}
```

**Example: Match Your Brand**

```css
#menoo-widget {
  --menoo-primary: #e91e63; /* Pink theme */
  --menoo-radius-md: 16px; /* More rounded */
  --menoo-font-size-md: 1.125rem; /* Larger text */
}
```

### Container Customization

You can customize the widget container dimensions:

```css
/* Override max-width */
#menoo-widget-container {
  max-width: 1600px;
  margin: 0 auto;
}

/* Add custom padding */
#menoo-widget {
  padding: 20px;
}
```

## 🔗 Integration Examples

### Vanilla HTML/JavaScript

```html
<!DOCTYPE html>
<html lang="ro">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Restaurant Menu</title>
    <style>
      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      #menoo-widget {
        --menoo-primary: #2196f3;
      }
    </style>
  </head>
  <body>
    <div id="menoo-widget"></div>

    <script type="module">
      import("https://cdn.menoo.ro/v1/menoo-sdk.js").then(async (module) => {
        const MenooSDK = module.default;
        await MenooSDK.init({
          restaurantId: "demo",
          language: "ro",
        });
      });
    </script>
  </body>
</html>
```

### React Integration

```tsx
import { useEffect, useRef } from "react";

function RestaurantMenu({ restaurantId, language = "ro" }) {
  const containerRef = useRef(null);
  const sdkRef = useRef<any>(null);

  useEffect(() => {
    const initWidget = async () => {
      const module = await import("https://cdn.menoo.ro/v1/menoo-sdk.js");
      sdkRef.current = module.default;

      await sdkRef.current.init({
        restaurantId,
        container: containerRef.current,
        language,
        stickyOffset: 70,
      });
    };

    initWidget();

    return () => {
      sdkRef.current?.destroy();
    };
  }, [restaurantId, language]);

  return <div ref={containerRef} />;
}

export default RestaurantMenu;
```

### Vue.js Integration

```vue
<template>
  <div ref="widgetContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  restaurantId: { type: String, required: true },
  language: { type: String, default: "ro" },
});

const widgetContainer = ref(null);
let MenooSDK = null;

onMounted(async () => {
  const module = await import("https://cdn.menoo.ro/v1/menoo-sdk.js");
  MenooSDK = module.default;

  await MenooSDK.init({
    restaurantId: props.restaurantId,
    container: widgetContainer.value,
    language: props.language,
  });
});

onUnmounted(() => {
  MenooSDK?.destroy();
});
</script>
```

### WordPress Integration

```php
<?php
/**
 * Add Menoo Widget to WordPress
 * Place this in your theme's functions.php
 */
function add_menoo_widget_scripts() {
    ?>
    <script type="module">
      import('https://cdn.menoo.ro/v1/menoo-sdk.js').then(async (module) => {
        const MenooSDK = module.default;
        await MenooSDK.init({
          restaurantId: '<?php echo esc_js(get_option('menoo_restaurant_id')); ?>',
          container: '#menoo-widget',
          language: '<?php echo substr(get_locale(), 0, 2); ?>'
        });
      });
    </script>
    <?php
}
add_action('wp_footer', 'add_menoo_widget_scripts');

/**
 * Shortcode: [menoo_menu]
 */
function menoo_menu_shortcode($atts) {
    $atts = shortcode_atts(array(
        'restaurant_id' => get_option('menoo_restaurant_id'),
    ), $atts);

    return '<div id="menoo-widget" data-restaurant-id="' . esc_attr($atts['restaurant_id']) . '"></div>';
}
add_shortcode('menoo_menu', 'menoo_menu_shortcode');
```

### Next.js Integration

```tsx
"use client";

import { useEffect, useRef } from "react";

interface MenuWidgetProps {
  restaurantId: string;
  language?: "ro" | "en" | "ru";
}

export default function MenuWidget({
  restaurantId,
  language = "ro",
}: MenuWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sdkRef = useRef<any>(null);

  useEffect(() => {
    const initWidget = async () => {
      const module = await import("https://cdn.menoo.ro/v1/menoo-sdk.js");
      sdkRef.current = module.default;

      await sdkRef.current.init({
        restaurantId,
        container: containerRef.current,
        language,
      });
    };

    initWidget();

    return () => {
      sdkRef.current?.destroy();
    };
  }, [restaurantId, language]);

  return <div ref={containerRef} />;
}
```

## 📱 Responsive Behavior

The widget automatically adapts to different screen sizes:

### Desktop (> 1024px)

- Horizontal scrolling category navigation
- Sticky cart on the right side
- All categories visible
- Full menu display

### Tablet (768px - 1024px)

- Category navigation at the top
- Sticky cart
- Optimized spacing

### Mobile (< 768px)

- Cart collapses to bottom
- Category navigation becomes scrollable
- Touch-optimized interactions
- Vertical stacking

## 🎯 Events

The widget emits custom events that you can listen to:

### `menoo:ready`

Fired when the widget is fully initialized and ready to use.

```javascript
window.addEventListener("menoo:ready", (event) => {
  console.log("Restaurant ID:", event.detail.restaurantId);
  console.log("Widget is ready!");
});
```

### `menoo:cart-changed`

Fired whenever the cart contents change (item added, removed, or quantity updated).

```javascript
window.addEventListener("menoo:cart-changed", (event) => {
  const cart = event.detail.cart;
  console.log(`Cart now has ${cart.totalCount} items`);
  console.log(`Total: ${cart.totalPrice} RON`);

  // Update your custom UI
  document.getElementById("cart-count").textContent = cart.totalCount;
});
```

### `menoo:item-added`

Fired when an item is added to the cart.

```javascript
window.addEventListener("menoo:item-added", (event) => {
  const cartItem = event.detail.item;
  console.log(`Added: ${cartItem.item.name} x${cartItem.quantity}`);

  // Show notification
  showNotification(`${cartItem.item.name} added to cart!`);
});
```

### `menoo:item-removed`

Fired when an item is removed from the cart.

```javascript
window.addEventListener("menoo:item-removed", (event) => {
  const cartItem = event.detail.item;
  console.log(`Removed: ${cartItem.item.name}`);
});
```

### `menoo:checkout-started`

Fired when the user clicks the checkout button.

```javascript
window.addEventListener("menoo:checkout-started", (event) => {
  const cart = event.detail.cart;
  console.log("Checkout started with cart:", cart);

  // Track analytics
  gtag("event", "begin_checkout", {
    value: cart.totalPrice,
    items: cart.items.length,
  });
});
```

### `menoo:error`

Fired when an error occurs (e.g., failed to load restaurant data).

```javascript
window.addEventListener("menoo:error", (event) => {
  console.error("Widget error:", event.detail.error);
  console.error("Context:", event.detail.context);

  // Show user-friendly error message
  showError("Failed to load menu. Please try again later.");
});
```

## 🐛 Troubleshooting

### Widget doesn't appear

**Check the console** for error messages. Common issues:

1. **Invalid restaurant ID**

   ```
   Error: Restaurant not found
   ```

   Solution: Verify your `restaurantId` is correct

2. **Container not found**

   ```
   Error: Container element not found
   ```

   Solution: Make sure the container element exists before calling `init()`

3. **CORS errors**
   Solution: Make sure you're loading the widget from a web server (not `file://`)

### Cart not persisting

The cart uses localStorage. Check:

1. Browser has localStorage enabled
2. No browser extensions blocking localStorage
3. Not in private/incognito mode (some browsers restrict storage)

### Sticky positioning not working

If you have a fixed header, set `stickyOffset`:

```javascript
await MenooSDK.init({
  restaurantId: "demo",
  stickyOffset: 80, // Height of your fixed header
});
```

### Styles conflict with my website

The widget uses CSS custom properties and scoped styles. If you have conflicts:

```css
/* Isolate widget styles */
#menoo-widget {
  all: initial; /* Reset inherited styles */
}

/* Then reapply widget variables */
#menoo-widget {
  --menoo-primary: #your-color;
}
```

### Images not loading

Images are loaded from the Menoo CDN. Check:

1. Network tab for failed requests
2. Content Security Policy (CSP) allows images from `cdn.menoo.ro`

Add to your CSP if needed:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="img-src 'self' https://cdn.menoo.ro;"
/>
```

## 🌐 Browser Support

| Browser        | Minimum Version |
| -------------- | --------------- |
| Chrome/Edge    | 67+             |
| Firefox        | 63+             |
| Safari         | 10.1+           |
| iOS Safari     | 10.3+           |
| Android Chrome | 67+             |

**Requirements:**

- ES Modules support
- Custom Elements (Web Components)
- CSS Custom Properties
- Fetch API

## 📊 Performance

- **Bundle Size**: ~114KB gzipped (includes Vue 3 runtime + Pinia)
- Use CDN for faster delivery with automatic caching
- Preconnect to API domain for better performance:
  ```html
  <link rel="preconnect" href="https://api.menoo.ro" />
  ```

## 🔒 Security

- All API communication over HTTPS
- No sensitive data stored in widget (authentication happens in webapp)
- Cart data stored securely in localStorage

## 📄 License

MIT © Menoo

## � What's Next?

After users add items to the cart and click checkout, they'll be redirected to the Menoo webapp for authentication and payment. The complete ordering flow is handled by the platform.

---

## 💬 Support

- **Email**: contact@menoo.ro
- **Documentation**: https://menoo.ro/docs
- **GitHub**: https://github.com/crisposoft/menoo-widget

---

Made with ❤️ by [Menoo](https://menoo.ro)
