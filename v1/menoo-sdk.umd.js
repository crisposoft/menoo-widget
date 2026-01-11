(function(global2, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, factory(global2.MenooSDK = {}));
})(this, (function(exports2) {
  "use strict";var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  class ApiClient {
    constructor(baseUrl) {
      __publicField(this, "baseUrl");
      this.baseUrl = baseUrl || void 0 || "https://api.menoo.ro";
    }
    calculateRestaurantStatus(apiSchedule) {
      if (!apiSchedule || !apiSchedule.days) return "closed";
      const now = /* @__PURE__ */ new Date();
      const dayNames = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"
      ];
      const currentDay = dayNames[now.getDay()];
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;
      const todaySchedule = apiSchedule.days[currentDay];
      if (!todaySchedule || !todaySchedule.open) return "closed";
      if (currentTime >= todaySchedule.start && currentTime <= todaySchedule.end) {
        return "open";
      }
      return "closed";
    }
    transformSchedule(apiSchedule) {
      if (!apiSchedule || !apiSchedule.days) return void 0;
      const schedule = {};
      const dayNames = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday"
      ];
      for (const day of dayNames) {
        const daySchedule = apiSchedule.days[day];
        if (daySchedule && daySchedule.open) {
          schedule[day] = [
            {
              open: daySchedule.start,
              close: daySchedule.end
            }
          ];
        }
      }
      return schedule;
    }
    async request(endpoint, options = {}) {
      const headers = {
        "Content-Type": "application/json",
        ...options.headers
      };
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: response.statusText
        }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }
      return response.json();
    }
    async fetchRestaurant(restaurantId, language = "ro", publicApi = true) {
      const endpoint = publicApi ? `/v1/public/restaurants/${restaurantId}?lang=${language}` : `/v1/clients/restaurants/${restaurantId}?lang=${language}`;
      const response = await this.request(endpoint);
      const apiMetadata = response.restaurant.metadata;
      const transformedSchedule = this.transformSchedule(apiMetadata == null ? void 0 : apiMetadata.schedule);
      const status = this.calculateRestaurantStatus(apiMetadata == null ? void 0 : apiMetadata.schedule);
      return {
        data: {
          ...response.restaurant.data,
          schedule: transformedSchedule,
          status
        },
        metadata: response.restaurant.metadata,
        menus: response.menus,
        isPremium: !!response.restaurant.type && response.restaurant.type !== "standard"
      };
    }
  }
  const apiClient = new ApiClient();
  const cart$2 = { "title": "Your cart", "empty": "Your cart is empty", "addToCart": "Add to cart", "add": "Add", "remove": "Remove", "subtotal": "Products subtotal", "deliveryFee": "Delivery fee", "deliveryFreeOver": "Free delivery for orders over {amount}", "total": "Total", "checkout": "Continue to Checkout", "free": "Free" };
  const menu$2 = { "search": "Search", "categories": "Categories", "noResults": "No items found" };
  const item$2 = { "addToCart": "Add to cart", "options": "Options", "required": "Required", "optional": "Optional", "notes": "Special notes", "notesPlaceholder": "Add a note to your order...", "quantity": "Quantity" };
  const dialog$2 = { "note": "Special requests", "notePlaceholder": "Add a note for this item (e.g., no onions)...", "addToCart": "Add to cart • {price}", "options": { "required": "Required", "optional": "Optional", "singleChoice": "Choose one", "multipleChoice": "Choose multiple" } };
  const restaurant$2 = { "open": "Open", "closed": "Closed", "today": "Today", "closed_today": "Closed today", "delivery": "Delivery", "pickup": "Pickup" };
  const errors$2 = { "fetchError": "Failed to load restaurant data" };
  const enTranslations = {
    cart: cart$2,
    menu: menu$2,
    item: item$2,
    dialog: dialog$2,
    restaurant: restaurant$2,
    errors: errors$2
  };
  const cart$1 = { "title": "Coșul tău", "empty": "Coșul tău este gol", "addToCart": "Adaugă în coș", "add": "Adaugă", "remove": "Elimină", "subtotal": "Subtotal produse", "deliveryFee": "Cost livrare", "deliveryFreeOver": "Livrare gratuită pentru comenzi peste {amount}", "total": "Total", "checkout": "Continuă la finalizare", "free": "Gratuit" };
  const menu$1 = { "search": "Caută", "categories": "Categorii", "noResults": "Nu s-au găsit produse" };
  const item$1 = { "addToCart": "Adaugă în coș", "options": "Opțiuni", "required": "Obligatoriu", "optional": "Opțional", "notes": "Mențiuni speciale", "notesPlaceholder": "Adaugă o mențiune la comandă...", "quantity": "Cantitate" };
  const dialog$1 = { "note": "Solicitări speciale", "notePlaceholder": "Adaugă o notă pentru acest produs (ex: fără ceapă)...", "addToCart": "Adaugă în coș • {price}", "options": { "required": "Obligatoriu", "optional": "Opțional", "singleChoice": "Alege unul", "multipleChoice": "Alege multiple" } };
  const restaurant$1 = { "open": "Deschis", "closed": "Închis", "today": "Astăzi", "closed_today": "Închis astăzi", "delivery": "Livrare", "pickup": "Ridicare personală" };
  const errors$1 = { "fetchError": "Nu s-au putut încărca datele restaurantului" };
  const roTranslations = {
    cart: cart$1,
    menu: menu$1,
    item: item$1,
    dialog: dialog$1,
    restaurant: restaurant$1,
    errors: errors$1
  };
  const cart = { "title": "Ваша корзина", "empty": "Ваша корзина пуста", "addToCart": "Добавить в корзину", "add": "Добавить", "remove": "Удалить", "subtotal": "Промежуточный итог", "deliveryFee": "Стоимость доставки", "deliveryFreeOver": "Бесплатная доставка при заказе от {amount}", "total": "Итого", "checkout": "Перейти к оформлению", "free": "Бесплатно" };
  const menu = { "search": "Поиск", "categories": "Категории", "noResults": "Товары не найдены" };
  const item = { "addToCart": "Добавить в корзину", "options": "Опции", "required": "Обязательно", "optional": "Необязательно", "notes": "Особые примечания", "notesPlaceholder": "Добавить примечание к заказу...", "quantity": "Количество" };
  const dialog = { "note": "Специальные запросы", "notePlaceholder": "Добавьте замечание для этого товара (например, без лука)...", "addToCart": "Добавить в корзину • {price}", "options": { "required": "Обязательно", "optional": "Необязательно", "singleChoice": "Выберите один", "multipleChoice": "Выберите несколько" } };
  const restaurant = { "open": "Открыто", "closed": "Закрыто", "today": "Сегодня", "closed_today": "Сегодня закрыто", "delivery": "Доставка", "pickup": "Самовывоз" };
  const errors = { "fetchError": "Не удалось загрузить данные ресторана" };
  const ruTranslations = {
    cart,
    menu,
    item,
    dialog,
    restaurant,
    errors
  };
  class I18nService {
    constructor() {
      __publicField(this, "currentLanguage", "ro");
      __publicField(this, "translations", {
        en: enTranslations,
        ro: roTranslations,
        ru: ruTranslations
      });
    }
    // Add global property for compatibility
    get global() {
      return {
        t: this.translate.bind(this)
      };
    }
    // Alias for translate
    t(key, replacements) {
      return this.translate(key, replacements);
    }
    async setLanguage(lang) {
      this.currentLanguage = lang;
    }
    getLanguage() {
      return this.currentLanguage;
    }
    translate(key, replacements) {
      const keys = key.split(".");
      let value = this.translations[this.currentLanguage];
      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          if (this.currentLanguage !== "en") {
            value = this.translations["en"];
            for (const k2 of keys) {
              if (value && typeof value === "object" && k2 in value) {
                value = value[k2];
              } else {
                return key;
              }
            }
            break;
          }
          return key;
        }
      }
      if (typeof value !== "string") {
        return key;
      }
      if (replacements) {
        return value.replace(/\{(\w+)\}/g, (match, placeholder) => {
          return placeholder in replacements ? String(replacements[placeholder]) : match;
        });
      }
      return value;
    }
  }
  const i18n = new I18nService();
  /**
  * @vue/shared v3.5.25
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  // @__NO_SIDE_EFFECTS__
  function makeMap(str) {
    const map = /* @__PURE__ */ Object.create(null);
    for (const key of str.split(",")) map[key] = 1;
    return (val) => val in map;
  }
  const EMPTY_OBJ = {};
  const EMPTY_ARR = [];
  const NOOP = () => {
  };
  const NO = () => false;
  const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
  (key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
  const isModelListener = (key) => key.startsWith("onUpdate:");
  const extend = Object.assign;
  const remove = (arr, el) => {
    const i = arr.indexOf(el);
    if (i > -1) {
      arr.splice(i, 1);
    }
  };
  const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
  const isArray = Array.isArray;
  const isMap = (val) => toTypeString(val) === "[object Map]";
  const isSet = (val) => toTypeString(val) === "[object Set]";
  const isFunction = (val) => typeof val === "function";
  const isString = (val) => typeof val === "string";
  const isSymbol = (val) => typeof val === "symbol";
  const isObject = (val) => val !== null && typeof val === "object";
  const isPromise = (val) => {
    return (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
  };
  const objectToString = Object.prototype.toString;
  const toTypeString = (value) => objectToString.call(value);
  const toRawType = (value) => {
    return toTypeString(value).slice(8, -1);
  };
  const isPlainObject$1 = (val) => toTypeString(val) === "[object Object]";
  const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
  const isReservedProp = /* @__PURE__ */ makeMap(
    // the leading comma is intentional so empty string "" is also included
    ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
  );
  const cacheStringFunction = (fn) => {
    const cache = /* @__PURE__ */ Object.create(null);
    return ((str) => {
      const hit = cache[str];
      return hit || (cache[str] = fn(str));
    });
  };
  const camelizeRE = /-\w/g;
  const camelize = cacheStringFunction(
    (str) => {
      return str.replace(camelizeRE, (c) => c.slice(1).toUpperCase());
    }
  );
  const hyphenateRE = /\B([A-Z])/g;
  const hyphenate = cacheStringFunction(
    (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
  );
  const capitalize = cacheStringFunction((str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  });
  const toHandlerKey = cacheStringFunction(
    (str) => {
      const s = str ? `on${capitalize(str)}` : ``;
      return s;
    }
  );
  const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
  const invokeArrayFns = (fns, ...arg) => {
    for (let i = 0; i < fns.length; i++) {
      fns[i](...arg);
    }
  };
  const def = (obj, key, value, writable = false) => {
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: false,
      writable,
      value
    });
  };
  const looseToNumber = (val) => {
    const n = parseFloat(val);
    return isNaN(n) ? val : n;
  };
  const toNumber = (val) => {
    const n = isString(val) ? Number(val) : NaN;
    return isNaN(n) ? val : n;
  };
  let _globalThis;
  const getGlobalThis = () => {
    return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
  };
  function normalizeStyle(value) {
    if (isArray(value)) {
      const res = {};
      for (let i = 0; i < value.length; i++) {
        const item2 = value[i];
        const normalized = isString(item2) ? parseStringStyle(item2) : normalizeStyle(item2);
        if (normalized) {
          for (const key in normalized) {
            res[key] = normalized[key];
          }
        }
      }
      return res;
    } else if (isString(value) || isObject(value)) {
      return value;
    }
  }
  const listDelimiterRE = /;(?![^(]*\))/g;
  const propertyDelimiterRE = /:([^]+)/;
  const styleCommentRE = /\/\*[^]*?\*\//g;
  function parseStringStyle(cssText) {
    const ret = {};
    cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item2) => {
      if (item2) {
        const tmp = item2.split(propertyDelimiterRE);
        tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
      }
    });
    return ret;
  }
  function normalizeClass(value) {
    let res = "";
    if (isString(value)) {
      res = value;
    } else if (isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const normalized = normalizeClass(value[i]);
        if (normalized) {
          res += normalized + " ";
        }
      }
    } else if (isObject(value)) {
      for (const name in value) {
        if (value[name]) {
          res += name + " ";
        }
      }
    }
    return res.trim();
  }
  const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
  const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
  function includeBooleanAttr(value) {
    return !!value || value === "";
  }
  const isRef$1 = (val) => {
    return !!(val && val["__v_isRef"] === true);
  };
  const toDisplayString = (val) => {
    return isString(val) ? val : val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? isRef$1(val) ? toDisplayString(val.value) : JSON.stringify(val, replacer, 2) : String(val);
  };
  const replacer = (_key, val) => {
    if (isRef$1(val)) {
      return replacer(_key, val.value);
    } else if (isMap(val)) {
      return {
        [`Map(${val.size})`]: [...val.entries()].reduce(
          (entries, [key, val2], i) => {
            entries[stringifySymbol(key, i) + " =>"] = val2;
            return entries;
          },
          {}
        )
      };
    } else if (isSet(val)) {
      return {
        [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
      };
    } else if (isSymbol(val)) {
      return stringifySymbol(val);
    } else if (isObject(val) && !isArray(val) && !isPlainObject$1(val)) {
      return String(val);
    }
    return val;
  };
  const stringifySymbol = (v, i = "") => {
    var _a;
    return (
      // Symbol.description in es2019+ so we need to cast here to pass
      // the lib: es2016 check
      isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v
    );
  };
  function normalizeCssVarValue(value) {
    if (value == null) {
      return "initial";
    }
    if (typeof value === "string") {
      return value === "" ? " " : value;
    }
    return String(value);
  }
  /**
  * @vue/reactivity v3.5.25
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  let activeEffectScope;
  class EffectScope {
    constructor(detached = false) {
      this.detached = detached;
      this._active = true;
      this._on = 0;
      this.effects = [];
      this.cleanups = [];
      this._isPaused = false;
      this.parent = activeEffectScope;
      if (!detached && activeEffectScope) {
        this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
          this
        ) - 1;
      }
    }
    get active() {
      return this._active;
    }
    pause() {
      if (this._active) {
        this._isPaused = true;
        let i, l;
        if (this.scopes) {
          for (i = 0, l = this.scopes.length; i < l; i++) {
            this.scopes[i].pause();
          }
        }
        for (i = 0, l = this.effects.length; i < l; i++) {
          this.effects[i].pause();
        }
      }
    }
    /**
     * Resumes the effect scope, including all child scopes and effects.
     */
    resume() {
      if (this._active) {
        if (this._isPaused) {
          this._isPaused = false;
          let i, l;
          if (this.scopes) {
            for (i = 0, l = this.scopes.length; i < l; i++) {
              this.scopes[i].resume();
            }
          }
          for (i = 0, l = this.effects.length; i < l; i++) {
            this.effects[i].resume();
          }
        }
      }
    }
    run(fn) {
      if (this._active) {
        const currentEffectScope = activeEffectScope;
        try {
          activeEffectScope = this;
          return fn();
        } finally {
          activeEffectScope = currentEffectScope;
        }
      }
    }
    /**
     * This should only be called on non-detached scopes
     * @internal
     */
    on() {
      if (++this._on === 1) {
        this.prevScope = activeEffectScope;
        activeEffectScope = this;
      }
    }
    /**
     * This should only be called on non-detached scopes
     * @internal
     */
    off() {
      if (this._on > 0 && --this._on === 0) {
        activeEffectScope = this.prevScope;
        this.prevScope = void 0;
      }
    }
    stop(fromParent) {
      if (this._active) {
        this._active = false;
        let i, l;
        for (i = 0, l = this.effects.length; i < l; i++) {
          this.effects[i].stop();
        }
        this.effects.length = 0;
        for (i = 0, l = this.cleanups.length; i < l; i++) {
          this.cleanups[i]();
        }
        this.cleanups.length = 0;
        if (this.scopes) {
          for (i = 0, l = this.scopes.length; i < l; i++) {
            this.scopes[i].stop(true);
          }
          this.scopes.length = 0;
        }
        if (!this.detached && this.parent && !fromParent) {
          const last = this.parent.scopes.pop();
          if (last && last !== this) {
            this.parent.scopes[this.index] = last;
            last.index = this.index;
          }
        }
        this.parent = void 0;
      }
    }
  }
  function effectScope(detached) {
    return new EffectScope(detached);
  }
  function getCurrentScope() {
    return activeEffectScope;
  }
  function onScopeDispose(fn, failSilently = false) {
    if (activeEffectScope) {
      activeEffectScope.cleanups.push(fn);
    }
  }
  let activeSub;
  const pausedQueueEffects = /* @__PURE__ */ new WeakSet();
  class ReactiveEffect {
    constructor(fn) {
      this.fn = fn;
      this.deps = void 0;
      this.depsTail = void 0;
      this.flags = 1 | 4;
      this.next = void 0;
      this.cleanup = void 0;
      this.scheduler = void 0;
      if (activeEffectScope && activeEffectScope.active) {
        activeEffectScope.effects.push(this);
      }
    }
    pause() {
      this.flags |= 64;
    }
    resume() {
      if (this.flags & 64) {
        this.flags &= -65;
        if (pausedQueueEffects.has(this)) {
          pausedQueueEffects.delete(this);
          this.trigger();
        }
      }
    }
    /**
     * @internal
     */
    notify() {
      if (this.flags & 2 && !(this.flags & 32)) {
        return;
      }
      if (!(this.flags & 8)) {
        batch(this);
      }
    }
    run() {
      if (!(this.flags & 1)) {
        return this.fn();
      }
      this.flags |= 2;
      cleanupEffect(this);
      prepareDeps(this);
      const prevEffect = activeSub;
      const prevShouldTrack = shouldTrack;
      activeSub = this;
      shouldTrack = true;
      try {
        return this.fn();
      } finally {
        cleanupDeps(this);
        activeSub = prevEffect;
        shouldTrack = prevShouldTrack;
        this.flags &= -3;
      }
    }
    stop() {
      if (this.flags & 1) {
        for (let link = this.deps; link; link = link.nextDep) {
          removeSub(link);
        }
        this.deps = this.depsTail = void 0;
        cleanupEffect(this);
        this.onStop && this.onStop();
        this.flags &= -2;
      }
    }
    trigger() {
      if (this.flags & 64) {
        pausedQueueEffects.add(this);
      } else if (this.scheduler) {
        this.scheduler();
      } else {
        this.runIfDirty();
      }
    }
    /**
     * @internal
     */
    runIfDirty() {
      if (isDirty(this)) {
        this.run();
      }
    }
    get dirty() {
      return isDirty(this);
    }
  }
  let batchDepth = 0;
  let batchedSub;
  let batchedComputed;
  function batch(sub, isComputed2 = false) {
    sub.flags |= 8;
    if (isComputed2) {
      sub.next = batchedComputed;
      batchedComputed = sub;
      return;
    }
    sub.next = batchedSub;
    batchedSub = sub;
  }
  function startBatch() {
    batchDepth++;
  }
  function endBatch() {
    if (--batchDepth > 0) {
      return;
    }
    if (batchedComputed) {
      let e = batchedComputed;
      batchedComputed = void 0;
      while (e) {
        const next = e.next;
        e.next = void 0;
        e.flags &= -9;
        e = next;
      }
    }
    let error;
    while (batchedSub) {
      let e = batchedSub;
      batchedSub = void 0;
      while (e) {
        const next = e.next;
        e.next = void 0;
        e.flags &= -9;
        if (e.flags & 1) {
          try {
            ;
            e.trigger();
          } catch (err) {
            if (!error) error = err;
          }
        }
        e = next;
      }
    }
    if (error) throw error;
  }
  function prepareDeps(sub) {
    for (let link = sub.deps; link; link = link.nextDep) {
      link.version = -1;
      link.prevActiveLink = link.dep.activeLink;
      link.dep.activeLink = link;
    }
  }
  function cleanupDeps(sub) {
    let head;
    let tail = sub.depsTail;
    let link = tail;
    while (link) {
      const prev = link.prevDep;
      if (link.version === -1) {
        if (link === tail) tail = prev;
        removeSub(link);
        removeDep(link);
      } else {
        head = link;
      }
      link.dep.activeLink = link.prevActiveLink;
      link.prevActiveLink = void 0;
      link = prev;
    }
    sub.deps = head;
    sub.depsTail = tail;
  }
  function isDirty(sub) {
    for (let link = sub.deps; link; link = link.nextDep) {
      if (link.dep.version !== link.version || link.dep.computed && (refreshComputed(link.dep.computed) || link.dep.version !== link.version)) {
        return true;
      }
    }
    if (sub._dirty) {
      return true;
    }
    return false;
  }
  function refreshComputed(computed2) {
    if (computed2.flags & 4 && !(computed2.flags & 16)) {
      return;
    }
    computed2.flags &= -17;
    if (computed2.globalVersion === globalVersion) {
      return;
    }
    computed2.globalVersion = globalVersion;
    if (!computed2.isSSR && computed2.flags & 128 && (!computed2.deps && !computed2._dirty || !isDirty(computed2))) {
      return;
    }
    computed2.flags |= 2;
    const dep = computed2.dep;
    const prevSub = activeSub;
    const prevShouldTrack = shouldTrack;
    activeSub = computed2;
    shouldTrack = true;
    try {
      prepareDeps(computed2);
      const value = computed2.fn(computed2._value);
      if (dep.version === 0 || hasChanged(value, computed2._value)) {
        computed2.flags |= 128;
        computed2._value = value;
        dep.version++;
      }
    } catch (err) {
      dep.version++;
      throw err;
    } finally {
      activeSub = prevSub;
      shouldTrack = prevShouldTrack;
      cleanupDeps(computed2);
      computed2.flags &= -3;
    }
  }
  function removeSub(link, soft = false) {
    const { dep, prevSub, nextSub } = link;
    if (prevSub) {
      prevSub.nextSub = nextSub;
      link.prevSub = void 0;
    }
    if (nextSub) {
      nextSub.prevSub = prevSub;
      link.nextSub = void 0;
    }
    if (dep.subs === link) {
      dep.subs = prevSub;
      if (!prevSub && dep.computed) {
        dep.computed.flags &= -5;
        for (let l = dep.computed.deps; l; l = l.nextDep) {
          removeSub(l, true);
        }
      }
    }
    if (!soft && !--dep.sc && dep.map) {
      dep.map.delete(dep.key);
    }
  }
  function removeDep(link) {
    const { prevDep, nextDep } = link;
    if (prevDep) {
      prevDep.nextDep = nextDep;
      link.prevDep = void 0;
    }
    if (nextDep) {
      nextDep.prevDep = prevDep;
      link.nextDep = void 0;
    }
  }
  let shouldTrack = true;
  const trackStack = [];
  function pauseTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = false;
  }
  function resetTracking() {
    const last = trackStack.pop();
    shouldTrack = last === void 0 ? true : last;
  }
  function cleanupEffect(e) {
    const { cleanup } = e;
    e.cleanup = void 0;
    if (cleanup) {
      const prevSub = activeSub;
      activeSub = void 0;
      try {
        cleanup();
      } finally {
        activeSub = prevSub;
      }
    }
  }
  let globalVersion = 0;
  class Link {
    constructor(sub, dep) {
      this.sub = sub;
      this.dep = dep;
      this.version = dep.version;
      this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
    }
  }
  class Dep {
    // TODO isolatedDeclarations "__v_skip"
    constructor(computed2) {
      this.computed = computed2;
      this.version = 0;
      this.activeLink = void 0;
      this.subs = void 0;
      this.map = void 0;
      this.key = void 0;
      this.sc = 0;
      this.__v_skip = true;
    }
    track(debugInfo) {
      if (!activeSub || !shouldTrack || activeSub === this.computed) {
        return;
      }
      let link = this.activeLink;
      if (link === void 0 || link.sub !== activeSub) {
        link = this.activeLink = new Link(activeSub, this);
        if (!activeSub.deps) {
          activeSub.deps = activeSub.depsTail = link;
        } else {
          link.prevDep = activeSub.depsTail;
          activeSub.depsTail.nextDep = link;
          activeSub.depsTail = link;
        }
        addSub(link);
      } else if (link.version === -1) {
        link.version = this.version;
        if (link.nextDep) {
          const next = link.nextDep;
          next.prevDep = link.prevDep;
          if (link.prevDep) {
            link.prevDep.nextDep = next;
          }
          link.prevDep = activeSub.depsTail;
          link.nextDep = void 0;
          activeSub.depsTail.nextDep = link;
          activeSub.depsTail = link;
          if (activeSub.deps === link) {
            activeSub.deps = next;
          }
        }
      }
      return link;
    }
    trigger(debugInfo) {
      this.version++;
      globalVersion++;
      this.notify(debugInfo);
    }
    notify(debugInfo) {
      startBatch();
      try {
        if (false) ;
        for (let link = this.subs; link; link = link.prevSub) {
          if (link.sub.notify()) {
            ;
            link.sub.dep.notify();
          }
        }
      } finally {
        endBatch();
      }
    }
  }
  function addSub(link) {
    link.dep.sc++;
    if (link.sub.flags & 4) {
      const computed2 = link.dep.computed;
      if (computed2 && !link.dep.subs) {
        computed2.flags |= 4 | 16;
        for (let l = computed2.deps; l; l = l.nextDep) {
          addSub(l);
        }
      }
      const currentTail = link.dep.subs;
      if (currentTail !== link) {
        link.prevSub = currentTail;
        if (currentTail) currentTail.nextSub = link;
      }
      link.dep.subs = link;
    }
  }
  const targetMap = /* @__PURE__ */ new WeakMap();
  const ITERATE_KEY = Symbol(
    ""
  );
  const MAP_KEY_ITERATE_KEY = Symbol(
    ""
  );
  const ARRAY_ITERATE_KEY = Symbol(
    ""
  );
  function track(target, type, key) {
    if (shouldTrack && activeSub) {
      let depsMap = targetMap.get(target);
      if (!depsMap) {
        targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
      }
      let dep = depsMap.get(key);
      if (!dep) {
        depsMap.set(key, dep = new Dep());
        dep.map = depsMap;
        dep.key = key;
      }
      {
        dep.track();
      }
    }
  }
  function trigger(target, type, key, newValue, oldValue, oldTarget) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
      globalVersion++;
      return;
    }
    const run = (dep) => {
      if (dep) {
        {
          dep.trigger();
        }
      }
    };
    startBatch();
    if (type === "clear") {
      depsMap.forEach(run);
    } else {
      const targetIsArray = isArray(target);
      const isArrayIndex = targetIsArray && isIntegerKey(key);
      if (targetIsArray && key === "length") {
        const newLength = Number(newValue);
        depsMap.forEach((dep, key2) => {
          if (key2 === "length" || key2 === ARRAY_ITERATE_KEY || !isSymbol(key2) && key2 >= newLength) {
            run(dep);
          }
        });
      } else {
        if (key !== void 0 || depsMap.has(void 0)) {
          run(depsMap.get(key));
        }
        if (isArrayIndex) {
          run(depsMap.get(ARRAY_ITERATE_KEY));
        }
        switch (type) {
          case "add":
            if (!targetIsArray) {
              run(depsMap.get(ITERATE_KEY));
              if (isMap(target)) {
                run(depsMap.get(MAP_KEY_ITERATE_KEY));
              }
            } else if (isArrayIndex) {
              run(depsMap.get("length"));
            }
            break;
          case "delete":
            if (!targetIsArray) {
              run(depsMap.get(ITERATE_KEY));
              if (isMap(target)) {
                run(depsMap.get(MAP_KEY_ITERATE_KEY));
              }
            }
            break;
          case "set":
            if (isMap(target)) {
              run(depsMap.get(ITERATE_KEY));
            }
            break;
        }
      }
    }
    endBatch();
  }
  function getDepFromReactive(object, key) {
    const depMap = targetMap.get(object);
    return depMap && depMap.get(key);
  }
  function reactiveReadArray(array) {
    const raw = toRaw(array);
    if (raw === array) return raw;
    track(raw, "iterate", ARRAY_ITERATE_KEY);
    return isShallow(array) ? raw : raw.map(toReactive);
  }
  function shallowReadArray(arr) {
    track(arr = toRaw(arr), "iterate", ARRAY_ITERATE_KEY);
    return arr;
  }
  function toWrapped(target, item2) {
    if (isReadonly(target)) {
      return isReactive(target) ? toReadonly(toReactive(item2)) : toReadonly(item2);
    }
    return toReactive(item2);
  }
  const arrayInstrumentations = {
    __proto__: null,
    [Symbol.iterator]() {
      return iterator(this, Symbol.iterator, (item2) => toWrapped(this, item2));
    },
    concat(...args) {
      return reactiveReadArray(this).concat(
        ...args.map((x) => isArray(x) ? reactiveReadArray(x) : x)
      );
    },
    entries() {
      return iterator(this, "entries", (value) => {
        value[1] = toWrapped(this, value[1]);
        return value;
      });
    },
    every(fn, thisArg) {
      return apply(this, "every", fn, thisArg, void 0, arguments);
    },
    filter(fn, thisArg) {
      return apply(
        this,
        "filter",
        fn,
        thisArg,
        (v) => v.map((item2) => toWrapped(this, item2)),
        arguments
      );
    },
    find(fn, thisArg) {
      return apply(
        this,
        "find",
        fn,
        thisArg,
        (item2) => toWrapped(this, item2),
        arguments
      );
    },
    findIndex(fn, thisArg) {
      return apply(this, "findIndex", fn, thisArg, void 0, arguments);
    },
    findLast(fn, thisArg) {
      return apply(
        this,
        "findLast",
        fn,
        thisArg,
        (item2) => toWrapped(this, item2),
        arguments
      );
    },
    findLastIndex(fn, thisArg) {
      return apply(this, "findLastIndex", fn, thisArg, void 0, arguments);
    },
    // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
    forEach(fn, thisArg) {
      return apply(this, "forEach", fn, thisArg, void 0, arguments);
    },
    includes(...args) {
      return searchProxy(this, "includes", args);
    },
    indexOf(...args) {
      return searchProxy(this, "indexOf", args);
    },
    join(separator) {
      return reactiveReadArray(this).join(separator);
    },
    // keys() iterator only reads `length`, no optimization required
    lastIndexOf(...args) {
      return searchProxy(this, "lastIndexOf", args);
    },
    map(fn, thisArg) {
      return apply(this, "map", fn, thisArg, void 0, arguments);
    },
    pop() {
      return noTracking(this, "pop");
    },
    push(...args) {
      return noTracking(this, "push", args);
    },
    reduce(fn, ...args) {
      return reduce(this, "reduce", fn, args);
    },
    reduceRight(fn, ...args) {
      return reduce(this, "reduceRight", fn, args);
    },
    shift() {
      return noTracking(this, "shift");
    },
    // slice could use ARRAY_ITERATE but also seems to beg for range tracking
    some(fn, thisArg) {
      return apply(this, "some", fn, thisArg, void 0, arguments);
    },
    splice(...args) {
      return noTracking(this, "splice", args);
    },
    toReversed() {
      return reactiveReadArray(this).toReversed();
    },
    toSorted(comparer) {
      return reactiveReadArray(this).toSorted(comparer);
    },
    toSpliced(...args) {
      return reactiveReadArray(this).toSpliced(...args);
    },
    unshift(...args) {
      return noTracking(this, "unshift", args);
    },
    values() {
      return iterator(this, "values", (item2) => toWrapped(this, item2));
    }
  };
  function iterator(self2, method, wrapValue) {
    const arr = shallowReadArray(self2);
    const iter = arr[method]();
    if (arr !== self2 && !isShallow(self2)) {
      iter._next = iter.next;
      iter.next = () => {
        const result = iter._next();
        if (!result.done) {
          result.value = wrapValue(result.value);
        }
        return result;
      };
    }
    return iter;
  }
  const arrayProto = Array.prototype;
  function apply(self2, method, fn, thisArg, wrappedRetFn, args) {
    const arr = shallowReadArray(self2);
    const needsWrap = arr !== self2 && !isShallow(self2);
    const methodFn = arr[method];
    if (methodFn !== arrayProto[method]) {
      const result2 = methodFn.apply(self2, args);
      return needsWrap ? toReactive(result2) : result2;
    }
    let wrappedFn = fn;
    if (arr !== self2) {
      if (needsWrap) {
        wrappedFn = function(item2, index) {
          return fn.call(this, toWrapped(self2, item2), index, self2);
        };
      } else if (fn.length > 2) {
        wrappedFn = function(item2, index) {
          return fn.call(this, item2, index, self2);
        };
      }
    }
    const result = methodFn.call(arr, wrappedFn, thisArg);
    return needsWrap && wrappedRetFn ? wrappedRetFn(result) : result;
  }
  function reduce(self2, method, fn, args) {
    const arr = shallowReadArray(self2);
    let wrappedFn = fn;
    if (arr !== self2) {
      if (!isShallow(self2)) {
        wrappedFn = function(acc, item2, index) {
          return fn.call(this, acc, toWrapped(self2, item2), index, self2);
        };
      } else if (fn.length > 3) {
        wrappedFn = function(acc, item2, index) {
          return fn.call(this, acc, item2, index, self2);
        };
      }
    }
    return arr[method](wrappedFn, ...args);
  }
  function searchProxy(self2, method, args) {
    const arr = toRaw(self2);
    track(arr, "iterate", ARRAY_ITERATE_KEY);
    const res = arr[method](...args);
    if ((res === -1 || res === false) && isProxy(args[0])) {
      args[0] = toRaw(args[0]);
      return arr[method](...args);
    }
    return res;
  }
  function noTracking(self2, method, args = []) {
    pauseTracking();
    startBatch();
    const res = toRaw(self2)[method].apply(self2, args);
    endBatch();
    resetTracking();
    return res;
  }
  const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
  const builtInSymbols = new Set(
    /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
  );
  function hasOwnProperty(key) {
    if (!isSymbol(key)) key = String(key);
    const obj = toRaw(this);
    track(obj, "has", key);
    return obj.hasOwnProperty(key);
  }
  class BaseReactiveHandler {
    constructor(_isReadonly = false, _isShallow = false) {
      this._isReadonly = _isReadonly;
      this._isShallow = _isShallow;
    }
    get(target, key, receiver) {
      if (key === "__v_skip") return target["__v_skip"];
      const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
      if (key === "__v_isReactive") {
        return !isReadonly2;
      } else if (key === "__v_isReadonly") {
        return isReadonly2;
      } else if (key === "__v_isShallow") {
        return isShallow2;
      } else if (key === "__v_raw") {
        if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
        // this means the receiver is a user proxy of the reactive proxy
        Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
          return target;
        }
        return;
      }
      const targetIsArray = isArray(target);
      if (!isReadonly2) {
        let fn;
        if (targetIsArray && (fn = arrayInstrumentations[key])) {
          return fn;
        }
        if (key === "hasOwnProperty") {
          return hasOwnProperty;
        }
      }
      const res = Reflect.get(
        target,
        key,
        // if this is a proxy wrapping a ref, return methods using the raw ref
        // as receiver so that we don't have to call `toRaw` on the ref in all
        // its class methods
        isRef(target) ? target : receiver
      );
      if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
        return res;
      }
      if (!isReadonly2) {
        track(target, "get", key);
      }
      if (isShallow2) {
        return res;
      }
      if (isRef(res)) {
        const value = targetIsArray && isIntegerKey(key) ? res : res.value;
        return isReadonly2 && isObject(value) ? readonly(value) : value;
      }
      if (isObject(res)) {
        return isReadonly2 ? readonly(res) : reactive(res);
      }
      return res;
    }
  }
  class MutableReactiveHandler extends BaseReactiveHandler {
    constructor(isShallow2 = false) {
      super(false, isShallow2);
    }
    set(target, key, value, receiver) {
      let oldValue = target[key];
      const isArrayWithIntegerKey = isArray(target) && isIntegerKey(key);
      if (!this._isShallow) {
        const isOldValueReadonly = isReadonly(oldValue);
        if (!isShallow(value) && !isReadonly(value)) {
          oldValue = toRaw(oldValue);
          value = toRaw(value);
        }
        if (!isArrayWithIntegerKey && isRef(oldValue) && !isRef(value)) {
          if (isOldValueReadonly) {
            return true;
          } else {
            oldValue.value = value;
            return true;
          }
        }
      }
      const hadKey = isArrayWithIntegerKey ? Number(key) < target.length : hasOwn(target, key);
      const result = Reflect.set(
        target,
        key,
        value,
        isRef(target) ? target : receiver
      );
      if (target === toRaw(receiver)) {
        if (!hadKey) {
          trigger(target, "add", key, value);
        } else if (hasChanged(value, oldValue)) {
          trigger(target, "set", key, value);
        }
      }
      return result;
    }
    deleteProperty(target, key) {
      const hadKey = hasOwn(target, key);
      target[key];
      const result = Reflect.deleteProperty(target, key);
      if (result && hadKey) {
        trigger(target, "delete", key, void 0);
      }
      return result;
    }
    has(target, key) {
      const result = Reflect.has(target, key);
      if (!isSymbol(key) || !builtInSymbols.has(key)) {
        track(target, "has", key);
      }
      return result;
    }
    ownKeys(target) {
      track(
        target,
        "iterate",
        isArray(target) ? "length" : ITERATE_KEY
      );
      return Reflect.ownKeys(target);
    }
  }
  class ReadonlyReactiveHandler extends BaseReactiveHandler {
    constructor(isShallow2 = false) {
      super(true, isShallow2);
    }
    set(target, key) {
      return true;
    }
    deleteProperty(target, key) {
      return true;
    }
  }
  const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
  const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
  const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(true);
  const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
  const toShallow = (value) => value;
  const getProto = (v) => Reflect.getPrototypeOf(v);
  function createIterableMethod(method, isReadonly2, isShallow2) {
    return function(...args) {
      const target = this["__v_raw"];
      const rawTarget = toRaw(target);
      const targetIsMap = isMap(rawTarget);
      const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
      const isKeyOnly = method === "keys" && targetIsMap;
      const innerIterator = target[method](...args);
      const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
      !isReadonly2 && track(
        rawTarget,
        "iterate",
        isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
      );
      return {
        // iterator protocol
        next() {
          const { value, done } = innerIterator.next();
          return done ? { value, done } : {
            value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
            done
          };
        },
        // iterable protocol
        [Symbol.iterator]() {
          return this;
        }
      };
    };
  }
  function createReadonlyMethod(type) {
    return function(...args) {
      return type === "delete" ? false : type === "clear" ? void 0 : this;
    };
  }
  function createInstrumentations(readonly2, shallow) {
    const instrumentations = {
      get(key) {
        const target = this["__v_raw"];
        const rawTarget = toRaw(target);
        const rawKey = toRaw(key);
        if (!readonly2) {
          if (hasChanged(key, rawKey)) {
            track(rawTarget, "get", key);
          }
          track(rawTarget, "get", rawKey);
        }
        const { has } = getProto(rawTarget);
        const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
        if (has.call(rawTarget, key)) {
          return wrap(target.get(key));
        } else if (has.call(rawTarget, rawKey)) {
          return wrap(target.get(rawKey));
        } else if (target !== rawTarget) {
          target.get(key);
        }
      },
      get size() {
        const target = this["__v_raw"];
        !readonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
        return target.size;
      },
      has(key) {
        const target = this["__v_raw"];
        const rawTarget = toRaw(target);
        const rawKey = toRaw(key);
        if (!readonly2) {
          if (hasChanged(key, rawKey)) {
            track(rawTarget, "has", key);
          }
          track(rawTarget, "has", rawKey);
        }
        return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
      },
      forEach(callback, thisArg) {
        const observed = this;
        const target = observed["__v_raw"];
        const rawTarget = toRaw(target);
        const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
        !readonly2 && track(rawTarget, "iterate", ITERATE_KEY);
        return target.forEach((value, key) => {
          return callback.call(thisArg, wrap(value), wrap(key), observed);
        });
      }
    };
    extend(
      instrumentations,
      readonly2 ? {
        add: createReadonlyMethod("add"),
        set: createReadonlyMethod("set"),
        delete: createReadonlyMethod("delete"),
        clear: createReadonlyMethod("clear")
      } : {
        add(value) {
          if (!shallow && !isShallow(value) && !isReadonly(value)) {
            value = toRaw(value);
          }
          const target = toRaw(this);
          const proto = getProto(target);
          const hadKey = proto.has.call(target, value);
          if (!hadKey) {
            target.add(value);
            trigger(target, "add", value, value);
          }
          return this;
        },
        set(key, value) {
          if (!shallow && !isShallow(value) && !isReadonly(value)) {
            value = toRaw(value);
          }
          const target = toRaw(this);
          const { has, get } = getProto(target);
          let hadKey = has.call(target, key);
          if (!hadKey) {
            key = toRaw(key);
            hadKey = has.call(target, key);
          }
          const oldValue = get.call(target, key);
          target.set(key, value);
          if (!hadKey) {
            trigger(target, "add", key, value);
          } else if (hasChanged(value, oldValue)) {
            trigger(target, "set", key, value);
          }
          return this;
        },
        delete(key) {
          const target = toRaw(this);
          const { has, get } = getProto(target);
          let hadKey = has.call(target, key);
          if (!hadKey) {
            key = toRaw(key);
            hadKey = has.call(target, key);
          }
          get ? get.call(target, key) : void 0;
          const result = target.delete(key);
          if (hadKey) {
            trigger(target, "delete", key, void 0);
          }
          return result;
        },
        clear() {
          const target = toRaw(this);
          const hadItems = target.size !== 0;
          const result = target.clear();
          if (hadItems) {
            trigger(
              target,
              "clear",
              void 0,
              void 0
            );
          }
          return result;
        }
      }
    );
    const iteratorMethods = [
      "keys",
      "values",
      "entries",
      Symbol.iterator
    ];
    iteratorMethods.forEach((method) => {
      instrumentations[method] = createIterableMethod(method, readonly2, shallow);
    });
    return instrumentations;
  }
  function createInstrumentationGetter(isReadonly2, shallow) {
    const instrumentations = createInstrumentations(isReadonly2, shallow);
    return (target, key, receiver) => {
      if (key === "__v_isReactive") {
        return !isReadonly2;
      } else if (key === "__v_isReadonly") {
        return isReadonly2;
      } else if (key === "__v_raw") {
        return target;
      }
      return Reflect.get(
        hasOwn(instrumentations, key) && key in target ? instrumentations : target,
        key,
        receiver
      );
    };
  }
  const mutableCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(false, false)
  };
  const shallowCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(false, true)
  };
  const readonlyCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(true, false)
  };
  const shallowReadonlyCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(true, true)
  };
  const reactiveMap = /* @__PURE__ */ new WeakMap();
  const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
  const readonlyMap = /* @__PURE__ */ new WeakMap();
  const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
  function targetTypeMap(rawType) {
    switch (rawType) {
      case "Object":
      case "Array":
        return 1;
      case "Map":
      case "Set":
      case "WeakMap":
      case "WeakSet":
        return 2;
      default:
        return 0;
    }
  }
  function getTargetType(value) {
    return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
  }
  function reactive(target) {
    if (isReadonly(target)) {
      return target;
    }
    return createReactiveObject(
      target,
      false,
      mutableHandlers,
      mutableCollectionHandlers,
      reactiveMap
    );
  }
  function shallowReactive(target) {
    return createReactiveObject(
      target,
      false,
      shallowReactiveHandlers,
      shallowCollectionHandlers,
      shallowReactiveMap
    );
  }
  function readonly(target) {
    return createReactiveObject(
      target,
      true,
      readonlyHandlers,
      readonlyCollectionHandlers,
      readonlyMap
    );
  }
  function shallowReadonly(target) {
    return createReactiveObject(
      target,
      true,
      shallowReadonlyHandlers,
      shallowReadonlyCollectionHandlers,
      shallowReadonlyMap
    );
  }
  function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
    if (!isObject(target)) {
      return target;
    }
    if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
      return target;
    }
    const targetType = getTargetType(target);
    if (targetType === 0) {
      return target;
    }
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
      return existingProxy;
    }
    const proxy = new Proxy(
      target,
      targetType === 2 ? collectionHandlers : baseHandlers
    );
    proxyMap.set(target, proxy);
    return proxy;
  }
  function isReactive(value) {
    if (isReadonly(value)) {
      return isReactive(value["__v_raw"]);
    }
    return !!(value && value["__v_isReactive"]);
  }
  function isReadonly(value) {
    return !!(value && value["__v_isReadonly"]);
  }
  function isShallow(value) {
    return !!(value && value["__v_isShallow"]);
  }
  function isProxy(value) {
    return value ? !!value["__v_raw"] : false;
  }
  function toRaw(observed) {
    const raw = observed && observed["__v_raw"];
    return raw ? toRaw(raw) : observed;
  }
  function markRaw(value) {
    if (!hasOwn(value, "__v_skip") && Object.isExtensible(value)) {
      def(value, "__v_skip", true);
    }
    return value;
  }
  const toReactive = (value) => isObject(value) ? reactive(value) : value;
  const toReadonly = (value) => isObject(value) ? readonly(value) : value;
  function isRef(r) {
    return r ? r["__v_isRef"] === true : false;
  }
  function ref(value) {
    return createRef(value, false);
  }
  function createRef(rawValue, shallow) {
    if (isRef(rawValue)) {
      return rawValue;
    }
    return new RefImpl(rawValue, shallow);
  }
  class RefImpl {
    constructor(value, isShallow2) {
      this.dep = new Dep();
      this["__v_isRef"] = true;
      this["__v_isShallow"] = false;
      this._rawValue = isShallow2 ? value : toRaw(value);
      this._value = isShallow2 ? value : toReactive(value);
      this["__v_isShallow"] = isShallow2;
    }
    get value() {
      {
        this.dep.track();
      }
      return this._value;
    }
    set value(newValue) {
      const oldValue = this._rawValue;
      const useDirectValue = this["__v_isShallow"] || isShallow(newValue) || isReadonly(newValue);
      newValue = useDirectValue ? newValue : toRaw(newValue);
      if (hasChanged(newValue, oldValue)) {
        this._rawValue = newValue;
        this._value = useDirectValue ? newValue : toReactive(newValue);
        {
          this.dep.trigger();
        }
      }
    }
  }
  function unref(ref2) {
    return isRef(ref2) ? ref2.value : ref2;
  }
  const shallowUnwrapHandlers = {
    get: (target, key, receiver) => key === "__v_raw" ? target : unref(Reflect.get(target, key, receiver)),
    set: (target, key, value, receiver) => {
      const oldValue = target[key];
      if (isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      } else {
        return Reflect.set(target, key, value, receiver);
      }
    }
  };
  function proxyRefs(objectWithRefs) {
    return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
  }
  class CustomRefImpl {
    constructor(factory) {
      this["__v_isRef"] = true;
      this._value = void 0;
      const dep = this.dep = new Dep();
      const { get, set } = factory(dep.track.bind(dep), dep.trigger.bind(dep));
      this._get = get;
      this._set = set;
    }
    get value() {
      return this._value = this._get();
    }
    set value(newVal) {
      this._set(newVal);
    }
  }
  function customRef(factory) {
    return new CustomRefImpl(factory);
  }
  function toRefs(object) {
    const ret = isArray(object) ? new Array(object.length) : {};
    for (const key in object) {
      ret[key] = propertyToRef(object, key);
    }
    return ret;
  }
  class ObjectRefImpl {
    constructor(_object, _key, _defaultValue) {
      this._object = _object;
      this._key = _key;
      this._defaultValue = _defaultValue;
      this["__v_isRef"] = true;
      this._value = void 0;
      this._raw = toRaw(_object);
      let shallow = true;
      let obj = _object;
      if (!isArray(_object) || !isIntegerKey(String(_key))) {
        do {
          shallow = !isProxy(obj) || isShallow(obj);
        } while (shallow && (obj = obj["__v_raw"]));
      }
      this._shallow = shallow;
    }
    get value() {
      let val = this._object[this._key];
      if (this._shallow) {
        val = unref(val);
      }
      return this._value = val === void 0 ? this._defaultValue : val;
    }
    set value(newVal) {
      if (this._shallow && isRef(this._raw[this._key])) {
        const nestedRef = this._object[this._key];
        if (isRef(nestedRef)) {
          nestedRef.value = newVal;
          return;
        }
      }
      this._object[this._key] = newVal;
    }
    get dep() {
      return getDepFromReactive(this._raw, this._key);
    }
  }
  function propertyToRef(source, key, defaultValue) {
    return new ObjectRefImpl(source, key, defaultValue);
  }
  class ComputedRefImpl {
    constructor(fn, setter, isSSR) {
      this.fn = fn;
      this.setter = setter;
      this._value = void 0;
      this.dep = new Dep(this);
      this.__v_isRef = true;
      this.deps = void 0;
      this.depsTail = void 0;
      this.flags = 16;
      this.globalVersion = globalVersion - 1;
      this.next = void 0;
      this.effect = this;
      this["__v_isReadonly"] = !setter;
      this.isSSR = isSSR;
    }
    /**
     * @internal
     */
    notify() {
      this.flags |= 16;
      if (!(this.flags & 8) && // avoid infinite self recursion
      activeSub !== this) {
        batch(this, true);
        return true;
      }
    }
    get value() {
      const link = this.dep.track();
      refreshComputed(this);
      if (link) {
        link.version = this.dep.version;
      }
      return this._value;
    }
    set value(newValue) {
      if (this.setter) {
        this.setter(newValue);
      }
    }
  }
  function computed$1(getterOrOptions, debugOptions, isSSR = false) {
    let getter;
    let setter;
    if (isFunction(getterOrOptions)) {
      getter = getterOrOptions;
    } else {
      getter = getterOrOptions.get;
      setter = getterOrOptions.set;
    }
    const cRef = new ComputedRefImpl(getter, setter, isSSR);
    return cRef;
  }
  const INITIAL_WATCHER_VALUE = {};
  const cleanupMap = /* @__PURE__ */ new WeakMap();
  let activeWatcher = void 0;
  function onWatcherCleanup(cleanupFn, failSilently = false, owner = activeWatcher) {
    if (owner) {
      let cleanups = cleanupMap.get(owner);
      if (!cleanups) cleanupMap.set(owner, cleanups = []);
      cleanups.push(cleanupFn);
    }
  }
  function watch$1(source, cb, options = EMPTY_OBJ) {
    const { immediate, deep, once, scheduler, augmentJob, call } = options;
    const reactiveGetter = (source2) => {
      if (deep) return source2;
      if (isShallow(source2) || deep === false || deep === 0)
        return traverse(source2, 1);
      return traverse(source2);
    };
    let effect2;
    let getter;
    let cleanup;
    let boundCleanup;
    let forceTrigger = false;
    let isMultiSource = false;
    if (isRef(source)) {
      getter = () => source.value;
      forceTrigger = isShallow(source);
    } else if (isReactive(source)) {
      getter = () => reactiveGetter(source);
      forceTrigger = true;
    } else if (isArray(source)) {
      isMultiSource = true;
      forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
      getter = () => source.map((s) => {
        if (isRef(s)) {
          return s.value;
        } else if (isReactive(s)) {
          return reactiveGetter(s);
        } else if (isFunction(s)) {
          return call ? call(s, 2) : s();
        } else ;
      });
    } else if (isFunction(source)) {
      if (cb) {
        getter = call ? () => call(source, 2) : source;
      } else {
        getter = () => {
          if (cleanup) {
            pauseTracking();
            try {
              cleanup();
            } finally {
              resetTracking();
            }
          }
          const currentEffect = activeWatcher;
          activeWatcher = effect2;
          try {
            return call ? call(source, 3, [boundCleanup]) : source(boundCleanup);
          } finally {
            activeWatcher = currentEffect;
          }
        };
      }
    } else {
      getter = NOOP;
    }
    if (cb && deep) {
      const baseGetter = getter;
      const depth = deep === true ? Infinity : deep;
      getter = () => traverse(baseGetter(), depth);
    }
    const scope = getCurrentScope();
    const watchHandle = () => {
      effect2.stop();
      if (scope && scope.active) {
        remove(scope.effects, effect2);
      }
    };
    if (once && cb) {
      const _cb = cb;
      cb = (...args) => {
        _cb(...args);
        watchHandle();
      };
    }
    let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
    const job = (immediateFirstRun) => {
      if (!(effect2.flags & 1) || !effect2.dirty && !immediateFirstRun) {
        return;
      }
      if (cb) {
        const newValue = effect2.run();
        if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue))) {
          if (cleanup) {
            cleanup();
          }
          const currentWatcher = activeWatcher;
          activeWatcher = effect2;
          try {
            const args = [
              newValue,
              // pass undefined as the old value when it's changed for the first time
              oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
              boundCleanup
            ];
            oldValue = newValue;
            call ? call(cb, 3, args) : (
              // @ts-expect-error
              cb(...args)
            );
          } finally {
            activeWatcher = currentWatcher;
          }
        }
      } else {
        effect2.run();
      }
    };
    if (augmentJob) {
      augmentJob(job);
    }
    effect2 = new ReactiveEffect(getter);
    effect2.scheduler = scheduler ? () => scheduler(job, false) : job;
    boundCleanup = (fn) => onWatcherCleanup(fn, false, effect2);
    cleanup = effect2.onStop = () => {
      const cleanups = cleanupMap.get(effect2);
      if (cleanups) {
        if (call) {
          call(cleanups, 4);
        } else {
          for (const cleanup2 of cleanups) cleanup2();
        }
        cleanupMap.delete(effect2);
      }
    };
    if (cb) {
      if (immediate) {
        job(true);
      } else {
        oldValue = effect2.run();
      }
    } else if (scheduler) {
      scheduler(job.bind(null, true), true);
    } else {
      effect2.run();
    }
    watchHandle.pause = effect2.pause.bind(effect2);
    watchHandle.resume = effect2.resume.bind(effect2);
    watchHandle.stop = watchHandle;
    return watchHandle;
  }
  function traverse(value, depth = Infinity, seen) {
    if (depth <= 0 || !isObject(value) || value["__v_skip"]) {
      return value;
    }
    seen = seen || /* @__PURE__ */ new Map();
    if ((seen.get(value) || 0) >= depth) {
      return value;
    }
    seen.set(value, depth);
    depth--;
    if (isRef(value)) {
      traverse(value.value, depth, seen);
    } else if (isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        traverse(value[i], depth, seen);
      }
    } else if (isSet(value) || isMap(value)) {
      value.forEach((v) => {
        traverse(v, depth, seen);
      });
    } else if (isPlainObject$1(value)) {
      for (const key in value) {
        traverse(value[key], depth, seen);
      }
      for (const key of Object.getOwnPropertySymbols(value)) {
        if (Object.prototype.propertyIsEnumerable.call(value, key)) {
          traverse(value[key], depth, seen);
        }
      }
    }
    return value;
  }
  /**
  * @vue/runtime-core v3.5.25
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  const stack = [];
  let isWarning = false;
  function warn$1(msg, ...args) {
    if (isWarning) return;
    isWarning = true;
    pauseTracking();
    const instance = stack.length ? stack[stack.length - 1].component : null;
    const appWarnHandler = instance && instance.appContext.config.warnHandler;
    const trace = getComponentTrace();
    if (appWarnHandler) {
      callWithErrorHandling(
        appWarnHandler,
        instance,
        11,
        [
          // eslint-disable-next-line no-restricted-syntax
          msg + args.map((a) => {
            var _a, _b;
            return (_b = (_a = a.toString) == null ? void 0 : _a.call(a)) != null ? _b : JSON.stringify(a);
          }).join(""),
          instance && instance.proxy,
          trace.map(
            ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
          ).join("\n"),
          trace
        ]
      );
    } else {
      const warnArgs = [`[Vue warn]: ${msg}`, ...args];
      if (trace.length && // avoid spamming console during tests
      true) {
        warnArgs.push(`
`, ...formatTrace(trace));
      }
      console.warn(...warnArgs);
    }
    resetTracking();
    isWarning = false;
  }
  function getComponentTrace() {
    let currentVNode = stack[stack.length - 1];
    if (!currentVNode) {
      return [];
    }
    const normalizedStack = [];
    while (currentVNode) {
      const last = normalizedStack[0];
      if (last && last.vnode === currentVNode) {
        last.recurseCount++;
      } else {
        normalizedStack.push({
          vnode: currentVNode,
          recurseCount: 0
        });
      }
      const parentInstance = currentVNode.component && currentVNode.component.parent;
      currentVNode = parentInstance && parentInstance.vnode;
    }
    return normalizedStack;
  }
  function formatTrace(trace) {
    const logs = [];
    trace.forEach((entry, i) => {
      logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
    });
    return logs;
  }
  function formatTraceEntry({ vnode, recurseCount }) {
    const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
    const isRoot = vnode.component ? vnode.component.parent == null : false;
    const open = ` at <${formatComponentName(
      vnode.component,
      vnode.type,
      isRoot
    )}`;
    const close = `>` + postfix;
    return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
  }
  function formatProps(props) {
    const res = [];
    const keys = Object.keys(props);
    keys.slice(0, 3).forEach((key) => {
      res.push(...formatProp(key, props[key]));
    });
    if (keys.length > 3) {
      res.push(` ...`);
    }
    return res;
  }
  function formatProp(key, value, raw) {
    if (isString(value)) {
      value = JSON.stringify(value);
      return raw ? value : [`${key}=${value}`];
    } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
      return raw ? value : [`${key}=${value}`];
    } else if (isRef(value)) {
      value = formatProp(key, toRaw(value.value), true);
      return raw ? value : [`${key}=Ref<`, value, `>`];
    } else if (isFunction(value)) {
      return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
    } else {
      value = toRaw(value);
      return raw ? value : [`${key}=`, value];
    }
  }
  function callWithErrorHandling(fn, instance, type, args) {
    try {
      return args ? fn(...args) : fn();
    } catch (err) {
      handleError(err, instance, type);
    }
  }
  function callWithAsyncErrorHandling(fn, instance, type, args) {
    if (isFunction(fn)) {
      const res = callWithErrorHandling(fn, instance, type, args);
      if (res && isPromise(res)) {
        res.catch((err) => {
          handleError(err, instance, type);
        });
      }
      return res;
    }
    if (isArray(fn)) {
      const values = [];
      for (let i = 0; i < fn.length; i++) {
        values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
      }
      return values;
    }
  }
  function handleError(err, instance, type, throwInDev = true) {
    const contextVNode = instance ? instance.vnode : null;
    const { errorHandler, throwUnhandledErrorInProduction } = instance && instance.appContext.config || EMPTY_OBJ;
    if (instance) {
      let cur = instance.parent;
      const exposedInstance = instance.proxy;
      const errorInfo = `https://vuejs.org/error-reference/#runtime-${type}`;
      while (cur) {
        const errorCapturedHooks = cur.ec;
        if (errorCapturedHooks) {
          for (let i = 0; i < errorCapturedHooks.length; i++) {
            if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
              return;
            }
          }
        }
        cur = cur.parent;
      }
      if (errorHandler) {
        pauseTracking();
        callWithErrorHandling(errorHandler, null, 10, [
          err,
          exposedInstance,
          errorInfo
        ]);
        resetTracking();
        return;
      }
    }
    logError(err, type, contextVNode, throwInDev, throwUnhandledErrorInProduction);
  }
  function logError(err, type, contextVNode, throwInDev = true, throwInProd = false) {
    if (throwInProd) {
      throw err;
    } else {
      console.error(err);
    }
  }
  const queue = [];
  let flushIndex = -1;
  const pendingPostFlushCbs = [];
  let activePostFlushCbs = null;
  let postFlushIndex = 0;
  const resolvedPromise = /* @__PURE__ */ Promise.resolve();
  let currentFlushPromise = null;
  function nextTick(fn) {
    const p2 = currentFlushPromise || resolvedPromise;
    return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
  }
  function findInsertionIndex(id) {
    let start = flushIndex + 1;
    let end = queue.length;
    while (start < end) {
      const middle = start + end >>> 1;
      const middleJob = queue[middle];
      const middleJobId = getId(middleJob);
      if (middleJobId < id || middleJobId === id && middleJob.flags & 2) {
        start = middle + 1;
      } else {
        end = middle;
      }
    }
    return start;
  }
  function queueJob(job) {
    if (!(job.flags & 1)) {
      const jobId = getId(job);
      const lastJob = queue[queue.length - 1];
      if (!lastJob || // fast path when the job id is larger than the tail
      !(job.flags & 2) && jobId >= getId(lastJob)) {
        queue.push(job);
      } else {
        queue.splice(findInsertionIndex(jobId), 0, job);
      }
      job.flags |= 1;
      queueFlush();
    }
  }
  function queueFlush() {
    if (!currentFlushPromise) {
      currentFlushPromise = resolvedPromise.then(flushJobs);
    }
  }
  function queuePostFlushCb(cb) {
    if (!isArray(cb)) {
      if (activePostFlushCbs && cb.id === -1) {
        activePostFlushCbs.splice(postFlushIndex + 1, 0, cb);
      } else if (!(cb.flags & 1)) {
        pendingPostFlushCbs.push(cb);
        cb.flags |= 1;
      }
    } else {
      pendingPostFlushCbs.push(...cb);
    }
    queueFlush();
  }
  function flushPreFlushCbs(instance, seen, i = flushIndex + 1) {
    for (; i < queue.length; i++) {
      const cb = queue[i];
      if (cb && cb.flags & 2) {
        if (instance && cb.id !== instance.uid) {
          continue;
        }
        queue.splice(i, 1);
        i--;
        if (cb.flags & 4) {
          cb.flags &= -2;
        }
        cb();
        if (!(cb.flags & 4)) {
          cb.flags &= -2;
        }
      }
    }
  }
  function flushPostFlushCbs(seen) {
    if (pendingPostFlushCbs.length) {
      const deduped = [...new Set(pendingPostFlushCbs)].sort(
        (a, b) => getId(a) - getId(b)
      );
      pendingPostFlushCbs.length = 0;
      if (activePostFlushCbs) {
        activePostFlushCbs.push(...deduped);
        return;
      }
      activePostFlushCbs = deduped;
      for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
        const cb = activePostFlushCbs[postFlushIndex];
        if (cb.flags & 4) {
          cb.flags &= -2;
        }
        if (!(cb.flags & 8)) cb();
        cb.flags &= -2;
      }
      activePostFlushCbs = null;
      postFlushIndex = 0;
    }
  }
  const getId = (job) => job.id == null ? job.flags & 2 ? -1 : Infinity : job.id;
  function flushJobs(seen) {
    try {
      for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
        const job = queue[flushIndex];
        if (job && !(job.flags & 8)) {
          if (false) ;
          if (job.flags & 4) {
            job.flags &= ~1;
          }
          callWithErrorHandling(
            job,
            job.i,
            job.i ? 15 : 14
          );
          if (!(job.flags & 4)) {
            job.flags &= ~1;
          }
        }
      }
    } finally {
      for (; flushIndex < queue.length; flushIndex++) {
        const job = queue[flushIndex];
        if (job) {
          job.flags &= -2;
        }
      }
      flushIndex = -1;
      queue.length = 0;
      flushPostFlushCbs();
      currentFlushPromise = null;
      if (queue.length || pendingPostFlushCbs.length) {
        flushJobs();
      }
    }
  }
  let currentRenderingInstance = null;
  let currentScopeId = null;
  function setCurrentRenderingInstance(instance) {
    const prev = currentRenderingInstance;
    currentRenderingInstance = instance;
    currentScopeId = instance && instance.type.__scopeId || null;
    return prev;
  }
  function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
    if (!ctx) return fn;
    if (fn._n) {
      return fn;
    }
    const renderFnWithContext = (...args) => {
      if (renderFnWithContext._d) {
        setBlockTracking(-1);
      }
      const prevInstance = setCurrentRenderingInstance(ctx);
      let res;
      try {
        res = fn(...args);
      } finally {
        setCurrentRenderingInstance(prevInstance);
        if (renderFnWithContext._d) {
          setBlockTracking(1);
        }
      }
      return res;
    };
    renderFnWithContext._n = true;
    renderFnWithContext._c = true;
    renderFnWithContext._d = true;
    return renderFnWithContext;
  }
  function withDirectives(vnode, directives) {
    if (currentRenderingInstance === null) {
      return vnode;
    }
    const instance = getComponentPublicInstance(currentRenderingInstance);
    const bindings = vnode.dirs || (vnode.dirs = []);
    for (let i = 0; i < directives.length; i++) {
      let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
      if (dir) {
        if (isFunction(dir)) {
          dir = {
            mounted: dir,
            updated: dir
          };
        }
        if (dir.deep) {
          traverse(value);
        }
        bindings.push({
          dir,
          instance,
          value,
          oldValue: void 0,
          arg,
          modifiers
        });
      }
    }
    return vnode;
  }
  function invokeDirectiveHook(vnode, prevVNode, instance, name) {
    const bindings = vnode.dirs;
    const oldBindings = prevVNode && prevVNode.dirs;
    for (let i = 0; i < bindings.length; i++) {
      const binding = bindings[i];
      if (oldBindings) {
        binding.oldValue = oldBindings[i].value;
      }
      let hook = binding.dir[name];
      if (hook) {
        pauseTracking();
        callWithAsyncErrorHandling(hook, instance, 8, [
          vnode.el,
          binding,
          vnode,
          prevVNode
        ]);
        resetTracking();
      }
    }
  }
  const TeleportEndKey = Symbol("_vte");
  const isTeleport = (type) => type.__isTeleport;
  const leaveCbKey = Symbol("_leaveCb");
  const enterCbKey$1 = Symbol("_enterCb");
  function useTransitionState() {
    const state = {
      isMounted: false,
      isLeaving: false,
      isUnmounting: false,
      leavingVNodes: /* @__PURE__ */ new Map()
    };
    onMounted(() => {
      state.isMounted = true;
    });
    onBeforeUnmount(() => {
      state.isUnmounting = true;
    });
    return state;
  }
  const TransitionHookValidator = [Function, Array];
  const BaseTransitionPropsValidators = {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
    // enter
    onBeforeEnter: TransitionHookValidator,
    onEnter: TransitionHookValidator,
    onAfterEnter: TransitionHookValidator,
    onEnterCancelled: TransitionHookValidator,
    // leave
    onBeforeLeave: TransitionHookValidator,
    onLeave: TransitionHookValidator,
    onAfterLeave: TransitionHookValidator,
    onLeaveCancelled: TransitionHookValidator,
    // appear
    onBeforeAppear: TransitionHookValidator,
    onAppear: TransitionHookValidator,
    onAfterAppear: TransitionHookValidator,
    onAppearCancelled: TransitionHookValidator
  };
  const recursiveGetSubtree = (instance) => {
    const subTree = instance.subTree;
    return subTree.component ? recursiveGetSubtree(subTree.component) : subTree;
  };
  const BaseTransitionImpl = {
    name: `BaseTransition`,
    props: BaseTransitionPropsValidators,
    setup(props, { slots }) {
      const instance = getCurrentInstance();
      const state = useTransitionState();
      return () => {
        const children = slots.default && getTransitionRawChildren(slots.default(), true);
        if (!children || !children.length) {
          return;
        }
        const child = findNonCommentChild(children);
        const rawProps = toRaw(props);
        const { mode } = rawProps;
        if (state.isLeaving) {
          return emptyPlaceholder(child);
        }
        const innerChild = getInnerChild$1(child);
        if (!innerChild) {
          return emptyPlaceholder(child);
        }
        let enterHooks = resolveTransitionHooks(
          innerChild,
          rawProps,
          state,
          instance,
          // #11061, ensure enterHooks is fresh after clone
          (hooks) => enterHooks = hooks
        );
        if (innerChild.type !== Comment) {
          setTransitionHooks(innerChild, enterHooks);
        }
        let oldInnerChild = instance.subTree && getInnerChild$1(instance.subTree);
        if (oldInnerChild && oldInnerChild.type !== Comment && !isSameVNodeType(oldInnerChild, innerChild) && recursiveGetSubtree(instance).type !== Comment) {
          let leavingHooks = resolveTransitionHooks(
            oldInnerChild,
            rawProps,
            state,
            instance
          );
          setTransitionHooks(oldInnerChild, leavingHooks);
          if (mode === "out-in" && innerChild.type !== Comment) {
            state.isLeaving = true;
            leavingHooks.afterLeave = () => {
              state.isLeaving = false;
              if (!(instance.job.flags & 8)) {
                instance.update();
              }
              delete leavingHooks.afterLeave;
              oldInnerChild = void 0;
            };
            return emptyPlaceholder(child);
          } else if (mode === "in-out" && innerChild.type !== Comment) {
            leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
              const leavingVNodesCache = getLeavingNodesForType(
                state,
                oldInnerChild
              );
              leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
              el[leaveCbKey] = () => {
                earlyRemove();
                el[leaveCbKey] = void 0;
                delete enterHooks.delayedLeave;
                oldInnerChild = void 0;
              };
              enterHooks.delayedLeave = () => {
                delayedLeave();
                delete enterHooks.delayedLeave;
                oldInnerChild = void 0;
              };
            };
          } else {
            oldInnerChild = void 0;
          }
        } else if (oldInnerChild) {
          oldInnerChild = void 0;
        }
        return child;
      };
    }
  };
  function findNonCommentChild(children) {
    let child = children[0];
    if (children.length > 1) {
      for (const c of children) {
        if (c.type !== Comment) {
          child = c;
          break;
        }
      }
    }
    return child;
  }
  const BaseTransition = BaseTransitionImpl;
  function getLeavingNodesForType(state, vnode) {
    const { leavingVNodes } = state;
    let leavingVNodesCache = leavingVNodes.get(vnode.type);
    if (!leavingVNodesCache) {
      leavingVNodesCache = /* @__PURE__ */ Object.create(null);
      leavingVNodes.set(vnode.type, leavingVNodesCache);
    }
    return leavingVNodesCache;
  }
  function resolveTransitionHooks(vnode, props, state, instance, postClone) {
    const {
      appear,
      mode,
      persisted = false,
      onBeforeEnter,
      onEnter,
      onAfterEnter,
      onEnterCancelled,
      onBeforeLeave,
      onLeave,
      onAfterLeave,
      onLeaveCancelled,
      onBeforeAppear,
      onAppear,
      onAfterAppear,
      onAppearCancelled
    } = props;
    const key = String(vnode.key);
    const leavingVNodesCache = getLeavingNodesForType(state, vnode);
    const callHook2 = (hook, args) => {
      hook && callWithAsyncErrorHandling(
        hook,
        instance,
        9,
        args
      );
    };
    const callAsyncHook = (hook, args) => {
      const done = args[1];
      callHook2(hook, args);
      if (isArray(hook)) {
        if (hook.every((hook2) => hook2.length <= 1)) done();
      } else if (hook.length <= 1) {
        done();
      }
    };
    const hooks = {
      mode,
      persisted,
      beforeEnter(el) {
        let hook = onBeforeEnter;
        if (!state.isMounted) {
          if (appear) {
            hook = onBeforeAppear || onBeforeEnter;
          } else {
            return;
          }
        }
        if (el[leaveCbKey]) {
          el[leaveCbKey](
            true
            /* cancelled */
          );
        }
        const leavingVNode = leavingVNodesCache[key];
        if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el[leaveCbKey]) {
          leavingVNode.el[leaveCbKey]();
        }
        callHook2(hook, [el]);
      },
      enter(el) {
        let hook = onEnter;
        let afterHook = onAfterEnter;
        let cancelHook = onEnterCancelled;
        if (!state.isMounted) {
          if (appear) {
            hook = onAppear || onEnter;
            afterHook = onAfterAppear || onAfterEnter;
            cancelHook = onAppearCancelled || onEnterCancelled;
          } else {
            return;
          }
        }
        let called = false;
        const done = el[enterCbKey$1] = (cancelled) => {
          if (called) return;
          called = true;
          if (cancelled) {
            callHook2(cancelHook, [el]);
          } else {
            callHook2(afterHook, [el]);
          }
          if (hooks.delayedLeave) {
            hooks.delayedLeave();
          }
          el[enterCbKey$1] = void 0;
        };
        if (hook) {
          callAsyncHook(hook, [el, done]);
        } else {
          done();
        }
      },
      leave(el, remove2) {
        const key2 = String(vnode.key);
        if (el[enterCbKey$1]) {
          el[enterCbKey$1](
            true
            /* cancelled */
          );
        }
        if (state.isUnmounting) {
          return remove2();
        }
        callHook2(onBeforeLeave, [el]);
        let called = false;
        const done = el[leaveCbKey] = (cancelled) => {
          if (called) return;
          called = true;
          remove2();
          if (cancelled) {
            callHook2(onLeaveCancelled, [el]);
          } else {
            callHook2(onAfterLeave, [el]);
          }
          el[leaveCbKey] = void 0;
          if (leavingVNodesCache[key2] === vnode) {
            delete leavingVNodesCache[key2];
          }
        };
        leavingVNodesCache[key2] = vnode;
        if (onLeave) {
          callAsyncHook(onLeave, [el, done]);
        } else {
          done();
        }
      },
      clone(vnode2) {
        const hooks2 = resolveTransitionHooks(
          vnode2,
          props,
          state,
          instance,
          postClone
        );
        if (postClone) postClone(hooks2);
        return hooks2;
      }
    };
    return hooks;
  }
  function emptyPlaceholder(vnode) {
    if (isKeepAlive(vnode)) {
      vnode = cloneVNode(vnode);
      vnode.children = null;
      return vnode;
    }
  }
  function getInnerChild$1(vnode) {
    if (!isKeepAlive(vnode)) {
      if (isTeleport(vnode.type) && vnode.children) {
        return findNonCommentChild(vnode.children);
      }
      return vnode;
    }
    if (vnode.component) {
      return vnode.component.subTree;
    }
    const { shapeFlag, children } = vnode;
    if (children) {
      if (shapeFlag & 16) {
        return children[0];
      }
      if (shapeFlag & 32 && isFunction(children.default)) {
        return children.default();
      }
    }
  }
  function setTransitionHooks(vnode, hooks) {
    if (vnode.shapeFlag & 6 && vnode.component) {
      vnode.transition = hooks;
      setTransitionHooks(vnode.component.subTree, hooks);
    } else if (vnode.shapeFlag & 128) {
      vnode.ssContent.transition = hooks.clone(vnode.ssContent);
      vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
    } else {
      vnode.transition = hooks;
    }
  }
  function getTransitionRawChildren(children, keepComment = false, parentKey) {
    let ret = [];
    let keyedFragmentCount = 0;
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i);
      if (child.type === Fragment) {
        if (child.patchFlag & 128) keyedFragmentCount++;
        ret = ret.concat(
          getTransitionRawChildren(child.children, keepComment, key)
        );
      } else if (keepComment || child.type !== Comment) {
        ret.push(key != null ? cloneVNode(child, { key }) : child);
      }
    }
    if (keyedFragmentCount > 1) {
      for (let i = 0; i < ret.length; i++) {
        ret[i].patchFlag = -2;
      }
    }
    return ret;
  }
  // @__NO_SIDE_EFFECTS__
  function defineComponent(options, extraOptions) {
    return isFunction(options) ? (
      // #8236: extend call and options.name access are considered side-effects
      // by Rollup, so we have to wrap it in a pure-annotated IIFE.
      /* @__PURE__ */ (() => extend({ name: options.name }, extraOptions, { setup: options }))()
    ) : options;
  }
  function markAsyncBoundary(instance) {
    instance.ids = [instance.ids[0] + instance.ids[2]++ + "-", 0, 0];
  }
  const pendingSetRefMap = /* @__PURE__ */ new WeakMap();
  function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
    if (isArray(rawRef)) {
      rawRef.forEach(
        (r, i) => setRef(
          r,
          oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef),
          parentSuspense,
          vnode,
          isUnmount
        )
      );
      return;
    }
    if (isAsyncWrapper(vnode) && !isUnmount) {
      if (vnode.shapeFlag & 512 && vnode.type.__asyncResolved && vnode.component.subTree.component) {
        setRef(rawRef, oldRawRef, parentSuspense, vnode.component.subTree);
      }
      return;
    }
    const refValue = vnode.shapeFlag & 4 ? getComponentPublicInstance(vnode.component) : vnode.el;
    const value = isUnmount ? null : refValue;
    const { i: owner, r: ref3 } = rawRef;
    const oldRef = oldRawRef && oldRawRef.r;
    const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
    const setupState = owner.setupState;
    const rawSetupState = toRaw(setupState);
    const canSetSetupRef = setupState === EMPTY_OBJ ? NO : (key) => {
      return hasOwn(rawSetupState, key);
    };
    if (oldRef != null && oldRef !== ref3) {
      invalidatePendingSetRef(oldRawRef);
      if (isString(oldRef)) {
        refs[oldRef] = null;
        if (canSetSetupRef(oldRef)) {
          setupState[oldRef] = null;
        }
      } else if (isRef(oldRef)) {
        {
          oldRef.value = null;
        }
        const oldRawRefAtom = oldRawRef;
        if (oldRawRefAtom.k) refs[oldRawRefAtom.k] = null;
      }
    }
    if (isFunction(ref3)) {
      callWithErrorHandling(ref3, owner, 12, [value, refs]);
    } else {
      const _isString = isString(ref3);
      const _isRef = isRef(ref3);
      if (_isString || _isRef) {
        const doSet = () => {
          if (rawRef.f) {
            const existing = _isString ? canSetSetupRef(ref3) ? setupState[ref3] : refs[ref3] : ref3.value;
            if (isUnmount) {
              isArray(existing) && remove(existing, refValue);
            } else {
              if (!isArray(existing)) {
                if (_isString) {
                  refs[ref3] = [refValue];
                  if (canSetSetupRef(ref3)) {
                    setupState[ref3] = refs[ref3];
                  }
                } else {
                  const newVal = [refValue];
                  {
                    ref3.value = newVal;
                  }
                  if (rawRef.k) refs[rawRef.k] = newVal;
                }
              } else if (!existing.includes(refValue)) {
                existing.push(refValue);
              }
            }
          } else if (_isString) {
            refs[ref3] = value;
            if (canSetSetupRef(ref3)) {
              setupState[ref3] = value;
            }
          } else if (_isRef) {
            {
              ref3.value = value;
            }
            if (rawRef.k) refs[rawRef.k] = value;
          } else ;
        };
        if (value) {
          const job = () => {
            doSet();
            pendingSetRefMap.delete(rawRef);
          };
          job.id = -1;
          pendingSetRefMap.set(rawRef, job);
          queuePostRenderEffect(job, parentSuspense);
        } else {
          invalidatePendingSetRef(rawRef);
          doSet();
        }
      }
    }
  }
  function invalidatePendingSetRef(rawRef) {
    const pendingSetRef = pendingSetRefMap.get(rawRef);
    if (pendingSetRef) {
      pendingSetRef.flags |= 8;
      pendingSetRefMap.delete(rawRef);
    }
  }
  getGlobalThis().requestIdleCallback || ((cb) => setTimeout(cb, 1));
  getGlobalThis().cancelIdleCallback || ((id) => clearTimeout(id));
  const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
  const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
  function onActivated(hook, target) {
    registerKeepAliveHook(hook, "a", target);
  }
  function onDeactivated(hook, target) {
    registerKeepAliveHook(hook, "da", target);
  }
  function registerKeepAliveHook(hook, type, target = currentInstance) {
    const wrappedHook = hook.__wdc || (hook.__wdc = () => {
      let current = target;
      while (current) {
        if (current.isDeactivated) {
          return;
        }
        current = current.parent;
      }
      return hook();
    });
    injectHook(type, wrappedHook, target);
    if (target) {
      let current = target.parent;
      while (current && current.parent) {
        if (isKeepAlive(current.parent.vnode)) {
          injectToKeepAliveRoot(wrappedHook, type, target, current);
        }
        current = current.parent;
      }
    }
  }
  function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
    const injected = injectHook(
      type,
      hook,
      keepAliveRoot,
      true
      /* prepend */
    );
    onUnmounted(() => {
      remove(keepAliveRoot[type], injected);
    }, target);
  }
  function injectHook(type, hook, target = currentInstance, prepend = false) {
    if (target) {
      const hooks = target[type] || (target[type] = []);
      const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
        pauseTracking();
        const reset = setCurrentInstance(target);
        const res = callWithAsyncErrorHandling(hook, target, type, args);
        reset();
        resetTracking();
        return res;
      });
      if (prepend) {
        hooks.unshift(wrappedHook);
      } else {
        hooks.push(wrappedHook);
      }
      return wrappedHook;
    }
  }
  const createHook = (lifecycle) => (hook, target = currentInstance) => {
    if (!isInSSRComponentSetup || lifecycle === "sp") {
      injectHook(lifecycle, (...args) => hook(...args), target);
    }
  };
  const onBeforeMount = createHook("bm");
  const onMounted = createHook("m");
  const onBeforeUpdate = createHook(
    "bu"
  );
  const onUpdated = createHook("u");
  const onBeforeUnmount = createHook(
    "bum"
  );
  const onUnmounted = createHook("um");
  const onServerPrefetch = createHook(
    "sp"
  );
  const onRenderTriggered = createHook("rtg");
  const onRenderTracked = createHook("rtc");
  function onErrorCaptured(hook, target = currentInstance) {
    injectHook("ec", hook, target);
  }
  const NULL_DYNAMIC_COMPONENT = Symbol.for("v-ndc");
  function renderList(source, renderItem, cache, index) {
    let ret;
    const cached = cache;
    const sourceIsArray = isArray(source);
    if (sourceIsArray || isString(source)) {
      const sourceIsReactiveArray = sourceIsArray && isReactive(source);
      let needsWrap = false;
      let isReadonlySource = false;
      if (sourceIsReactiveArray) {
        needsWrap = !isShallow(source);
        isReadonlySource = isReadonly(source);
        source = shallowReadArray(source);
      }
      ret = new Array(source.length);
      for (let i = 0, l = source.length; i < l; i++) {
        ret[i] = renderItem(
          needsWrap ? isReadonlySource ? toReadonly(toReactive(source[i])) : toReactive(source[i]) : source[i],
          i,
          void 0,
          cached
        );
      }
    } else if (typeof source === "number") {
      ret = new Array(source);
      for (let i = 0; i < source; i++) {
        ret[i] = renderItem(i + 1, i, void 0, cached);
      }
    } else if (isObject(source)) {
      if (source[Symbol.iterator]) {
        ret = Array.from(
          source,
          (item2, i) => renderItem(item2, i, void 0, cached)
        );
      } else {
        const keys = Object.keys(source);
        ret = new Array(keys.length);
        for (let i = 0, l = keys.length; i < l; i++) {
          const key = keys[i];
          ret[i] = renderItem(source[key], key, i, cached);
        }
      }
    } else {
      ret = [];
    }
    return ret;
  }
  const getPublicInstance = (i) => {
    if (!i) return null;
    if (isStatefulComponent(i)) return getComponentPublicInstance(i);
    return getPublicInstance(i.parent);
  };
  const publicPropertiesMap = (
    // Move PURE marker to new line to workaround compiler discarding it
    // due to type annotation
    /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
      $: (i) => i,
      $el: (i) => i.vnode.el,
      $data: (i) => i.data,
      $props: (i) => i.props,
      $attrs: (i) => i.attrs,
      $slots: (i) => i.slots,
      $refs: (i) => i.refs,
      $parent: (i) => getPublicInstance(i.parent),
      $root: (i) => getPublicInstance(i.root),
      $host: (i) => i.ce,
      $emit: (i) => i.emit,
      $options: (i) => resolveMergedOptions(i),
      $forceUpdate: (i) => i.f || (i.f = () => {
        queueJob(i.update);
      }),
      $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
      $watch: (i) => instanceWatch.bind(i)
    })
  );
  const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
  const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
      if (key === "__v_skip") {
        return true;
      }
      const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
      if (key[0] !== "$") {
        const n = accessCache[key];
        if (n !== void 0) {
          switch (n) {
            case 1:
              return setupState[key];
            case 2:
              return data[key];
            case 4:
              return ctx[key];
            case 3:
              return props[key];
          }
        } else if (hasSetupBinding(setupState, key)) {
          accessCache[key] = 1;
          return setupState[key];
        } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
          accessCache[key] = 2;
          return data[key];
        } else if (hasOwn(props, key)) {
          accessCache[key] = 3;
          return props[key];
        } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
          accessCache[key] = 4;
          return ctx[key];
        } else if (shouldCacheAccess) {
          accessCache[key] = 0;
        }
      }
      const publicGetter = publicPropertiesMap[key];
      let cssModule, globalProperties;
      if (publicGetter) {
        if (key === "$attrs") {
          track(instance.attrs, "get", "");
        }
        return publicGetter(instance);
      } else if (
        // css module (injected by vue-loader)
        (cssModule = type.__cssModules) && (cssModule = cssModule[key])
      ) {
        return cssModule;
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (
        // global properties
        globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
      ) {
        {
          return globalProperties[key];
        }
      } else ;
    },
    set({ _: instance }, key, value) {
      const { data, setupState, ctx } = instance;
      if (hasSetupBinding(setupState, key)) {
        setupState[key] = value;
        return true;
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        data[key] = value;
        return true;
      } else if (hasOwn(instance.props, key)) {
        return false;
      }
      if (key[0] === "$" && key.slice(1) in instance) {
        return false;
      } else {
        {
          ctx[key] = value;
        }
      }
      return true;
    },
    has({
      _: { data, setupState, accessCache, ctx, appContext, props, type }
    }, key) {
      let cssModules;
      return !!(accessCache[key] || data !== EMPTY_OBJ && key[0] !== "$" && hasOwn(data, key) || hasSetupBinding(setupState, key) || hasOwn(props, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key) || (cssModules = type.__cssModules) && cssModules[key]);
    },
    defineProperty(target, key, descriptor) {
      if (descriptor.get != null) {
        target._.accessCache[key] = 0;
      } else if (hasOwn(descriptor, "value")) {
        this.set(target, key, descriptor.value, null);
      }
      return Reflect.defineProperty(target, key, descriptor);
    }
  };
  function normalizePropsOrEmits(props) {
    return isArray(props) ? props.reduce(
      (normalized, p2) => (normalized[p2] = null, normalized),
      {}
    ) : props;
  }
  let shouldCacheAccess = true;
  function applyOptions(instance) {
    const options = resolveMergedOptions(instance);
    const publicThis = instance.proxy;
    const ctx = instance.ctx;
    shouldCacheAccess = false;
    if (options.beforeCreate) {
      callHook$1(options.beforeCreate, instance, "bc");
    }
    const {
      // state
      data: dataOptions,
      computed: computedOptions,
      methods,
      watch: watchOptions,
      provide: provideOptions,
      inject: injectOptions,
      // lifecycle
      created,
      beforeMount,
      mounted,
      beforeUpdate,
      updated,
      activated,
      deactivated,
      beforeDestroy,
      beforeUnmount,
      destroyed,
      unmounted,
      render: render2,
      renderTracked,
      renderTriggered,
      errorCaptured,
      serverPrefetch,
      // public API
      expose,
      inheritAttrs,
      // assets
      components,
      directives,
      filters
    } = options;
    const checkDuplicateProperties = null;
    if (injectOptions) {
      resolveInjections(injectOptions, ctx, checkDuplicateProperties);
    }
    if (methods) {
      for (const key in methods) {
        const methodHandler = methods[key];
        if (isFunction(methodHandler)) {
          {
            ctx[key] = methodHandler.bind(publicThis);
          }
        }
      }
    }
    if (dataOptions) {
      const data = dataOptions.call(publicThis, publicThis);
      if (!isObject(data)) ;
      else {
        instance.data = reactive(data);
      }
    }
    shouldCacheAccess = true;
    if (computedOptions) {
      for (const key in computedOptions) {
        const opt = computedOptions[key];
        const get = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
        const set = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
        const c = computed({
          get,
          set
        });
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => c.value,
          set: (v) => c.value = v
        });
      }
    }
    if (watchOptions) {
      for (const key in watchOptions) {
        createWatcher(watchOptions[key], ctx, publicThis, key);
      }
    }
    if (provideOptions) {
      const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
      Reflect.ownKeys(provides).forEach((key) => {
        provide(key, provides[key]);
      });
    }
    if (created) {
      callHook$1(created, instance, "c");
    }
    function registerLifecycleHook(register, hook) {
      if (isArray(hook)) {
        hook.forEach((_hook) => register(_hook.bind(publicThis)));
      } else if (hook) {
        register(hook.bind(publicThis));
      }
    }
    registerLifecycleHook(onBeforeMount, beforeMount);
    registerLifecycleHook(onMounted, mounted);
    registerLifecycleHook(onBeforeUpdate, beforeUpdate);
    registerLifecycleHook(onUpdated, updated);
    registerLifecycleHook(onActivated, activated);
    registerLifecycleHook(onDeactivated, deactivated);
    registerLifecycleHook(onErrorCaptured, errorCaptured);
    registerLifecycleHook(onRenderTracked, renderTracked);
    registerLifecycleHook(onRenderTriggered, renderTriggered);
    registerLifecycleHook(onBeforeUnmount, beforeUnmount);
    registerLifecycleHook(onUnmounted, unmounted);
    registerLifecycleHook(onServerPrefetch, serverPrefetch);
    if (isArray(expose)) {
      if (expose.length) {
        const exposed = instance.exposed || (instance.exposed = {});
        expose.forEach((key) => {
          Object.defineProperty(exposed, key, {
            get: () => publicThis[key],
            set: (val) => publicThis[key] = val,
            enumerable: true
          });
        });
      } else if (!instance.exposed) {
        instance.exposed = {};
      }
    }
    if (render2 && instance.render === NOOP) {
      instance.render = render2;
    }
    if (inheritAttrs != null) {
      instance.inheritAttrs = inheritAttrs;
    }
    if (components) instance.components = components;
    if (directives) instance.directives = directives;
    if (serverPrefetch) {
      markAsyncBoundary(instance);
    }
  }
  function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
    if (isArray(injectOptions)) {
      injectOptions = normalizeInject(injectOptions);
    }
    for (const key in injectOptions) {
      const opt = injectOptions[key];
      let injected;
      if (isObject(opt)) {
        if ("default" in opt) {
          injected = inject(
            opt.from || key,
            opt.default,
            true
          );
        } else {
          injected = inject(opt.from || key);
        }
      } else {
        injected = inject(opt);
      }
      if (isRef(injected)) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => injected.value,
          set: (v) => injected.value = v
        });
      } else {
        ctx[key] = injected;
      }
    }
  }
  function callHook$1(hook, instance, type) {
    callWithAsyncErrorHandling(
      isArray(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
      instance,
      type
    );
  }
  function createWatcher(raw, ctx, publicThis, key) {
    let getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
    if (isString(raw)) {
      const handler = ctx[raw];
      if (isFunction(handler)) {
        {
          watch(getter, handler);
        }
      }
    } else if (isFunction(raw)) {
      {
        watch(getter, raw.bind(publicThis));
      }
    } else if (isObject(raw)) {
      if (isArray(raw)) {
        raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
      } else {
        const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
        if (isFunction(handler)) {
          watch(getter, handler, raw);
        }
      }
    } else ;
  }
  function resolveMergedOptions(instance) {
    const base = instance.type;
    const { mixins, extends: extendsOptions } = base;
    const {
      mixins: globalMixins,
      optionsCache: cache,
      config: { optionMergeStrategies }
    } = instance.appContext;
    const cached = cache.get(base);
    let resolved;
    if (cached) {
      resolved = cached;
    } else if (!globalMixins.length && !mixins && !extendsOptions) {
      {
        resolved = base;
      }
    } else {
      resolved = {};
      if (globalMixins.length) {
        globalMixins.forEach(
          (m) => mergeOptions(resolved, m, optionMergeStrategies, true)
        );
      }
      mergeOptions(resolved, base, optionMergeStrategies);
    }
    if (isObject(base)) {
      cache.set(base, resolved);
    }
    return resolved;
  }
  function mergeOptions(to, from, strats, asMixin = false) {
    const { mixins, extends: extendsOptions } = from;
    if (extendsOptions) {
      mergeOptions(to, extendsOptions, strats, true);
    }
    if (mixins) {
      mixins.forEach(
        (m) => mergeOptions(to, m, strats, true)
      );
    }
    for (const key in from) {
      if (asMixin && key === "expose") ;
      else {
        const strat = internalOptionMergeStrats[key] || strats && strats[key];
        to[key] = strat ? strat(to[key], from[key]) : from[key];
      }
    }
    return to;
  }
  const internalOptionMergeStrats = {
    data: mergeDataFn,
    props: mergeEmitsOrPropsOptions,
    emits: mergeEmitsOrPropsOptions,
    // objects
    methods: mergeObjectOptions,
    computed: mergeObjectOptions,
    // lifecycle
    beforeCreate: mergeAsArray,
    created: mergeAsArray,
    beforeMount: mergeAsArray,
    mounted: mergeAsArray,
    beforeUpdate: mergeAsArray,
    updated: mergeAsArray,
    beforeDestroy: mergeAsArray,
    beforeUnmount: mergeAsArray,
    destroyed: mergeAsArray,
    unmounted: mergeAsArray,
    activated: mergeAsArray,
    deactivated: mergeAsArray,
    errorCaptured: mergeAsArray,
    serverPrefetch: mergeAsArray,
    // assets
    components: mergeObjectOptions,
    directives: mergeObjectOptions,
    // watch
    watch: mergeWatchOptions,
    // provide / inject
    provide: mergeDataFn,
    inject: mergeInject
  };
  function mergeDataFn(to, from) {
    if (!from) {
      return to;
    }
    if (!to) {
      return from;
    }
    return function mergedDataFn() {
      return extend(
        isFunction(to) ? to.call(this, this) : to,
        isFunction(from) ? from.call(this, this) : from
      );
    };
  }
  function mergeInject(to, from) {
    return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
  }
  function normalizeInject(raw) {
    if (isArray(raw)) {
      const res = {};
      for (let i = 0; i < raw.length; i++) {
        res[raw[i]] = raw[i];
      }
      return res;
    }
    return raw;
  }
  function mergeAsArray(to, from) {
    return to ? [...new Set([].concat(to, from))] : from;
  }
  function mergeObjectOptions(to, from) {
    return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
  }
  function mergeEmitsOrPropsOptions(to, from) {
    if (to) {
      if (isArray(to) && isArray(from)) {
        return [.../* @__PURE__ */ new Set([...to, ...from])];
      }
      return extend(
        /* @__PURE__ */ Object.create(null),
        normalizePropsOrEmits(to),
        normalizePropsOrEmits(from != null ? from : {})
      );
    } else {
      return from;
    }
  }
  function mergeWatchOptions(to, from) {
    if (!to) return from;
    if (!from) return to;
    const merged = extend(/* @__PURE__ */ Object.create(null), to);
    for (const key in from) {
      merged[key] = mergeAsArray(to[key], from[key]);
    }
    return merged;
  }
  function createAppContext() {
    return {
      app: null,
      config: {
        isNativeTag: NO,
        performance: false,
        globalProperties: {},
        optionMergeStrategies: {},
        errorHandler: void 0,
        warnHandler: void 0,
        compilerOptions: {}
      },
      mixins: [],
      components: {},
      directives: {},
      provides: /* @__PURE__ */ Object.create(null),
      optionsCache: /* @__PURE__ */ new WeakMap(),
      propsCache: /* @__PURE__ */ new WeakMap(),
      emitsCache: /* @__PURE__ */ new WeakMap()
    };
  }
  let uid$1 = 0;
  function createAppAPI(render2, hydrate) {
    return function createApp2(rootComponent, rootProps = null) {
      if (!isFunction(rootComponent)) {
        rootComponent = extend({}, rootComponent);
      }
      if (rootProps != null && !isObject(rootProps)) {
        rootProps = null;
      }
      const context = createAppContext();
      const installedPlugins = /* @__PURE__ */ new WeakSet();
      const pluginCleanupFns = [];
      let isMounted = false;
      const app = context.app = {
        _uid: uid$1++,
        _component: rootComponent,
        _props: rootProps,
        _container: null,
        _context: context,
        _instance: null,
        version,
        get config() {
          return context.config;
        },
        set config(v) {
        },
        use(plugin, ...options) {
          if (installedPlugins.has(plugin)) ;
          else if (plugin && isFunction(plugin.install)) {
            installedPlugins.add(plugin);
            plugin.install(app, ...options);
          } else if (isFunction(plugin)) {
            installedPlugins.add(plugin);
            plugin(app, ...options);
          } else ;
          return app;
        },
        mixin(mixin) {
          {
            if (!context.mixins.includes(mixin)) {
              context.mixins.push(mixin);
            }
          }
          return app;
        },
        component(name, component) {
          if (!component) {
            return context.components[name];
          }
          context.components[name] = component;
          return app;
        },
        directive(name, directive) {
          if (!directive) {
            return context.directives[name];
          }
          context.directives[name] = directive;
          return app;
        },
        mount(rootContainer, isHydrate, namespace) {
          if (!isMounted) {
            const vnode = app._ceVNode || createVNode(rootComponent, rootProps);
            vnode.appContext = context;
            if (namespace === true) {
              namespace = "svg";
            } else if (namespace === false) {
              namespace = void 0;
            }
            {
              render2(vnode, rootContainer, namespace);
            }
            isMounted = true;
            app._container = rootContainer;
            rootContainer.__vue_app__ = app;
            return getComponentPublicInstance(vnode.component);
          }
        },
        onUnmount(cleanupFn) {
          pluginCleanupFns.push(cleanupFn);
        },
        unmount() {
          if (isMounted) {
            callWithAsyncErrorHandling(
              pluginCleanupFns,
              app._instance,
              16
            );
            render2(null, app._container);
            delete app._container.__vue_app__;
          }
        },
        provide(key, value) {
          context.provides[key] = value;
          return app;
        },
        runWithContext(fn) {
          const lastApp = currentApp;
          currentApp = app;
          try {
            return fn();
          } finally {
            currentApp = lastApp;
          }
        }
      };
      return app;
    };
  }
  let currentApp = null;
  function provide(key, value) {
    if (currentInstance) {
      let provides = currentInstance.provides;
      const parentProvides = currentInstance.parent && currentInstance.parent.provides;
      if (parentProvides === provides) {
        provides = currentInstance.provides = Object.create(parentProvides);
      }
      provides[key] = value;
    }
  }
  function inject(key, defaultValue, treatDefaultAsFactory = false) {
    const instance = getCurrentInstance();
    if (instance || currentApp) {
      let provides = currentApp ? currentApp._context.provides : instance ? instance.parent == null || instance.ce ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : void 0;
      if (provides && key in provides) {
        return provides[key];
      } else if (arguments.length > 1) {
        return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
      } else ;
    }
  }
  function hasInjectionContext() {
    return !!(getCurrentInstance() || currentApp);
  }
  const ssrContextKey = Symbol.for("v-scx");
  const useSSRContext = () => {
    {
      const ctx = inject(ssrContextKey);
      return ctx;
    }
  };
  function watch(source, cb, options) {
    return doWatch(source, cb, options);
  }
  function doWatch(source, cb, options = EMPTY_OBJ) {
    const { immediate, deep, flush, once } = options;
    const baseWatchOptions = extend({}, options);
    const runsImmediately = cb && immediate || !cb && flush !== "post";
    let ssrCleanup;
    if (isInSSRComponentSetup) {
      if (flush === "sync") {
        const ctx = useSSRContext();
        ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
      } else if (!runsImmediately) {
        const watchStopHandle = () => {
        };
        watchStopHandle.stop = NOOP;
        watchStopHandle.resume = NOOP;
        watchStopHandle.pause = NOOP;
        return watchStopHandle;
      }
    }
    const instance = currentInstance;
    baseWatchOptions.call = (fn, type, args) => callWithAsyncErrorHandling(fn, instance, type, args);
    let isPre = false;
    if (flush === "post") {
      baseWatchOptions.scheduler = (job) => {
        queuePostRenderEffect(job, instance && instance.suspense);
      };
    } else if (flush !== "sync") {
      isPre = true;
      baseWatchOptions.scheduler = (job, isFirstRun) => {
        if (isFirstRun) {
          job();
        } else {
          queueJob(job);
        }
      };
    }
    baseWatchOptions.augmentJob = (job) => {
      if (cb) {
        job.flags |= 4;
      }
      if (isPre) {
        job.flags |= 2;
        if (instance) {
          job.id = instance.uid;
          job.i = instance;
        }
      }
    };
    const watchHandle = watch$1(source, cb, baseWatchOptions);
    if (isInSSRComponentSetup) {
      if (ssrCleanup) {
        ssrCleanup.push(watchHandle);
      } else if (runsImmediately) {
        watchHandle();
      }
    }
    return watchHandle;
  }
  function instanceWatch(source, value, options) {
    const publicThis = this.proxy;
    const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
    let cb;
    if (isFunction(value)) {
      cb = value;
    } else {
      cb = value.handler;
      options = value;
    }
    const reset = setCurrentInstance(this);
    const res = doWatch(getter, cb.bind(publicThis), options);
    reset();
    return res;
  }
  function createPathGetter(ctx, path) {
    const segments = path.split(".");
    return () => {
      let cur = ctx;
      for (let i = 0; i < segments.length && cur; i++) {
        cur = cur[segments[i]];
      }
      return cur;
    };
  }
  const getModelModifiers = (props, modelName) => {
    return modelName === "modelValue" || modelName === "model-value" ? props.modelModifiers : props[`${modelName}Modifiers`] || props[`${camelize(modelName)}Modifiers`] || props[`${hyphenate(modelName)}Modifiers`];
  };
  function emit(instance, event, ...rawArgs) {
    if (instance.isUnmounted) return;
    const props = instance.vnode.props || EMPTY_OBJ;
    let args = rawArgs;
    const isModelListener2 = event.startsWith("update:");
    const modifiers = isModelListener2 && getModelModifiers(props, event.slice(7));
    if (modifiers) {
      if (modifiers.trim) {
        args = rawArgs.map((a) => isString(a) ? a.trim() : a);
      }
      if (modifiers.number) {
        args = rawArgs.map(looseToNumber);
      }
    }
    let handlerName;
    let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
    props[handlerName = toHandlerKey(camelize(event))];
    if (!handler && isModelListener2) {
      handler = props[handlerName = toHandlerKey(hyphenate(event))];
    }
    if (handler) {
      callWithAsyncErrorHandling(
        handler,
        instance,
        6,
        args
      );
    }
    const onceHandler = props[handlerName + `Once`];
    if (onceHandler) {
      if (!instance.emitted) {
        instance.emitted = {};
      } else if (instance.emitted[handlerName]) {
        return;
      }
      instance.emitted[handlerName] = true;
      callWithAsyncErrorHandling(
        onceHandler,
        instance,
        6,
        args
      );
    }
  }
  const mixinEmitsCache = /* @__PURE__ */ new WeakMap();
  function normalizeEmitsOptions(comp, appContext, asMixin = false) {
    const cache = asMixin ? mixinEmitsCache : appContext.emitsCache;
    const cached = cache.get(comp);
    if (cached !== void 0) {
      return cached;
    }
    const raw = comp.emits;
    let normalized = {};
    let hasExtends = false;
    if (!isFunction(comp)) {
      const extendEmits = (raw2) => {
        const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
        if (normalizedFromExtend) {
          hasExtends = true;
          extend(normalized, normalizedFromExtend);
        }
      };
      if (!asMixin && appContext.mixins.length) {
        appContext.mixins.forEach(extendEmits);
      }
      if (comp.extends) {
        extendEmits(comp.extends);
      }
      if (comp.mixins) {
        comp.mixins.forEach(extendEmits);
      }
    }
    if (!raw && !hasExtends) {
      if (isObject(comp)) {
        cache.set(comp, null);
      }
      return null;
    }
    if (isArray(raw)) {
      raw.forEach((key) => normalized[key] = null);
    } else {
      extend(normalized, raw);
    }
    if (isObject(comp)) {
      cache.set(comp, normalized);
    }
    return normalized;
  }
  function isEmitListener(options, key) {
    if (!options || !isOn(key)) {
      return false;
    }
    key = key.slice(2).replace(/Once$/, "");
    return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
  }
  function markAttrsAccessed() {
  }
  function renderComponentRoot(instance) {
    const {
      type: Component,
      vnode,
      proxy,
      withProxy,
      propsOptions: [propsOptions],
      slots,
      attrs,
      emit: emit2,
      render: render2,
      renderCache,
      props,
      data,
      setupState,
      ctx,
      inheritAttrs
    } = instance;
    const prev = setCurrentRenderingInstance(instance);
    let result;
    let fallthroughAttrs;
    try {
      if (vnode.shapeFlag & 4) {
        const proxyToUse = withProxy || proxy;
        const thisProxy = false ? new Proxy(proxyToUse, {
          get(target, key, receiver) {
            warn$1(
              `Property '${String(
                key
              )}' was accessed via 'this'. Avoid using 'this' in templates.`
            );
            return Reflect.get(target, key, receiver);
          }
        }) : proxyToUse;
        result = normalizeVNode(
          render2.call(
            thisProxy,
            proxyToUse,
            renderCache,
            false ? shallowReadonly(props) : props,
            setupState,
            data,
            ctx
          )
        );
        fallthroughAttrs = attrs;
      } else {
        const render22 = Component;
        if (false) ;
        result = normalizeVNode(
          render22.length > 1 ? render22(
            false ? shallowReadonly(props) : props,
            false ? {
              get attrs() {
                markAttrsAccessed();
                return shallowReadonly(attrs);
              },
              slots,
              emit: emit2
            } : { attrs, slots, emit: emit2 }
          ) : render22(
            false ? shallowReadonly(props) : props,
            null
          )
        );
        fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
      }
    } catch (err) {
      blockStack.length = 0;
      handleError(err, instance, 1);
      result = createVNode(Comment);
    }
    let root = result;
    if (fallthroughAttrs && inheritAttrs !== false) {
      const keys = Object.keys(fallthroughAttrs);
      const { shapeFlag } = root;
      if (keys.length) {
        if (shapeFlag & (1 | 6)) {
          if (propsOptions && keys.some(isModelListener)) {
            fallthroughAttrs = filterModelListeners(
              fallthroughAttrs,
              propsOptions
            );
          }
          root = cloneVNode(root, fallthroughAttrs, false, true);
        }
      }
    }
    if (vnode.dirs) {
      root = cloneVNode(root, null, false, true);
      root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
    }
    if (vnode.transition) {
      setTransitionHooks(root, vnode.transition);
    }
    {
      result = root;
    }
    setCurrentRenderingInstance(prev);
    return result;
  }
  const getFunctionalFallthrough = (attrs) => {
    let res;
    for (const key in attrs) {
      if (key === "class" || key === "style" || isOn(key)) {
        (res || (res = {}))[key] = attrs[key];
      }
    }
    return res;
  };
  const filterModelListeners = (attrs, props) => {
    const res = {};
    for (const key in attrs) {
      if (!isModelListener(key) || !(key.slice(9) in props)) {
        res[key] = attrs[key];
      }
    }
    return res;
  };
  function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
    const { props: prevProps, children: prevChildren, component } = prevVNode;
    const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
    const emits = component.emitsOptions;
    if (nextVNode.dirs || nextVNode.transition) {
      return true;
    }
    if (optimized && patchFlag >= 0) {
      if (patchFlag & 1024) {
        return true;
      }
      if (patchFlag & 16) {
        if (!prevProps) {
          return !!nextProps;
        }
        return hasPropsChanged(prevProps, nextProps, emits);
      } else if (patchFlag & 8) {
        const dynamicProps = nextVNode.dynamicProps;
        for (let i = 0; i < dynamicProps.length; i++) {
          const key = dynamicProps[i];
          if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
            return true;
          }
        }
      }
    } else {
      if (prevChildren || nextChildren) {
        if (!nextChildren || !nextChildren.$stable) {
          return true;
        }
      }
      if (prevProps === nextProps) {
        return false;
      }
      if (!prevProps) {
        return !!nextProps;
      }
      if (!nextProps) {
        return true;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    }
    return false;
  }
  function hasPropsChanged(prevProps, nextProps, emitsOptions) {
    const nextKeys = Object.keys(nextProps);
    if (nextKeys.length !== Object.keys(prevProps).length) {
      return true;
    }
    for (let i = 0; i < nextKeys.length; i++) {
      const key = nextKeys[i];
      if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
        return true;
      }
    }
    return false;
  }
  function updateHOCHostEl({ vnode, parent }, el) {
    while (parent) {
      const root = parent.subTree;
      if (root.suspense && root.suspense.activeBranch === vnode) {
        root.el = vnode.el;
      }
      if (root === vnode) {
        (vnode = parent.vnode).el = el;
        parent = parent.parent;
      } else {
        break;
      }
    }
  }
  const internalObjectProto = {};
  const createInternalObject = () => Object.create(internalObjectProto);
  const isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;
  function initProps(instance, rawProps, isStateful, isSSR = false) {
    const props = {};
    const attrs = createInternalObject();
    instance.propsDefaults = /* @__PURE__ */ Object.create(null);
    setFullProps(instance, rawProps, props, attrs);
    for (const key in instance.propsOptions[0]) {
      if (!(key in props)) {
        props[key] = void 0;
      }
    }
    if (isStateful) {
      instance.props = isSSR ? props : shallowReactive(props);
    } else {
      if (!instance.type.props) {
        instance.props = attrs;
      } else {
        instance.props = props;
      }
    }
    instance.attrs = attrs;
  }
  function updateProps(instance, rawProps, rawPrevProps, optimized) {
    const {
      props,
      attrs,
      vnode: { patchFlag }
    } = instance;
    const rawCurrentProps = toRaw(props);
    const [options] = instance.propsOptions;
    let hasAttrsChanged = false;
    if (
      // always force full diff in dev
      // - #1942 if hmr is enabled with sfc component
      // - vite#872 non-sfc component used by sfc component
      (optimized || patchFlag > 0) && !(patchFlag & 16)
    ) {
      if (patchFlag & 8) {
        const propsToUpdate = instance.vnode.dynamicProps;
        for (let i = 0; i < propsToUpdate.length; i++) {
          let key = propsToUpdate[i];
          if (isEmitListener(instance.emitsOptions, key)) {
            continue;
          }
          const value = rawProps[key];
          if (options) {
            if (hasOwn(attrs, key)) {
              if (value !== attrs[key]) {
                attrs[key] = value;
                hasAttrsChanged = true;
              }
            } else {
              const camelizedKey = camelize(key);
              props[camelizedKey] = resolvePropValue(
                options,
                rawCurrentProps,
                camelizedKey,
                value,
                instance,
                false
              );
            }
          } else {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          }
        }
      }
    } else {
      if (setFullProps(instance, rawProps, props, attrs)) {
        hasAttrsChanged = true;
      }
      let kebabKey;
      for (const key in rawCurrentProps) {
        if (!rawProps || // for camelCase
        !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
        // and converted to camelCase (#955)
        ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
          if (options) {
            if (rawPrevProps && // for camelCase
            (rawPrevProps[key] !== void 0 || // for kebab-case
            rawPrevProps[kebabKey] !== void 0)) {
              props[key] = resolvePropValue(
                options,
                rawCurrentProps,
                key,
                void 0,
                instance,
                true
              );
            }
          } else {
            delete props[key];
          }
        }
      }
      if (attrs !== rawCurrentProps) {
        for (const key in attrs) {
          if (!rawProps || !hasOwn(rawProps, key) && true) {
            delete attrs[key];
            hasAttrsChanged = true;
          }
        }
      }
    }
    if (hasAttrsChanged) {
      trigger(instance.attrs, "set", "");
    }
  }
  function setFullProps(instance, rawProps, props, attrs) {
    const [options, needCastKeys] = instance.propsOptions;
    let hasAttrsChanged = false;
    let rawCastValues;
    if (rawProps) {
      for (let key in rawProps) {
        if (isReservedProp(key)) {
          continue;
        }
        const value = rawProps[key];
        let camelKey;
        if (options && hasOwn(options, camelKey = camelize(key))) {
          if (!needCastKeys || !needCastKeys.includes(camelKey)) {
            props[camelKey] = value;
          } else {
            (rawCastValues || (rawCastValues = {}))[camelKey] = value;
          }
        } else if (!isEmitListener(instance.emitsOptions, key)) {
          if (!(key in attrs) || value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
    if (needCastKeys) {
      const rawCurrentProps = toRaw(props);
      const castValues = rawCastValues || EMPTY_OBJ;
      for (let i = 0; i < needCastKeys.length; i++) {
        const key = needCastKeys[i];
        props[key] = resolvePropValue(
          options,
          rawCurrentProps,
          key,
          castValues[key],
          instance,
          !hasOwn(castValues, key)
        );
      }
    }
    return hasAttrsChanged;
  }
  function resolvePropValue(options, props, key, value, instance, isAbsent) {
    const opt = options[key];
    if (opt != null) {
      const hasDefault = hasOwn(opt, "default");
      if (hasDefault && value === void 0) {
        const defaultValue = opt.default;
        if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
          const { propsDefaults } = instance;
          if (key in propsDefaults) {
            value = propsDefaults[key];
          } else {
            const reset = setCurrentInstance(instance);
            value = propsDefaults[key] = defaultValue.call(
              null,
              props
            );
            reset();
          }
        } else {
          value = defaultValue;
        }
        if (instance.ce) {
          instance.ce._setProp(key, value);
        }
      }
      if (opt[
        0
        /* shouldCast */
      ]) {
        if (isAbsent && !hasDefault) {
          value = false;
        } else if (opt[
          1
          /* shouldCastTrue */
        ] && (value === "" || value === hyphenate(key))) {
          value = true;
        }
      }
    }
    return value;
  }
  const mixinPropsCache = /* @__PURE__ */ new WeakMap();
  function normalizePropsOptions(comp, appContext, asMixin = false) {
    const cache = asMixin ? mixinPropsCache : appContext.propsCache;
    const cached = cache.get(comp);
    if (cached) {
      return cached;
    }
    const raw = comp.props;
    const normalized = {};
    const needCastKeys = [];
    let hasExtends = false;
    if (!isFunction(comp)) {
      const extendProps = (raw2) => {
        hasExtends = true;
        const [props, keys] = normalizePropsOptions(raw2, appContext, true);
        extend(normalized, props);
        if (keys) needCastKeys.push(...keys);
      };
      if (!asMixin && appContext.mixins.length) {
        appContext.mixins.forEach(extendProps);
      }
      if (comp.extends) {
        extendProps(comp.extends);
      }
      if (comp.mixins) {
        comp.mixins.forEach(extendProps);
      }
    }
    if (!raw && !hasExtends) {
      if (isObject(comp)) {
        cache.set(comp, EMPTY_ARR);
      }
      return EMPTY_ARR;
    }
    if (isArray(raw)) {
      for (let i = 0; i < raw.length; i++) {
        const normalizedKey = camelize(raw[i]);
        if (validatePropName(normalizedKey)) {
          normalized[normalizedKey] = EMPTY_OBJ;
        }
      }
    } else if (raw) {
      for (const key in raw) {
        const normalizedKey = camelize(key);
        if (validatePropName(normalizedKey)) {
          const opt = raw[key];
          const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
          const propType = prop.type;
          let shouldCast = false;
          let shouldCastTrue = true;
          if (isArray(propType)) {
            for (let index = 0; index < propType.length; ++index) {
              const type = propType[index];
              const typeName = isFunction(type) && type.name;
              if (typeName === "Boolean") {
                shouldCast = true;
                break;
              } else if (typeName === "String") {
                shouldCastTrue = false;
              }
            }
          } else {
            shouldCast = isFunction(propType) && propType.name === "Boolean";
          }
          prop[
            0
            /* shouldCast */
          ] = shouldCast;
          prop[
            1
            /* shouldCastTrue */
          ] = shouldCastTrue;
          if (shouldCast || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
    const res = [normalized, needCastKeys];
    if (isObject(comp)) {
      cache.set(comp, res);
    }
    return res;
  }
  function validatePropName(key) {
    if (key[0] !== "$" && !isReservedProp(key)) {
      return true;
    }
    return false;
  }
  const isInternalKey = (key) => key === "_" || key === "_ctx" || key === "$stable";
  const normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
  const normalizeSlot = (key, rawSlot, ctx) => {
    if (rawSlot._n) {
      return rawSlot;
    }
    const normalized = withCtx((...args) => {
      if (false) ;
      return normalizeSlotValue(rawSlot(...args));
    }, ctx);
    normalized._c = false;
    return normalized;
  };
  const normalizeObjectSlots = (rawSlots, slots, instance) => {
    const ctx = rawSlots._ctx;
    for (const key in rawSlots) {
      if (isInternalKey(key)) continue;
      const value = rawSlots[key];
      if (isFunction(value)) {
        slots[key] = normalizeSlot(key, value, ctx);
      } else if (value != null) {
        const normalized = normalizeSlotValue(value);
        slots[key] = () => normalized;
      }
    }
  };
  const normalizeVNodeSlots = (instance, children) => {
    const normalized = normalizeSlotValue(children);
    instance.slots.default = () => normalized;
  };
  const assignSlots = (slots, children, optimized) => {
    for (const key in children) {
      if (optimized || !isInternalKey(key)) {
        slots[key] = children[key];
      }
    }
  };
  const initSlots = (instance, children, optimized) => {
    const slots = instance.slots = createInternalObject();
    if (instance.vnode.shapeFlag & 32) {
      const type = children._;
      if (type) {
        assignSlots(slots, children, optimized);
        if (optimized) {
          def(slots, "_", type, true);
        }
      } else {
        normalizeObjectSlots(children, slots);
      }
    } else if (children) {
      normalizeVNodeSlots(instance, children);
    }
  };
  const updateSlots = (instance, children, optimized) => {
    const { vnode, slots } = instance;
    let needDeletionCheck = true;
    let deletionComparisonTarget = EMPTY_OBJ;
    if (vnode.shapeFlag & 32) {
      const type = children._;
      if (type) {
        if (optimized && type === 1) {
          needDeletionCheck = false;
        } else {
          assignSlots(slots, children, optimized);
        }
      } else {
        needDeletionCheck = !children.$stable;
        normalizeObjectSlots(children, slots);
      }
      deletionComparisonTarget = children;
    } else if (children) {
      normalizeVNodeSlots(instance, children);
      deletionComparisonTarget = { default: 1 };
    }
    if (needDeletionCheck) {
      for (const key in slots) {
        if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
          delete slots[key];
        }
      }
    }
  };
  const queuePostRenderEffect = queueEffectWithSuspense;
  function createRenderer(options) {
    return baseCreateRenderer(options);
  }
  function baseCreateRenderer(options, createHydrationFns) {
    const target = getGlobalThis();
    target.__VUE__ = true;
    const {
      insert: hostInsert,
      remove: hostRemove,
      patchProp: hostPatchProp,
      createElement: hostCreateElement,
      createText: hostCreateText,
      createComment: hostCreateComment,
      setText: hostSetText,
      setElementText: hostSetElementText,
      parentNode: hostParentNode,
      nextSibling: hostNextSibling,
      setScopeId: hostSetScopeId = NOOP,
      insertStaticContent: hostInsertStaticContent
    } = options;
    const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
      if (n1 === n2) {
        return;
      }
      if (n1 && !isSameVNodeType(n1, n2)) {
        anchor = getNextHostNode(n1);
        unmount(n1, parentComponent, parentSuspense, true);
        n1 = null;
      }
      if (n2.patchFlag === -2) {
        optimized = false;
        n2.dynamicChildren = null;
      }
      const { type, ref: ref3, shapeFlag } = n2;
      switch (type) {
        case Text:
          processText(n1, n2, container, anchor);
          break;
        case Comment:
          processCommentNode(n1, n2, container, anchor);
          break;
        case Static:
          if (n1 == null) {
            mountStaticNode(n2, container, anchor, namespace);
          }
          break;
        case Fragment:
          processFragment(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          break;
        default:
          if (shapeFlag & 1) {
            processElement(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else if (shapeFlag & 6) {
            processComponent(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else if (shapeFlag & 64) {
            type.process(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized,
              internals
            );
          } else if (shapeFlag & 128) {
            type.process(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized,
              internals
            );
          } else ;
      }
      if (ref3 != null && parentComponent) {
        setRef(ref3, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
      } else if (ref3 == null && n1 && n1.ref != null) {
        setRef(n1.ref, null, parentSuspense, n1, true);
      }
    };
    const processText = (n1, n2, container, anchor) => {
      if (n1 == null) {
        hostInsert(
          n2.el = hostCreateText(n2.children),
          container,
          anchor
        );
      } else {
        const el = n2.el = n1.el;
        if (n2.children !== n1.children) {
          hostSetText(el, n2.children);
        }
      }
    };
    const processCommentNode = (n1, n2, container, anchor) => {
      if (n1 == null) {
        hostInsert(
          n2.el = hostCreateComment(n2.children || ""),
          container,
          anchor
        );
      } else {
        n2.el = n1.el;
      }
    };
    const mountStaticNode = (n2, container, anchor, namespace) => {
      [n2.el, n2.anchor] = hostInsertStaticContent(
        n2.children,
        container,
        anchor,
        namespace,
        n2.el,
        n2.anchor
      );
    };
    const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
      let next;
      while (el && el !== anchor) {
        next = hostNextSibling(el);
        hostInsert(el, container, nextSibling);
        el = next;
      }
      hostInsert(anchor, container, nextSibling);
    };
    const removeStaticNode = ({ el, anchor }) => {
      let next;
      while (el && el !== anchor) {
        next = hostNextSibling(el);
        hostRemove(el);
        el = next;
      }
      hostRemove(anchor);
    };
    const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      if (n2.type === "svg") {
        namespace = "svg";
      } else if (n2.type === "math") {
        namespace = "mathml";
      }
      if (n1 == null) {
        mountElement(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        const customElement = !!(n1.el && n1.el._isVueCE) ? n1.el : null;
        try {
          if (customElement) {
            customElement._beginPatch();
          }
          patchElement(
            n1,
            n2,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } finally {
          if (customElement) {
            customElement._endPatch();
          }
        }
      }
    };
    const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      let el;
      let vnodeHook;
      const { props, shapeFlag, transition, dirs } = vnode;
      el = vnode.el = hostCreateElement(
        vnode.type,
        namespace,
        props && props.is,
        props
      );
      if (shapeFlag & 8) {
        hostSetElementText(el, vnode.children);
      } else if (shapeFlag & 16) {
        mountChildren(
          vnode.children,
          el,
          null,
          parentComponent,
          parentSuspense,
          resolveChildrenNamespace(vnode, namespace),
          slotScopeIds,
          optimized
        );
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "created");
      }
      setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
      if (props) {
        for (const key in props) {
          if (key !== "value" && !isReservedProp(key)) {
            hostPatchProp(el, key, null, props[key], namespace, parentComponent);
          }
        }
        if ("value" in props) {
          hostPatchProp(el, "value", null, props.value, namespace);
        }
        if (vnodeHook = props.onVnodeBeforeMount) {
          invokeVNodeHook(vnodeHook, parentComponent, vnode);
        }
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
      }
      const needCallTransitionHooks = needTransition(parentSuspense, transition);
      if (needCallTransitionHooks) {
        transition.beforeEnter(el);
      }
      hostInsert(el, container, anchor);
      if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          needCallTransitionHooks && transition.enter(el);
          dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
        }, parentSuspense);
      }
    };
    const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
      if (scopeId) {
        hostSetScopeId(el, scopeId);
      }
      if (slotScopeIds) {
        for (let i = 0; i < slotScopeIds.length; i++) {
          hostSetScopeId(el, slotScopeIds[i]);
        }
      }
      if (parentComponent) {
        let subTree = parentComponent.subTree;
        if (vnode === subTree || isSuspense(subTree.type) && (subTree.ssContent === vnode || subTree.ssFallback === vnode)) {
          const parentVNode = parentComponent.vnode;
          setScopeId(
            el,
            parentVNode,
            parentVNode.scopeId,
            parentVNode.slotScopeIds,
            parentComponent.parent
          );
        }
      }
    };
    const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
      for (let i = start; i < children.length; i++) {
        const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
        patch(
          null,
          child,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
    };
    const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      const el = n2.el = n1.el;
      let { patchFlag, dynamicChildren, dirs } = n2;
      patchFlag |= n1.patchFlag & 16;
      const oldProps = n1.props || EMPTY_OBJ;
      const newProps = n2.props || EMPTY_OBJ;
      let vnodeHook;
      parentComponent && toggleRecurse(parentComponent, false);
      if (vnodeHook = newProps.onVnodeBeforeUpdate) {
        invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
      }
      if (dirs) {
        invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
      }
      parentComponent && toggleRecurse(parentComponent, true);
      if (oldProps.innerHTML && newProps.innerHTML == null || oldProps.textContent && newProps.textContent == null) {
        hostSetElementText(el, "");
      }
      if (dynamicChildren) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          el,
          parentComponent,
          parentSuspense,
          resolveChildrenNamespace(n2, namespace),
          slotScopeIds
        );
      } else if (!optimized) {
        patchChildren(
          n1,
          n2,
          el,
          null,
          parentComponent,
          parentSuspense,
          resolveChildrenNamespace(n2, namespace),
          slotScopeIds,
          false
        );
      }
      if (patchFlag > 0) {
        if (patchFlag & 16) {
          patchProps(el, oldProps, newProps, parentComponent, namespace);
        } else {
          if (patchFlag & 2) {
            if (oldProps.class !== newProps.class) {
              hostPatchProp(el, "class", null, newProps.class, namespace);
            }
          }
          if (patchFlag & 4) {
            hostPatchProp(el, "style", oldProps.style, newProps.style, namespace);
          }
          if (patchFlag & 8) {
            const propsToUpdate = n2.dynamicProps;
            for (let i = 0; i < propsToUpdate.length; i++) {
              const key = propsToUpdate[i];
              const prev = oldProps[key];
              const next = newProps[key];
              if (next !== prev || key === "value") {
                hostPatchProp(el, key, prev, next, namespace, parentComponent);
              }
            }
          }
        }
        if (patchFlag & 1) {
          if (n1.children !== n2.children) {
            hostSetElementText(el, n2.children);
          }
        }
      } else if (!optimized && dynamicChildren == null) {
        patchProps(el, oldProps, newProps, parentComponent, namespace);
      }
      if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
          dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
        }, parentSuspense);
      }
    };
    const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
      for (let i = 0; i < newChildren.length; i++) {
        const oldVNode = oldChildren[i];
        const newVNode = newChildren[i];
        const container = (
          // oldVNode may be an errored async setup() component inside Suspense
          // which will not have a mounted element
          oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
          // of the Fragment itself so it can move its children.
          (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
          // which also requires the correct parent container
          !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
          oldVNode.shapeFlag & (6 | 64 | 128)) ? hostParentNode(oldVNode.el) : (
            // In other cases, the parent container is not actually used so we
            // just pass the block element here to avoid a DOM parentNode call.
            fallbackContainer
          )
        );
        patch(
          oldVNode,
          newVNode,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          true
        );
      }
    };
    const patchProps = (el, oldProps, newProps, parentComponent, namespace) => {
      if (oldProps !== newProps) {
        if (oldProps !== EMPTY_OBJ) {
          for (const key in oldProps) {
            if (!isReservedProp(key) && !(key in newProps)) {
              hostPatchProp(
                el,
                key,
                oldProps[key],
                null,
                namespace,
                parentComponent
              );
            }
          }
        }
        for (const key in newProps) {
          if (isReservedProp(key)) continue;
          const next = newProps[key];
          const prev = oldProps[key];
          if (next !== prev && key !== "value") {
            hostPatchProp(el, key, prev, next, namespace, parentComponent);
          }
        }
        if ("value" in newProps) {
          hostPatchProp(el, "value", oldProps.value, newProps.value, namespace);
        }
      }
    };
    const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
      const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
      let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
      if (fragmentSlotScopeIds) {
        slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
      }
      if (n1 == null) {
        hostInsert(fragmentStartAnchor, container, anchor);
        hostInsert(fragmentEndAnchor, container, anchor);
        mountChildren(
          // #10007
          // such fragment like `<></>` will be compiled into
          // a fragment which doesn't have a children.
          // In this case fallback to an empty array
          n2.children || [],
          container,
          fragmentEndAnchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
        // of renderSlot() with no valid children
        n1.dynamicChildren) {
          patchBlockChildren(
            n1.dynamicChildren,
            dynamicChildren,
            container,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds
          );
          if (
            // #2080 if the stable fragment has a key, it's a <template v-for> that may
            //  get moved around. Make sure all root level vnodes inherit el.
            // #2134 or if it's a component root, it may also get moved around
            // as the component is being moved.
            n2.key != null || parentComponent && n2 === parentComponent.subTree
          ) {
            traverseStaticChildren(
              n1,
              n2,
              true
              /* shallow */
            );
          }
        } else {
          patchChildren(
            n1,
            n2,
            container,
            fragmentEndAnchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        }
      }
    };
    const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      n2.slotScopeIds = slotScopeIds;
      if (n1 == null) {
        if (n2.shapeFlag & 512) {
          parentComponent.ctx.activate(
            n2,
            container,
            anchor,
            namespace,
            optimized
          );
        } else {
          mountComponent(
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            optimized
          );
        }
      } else {
        updateComponent(n1, n2, optimized);
      }
    };
    const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
      const instance = initialVNode.component = createComponentInstance(
        initialVNode,
        parentComponent,
        parentSuspense
      );
      if (isKeepAlive(initialVNode)) {
        instance.ctx.renderer = internals;
      }
      {
        setupComponent(instance, false, optimized);
      }
      if (instance.asyncDep) {
        parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect, optimized);
        if (!initialVNode.el) {
          const placeholder = instance.subTree = createVNode(Comment);
          processCommentNode(null, placeholder, container, anchor);
          initialVNode.placeholder = placeholder.el;
        }
      } else {
        setupRenderEffect(
          instance,
          initialVNode,
          container,
          anchor,
          parentSuspense,
          namespace,
          optimized
        );
      }
    };
    const updateComponent = (n1, n2, optimized) => {
      const instance = n2.component = n1.component;
      if (shouldUpdateComponent(n1, n2, optimized)) {
        if (instance.asyncDep && !instance.asyncResolved) {
          updateComponentPreRender(instance, n2, optimized);
          return;
        } else {
          instance.next = n2;
          instance.update();
        }
      } else {
        n2.el = n1.el;
        instance.vnode = n2;
      }
    };
    const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
      const componentUpdateFn = () => {
        if (!instance.isMounted) {
          let vnodeHook;
          const { el, props } = initialVNode;
          const { bm, m, parent, root, type } = instance;
          const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
          toggleRecurse(instance, false);
          if (bm) {
            invokeArrayFns(bm);
          }
          if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
            invokeVNodeHook(vnodeHook, parent, initialVNode);
          }
          toggleRecurse(instance, true);
          {
            if (root.ce && // @ts-expect-error _def is private
            root.ce._def.shadowRoot !== false) {
              root.ce._injectChildStyle(type);
            }
            const subTree = instance.subTree = renderComponentRoot(instance);
            patch(
              null,
              subTree,
              container,
              anchor,
              instance,
              parentSuspense,
              namespace
            );
            initialVNode.el = subTree.el;
          }
          if (m) {
            queuePostRenderEffect(m, parentSuspense);
          }
          if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
            const scopedInitialVNode = initialVNode;
            queuePostRenderEffect(
              () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
              parentSuspense
            );
          }
          if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
            instance.a && queuePostRenderEffect(instance.a, parentSuspense);
          }
          instance.isMounted = true;
          initialVNode = container = anchor = null;
        } else {
          let { next, bu, u, parent, vnode } = instance;
          {
            const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
            if (nonHydratedAsyncRoot) {
              if (next) {
                next.el = vnode.el;
                updateComponentPreRender(instance, next, optimized);
              }
              nonHydratedAsyncRoot.asyncDep.then(() => {
                if (!instance.isUnmounted) {
                  componentUpdateFn();
                }
              });
              return;
            }
          }
          let originNext = next;
          let vnodeHook;
          toggleRecurse(instance, false);
          if (next) {
            next.el = vnode.el;
            updateComponentPreRender(instance, next, optimized);
          } else {
            next = vnode;
          }
          if (bu) {
            invokeArrayFns(bu);
          }
          if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
            invokeVNodeHook(vnodeHook, parent, next, vnode);
          }
          toggleRecurse(instance, true);
          const nextTree = renderComponentRoot(instance);
          const prevTree = instance.subTree;
          instance.subTree = nextTree;
          patch(
            prevTree,
            nextTree,
            // parent may have changed if it's in a teleport
            hostParentNode(prevTree.el),
            // anchor may have changed if it's in a fragment
            getNextHostNode(prevTree),
            instance,
            parentSuspense,
            namespace
          );
          next.el = nextTree.el;
          if (originNext === null) {
            updateHOCHostEl(instance, nextTree.el);
          }
          if (u) {
            queuePostRenderEffect(u, parentSuspense);
          }
          if (vnodeHook = next.props && next.props.onVnodeUpdated) {
            queuePostRenderEffect(
              () => invokeVNodeHook(vnodeHook, parent, next, vnode),
              parentSuspense
            );
          }
        }
      };
      instance.scope.on();
      const effect2 = instance.effect = new ReactiveEffect(componentUpdateFn);
      instance.scope.off();
      const update = instance.update = effect2.run.bind(effect2);
      const job = instance.job = effect2.runIfDirty.bind(effect2);
      job.i = instance;
      job.id = instance.uid;
      effect2.scheduler = () => queueJob(job);
      toggleRecurse(instance, true);
      update();
    };
    const updateComponentPreRender = (instance, nextVNode, optimized) => {
      nextVNode.component = instance;
      const prevProps = instance.vnode.props;
      instance.vnode = nextVNode;
      instance.next = null;
      updateProps(instance, nextVNode.props, prevProps, optimized);
      updateSlots(instance, nextVNode.children, optimized);
      pauseTracking();
      flushPreFlushCbs(instance);
      resetTracking();
    };
    const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
      const c1 = n1 && n1.children;
      const prevShapeFlag = n1 ? n1.shapeFlag : 0;
      const c2 = n2.children;
      const { patchFlag, shapeFlag } = n2;
      if (patchFlag > 0) {
        if (patchFlag & 128) {
          patchKeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          return;
        } else if (patchFlag & 256) {
          patchUnkeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          return;
        }
      }
      if (shapeFlag & 8) {
        if (prevShapeFlag & 16) {
          unmountChildren(c1, parentComponent, parentSuspense);
        }
        if (c2 !== c1) {
          hostSetElementText(container, c2);
        }
      } else {
        if (prevShapeFlag & 16) {
          if (shapeFlag & 16) {
            patchKeyedChildren(
              c1,
              c2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else {
            unmountChildren(c1, parentComponent, parentSuspense, true);
          }
        } else {
          if (prevShapeFlag & 8) {
            hostSetElementText(container, "");
          }
          if (shapeFlag & 16) {
            mountChildren(
              c2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          }
        }
      }
    };
    const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      c1 = c1 || EMPTY_ARR;
      c2 = c2 || EMPTY_ARR;
      const oldLength = c1.length;
      const newLength = c2.length;
      const commonLength = Math.min(oldLength, newLength);
      let i;
      for (i = 0; i < commonLength; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        patch(
          c1[i],
          nextChild,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
      if (oldLength > newLength) {
        unmountChildren(
          c1,
          parentComponent,
          parentSuspense,
          true,
          false,
          commonLength
        );
      } else {
        mountChildren(
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized,
          commonLength
        );
      }
    };
    const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      let i = 0;
      const l2 = c2.length;
      let e1 = c1.length - 1;
      let e2 = l2 - 1;
      while (i <= e1 && i <= e2) {
        const n1 = c1[i];
        const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (isSameVNodeType(n1, n2)) {
          patch(
            n1,
            n2,
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          break;
        }
        i++;
      }
      while (i <= e1 && i <= e2) {
        const n1 = c1[e1];
        const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
        if (isSameVNodeType(n1, n2)) {
          patch(
            n1,
            n2,
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          break;
        }
        e1--;
        e2--;
      }
      if (i > e1) {
        if (i <= e2) {
          const nextPos = e2 + 1;
          const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
          while (i <= e2) {
            patch(
              null,
              c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
            i++;
          }
        }
      } else if (i > e2) {
        while (i <= e1) {
          unmount(c1[i], parentComponent, parentSuspense, true);
          i++;
        }
      } else {
        const s1 = i;
        const s2 = i;
        const keyToNewIndexMap = /* @__PURE__ */ new Map();
        for (i = s2; i <= e2; i++) {
          const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
          if (nextChild.key != null) {
            keyToNewIndexMap.set(nextChild.key, i);
          }
        }
        let j2;
        let patched = 0;
        const toBePatched = e2 - s2 + 1;
        let moved = false;
        let maxNewIndexSoFar = 0;
        const newIndexToOldIndexMap = new Array(toBePatched);
        for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;
        for (i = s1; i <= e1; i++) {
          const prevChild = c1[i];
          if (patched >= toBePatched) {
            unmount(prevChild, parentComponent, parentSuspense, true);
            continue;
          }
          let newIndex;
          if (prevChild.key != null) {
            newIndex = keyToNewIndexMap.get(prevChild.key);
          } else {
            for (j2 = s2; j2 <= e2; j2++) {
              if (newIndexToOldIndexMap[j2 - s2] === 0 && isSameVNodeType(prevChild, c2[j2])) {
                newIndex = j2;
                break;
              }
            }
          }
          if (newIndex === void 0) {
            unmount(prevChild, parentComponent, parentSuspense, true);
          } else {
            newIndexToOldIndexMap[newIndex - s2] = i + 1;
            if (newIndex >= maxNewIndexSoFar) {
              maxNewIndexSoFar = newIndex;
            } else {
              moved = true;
            }
            patch(
              prevChild,
              c2[newIndex],
              container,
              null,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
            patched++;
          }
        }
        const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
        j2 = increasingNewIndexSequence.length - 1;
        for (i = toBePatched - 1; i >= 0; i--) {
          const nextIndex = s2 + i;
          const nextChild = c2[nextIndex];
          const anchorVNode = c2[nextIndex + 1];
          const anchor = nextIndex + 1 < l2 ? (
            // #13559, fallback to el placeholder for unresolved async component
            anchorVNode.el || anchorVNode.placeholder
          ) : parentAnchor;
          if (newIndexToOldIndexMap[i] === 0) {
            patch(
              null,
              nextChild,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else if (moved) {
            if (j2 < 0 || i !== increasingNewIndexSequence[j2]) {
              move(nextChild, container, anchor, 2);
            } else {
              j2--;
            }
          }
        }
      }
    };
    const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
      const { el, type, transition, children, shapeFlag } = vnode;
      if (shapeFlag & 6) {
        move(vnode.component.subTree, container, anchor, moveType);
        return;
      }
      if (shapeFlag & 128) {
        vnode.suspense.move(container, anchor, moveType);
        return;
      }
      if (shapeFlag & 64) {
        type.move(vnode, container, anchor, internals);
        return;
      }
      if (type === Fragment) {
        hostInsert(el, container, anchor);
        for (let i = 0; i < children.length; i++) {
          move(children[i], container, anchor, moveType);
        }
        hostInsert(vnode.anchor, container, anchor);
        return;
      }
      if (type === Static) {
        moveStaticNode(vnode, container, anchor);
        return;
      }
      const needTransition2 = moveType !== 2 && shapeFlag & 1 && transition;
      if (needTransition2) {
        if (moveType === 0) {
          transition.beforeEnter(el);
          hostInsert(el, container, anchor);
          queuePostRenderEffect(() => transition.enter(el), parentSuspense);
        } else {
          const { leave, delayLeave, afterLeave } = transition;
          const remove22 = () => {
            if (vnode.ctx.isUnmounted) {
              hostRemove(el);
            } else {
              hostInsert(el, container, anchor);
            }
          };
          const performLeave = () => {
            if (el._isLeaving) {
              el[leaveCbKey](
                true
                /* cancelled */
              );
            }
            leave(el, () => {
              remove22();
              afterLeave && afterLeave();
            });
          };
          if (delayLeave) {
            delayLeave(el, remove22, performLeave);
          } else {
            performLeave();
          }
        }
      } else {
        hostInsert(el, container, anchor);
      }
    };
    const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
      const {
        type,
        props,
        ref: ref3,
        children,
        dynamicChildren,
        shapeFlag,
        patchFlag,
        dirs,
        cacheIndex
      } = vnode;
      if (patchFlag === -2) {
        optimized = false;
      }
      if (ref3 != null) {
        pauseTracking();
        setRef(ref3, null, parentSuspense, vnode, true);
        resetTracking();
      }
      if (cacheIndex != null) {
        parentComponent.renderCache[cacheIndex] = void 0;
      }
      if (shapeFlag & 256) {
        parentComponent.ctx.deactivate(vnode);
        return;
      }
      const shouldInvokeDirs = shapeFlag & 1 && dirs;
      const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
      let vnodeHook;
      if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
      if (shapeFlag & 6) {
        unmountComponent(vnode.component, parentSuspense, doRemove);
      } else {
        if (shapeFlag & 128) {
          vnode.suspense.unmount(parentSuspense, doRemove);
          return;
        }
        if (shouldInvokeDirs) {
          invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
        }
        if (shapeFlag & 64) {
          vnode.type.remove(
            vnode,
            parentComponent,
            parentSuspense,
            internals,
            doRemove
          );
        } else if (dynamicChildren && // #5154
        // when v-once is used inside a block, setBlockTracking(-1) marks the
        // parent block with hasOnce: true
        // so that it doesn't take the fast path during unmount - otherwise
        // components nested in v-once are never unmounted.
        !dynamicChildren.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
        (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
          unmountChildren(
            dynamicChildren,
            parentComponent,
            parentSuspense,
            false,
            true
          );
        } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
          unmountChildren(children, parentComponent, parentSuspense);
        }
        if (doRemove) {
          remove2(vnode);
        }
      }
      if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
        }, parentSuspense);
      }
    };
    const remove2 = (vnode) => {
      const { type, el, anchor, transition } = vnode;
      if (type === Fragment) {
        {
          removeFragment(el, anchor);
        }
        return;
      }
      if (type === Static) {
        removeStaticNode(vnode);
        return;
      }
      const performRemove = () => {
        hostRemove(el);
        if (transition && !transition.persisted && transition.afterLeave) {
          transition.afterLeave();
        }
      };
      if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
        const { leave, delayLeave } = transition;
        const performLeave = () => leave(el, performRemove);
        if (delayLeave) {
          delayLeave(vnode.el, performRemove, performLeave);
        } else {
          performLeave();
        }
      } else {
        performRemove();
      }
    };
    const removeFragment = (cur, end) => {
      let next;
      while (cur !== end) {
        next = hostNextSibling(cur);
        hostRemove(cur);
        cur = next;
      }
      hostRemove(end);
    };
    const unmountComponent = (instance, parentSuspense, doRemove) => {
      const { bum, scope, job, subTree, um, m, a } = instance;
      invalidateMount(m);
      invalidateMount(a);
      if (bum) {
        invokeArrayFns(bum);
      }
      scope.stop();
      if (job) {
        job.flags |= 8;
        unmount(subTree, instance, parentSuspense, doRemove);
      }
      if (um) {
        queuePostRenderEffect(um, parentSuspense);
      }
      queuePostRenderEffect(() => {
        instance.isUnmounted = true;
      }, parentSuspense);
    };
    const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
      for (let i = start; i < children.length; i++) {
        unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
      }
    };
    const getNextHostNode = (vnode) => {
      if (vnode.shapeFlag & 6) {
        return getNextHostNode(vnode.component.subTree);
      }
      if (vnode.shapeFlag & 128) {
        return vnode.suspense.next();
      }
      const el = hostNextSibling(vnode.anchor || vnode.el);
      const teleportEnd = el && el[TeleportEndKey];
      return teleportEnd ? hostNextSibling(teleportEnd) : el;
    };
    let isFlushing = false;
    const render2 = (vnode, container, namespace) => {
      if (vnode == null) {
        if (container._vnode) {
          unmount(container._vnode, null, null, true);
        }
      } else {
        patch(
          container._vnode || null,
          vnode,
          container,
          null,
          null,
          null,
          namespace
        );
      }
      container._vnode = vnode;
      if (!isFlushing) {
        isFlushing = true;
        flushPreFlushCbs();
        flushPostFlushCbs();
        isFlushing = false;
      }
    };
    const internals = {
      p: patch,
      um: unmount,
      m: move,
      r: remove2,
      mt: mountComponent,
      mc: mountChildren,
      pc: patchChildren,
      pbc: patchBlockChildren,
      n: getNextHostNode,
      o: options
    };
    let hydrate;
    return {
      render: render2,
      hydrate,
      createApp: createAppAPI(render2)
    };
  }
  function resolveChildrenNamespace({ type, props }, currentNamespace) {
    return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
  }
  function toggleRecurse({ effect: effect2, job }, allowed) {
    if (allowed) {
      effect2.flags |= 32;
      job.flags |= 4;
    } else {
      effect2.flags &= -33;
      job.flags &= -5;
    }
  }
  function needTransition(parentSuspense, transition) {
    return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
  }
  function traverseStaticChildren(n1, n2, shallow = false) {
    const ch1 = n1.children;
    const ch2 = n2.children;
    if (isArray(ch1) && isArray(ch2)) {
      for (let i = 0; i < ch1.length; i++) {
        const c1 = ch1[i];
        let c2 = ch2[i];
        if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
          if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
            c2 = ch2[i] = cloneIfMounted(ch2[i]);
            c2.el = c1.el;
          }
          if (!shallow && c2.patchFlag !== -2)
            traverseStaticChildren(c1, c2);
        }
        if (c2.type === Text && // avoid cached text nodes retaining detached dom nodes
        c2.patchFlag !== -1) {
          c2.el = c1.el;
        }
        if (c2.type === Comment && !c2.el) {
          c2.el = c1.el;
        }
      }
    }
  }
  function getSequence(arr) {
    const p2 = arr.slice();
    const result = [0];
    let i, j2, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
      const arrI = arr[i];
      if (arrI !== 0) {
        j2 = result[result.length - 1];
        if (arr[j2] < arrI) {
          p2[i] = j2;
          result.push(i);
          continue;
        }
        u = 0;
        v = result.length - 1;
        while (u < v) {
          c = u + v >> 1;
          if (arr[result[c]] < arrI) {
            u = c + 1;
          } else {
            v = c;
          }
        }
        if (arrI < arr[result[u]]) {
          if (u > 0) {
            p2[i] = result[u - 1];
          }
          result[u] = i;
        }
      }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
      result[u] = v;
      v = p2[v];
    }
    return result;
  }
  function locateNonHydratedAsyncRoot(instance) {
    const subComponent = instance.subTree.component;
    if (subComponent) {
      if (subComponent.asyncDep && !subComponent.asyncResolved) {
        return subComponent;
      } else {
        return locateNonHydratedAsyncRoot(subComponent);
      }
    }
  }
  function invalidateMount(hooks) {
    if (hooks) {
      for (let i = 0; i < hooks.length; i++)
        hooks[i].flags |= 8;
    }
  }
  const isSuspense = (type) => type.__isSuspense;
  function queueEffectWithSuspense(fn, suspense) {
    if (suspense && suspense.pendingBranch) {
      if (isArray(fn)) {
        suspense.effects.push(...fn);
      } else {
        suspense.effects.push(fn);
      }
    } else {
      queuePostFlushCb(fn);
    }
  }
  const Fragment = Symbol.for("v-fgt");
  const Text = Symbol.for("v-txt");
  const Comment = Symbol.for("v-cmt");
  const Static = Symbol.for("v-stc");
  const blockStack = [];
  let currentBlock = null;
  function openBlock(disableTracking = false) {
    blockStack.push(currentBlock = disableTracking ? null : []);
  }
  function closeBlock() {
    blockStack.pop();
    currentBlock = blockStack[blockStack.length - 1] || null;
  }
  let isBlockTreeEnabled = 1;
  function setBlockTracking(value, inVOnce = false) {
    isBlockTreeEnabled += value;
    if (value < 0 && currentBlock && inVOnce) {
      currentBlock.hasOnce = true;
    }
  }
  function setupBlock(vnode) {
    vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
    closeBlock();
    if (isBlockTreeEnabled > 0 && currentBlock) {
      currentBlock.push(vnode);
    }
    return vnode;
  }
  function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
    return setupBlock(
      createBaseVNode(
        type,
        props,
        children,
        patchFlag,
        dynamicProps,
        shapeFlag,
        true
      )
    );
  }
  function createBlock(type, props, children, patchFlag, dynamicProps) {
    return setupBlock(
      createVNode(
        type,
        props,
        children,
        patchFlag,
        dynamicProps,
        true
      )
    );
  }
  function isVNode(value) {
    return value ? value.__v_isVNode === true : false;
  }
  function isSameVNodeType(n1, n2) {
    return n1.type === n2.type && n1.key === n2.key;
  }
  const normalizeKey = ({ key }) => key != null ? key : null;
  const normalizeRef = ({
    ref: ref3,
    ref_key,
    ref_for
  }) => {
    if (typeof ref3 === "number") {
      ref3 = "" + ref3;
    }
    return ref3 != null ? isString(ref3) || isRef(ref3) || isFunction(ref3) ? { i: currentRenderingInstance, r: ref3, k: ref_key, f: !!ref_for } : ref3 : null;
  };
  function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
    const vnode = {
      __v_isVNode: true,
      __v_skip: true,
      type,
      props,
      key: props && normalizeKey(props),
      ref: props && normalizeRef(props),
      scopeId: currentScopeId,
      slotScopeIds: null,
      children,
      component: null,
      suspense: null,
      ssContent: null,
      ssFallback: null,
      dirs: null,
      transition: null,
      el: null,
      anchor: null,
      target: null,
      targetStart: null,
      targetAnchor: null,
      staticCount: 0,
      shapeFlag,
      patchFlag,
      dynamicProps,
      dynamicChildren: null,
      appContext: null,
      ctx: currentRenderingInstance
    };
    if (needFullChildrenNormalization) {
      normalizeChildren(vnode, children);
      if (shapeFlag & 128) {
        type.normalize(vnode);
      }
    } else if (children) {
      vnode.shapeFlag |= isString(children) ? 8 : 16;
    }
    if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
    !isBlockNode && // has current parent block
    currentBlock && // presence of a patch flag indicates this node needs patching on updates.
    // component nodes also should always be patched, because even if the
    // component doesn't need to update, it needs to persist the instance on to
    // the next vnode so that it can be properly unmounted later.
    (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
    // vnode should not be considered dynamic due to handler caching.
    vnode.patchFlag !== 32) {
      currentBlock.push(vnode);
    }
    return vnode;
  }
  const createVNode = _createVNode;
  function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
    if (!type || type === NULL_DYNAMIC_COMPONENT) {
      type = Comment;
    }
    if (isVNode(type)) {
      const cloned = cloneVNode(
        type,
        props,
        true
        /* mergeRef: true */
      );
      if (children) {
        normalizeChildren(cloned, children);
      }
      if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
        if (cloned.shapeFlag & 6) {
          currentBlock[currentBlock.indexOf(type)] = cloned;
        } else {
          currentBlock.push(cloned);
        }
      }
      cloned.patchFlag = -2;
      return cloned;
    }
    if (isClassComponent(type)) {
      type = type.__vccOpts;
    }
    if (props) {
      props = guardReactiveProps(props);
      let { class: klass, style } = props;
      if (klass && !isString(klass)) {
        props.class = normalizeClass(klass);
      }
      if (isObject(style)) {
        if (isProxy(style) && !isArray(style)) {
          style = extend({}, style);
        }
        props.style = normalizeStyle(style);
      }
    }
    const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
    return createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      isBlockNode,
      true
    );
  }
  function guardReactiveProps(props) {
    if (!props) return null;
    return isProxy(props) || isInternalObject(props) ? extend({}, props) : props;
  }
  function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
    const { props, ref: ref3, patchFlag, children, transition } = vnode;
    const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
    const cloned = {
      __v_isVNode: true,
      __v_skip: true,
      type: vnode.type,
      props: mergedProps,
      key: mergedProps && normalizeKey(mergedProps),
      ref: extraProps && extraProps.ref ? (
        // #2078 in the case of <component :is="vnode" ref="extra"/>
        // if the vnode itself already has a ref, cloneVNode will need to merge
        // the refs so the single vnode can be set on multiple refs
        mergeRef && ref3 ? isArray(ref3) ? ref3.concat(normalizeRef(extraProps)) : [ref3, normalizeRef(extraProps)] : normalizeRef(extraProps)
      ) : ref3,
      scopeId: vnode.scopeId,
      slotScopeIds: vnode.slotScopeIds,
      children,
      target: vnode.target,
      targetStart: vnode.targetStart,
      targetAnchor: vnode.targetAnchor,
      staticCount: vnode.staticCount,
      shapeFlag: vnode.shapeFlag,
      // if the vnode is cloned with extra props, we can no longer assume its
      // existing patch flag to be reliable and need to add the FULL_PROPS flag.
      // note: preserve flag for fragments since they use the flag for children
      // fast paths only.
      patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
      dynamicProps: vnode.dynamicProps,
      dynamicChildren: vnode.dynamicChildren,
      appContext: vnode.appContext,
      dirs: vnode.dirs,
      transition,
      // These should technically only be non-null on mounted VNodes. However,
      // they *should* be copied for kept-alive vnodes. So we just always copy
      // them since them being non-null during a mount doesn't affect the logic as
      // they will simply be overwritten.
      component: vnode.component,
      suspense: vnode.suspense,
      ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
      ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
      placeholder: vnode.placeholder,
      el: vnode.el,
      anchor: vnode.anchor,
      ctx: vnode.ctx,
      ce: vnode.ce
    };
    if (transition && cloneTransition) {
      setTransitionHooks(
        cloned,
        transition.clone(cloned)
      );
    }
    return cloned;
  }
  function createTextVNode(text = " ", flag = 0) {
    return createVNode(Text, null, text, flag);
  }
  function createCommentVNode(text = "", asBlock = false) {
    return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
  }
  function normalizeVNode(child) {
    if (child == null || typeof child === "boolean") {
      return createVNode(Comment);
    } else if (isArray(child)) {
      return createVNode(
        Fragment,
        null,
        // #3666, avoid reference pollution when reusing vnode
        child.slice()
      );
    } else if (isVNode(child)) {
      return cloneIfMounted(child);
    } else {
      return createVNode(Text, null, String(child));
    }
  }
  function cloneIfMounted(child) {
    return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
  }
  function normalizeChildren(vnode, children) {
    let type = 0;
    const { shapeFlag } = vnode;
    if (children == null) {
      children = null;
    } else if (isArray(children)) {
      type = 16;
    } else if (typeof children === "object") {
      if (shapeFlag & (1 | 64)) {
        const slot = children.default;
        if (slot) {
          slot._c && (slot._d = false);
          normalizeChildren(vnode, slot());
          slot._c && (slot._d = true);
        }
        return;
      } else {
        type = 32;
        const slotFlag = children._;
        if (!slotFlag && !isInternalObject(children)) {
          children._ctx = currentRenderingInstance;
        } else if (slotFlag === 3 && currentRenderingInstance) {
          if (currentRenderingInstance.slots._ === 1) {
            children._ = 1;
          } else {
            children._ = 2;
            vnode.patchFlag |= 1024;
          }
        }
      }
    } else if (isFunction(children)) {
      children = { default: children, _ctx: currentRenderingInstance };
      type = 32;
    } else {
      children = String(children);
      if (shapeFlag & 64) {
        type = 16;
        children = [createTextVNode(children)];
      } else {
        type = 8;
      }
    }
    vnode.children = children;
    vnode.shapeFlag |= type;
  }
  function mergeProps(...args) {
    const ret = {};
    for (let i = 0; i < args.length; i++) {
      const toMerge = args[i];
      for (const key in toMerge) {
        if (key === "class") {
          if (ret.class !== toMerge.class) {
            ret.class = normalizeClass([ret.class, toMerge.class]);
          }
        } else if (key === "style") {
          ret.style = normalizeStyle([ret.style, toMerge.style]);
        } else if (isOn(key)) {
          const existing = ret[key];
          const incoming = toMerge[key];
          if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
            ret[key] = existing ? [].concat(existing, incoming) : incoming;
          }
        } else if (key !== "") {
          ret[key] = toMerge[key];
        }
      }
    }
    return ret;
  }
  function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
    callWithAsyncErrorHandling(hook, instance, 7, [
      vnode,
      prevVNode
    ]);
  }
  const emptyAppContext = createAppContext();
  let uid = 0;
  function createComponentInstance(vnode, parent, suspense) {
    const type = vnode.type;
    const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
    const instance = {
      uid: uid++,
      vnode,
      type,
      parent,
      appContext,
      root: null,
      // to be immediately set
      next: null,
      subTree: null,
      // will be set synchronously right after creation
      effect: null,
      update: null,
      // will be set synchronously right after creation
      job: null,
      scope: new EffectScope(
        true
        /* detached */
      ),
      render: null,
      proxy: null,
      exposed: null,
      exposeProxy: null,
      withProxy: null,
      provides: parent ? parent.provides : Object.create(appContext.provides),
      ids: parent ? parent.ids : ["", 0, 0],
      accessCache: null,
      renderCache: [],
      // local resolved assets
      components: null,
      directives: null,
      // resolved props and emits options
      propsOptions: normalizePropsOptions(type, appContext),
      emitsOptions: normalizeEmitsOptions(type, appContext),
      // emit
      emit: null,
      // to be set immediately
      emitted: null,
      // props default value
      propsDefaults: EMPTY_OBJ,
      // inheritAttrs
      inheritAttrs: type.inheritAttrs,
      // state
      ctx: EMPTY_OBJ,
      data: EMPTY_OBJ,
      props: EMPTY_OBJ,
      attrs: EMPTY_OBJ,
      slots: EMPTY_OBJ,
      refs: EMPTY_OBJ,
      setupState: EMPTY_OBJ,
      setupContext: null,
      // suspense related
      suspense,
      suspenseId: suspense ? suspense.pendingId : 0,
      asyncDep: null,
      asyncResolved: false,
      // lifecycle hooks
      // not using enums here because it results in computed properties
      isMounted: false,
      isUnmounted: false,
      isDeactivated: false,
      bc: null,
      c: null,
      bm: null,
      m: null,
      bu: null,
      u: null,
      um: null,
      bum: null,
      da: null,
      a: null,
      rtg: null,
      rtc: null,
      ec: null,
      sp: null
    };
    {
      instance.ctx = { _: instance };
    }
    instance.root = parent ? parent.root : instance;
    instance.emit = emit.bind(null, instance);
    if (vnode.ce) {
      vnode.ce(instance);
    }
    return instance;
  }
  let currentInstance = null;
  const getCurrentInstance = () => currentInstance || currentRenderingInstance;
  let internalSetCurrentInstance;
  let setInSSRSetupState;
  {
    const g = getGlobalThis();
    const registerGlobalSetter = (key, setter) => {
      let setters;
      if (!(setters = g[key])) setters = g[key] = [];
      setters.push(setter);
      return (v) => {
        if (setters.length > 1) setters.forEach((set) => set(v));
        else setters[0](v);
      };
    };
    internalSetCurrentInstance = registerGlobalSetter(
      `__VUE_INSTANCE_SETTERS__`,
      (v) => currentInstance = v
    );
    setInSSRSetupState = registerGlobalSetter(
      `__VUE_SSR_SETTERS__`,
      (v) => isInSSRComponentSetup = v
    );
  }
  const setCurrentInstance = (instance) => {
    const prev = currentInstance;
    internalSetCurrentInstance(instance);
    instance.scope.on();
    return () => {
      instance.scope.off();
      internalSetCurrentInstance(prev);
    };
  };
  const unsetCurrentInstance = () => {
    currentInstance && currentInstance.scope.off();
    internalSetCurrentInstance(null);
  };
  function isStatefulComponent(instance) {
    return instance.vnode.shapeFlag & 4;
  }
  let isInSSRComponentSetup = false;
  function setupComponent(instance, isSSR = false, optimized = false) {
    isSSR && setInSSRSetupState(isSSR);
    const { props, children } = instance.vnode;
    const isStateful = isStatefulComponent(instance);
    initProps(instance, props, isStateful, isSSR);
    initSlots(instance, children, optimized || isSSR);
    const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
    isSSR && setInSSRSetupState(false);
    return setupResult;
  }
  function setupStatefulComponent(instance, isSSR) {
    const Component = instance.type;
    instance.accessCache = /* @__PURE__ */ Object.create(null);
    instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
    const { setup } = Component;
    if (setup) {
      pauseTracking();
      const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
      const reset = setCurrentInstance(instance);
      const setupResult = callWithErrorHandling(
        setup,
        instance,
        0,
        [
          instance.props,
          setupContext
        ]
      );
      const isAsyncSetup = isPromise(setupResult);
      resetTracking();
      reset();
      if ((isAsyncSetup || instance.sp) && !isAsyncWrapper(instance)) {
        markAsyncBoundary(instance);
      }
      if (isAsyncSetup) {
        setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
        if (isSSR) {
          return setupResult.then((resolvedResult) => {
            handleSetupResult(instance, resolvedResult);
          }).catch((e) => {
            handleError(e, instance, 0);
          });
        } else {
          instance.asyncDep = setupResult;
        }
      } else {
        handleSetupResult(instance, setupResult);
      }
    } else {
      finishComponentSetup(instance);
    }
  }
  function handleSetupResult(instance, setupResult, isSSR) {
    if (isFunction(setupResult)) {
      if (instance.type.__ssrInlineRender) {
        instance.ssrRender = setupResult;
      } else {
        instance.render = setupResult;
      }
    } else if (isObject(setupResult)) {
      instance.setupState = proxyRefs(setupResult);
    } else ;
    finishComponentSetup(instance);
  }
  function finishComponentSetup(instance, isSSR, skipOptions) {
    const Component = instance.type;
    if (!instance.render) {
      instance.render = Component.render || NOOP;
    }
    {
      const reset = setCurrentInstance(instance);
      pauseTracking();
      try {
        applyOptions(instance);
      } finally {
        resetTracking();
        reset();
      }
    }
  }
  const attrsProxyHandlers = {
    get(target, key) {
      track(target, "get", "");
      return target[key];
    }
  };
  function createSetupContext(instance) {
    const expose = (exposed) => {
      instance.exposed = exposed || {};
    };
    {
      return {
        attrs: new Proxy(instance.attrs, attrsProxyHandlers),
        slots: instance.slots,
        emit: instance.emit,
        expose
      };
    }
  }
  function getComponentPublicInstance(instance) {
    if (instance.exposed) {
      return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
        get(target, key) {
          if (key in target) {
            return target[key];
          } else if (key in publicPropertiesMap) {
            return publicPropertiesMap[key](instance);
          }
        },
        has(target, key) {
          return key in target || key in publicPropertiesMap;
        }
      }));
    } else {
      return instance.proxy;
    }
  }
  const classifyRE = /(?:^|[-_])\w/g;
  const classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
  function getComponentName(Component, includeInferred = true) {
    return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
  }
  function formatComponentName(instance, Component, isRoot = false) {
    let name = getComponentName(Component);
    if (!name && Component.__file) {
      const match = Component.__file.match(/([^/\\]+)\.\w+$/);
      if (match) {
        name = match[1];
      }
    }
    if (!name && instance) {
      const inferFromRegistry = (registry) => {
        for (const key in registry) {
          if (registry[key] === Component) {
            return key;
          }
        }
      };
      name = inferFromRegistry(instance.components) || instance.parent && inferFromRegistry(
        instance.parent.type.components
      ) || inferFromRegistry(instance.appContext.components);
    }
    return name ? classify(name) : isRoot ? `App` : `Anonymous`;
  }
  function isClassComponent(value) {
    return isFunction(value) && "__vccOpts" in value;
  }
  const computed = (getterOrOptions, debugOptions) => {
    const c = computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
    return c;
  };
  function h(type, propsOrChildren, children) {
    try {
      setBlockTracking(-1);
      const l = arguments.length;
      if (l === 2) {
        if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
          if (isVNode(propsOrChildren)) {
            return createVNode(type, null, [propsOrChildren]);
          }
          return createVNode(type, propsOrChildren);
        } else {
          return createVNode(type, null, propsOrChildren);
        }
      } else {
        if (l > 3) {
          children = Array.prototype.slice.call(arguments, 2);
        } else if (l === 3 && isVNode(children)) {
          children = [children];
        }
        return createVNode(type, propsOrChildren, children);
      }
    } finally {
      setBlockTracking(1);
    }
  }
  const version = "3.5.25";
  /**
  * @vue/runtime-dom v3.5.25
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  let policy = void 0;
  const tt$1 = typeof window !== "undefined" && window.trustedTypes;
  if (tt$1) {
    try {
      policy = /* @__PURE__ */ tt$1.createPolicy("vue", {
        createHTML: (val) => val
      });
    } catch (e) {
    }
  }
  const unsafeToTrustedHTML = policy ? (val) => policy.createHTML(val) : (val) => val;
  const svgNS = "http://www.w3.org/2000/svg";
  const mathmlNS = "http://www.w3.org/1998/Math/MathML";
  const doc = typeof document !== "undefined" ? document : null;
  const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
  const nodeOps = {
    insert: (child, parent, anchor) => {
      parent.insertBefore(child, anchor || null);
    },
    remove: (child) => {
      const parent = child.parentNode;
      if (parent) {
        parent.removeChild(child);
      }
    },
    createElement: (tag, namespace, is, props) => {
      const el = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : is ? doc.createElement(tag, { is }) : doc.createElement(tag);
      if (tag === "select" && props && props.multiple != null) {
        el.setAttribute("multiple", props.multiple);
      }
      return el;
    },
    createText: (text) => doc.createTextNode(text),
    createComment: (text) => doc.createComment(text),
    setText: (node, text) => {
      node.nodeValue = text;
    },
    setElementText: (el, text) => {
      el.textContent = text;
    },
    parentNode: (node) => node.parentNode,
    nextSibling: (node) => node.nextSibling,
    querySelector: (selector) => doc.querySelector(selector),
    setScopeId(el, id) {
      el.setAttribute(id, "");
    },
    // __UNSAFE__
    // Reason: innerHTML.
    // Static content here can only come from compiled templates.
    // As long as the user only uses trusted templates, this is safe.
    insertStaticContent(content, parent, anchor, namespace, start, end) {
      const before = anchor ? anchor.previousSibling : parent.lastChild;
      if (start && (start === end || start.nextSibling)) {
        while (true) {
          parent.insertBefore(start.cloneNode(true), anchor);
          if (start === end || !(start = start.nextSibling)) break;
        }
      } else {
        templateContainer.innerHTML = unsafeToTrustedHTML(
          namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content
        );
        const template = templateContainer.content;
        if (namespace === "svg" || namespace === "mathml") {
          const wrapper = template.firstChild;
          while (wrapper.firstChild) {
            template.appendChild(wrapper.firstChild);
          }
          template.removeChild(wrapper);
        }
        parent.insertBefore(template, anchor);
      }
      return [
        // first
        before ? before.nextSibling : parent.firstChild,
        // last
        anchor ? anchor.previousSibling : parent.lastChild
      ];
    }
  };
  const TRANSITION = "transition";
  const ANIMATION = "animation";
  const vtcKey = Symbol("_vtc");
  const DOMTransitionPropsValidators = {
    name: String,
    type: String,
    css: {
      type: Boolean,
      default: true
    },
    duration: [String, Number, Object],
    enterFromClass: String,
    enterActiveClass: String,
    enterToClass: String,
    appearFromClass: String,
    appearActiveClass: String,
    appearToClass: String,
    leaveFromClass: String,
    leaveActiveClass: String,
    leaveToClass: String
  };
  const TransitionPropsValidators = /* @__PURE__ */ extend(
    {},
    BaseTransitionPropsValidators,
    DOMTransitionPropsValidators
  );
  const decorate$1 = (t) => {
    t.displayName = "Transition";
    t.props = TransitionPropsValidators;
    return t;
  };
  const Transition = /* @__PURE__ */ decorate$1(
    (props, { slots }) => h(BaseTransition, resolveTransitionProps(props), slots)
  );
  const callHook = (hook, args = []) => {
    if (isArray(hook)) {
      hook.forEach((h2) => h2(...args));
    } else if (hook) {
      hook(...args);
    }
  };
  const hasExplicitCallback = (hook) => {
    return hook ? isArray(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
  };
  function resolveTransitionProps(rawProps) {
    const baseProps = {};
    for (const key in rawProps) {
      if (!(key in DOMTransitionPropsValidators)) {
        baseProps[key] = rawProps[key];
      }
    }
    if (rawProps.css === false) {
      return baseProps;
    }
    const {
      name = "v",
      type,
      duration,
      enterFromClass = `${name}-enter-from`,
      enterActiveClass = `${name}-enter-active`,
      enterToClass = `${name}-enter-to`,
      appearFromClass = enterFromClass,
      appearActiveClass = enterActiveClass,
      appearToClass = enterToClass,
      leaveFromClass = `${name}-leave-from`,
      leaveActiveClass = `${name}-leave-active`,
      leaveToClass = `${name}-leave-to`
    } = rawProps;
    const durations = normalizeDuration(duration);
    const enterDuration = durations && durations[0];
    const leaveDuration = durations && durations[1];
    const {
      onBeforeEnter,
      onEnter,
      onEnterCancelled,
      onLeave,
      onLeaveCancelled,
      onBeforeAppear = onBeforeEnter,
      onAppear = onEnter,
      onAppearCancelled = onEnterCancelled
    } = baseProps;
    const finishEnter = (el, isAppear, done, isCancelled) => {
      el._enterCancelled = isCancelled;
      removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
      removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
      done && done();
    };
    const finishLeave = (el, done) => {
      el._isLeaving = false;
      removeTransitionClass(el, leaveFromClass);
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
      done && done();
    };
    const makeEnterHook = (isAppear) => {
      return (el, done) => {
        const hook = isAppear ? onAppear : onEnter;
        const resolve = () => finishEnter(el, isAppear, done);
        callHook(hook, [el, resolve]);
        nextFrame(() => {
          removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
          addTransitionClass(el, isAppear ? appearToClass : enterToClass);
          if (!hasExplicitCallback(hook)) {
            whenTransitionEnds(el, type, enterDuration, resolve);
          }
        });
      };
    };
    return extend(baseProps, {
      onBeforeEnter(el) {
        callHook(onBeforeEnter, [el]);
        addTransitionClass(el, enterFromClass);
        addTransitionClass(el, enterActiveClass);
      },
      onBeforeAppear(el) {
        callHook(onBeforeAppear, [el]);
        addTransitionClass(el, appearFromClass);
        addTransitionClass(el, appearActiveClass);
      },
      onEnter: makeEnterHook(false),
      onAppear: makeEnterHook(true),
      onLeave(el, done) {
        el._isLeaving = true;
        const resolve = () => finishLeave(el, done);
        addTransitionClass(el, leaveFromClass);
        if (!el._enterCancelled) {
          forceReflow(el);
          addTransitionClass(el, leaveActiveClass);
        } else {
          addTransitionClass(el, leaveActiveClass);
          forceReflow(el);
        }
        nextFrame(() => {
          if (!el._isLeaving) {
            return;
          }
          removeTransitionClass(el, leaveFromClass);
          addTransitionClass(el, leaveToClass);
          if (!hasExplicitCallback(onLeave)) {
            whenTransitionEnds(el, type, leaveDuration, resolve);
          }
        });
        callHook(onLeave, [el, resolve]);
      },
      onEnterCancelled(el) {
        finishEnter(el, false, void 0, true);
        callHook(onEnterCancelled, [el]);
      },
      onAppearCancelled(el) {
        finishEnter(el, true, void 0, true);
        callHook(onAppearCancelled, [el]);
      },
      onLeaveCancelled(el) {
        finishLeave(el);
        callHook(onLeaveCancelled, [el]);
      }
    });
  }
  function normalizeDuration(duration) {
    if (duration == null) {
      return null;
    } else if (isObject(duration)) {
      return [NumberOf(duration.enter), NumberOf(duration.leave)];
    } else {
      const n = NumberOf(duration);
      return [n, n];
    }
  }
  function NumberOf(val) {
    const res = toNumber(val);
    return res;
  }
  function addTransitionClass(el, cls) {
    cls.split(/\s+/).forEach((c) => c && el.classList.add(c));
    (el[vtcKey] || (el[vtcKey] = /* @__PURE__ */ new Set())).add(cls);
  }
  function removeTransitionClass(el, cls) {
    cls.split(/\s+/).forEach((c) => c && el.classList.remove(c));
    const _vtc = el[vtcKey];
    if (_vtc) {
      _vtc.delete(cls);
      if (!_vtc.size) {
        el[vtcKey] = void 0;
      }
    }
  }
  function nextFrame(cb) {
    requestAnimationFrame(() => {
      requestAnimationFrame(cb);
    });
  }
  let endId = 0;
  function whenTransitionEnds(el, expectedType, explicitTimeout, resolve) {
    const id = el._endId = ++endId;
    const resolveIfNotStale = () => {
      if (id === el._endId) {
        resolve();
      }
    };
    if (explicitTimeout != null) {
      return setTimeout(resolveIfNotStale, explicitTimeout);
    }
    const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
    if (!type) {
      return resolve();
    }
    const endEvent = type + "end";
    let ended = 0;
    const end = () => {
      el.removeEventListener(endEvent, onEnd);
      resolveIfNotStale();
    };
    const onEnd = (e) => {
      if (e.target === el && ++ended >= propCount) {
        end();
      }
    };
    setTimeout(() => {
      if (ended < propCount) {
        end();
      }
    }, timeout + 1);
    el.addEventListener(endEvent, onEnd);
  }
  function getTransitionInfo(el, expectedType) {
    const styles = window.getComputedStyle(el);
    const getStyleProperties = (key) => (styles[key] || "").split(", ");
    const transitionDelays = getStyleProperties(`${TRANSITION}Delay`);
    const transitionDurations = getStyleProperties(`${TRANSITION}Duration`);
    const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
    const animationDelays = getStyleProperties(`${ANIMATION}Delay`);
    const animationDurations = getStyleProperties(`${ANIMATION}Duration`);
    const animationTimeout = getTimeout(animationDelays, animationDurations);
    let type = null;
    let timeout = 0;
    let propCount = 0;
    if (expectedType === TRANSITION) {
      if (transitionTimeout > 0) {
        type = TRANSITION;
        timeout = transitionTimeout;
        propCount = transitionDurations.length;
      }
    } else if (expectedType === ANIMATION) {
      if (animationTimeout > 0) {
        type = ANIMATION;
        timeout = animationTimeout;
        propCount = animationDurations.length;
      }
    } else {
      timeout = Math.max(transitionTimeout, animationTimeout);
      type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
      propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
    }
    const hasTransform = type === TRANSITION && /\b(?:transform|all)(?:,|$)/.test(
      getStyleProperties(`${TRANSITION}Property`).toString()
    );
    return {
      type,
      timeout,
      propCount,
      hasTransform
    };
  }
  function getTimeout(delays, durations) {
    while (delays.length < durations.length) {
      delays = delays.concat(delays);
    }
    return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
  }
  function toMs(s) {
    if (s === "auto") return 0;
    return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
  }
  function forceReflow(el) {
    const targetDocument = el ? el.ownerDocument : document;
    return targetDocument.body.offsetHeight;
  }
  function patchClass(el, value, isSVG) {
    const transitionClasses = el[vtcKey];
    if (transitionClasses) {
      value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
    }
    if (value == null) {
      el.removeAttribute("class");
    } else if (isSVG) {
      el.setAttribute("class", value);
    } else {
      el.className = value;
    }
  }
  const vShowOriginalDisplay = Symbol("_vod");
  const vShowHidden = Symbol("_vsh");
  const CSS_VAR_TEXT = Symbol("");
  function useCssVars(getter) {
    const instance = getCurrentInstance();
    if (!instance) {
      return;
    }
    const updateTeleports = instance.ut = (vars = getter(instance.proxy)) => {
      Array.from(
        document.querySelectorAll(`[data-v-owner="${instance.uid}"]`)
      ).forEach((node) => setVarsOnNode(node, vars));
    };
    const setVars = () => {
      const vars = getter(instance.proxy);
      if (instance.ce) {
        setVarsOnNode(instance.ce, vars);
      } else {
        setVarsOnVNode(instance.subTree, vars);
      }
      updateTeleports(vars);
    };
    onBeforeUpdate(() => {
      queuePostFlushCb(setVars);
    });
    onMounted(() => {
      watch(setVars, NOOP, { flush: "post" });
      const ob = new MutationObserver(setVars);
      ob.observe(instance.subTree.el.parentNode, { childList: true });
      onUnmounted(() => ob.disconnect());
    });
  }
  function setVarsOnVNode(vnode, vars) {
    if (vnode.shapeFlag & 128) {
      const suspense = vnode.suspense;
      vnode = suspense.activeBranch;
      if (suspense.pendingBranch && !suspense.isHydrating) {
        suspense.effects.push(() => {
          setVarsOnVNode(suspense.activeBranch, vars);
        });
      }
    }
    while (vnode.component) {
      vnode = vnode.component.subTree;
    }
    if (vnode.shapeFlag & 1 && vnode.el) {
      setVarsOnNode(vnode.el, vars);
    } else if (vnode.type === Fragment) {
      vnode.children.forEach((c) => setVarsOnVNode(c, vars));
    } else if (vnode.type === Static) {
      let { el, anchor } = vnode;
      while (el) {
        setVarsOnNode(el, vars);
        if (el === anchor) break;
        el = el.nextSibling;
      }
    }
  }
  function setVarsOnNode(el, vars) {
    if (el.nodeType === 1) {
      const style = el.style;
      let cssText = "";
      for (const key in vars) {
        const value = normalizeCssVarValue(vars[key]);
        style.setProperty(`--${key}`, value);
        cssText += `--${key}: ${value};`;
      }
      style[CSS_VAR_TEXT] = cssText;
    }
  }
  const displayRE = /(?:^|;)\s*display\s*:/;
  function patchStyle(el, prev, next) {
    const style = el.style;
    const isCssString = isString(next);
    let hasControlledDisplay = false;
    if (next && !isCssString) {
      if (prev) {
        if (!isString(prev)) {
          for (const key in prev) {
            if (next[key] == null) {
              setStyle(style, key, "");
            }
          }
        } else {
          for (const prevStyle of prev.split(";")) {
            const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
            if (next[key] == null) {
              setStyle(style, key, "");
            }
          }
        }
      }
      for (const key in next) {
        if (key === "display") {
          hasControlledDisplay = true;
        }
        setStyle(style, key, next[key]);
      }
    } else {
      if (isCssString) {
        if (prev !== next) {
          const cssVarText = style[CSS_VAR_TEXT];
          if (cssVarText) {
            next += ";" + cssVarText;
          }
          style.cssText = next;
          hasControlledDisplay = displayRE.test(next);
        }
      } else if (prev) {
        el.removeAttribute("style");
      }
    }
    if (vShowOriginalDisplay in el) {
      el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
      if (el[vShowHidden]) {
        style.display = "none";
      }
    }
  }
  const importantRE = /\s*!important$/;
  function setStyle(style, name, val) {
    if (isArray(val)) {
      val.forEach((v) => setStyle(style, name, v));
    } else {
      if (val == null) val = "";
      if (name.startsWith("--")) {
        style.setProperty(name, val);
      } else {
        const prefixed = autoPrefix(style, name);
        if (importantRE.test(val)) {
          style.setProperty(
            hyphenate(prefixed),
            val.replace(importantRE, ""),
            "important"
          );
        } else {
          style[prefixed] = val;
        }
      }
    }
  }
  const prefixes = ["Webkit", "Moz", "ms"];
  const prefixCache = {};
  function autoPrefix(style, rawName) {
    const cached = prefixCache[rawName];
    if (cached) {
      return cached;
    }
    let name = camelize(rawName);
    if (name !== "filter" && name in style) {
      return prefixCache[rawName] = name;
    }
    name = capitalize(name);
    for (let i = 0; i < prefixes.length; i++) {
      const prefixed = prefixes[i] + name;
      if (prefixed in style) {
        return prefixCache[rawName] = prefixed;
      }
    }
    return rawName;
  }
  const xlinkNS = "http://www.w3.org/1999/xlink";
  function patchAttr(el, key, value, isSVG, instance, isBoolean = isSpecialBooleanAttr(key)) {
    if (isSVG && key.startsWith("xlink:")) {
      if (value == null) {
        el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
      } else {
        el.setAttributeNS(xlinkNS, key, value);
      }
    } else {
      if (value == null || isBoolean && !includeBooleanAttr(value)) {
        el.removeAttribute(key);
      } else {
        el.setAttribute(
          key,
          isBoolean ? "" : isSymbol(value) ? String(value) : value
        );
      }
    }
  }
  function patchDOMProp(el, key, value, parentComponent, attrName) {
    if (key === "innerHTML" || key === "textContent") {
      if (value != null) {
        el[key] = key === "innerHTML" ? unsafeToTrustedHTML(value) : value;
      }
      return;
    }
    const tag = el.tagName;
    if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
    !tag.includes("-")) {
      const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value;
      const newValue = value == null ? (
        // #11647: value should be set as empty string for null and undefined,
        // but <input type="checkbox"> should be set as 'on'.
        el.type === "checkbox" ? "on" : ""
      ) : String(value);
      if (oldValue !== newValue || !("_value" in el)) {
        el.value = newValue;
      }
      if (value == null) {
        el.removeAttribute(key);
      }
      el._value = value;
      return;
    }
    let needRemove = false;
    if (value === "" || value == null) {
      const type = typeof el[key];
      if (type === "boolean") {
        value = includeBooleanAttr(value);
      } else if (value == null && type === "string") {
        value = "";
        needRemove = true;
      } else if (type === "number") {
        value = 0;
        needRemove = true;
      }
    }
    try {
      el[key] = value;
    } catch (e) {
    }
    needRemove && el.removeAttribute(attrName || key);
  }
  function addEventListener(el, event, handler, options) {
    el.addEventListener(event, handler, options);
  }
  function removeEventListener(el, event, handler, options) {
    el.removeEventListener(event, handler, options);
  }
  const veiKey = Symbol("_vei");
  function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
    const invokers = el[veiKey] || (el[veiKey] = {});
    const existingInvoker = invokers[rawName];
    if (nextValue && existingInvoker) {
      existingInvoker.value = nextValue;
    } else {
      const [name, options] = parseName(rawName);
      if (nextValue) {
        const invoker = invokers[rawName] = createInvoker(
          nextValue,
          instance
        );
        addEventListener(el, name, invoker, options);
      } else if (existingInvoker) {
        removeEventListener(el, name, existingInvoker, options);
        invokers[rawName] = void 0;
      }
    }
  }
  const optionsModifierRE = /(?:Once|Passive|Capture)$/;
  function parseName(name) {
    let options;
    if (optionsModifierRE.test(name)) {
      options = {};
      let m;
      while (m = name.match(optionsModifierRE)) {
        name = name.slice(0, name.length - m[0].length);
        options[m[0].toLowerCase()] = true;
      }
    }
    const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
    return [event, options];
  }
  let cachedNow = 0;
  const p$1 = /* @__PURE__ */ Promise.resolve();
  const getNow = () => cachedNow || (p$1.then(() => cachedNow = 0), cachedNow = Date.now());
  function createInvoker(initialValue, instance) {
    const invoker = (e) => {
      if (!e._vts) {
        e._vts = Date.now();
      } else if (e._vts <= invoker.attached) {
        return;
      }
      callWithAsyncErrorHandling(
        patchStopImmediatePropagation(e, invoker.value),
        instance,
        5,
        [e]
      );
    };
    invoker.value = initialValue;
    invoker.attached = getNow();
    return invoker;
  }
  function patchStopImmediatePropagation(e, value) {
    if (isArray(value)) {
      const originalStop = e.stopImmediatePropagation;
      e.stopImmediatePropagation = () => {
        originalStop.call(e);
        e._stopped = true;
      };
      return value.map(
        (fn) => (e2) => !e2._stopped && fn && fn(e2)
      );
    } else {
      return value;
    }
  }
  const isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // lowercase letter
  key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
  const patchProp = (el, key, prevValue, nextValue, namespace, parentComponent) => {
    const isSVG = namespace === "svg";
    if (key === "class") {
      patchClass(el, nextValue, isSVG);
    } else if (key === "style") {
      patchStyle(el, prevValue, nextValue);
    } else if (isOn(key)) {
      if (!isModelListener(key)) {
        patchEvent(el, key, prevValue, nextValue, parentComponent);
      }
    } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
      patchDOMProp(el, key, nextValue);
      if (!el.tagName.includes("-") && (key === "value" || key === "checked" || key === "selected")) {
        patchAttr(el, key, nextValue, isSVG, parentComponent, key !== "value");
      }
    } else if (
      // #11081 force set props for possible async custom element
      el._isVueCE && (/[A-Z]/.test(key) || !isString(nextValue))
    ) {
      patchDOMProp(el, camelize(key), nextValue, parentComponent, key);
    } else {
      if (key === "true-value") {
        el._trueValue = nextValue;
      } else if (key === "false-value") {
        el._falseValue = nextValue;
      }
      patchAttr(el, key, nextValue, isSVG);
    }
  };
  function shouldSetAsProp(el, key, value, isSVG) {
    if (isSVG) {
      if (key === "innerHTML" || key === "textContent") {
        return true;
      }
      if (key in el && isNativeOn(key) && isFunction(value)) {
        return true;
      }
      return false;
    }
    if (key === "spellcheck" || key === "draggable" || key === "translate" || key === "autocorrect") {
      return false;
    }
    if (key === "sandbox" && el.tagName === "IFRAME") {
      return false;
    }
    if (key === "form") {
      return false;
    }
    if (key === "list" && el.tagName === "INPUT") {
      return false;
    }
    if (key === "type" && el.tagName === "TEXTAREA") {
      return false;
    }
    if (key === "width" || key === "height") {
      const tag = el.tagName;
      if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") {
        return false;
      }
    }
    if (isNativeOn(key) && isString(value)) {
      return false;
    }
    return key in el;
  }
  const REMOVAL = {};
  // @__NO_SIDE_EFFECTS__
  function defineCustomElement(options, extraOptions, _createApp) {
    let Comp = /* @__PURE__ */ defineComponent(options, extraOptions);
    if (isPlainObject$1(Comp)) Comp = extend({}, Comp, extraOptions);
    class VueCustomElement extends VueElement {
      constructor(initialProps) {
        super(Comp, initialProps, _createApp);
      }
    }
    VueCustomElement.def = Comp;
    return VueCustomElement;
  }
  const BaseClass = typeof HTMLElement !== "undefined" ? HTMLElement : class {
  };
  class VueElement extends BaseClass {
    constructor(_def, _props = {}, _createApp = createApp) {
      super();
      this._def = _def;
      this._props = _props;
      this._createApp = _createApp;
      this._isVueCE = true;
      this._instance = null;
      this._app = null;
      this._nonce = this._def.nonce;
      this._connected = false;
      this._resolved = false;
      this._patching = false;
      this._dirty = false;
      this._numberProps = null;
      this._styleChildren = /* @__PURE__ */ new WeakSet();
      this._ob = null;
      if (this.shadowRoot && _createApp !== createApp) {
        this._root = this.shadowRoot;
      } else {
        if (_def.shadowRoot !== false) {
          this.attachShadow(
            extend({}, _def.shadowRootOptions, {
              mode: "open"
            })
          );
          this._root = this.shadowRoot;
        } else {
          this._root = this;
        }
      }
    }
    connectedCallback() {
      if (!this.isConnected) return;
      if (!this.shadowRoot && !this._resolved) {
        this._parseSlots();
      }
      this._connected = true;
      let parent = this;
      while (parent = parent && (parent.parentNode || parent.host)) {
        if (parent instanceof VueElement) {
          this._parent = parent;
          break;
        }
      }
      if (!this._instance) {
        if (this._resolved) {
          this._mount(this._def);
        } else {
          if (parent && parent._pendingResolve) {
            this._pendingResolve = parent._pendingResolve.then(() => {
              this._pendingResolve = void 0;
              this._resolveDef();
            });
          } else {
            this._resolveDef();
          }
        }
      }
    }
    _setParent(parent = this._parent) {
      if (parent) {
        this._instance.parent = parent._instance;
        this._inheritParentContext(parent);
      }
    }
    _inheritParentContext(parent = this._parent) {
      if (parent && this._app) {
        Object.setPrototypeOf(
          this._app._context.provides,
          parent._instance.provides
        );
      }
    }
    disconnectedCallback() {
      this._connected = false;
      nextTick(() => {
        if (!this._connected) {
          if (this._ob) {
            this._ob.disconnect();
            this._ob = null;
          }
          this._app && this._app.unmount();
          if (this._instance) this._instance.ce = void 0;
          this._app = this._instance = null;
          if (this._teleportTargets) {
            this._teleportTargets.clear();
            this._teleportTargets = void 0;
          }
        }
      });
    }
    _processMutations(mutations) {
      for (const m of mutations) {
        this._setAttr(m.attributeName);
      }
    }
    /**
     * resolve inner component definition (handle possible async component)
     */
    _resolveDef() {
      if (this._pendingResolve) {
        return;
      }
      for (let i = 0; i < this.attributes.length; i++) {
        this._setAttr(this.attributes[i].name);
      }
      this._ob = new MutationObserver(this._processMutations.bind(this));
      this._ob.observe(this, { attributes: true });
      const resolve = (def2, isAsync = false) => {
        this._resolved = true;
        this._pendingResolve = void 0;
        const { props, styles } = def2;
        let numberProps;
        if (props && !isArray(props)) {
          for (const key in props) {
            const opt = props[key];
            if (opt === Number || opt && opt.type === Number) {
              if (key in this._props) {
                this._props[key] = toNumber(this._props[key]);
              }
              (numberProps || (numberProps = /* @__PURE__ */ Object.create(null)))[camelize(key)] = true;
            }
          }
        }
        this._numberProps = numberProps;
        this._resolveProps(def2);
        if (this.shadowRoot) {
          this._applyStyles(styles);
        }
        this._mount(def2);
      };
      const asyncDef = this._def.__asyncLoader;
      if (asyncDef) {
        this._pendingResolve = asyncDef().then((def2) => {
          def2.configureApp = this._def.configureApp;
          resolve(this._def = def2, true);
        });
      } else {
        resolve(this._def);
      }
    }
    _mount(def2) {
      this._app = this._createApp(def2);
      this._inheritParentContext();
      if (def2.configureApp) {
        def2.configureApp(this._app);
      }
      this._app._ceVNode = this._createVNode();
      this._app.mount(this._root);
      const exposed = this._instance && this._instance.exposed;
      if (!exposed) return;
      for (const key in exposed) {
        if (!hasOwn(this, key)) {
          Object.defineProperty(this, key, {
            // unwrap ref to be consistent with public instance behavior
            get: () => unref(exposed[key])
          });
        }
      }
    }
    _resolveProps(def2) {
      const { props } = def2;
      const declaredPropKeys = isArray(props) ? props : Object.keys(props || {});
      for (const key of Object.keys(this)) {
        if (key[0] !== "_" && declaredPropKeys.includes(key)) {
          this._setProp(key, this[key]);
        }
      }
      for (const key of declaredPropKeys.map(camelize)) {
        Object.defineProperty(this, key, {
          get() {
            return this._getProp(key);
          },
          set(val) {
            this._setProp(key, val, true, !this._patching);
          }
        });
      }
    }
    _setAttr(key) {
      if (key.startsWith("data-v-")) return;
      const has = this.hasAttribute(key);
      let value = has ? this.getAttribute(key) : REMOVAL;
      const camelKey = camelize(key);
      if (has && this._numberProps && this._numberProps[camelKey]) {
        value = toNumber(value);
      }
      this._setProp(camelKey, value, false, true);
    }
    /**
     * @internal
     */
    _getProp(key) {
      return this._props[key];
    }
    /**
     * @internal
     */
    _setProp(key, val, shouldReflect = true, shouldUpdate = false) {
      if (val !== this._props[key]) {
        this._dirty = true;
        if (val === REMOVAL) {
          delete this._props[key];
        } else {
          this._props[key] = val;
          if (key === "key" && this._app) {
            this._app._ceVNode.key = val;
          }
        }
        if (shouldUpdate && this._instance) {
          this._update();
        }
        if (shouldReflect) {
          const ob = this._ob;
          if (ob) {
            this._processMutations(ob.takeRecords());
            ob.disconnect();
          }
          if (val === true) {
            this.setAttribute(hyphenate(key), "");
          } else if (typeof val === "string" || typeof val === "number") {
            this.setAttribute(hyphenate(key), val + "");
          } else if (!val) {
            this.removeAttribute(hyphenate(key));
          }
          ob && ob.observe(this, { attributes: true });
        }
      }
    }
    _update() {
      const vnode = this._createVNode();
      if (this._app) vnode.appContext = this._app._context;
      render(vnode, this._root);
    }
    _createVNode() {
      const baseProps = {};
      if (!this.shadowRoot) {
        baseProps.onVnodeMounted = baseProps.onVnodeUpdated = this._renderSlots.bind(this);
      }
      const vnode = createVNode(this._def, extend(baseProps, this._props));
      if (!this._instance) {
        vnode.ce = (instance) => {
          this._instance = instance;
          instance.ce = this;
          instance.isCE = true;
          const dispatch = (event, args) => {
            this.dispatchEvent(
              new CustomEvent(
                event,
                isPlainObject$1(args[0]) ? extend({ detail: args }, args[0]) : { detail: args }
              )
            );
          };
          instance.emit = (event, ...args) => {
            dispatch(event, args);
            if (hyphenate(event) !== event) {
              dispatch(hyphenate(event), args);
            }
          };
          this._setParent();
        };
      }
      return vnode;
    }
    _applyStyles(styles, owner) {
      if (!styles) return;
      if (owner) {
        if (owner === this._def || this._styleChildren.has(owner)) {
          return;
        }
        this._styleChildren.add(owner);
      }
      const nonce = this._nonce;
      for (let i = styles.length - 1; i >= 0; i--) {
        const s = document.createElement("style");
        if (nonce) s.setAttribute("nonce", nonce);
        s.textContent = styles[i];
        this.shadowRoot.prepend(s);
      }
    }
    /**
     * Only called when shadowRoot is false
     */
    _parseSlots() {
      const slots = this._slots = {};
      let n;
      while (n = this.firstChild) {
        const slotName = n.nodeType === 1 && n.getAttribute("slot") || "default";
        (slots[slotName] || (slots[slotName] = [])).push(n);
        this.removeChild(n);
      }
    }
    /**
     * Only called when shadowRoot is false
     */
    _renderSlots() {
      const outlets = this._getSlots();
      const scopeId = this._instance.type.__scopeId;
      for (let i = 0; i < outlets.length; i++) {
        const o = outlets[i];
        const slotName = o.getAttribute("name") || "default";
        const content = this._slots[slotName];
        const parent = o.parentNode;
        if (content) {
          for (const n of content) {
            if (scopeId && n.nodeType === 1) {
              const id = scopeId + "-s";
              const walker = document.createTreeWalker(n, 1);
              n.setAttribute(id, "");
              let child;
              while (child = walker.nextNode()) {
                child.setAttribute(id, "");
              }
            }
            parent.insertBefore(n, o);
          }
        } else {
          while (o.firstChild) parent.insertBefore(o.firstChild, o);
        }
        parent.removeChild(o);
      }
    }
    /**
     * @internal
     */
    _getSlots() {
      const roots = [this];
      if (this._teleportTargets) {
        roots.push(...this._teleportTargets);
      }
      const slots = /* @__PURE__ */ new Set();
      for (const root of roots) {
        const found = root.querySelectorAll("slot");
        for (let i = 0; i < found.length; i++) {
          slots.add(found[i]);
        }
      }
      return Array.from(slots);
    }
    /**
     * @internal
     */
    _injectChildStyle(comp) {
      this._applyStyles(comp.styles, comp);
    }
    /**
     * @internal
     */
    _beginPatch() {
      this._patching = true;
      this._dirty = false;
    }
    /**
     * @internal
     */
    _endPatch() {
      this._patching = false;
      if (this._dirty && this._instance) {
        this._update();
      }
    }
    /**
     * @internal
     */
    _removeChildStyle(comp) {
    }
  }
  const positionMap = /* @__PURE__ */ new WeakMap();
  const newPositionMap = /* @__PURE__ */ new WeakMap();
  const moveCbKey = Symbol("_moveCb");
  const enterCbKey = Symbol("_enterCb");
  const decorate = (t) => {
    delete t.props.mode;
    return t;
  };
  const TransitionGroupImpl = /* @__PURE__ */ decorate({
    name: "TransitionGroup",
    props: /* @__PURE__ */ extend({}, TransitionPropsValidators, {
      tag: String,
      moveClass: String
    }),
    setup(props, { slots }) {
      const instance = getCurrentInstance();
      const state = useTransitionState();
      let prevChildren;
      let children;
      onUpdated(() => {
        if (!prevChildren.length) {
          return;
        }
        const moveClass = props.moveClass || `${props.name || "v"}-move`;
        if (!hasCSSTransform(
          prevChildren[0].el,
          instance.vnode.el,
          moveClass
        )) {
          prevChildren = [];
          return;
        }
        prevChildren.forEach(callPendingCbs);
        prevChildren.forEach(recordPosition);
        const movedChildren = prevChildren.filter(applyTranslation);
        forceReflow(instance.vnode.el);
        movedChildren.forEach((c) => {
          const el = c.el;
          const style = el.style;
          addTransitionClass(el, moveClass);
          style.transform = style.webkitTransform = style.transitionDuration = "";
          const cb = el[moveCbKey] = (e) => {
            if (e && e.target !== el) {
              return;
            }
            if (!e || e.propertyName.endsWith("transform")) {
              el.removeEventListener("transitionend", cb);
              el[moveCbKey] = null;
              removeTransitionClass(el, moveClass);
            }
          };
          el.addEventListener("transitionend", cb);
        });
        prevChildren = [];
      });
      return () => {
        const rawProps = toRaw(props);
        const cssTransitionProps = resolveTransitionProps(rawProps);
        let tag = rawProps.tag || Fragment;
        prevChildren = [];
        if (children) {
          for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.el && child.el instanceof Element) {
              prevChildren.push(child);
              setTransitionHooks(
                child,
                resolveTransitionHooks(
                  child,
                  cssTransitionProps,
                  state,
                  instance
                )
              );
              positionMap.set(child, {
                left: child.el.offsetLeft,
                top: child.el.offsetTop
              });
            }
          }
        }
        children = slots.default ? getTransitionRawChildren(slots.default()) : [];
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (child.key != null) {
            setTransitionHooks(
              child,
              resolveTransitionHooks(child, cssTransitionProps, state, instance)
            );
          }
        }
        return createVNode(tag, null, children);
      };
    }
  });
  const TransitionGroup = TransitionGroupImpl;
  function callPendingCbs(c) {
    const el = c.el;
    if (el[moveCbKey]) {
      el[moveCbKey]();
    }
    if (el[enterCbKey]) {
      el[enterCbKey]();
    }
  }
  function recordPosition(c) {
    newPositionMap.set(c, {
      left: c.el.offsetLeft,
      top: c.el.offsetTop
    });
  }
  function applyTranslation(c) {
    const oldPos = positionMap.get(c);
    const newPos = newPositionMap.get(c);
    const dx = oldPos.left - newPos.left;
    const dy = oldPos.top - newPos.top;
    if (dx || dy) {
      const s = c.el.style;
      s.transform = s.webkitTransform = `translate(${dx}px,${dy}px)`;
      s.transitionDuration = "0s";
      return c;
    }
  }
  function hasCSSTransform(el, root, moveClass) {
    const clone = el.cloneNode();
    const _vtc = el[vtcKey];
    if (_vtc) {
      _vtc.forEach((cls) => {
        cls.split(/\s+/).forEach((c) => c && clone.classList.remove(c));
      });
    }
    moveClass.split(/\s+/).forEach((c) => c && clone.classList.add(c));
    clone.style.display = "none";
    const container = root.nodeType === 1 ? root : root.parentNode;
    container.appendChild(clone);
    const { hasTransform } = getTransitionInfo(clone);
    container.removeChild(clone);
    return hasTransform;
  }
  const getModelAssigner = (vnode) => {
    const fn = vnode.props["onUpdate:modelValue"] || false;
    return isArray(fn) ? (value) => invokeArrayFns(fn, value) : fn;
  };
  function onCompositionStart(e) {
    e.target.composing = true;
  }
  function onCompositionEnd(e) {
    const target = e.target;
    if (target.composing) {
      target.composing = false;
      target.dispatchEvent(new Event("input"));
    }
  }
  const assignKey = Symbol("_assign");
  function castValue(value, trim, number) {
    if (trim) value = value.trim();
    if (number) value = looseToNumber(value);
    return value;
  }
  const vModelText = {
    created(el, { modifiers: { lazy, trim, number } }, vnode) {
      el[assignKey] = getModelAssigner(vnode);
      const castToNumber = number || vnode.props && vnode.props.type === "number";
      addEventListener(el, lazy ? "change" : "input", (e) => {
        if (e.target.composing) return;
        el[assignKey](castValue(el.value, trim, castToNumber));
      });
      if (trim || castToNumber) {
        addEventListener(el, "change", () => {
          el.value = castValue(el.value, trim, castToNumber);
        });
      }
      if (!lazy) {
        addEventListener(el, "compositionstart", onCompositionStart);
        addEventListener(el, "compositionend", onCompositionEnd);
        addEventListener(el, "change", onCompositionEnd);
      }
    },
    // set value on mounted so it's after min/max for type="range"
    mounted(el, { value }) {
      el.value = value == null ? "" : value;
    },
    beforeUpdate(el, { value, oldValue, modifiers: { lazy, trim, number } }, vnode) {
      el[assignKey] = getModelAssigner(vnode);
      if (el.composing) return;
      const elValue = (number || el.type === "number") && !/^0\d/.test(el.value) ? looseToNumber(el.value) : el.value;
      const newValue = value == null ? "" : value;
      if (elValue === newValue) {
        return;
      }
      if (document.activeElement === el && el.type !== "range") {
        if (lazy && value === oldValue) {
          return;
        }
        if (trim && el.value.trim() === newValue) {
          return;
        }
      }
      el.value = newValue;
    }
  };
  const systemModifiers = ["ctrl", "shift", "alt", "meta"];
  const modifierGuards = {
    stop: (e) => e.stopPropagation(),
    prevent: (e) => e.preventDefault(),
    self: (e) => e.target !== e.currentTarget,
    ctrl: (e) => !e.ctrlKey,
    shift: (e) => !e.shiftKey,
    alt: (e) => !e.altKey,
    meta: (e) => !e.metaKey,
    left: (e) => "button" in e && e.button !== 0,
    middle: (e) => "button" in e && e.button !== 1,
    right: (e) => "button" in e && e.button !== 2,
    exact: (e, modifiers) => systemModifiers.some((m) => e[`${m}Key`] && !modifiers.includes(m))
  };
  const withModifiers = (fn, modifiers) => {
    const cache = fn._withMods || (fn._withMods = {});
    const cacheKey = modifiers.join(".");
    return cache[cacheKey] || (cache[cacheKey] = ((event, ...args) => {
      for (let i = 0; i < modifiers.length; i++) {
        const guard = modifierGuards[modifiers[i]];
        if (guard && guard(event, modifiers)) return;
      }
      return fn(event, ...args);
    }));
  };
  const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
  let renderer;
  function ensureRenderer() {
    return renderer || (renderer = createRenderer(rendererOptions));
  }
  const render = ((...args) => {
    ensureRenderer().render(...args);
  });
  const createApp = ((...args) => {
    const app = ensureRenderer().createApp(...args);
    const { mount } = app;
    app.mount = (containerOrSelector) => {
      const container = normalizeContainer(containerOrSelector);
      if (!container) return;
      const component = app._component;
      if (!isFunction(component) && !component.render && !component.template) {
        component.template = container.innerHTML;
      }
      if (container.nodeType === 1) {
        container.textContent = "";
      }
      const proxy = mount(container, false, resolveRootNamespace(container));
      if (container instanceof Element) {
        container.removeAttribute("v-cloak");
        container.setAttribute("data-v-app", "");
      }
      return proxy;
    };
    return app;
  });
  function resolveRootNamespace(container) {
    if (container instanceof SVGElement) {
      return "svg";
    }
    if (typeof MathMLElement === "function" && container instanceof MathMLElement) {
      return "mathml";
    }
  }
  function normalizeContainer(container) {
    if (isString(container)) {
      const res = document.querySelector(container);
      return res;
    }
    return container;
  }
  /*!
   * pinia v3.0.4
   * (c) 2025 Eduardo San Martin Morote
   * @license MIT
   */
  let activePinia;
  const setActivePinia = (pinia2) => activePinia = pinia2;
  const piniaSymbol = (
    /* istanbul ignore next */
    Symbol()
  );
  function isPlainObject(o) {
    return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
  }
  var MutationType;
  (function(MutationType2) {
    MutationType2["direct"] = "direct";
    MutationType2["patchObject"] = "patch object";
    MutationType2["patchFunction"] = "patch function";
  })(MutationType || (MutationType = {}));
  function createPinia() {
    const scope = effectScope(true);
    const state = scope.run(() => ref({}));
    let _p = [];
    let toBeInstalled = [];
    const pinia2 = markRaw({
      install(app) {
        setActivePinia(pinia2);
        pinia2._a = app;
        app.provide(piniaSymbol, pinia2);
        app.config.globalProperties.$pinia = pinia2;
        toBeInstalled.forEach((plugin) => _p.push(plugin));
        toBeInstalled = [];
      },
      use(plugin) {
        if (!this._a) {
          toBeInstalled.push(plugin);
        } else {
          _p.push(plugin);
        }
        return this;
      },
      _p,
      // it's actually undefined here
      // @ts-expect-error
      _a: null,
      _e: scope,
      _s: /* @__PURE__ */ new Map(),
      state
    });
    return pinia2;
  }
  const noop = () => {
  };
  function addSubscription(subscriptions, callback, detached, onCleanup = noop) {
    subscriptions.add(callback);
    const removeSubscription = () => {
      const isDel = subscriptions.delete(callback);
      isDel && onCleanup();
    };
    if (!detached && getCurrentScope()) {
      onScopeDispose(removeSubscription);
    }
    return removeSubscription;
  }
  function triggerSubscriptions(subscriptions, ...args) {
    subscriptions.forEach((callback) => {
      callback(...args);
    });
  }
  const fallbackRunWithContext = (fn) => fn();
  const ACTION_MARKER = Symbol();
  const ACTION_NAME = Symbol();
  function mergeReactiveObjects(target, patchToApply) {
    if (target instanceof Map && patchToApply instanceof Map) {
      patchToApply.forEach((value, key) => target.set(key, value));
    } else if (target instanceof Set && patchToApply instanceof Set) {
      patchToApply.forEach(target.add, target);
    }
    for (const key in patchToApply) {
      if (!patchToApply.hasOwnProperty(key))
        continue;
      const subPatch = patchToApply[key];
      const targetValue = target[key];
      if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !isRef(subPatch) && !isReactive(subPatch)) {
        target[key] = mergeReactiveObjects(targetValue, subPatch);
      } else {
        target[key] = subPatch;
      }
    }
    return target;
  }
  const skipHydrateSymbol = (
    /* istanbul ignore next */
    Symbol()
  );
  function shouldHydrate(obj) {
    return !isPlainObject(obj) || !Object.prototype.hasOwnProperty.call(obj, skipHydrateSymbol);
  }
  const { assign } = Object;
  function isComputed(o) {
    return !!(isRef(o) && o.effect);
  }
  function createOptionsStore(id, options, pinia2, hot) {
    const { state, actions, getters } = options;
    const initialState = pinia2.state.value[id];
    let store;
    function setup() {
      if (!initialState && true) {
        pinia2.state.value[id] = state ? state() : {};
      }
      const localState = toRefs(pinia2.state.value[id]);
      return assign(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
        computedGetters[name] = markRaw(computed(() => {
          setActivePinia(pinia2);
          const store2 = pinia2._s.get(id);
          return getters[name].call(store2, store2);
        }));
        return computedGetters;
      }, {}));
    }
    store = createSetupStore(id, setup, options, pinia2, hot, true);
    return store;
  }
  function createSetupStore($id, setup, options = {}, pinia2, hot, isOptionsStore) {
    let scope;
    const optionsForPlugin = assign({ actions: {} }, options);
    const $subscribeOptions = { deep: true };
    let isListening;
    let isSyncListening;
    let subscriptions = /* @__PURE__ */ new Set();
    let actionSubscriptions = /* @__PURE__ */ new Set();
    let debuggerEvents;
    const initialState = pinia2.state.value[$id];
    if (!isOptionsStore && !initialState && true) {
      pinia2.state.value[$id] = {};
    }
    ref({});
    let activeListener;
    function $patch(partialStateOrMutator) {
      let subscriptionMutation;
      isListening = isSyncListening = false;
      if (typeof partialStateOrMutator === "function") {
        partialStateOrMutator(pinia2.state.value[$id]);
        subscriptionMutation = {
          type: MutationType.patchFunction,
          storeId: $id,
          events: debuggerEvents
        };
      } else {
        mergeReactiveObjects(pinia2.state.value[$id], partialStateOrMutator);
        subscriptionMutation = {
          type: MutationType.patchObject,
          payload: partialStateOrMutator,
          storeId: $id,
          events: debuggerEvents
        };
      }
      const myListenerId = activeListener = Symbol();
      nextTick().then(() => {
        if (activeListener === myListenerId) {
          isListening = true;
        }
      });
      isSyncListening = true;
      triggerSubscriptions(subscriptions, subscriptionMutation, pinia2.state.value[$id]);
    }
    const $reset = isOptionsStore ? function $reset2() {
      const { state } = options;
      const newState = state ? state() : {};
      this.$patch(($state) => {
        assign($state, newState);
      });
    } : (
      /* istanbul ignore next */
      noop
    );
    function $dispose() {
      scope.stop();
      subscriptions.clear();
      actionSubscriptions.clear();
      pinia2._s.delete($id);
    }
    const action = (fn, name = "") => {
      if (ACTION_MARKER in fn) {
        fn[ACTION_NAME] = name;
        return fn;
      }
      const wrappedAction = function() {
        setActivePinia(pinia2);
        const args = Array.from(arguments);
        const afterCallbackSet = /* @__PURE__ */ new Set();
        const onErrorCallbackSet = /* @__PURE__ */ new Set();
        function after(callback) {
          afterCallbackSet.add(callback);
        }
        function onError(callback) {
          onErrorCallbackSet.add(callback);
        }
        triggerSubscriptions(actionSubscriptions, {
          args,
          name: wrappedAction[ACTION_NAME],
          store,
          after,
          onError
        });
        let ret;
        try {
          ret = fn.apply(this && this.$id === $id ? this : store, args);
        } catch (error) {
          triggerSubscriptions(onErrorCallbackSet, error);
          throw error;
        }
        if (ret instanceof Promise) {
          return ret.then((value) => {
            triggerSubscriptions(afterCallbackSet, value);
            return value;
          }).catch((error) => {
            triggerSubscriptions(onErrorCallbackSet, error);
            return Promise.reject(error);
          });
        }
        triggerSubscriptions(afterCallbackSet, ret);
        return ret;
      };
      wrappedAction[ACTION_MARKER] = true;
      wrappedAction[ACTION_NAME] = name;
      return wrappedAction;
    };
    const partialStore = {
      _p: pinia2,
      // _s: scope,
      $id,
      $onAction: addSubscription.bind(null, actionSubscriptions),
      $patch,
      $reset,
      $subscribe(callback, options2 = {}) {
        const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
        const stopWatcher = scope.run(() => watch(() => pinia2.state.value[$id], (state) => {
          if (options2.flush === "sync" ? isSyncListening : isListening) {
            callback({
              storeId: $id,
              type: MutationType.direct,
              events: debuggerEvents
            }, state);
          }
        }, assign({}, $subscribeOptions, options2)));
        return removeSubscription;
      },
      $dispose
    };
    const store = reactive(partialStore);
    pinia2._s.set($id, store);
    const runWithContext = pinia2._a && pinia2._a.runWithContext || fallbackRunWithContext;
    const setupStore = runWithContext(() => pinia2._e.run(() => (scope = effectScope()).run(() => setup({ action }))));
    for (const key in setupStore) {
      const prop = setupStore[key];
      if (isRef(prop) && !isComputed(prop) || isReactive(prop)) {
        if (!isOptionsStore) {
          if (initialState && shouldHydrate(prop)) {
            if (isRef(prop)) {
              prop.value = initialState[key];
            } else {
              mergeReactiveObjects(prop, initialState[key]);
            }
          }
          pinia2.state.value[$id][key] = prop;
        }
      } else if (typeof prop === "function") {
        const actionValue = action(prop, key);
        setupStore[key] = actionValue;
        optionsForPlugin.actions[key] = prop;
      } else ;
    }
    assign(store, setupStore);
    assign(toRaw(store), setupStore);
    Object.defineProperty(store, "$state", {
      get: () => pinia2.state.value[$id],
      set: (state) => {
        $patch(($state) => {
          assign($state, state);
        });
      }
    });
    pinia2._p.forEach((extender) => {
      {
        assign(store, scope.run(() => extender({
          store,
          app: pinia2._a,
          pinia: pinia2,
          options: optionsForPlugin
        })));
      }
    });
    if (initialState && isOptionsStore && options.hydrate) {
      options.hydrate(store.$state, initialState);
    }
    isListening = true;
    isSyncListening = true;
    return store;
  }
  /*! #__NO_SIDE_EFFECTS__ */
  // @__NO_SIDE_EFFECTS__
  function defineStore(id, setup, setupOptions) {
    let options;
    const isSetupStore = typeof setup === "function";
    options = isSetupStore ? setupOptions : setup;
    function useStore(pinia2, hot) {
      const hasContext = hasInjectionContext();
      pinia2 = // in test mode, ignore the argument provided as we can always retrieve a
      // pinia instance with getActivePinia()
      pinia2 || (hasContext ? inject(piniaSymbol, null) : null);
      if (pinia2)
        setActivePinia(pinia2);
      pinia2 = activePinia;
      if (!pinia2._s.has(id)) {
        if (isSetupStore) {
          createSetupStore(id, setup, options, pinia2);
        } else {
          createOptionsStore(id, options, pinia2);
        }
      }
      const store = pinia2._s.get(id);
      return store;
    }
    useStore.$id = id;
    return useStore;
  }
  const useMenusStore = /* @__PURE__ */ defineStore("menus", {
    state: () => ({
      data: []
    }),
    getters: {
      getAvailableMenus: (state) => state.data,
      getMenu: (state) => (id) => {
        return state.data.find((menu2) => menu2._id === id);
      },
      getMenuItems: (state) => (menuId) => {
        const menu2 = state.data.find((m) => m._id === menuId);
        if (!menu2) return [];
        const items = [];
        menu2.categories.forEach((category) => {
          items.push(
            ...category.items.map((item2) => ({ ...item2, category: category._id }))
          );
        });
        return items;
      }
    },
    actions: {
      updateMenus(menus) {
        this.data = menus;
      }
    }
  });
  const useMetadataStore = /* @__PURE__ */ defineStore("metadata", {
    state: () => ({
      data: null,
      language: "ro"
    }),
    getters: {
      currency: (state) => {
        var _a;
        return ((_a = state.data) == null ? void 0 : _a.currency) || "RON";
      },
      showPrices: (state) => {
        var _a;
        return ((_a = state.data) == null ? void 0 : _a.showPrices) ?? true;
      }
    },
    actions: {
      updateMetadata(metadata) {
        if (!metadata) {
          console.warn("Metadata is undefined, using defaults");
          return;
        }
        this.data = metadata;
        if (metadata.language && ["ro", "en", "ru"].includes(metadata.language)) {
          this.language = metadata.language;
        }
      },
      setLanguage(language) {
        this.language = language;
      }
    }
  });
  const STORAGE_KEY = "menoo-order";
  function loadFromStorage() {
    if (typeof window === "undefined" || !window.localStorage) {
      return null;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch (error) {
      return null;
    }
  }
  function saveToStorage(state) {
    if (typeof window === "undefined" || !window.localStorage) {
      return;
    }
    try {
      const data = {
        type: state.type,
        restaurant: state.restaurant,
        cart: state.cart
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
    }
  }
  const useOrderStore = /* @__PURE__ */ defineStore("order", {
    state: () => {
      const stored = loadFromStorage();
      if (stored) {
        return {
          type: stored.type || "delivery",
          restaurant: stored.restaurant || "",
          cart: stored.cart || {
            items: [],
            totalPrice: 0,
            totalCount: 0
          }
        };
      }
      return {
        type: "delivery",
        restaurant: "",
        cart: {
          items: [],
          totalPrice: 0,
          totalCount: 0
        }
      };
    },
    getters: {
      getCart: (state) => state.cart,
      hasItems: (state) => state.cart.items.length > 0,
      itemCount: (state) => state.cart.totalCount
    },
    actions: {
      initCart(restaurantId) {
        if (this.restaurant && this.restaurant !== restaurantId) {
          this.clearCart();
          this.restaurant = restaurantId;
        } else if (!this.restaurant) {
          this.restaurant = restaurantId;
        }
      },
      addOrder(item2, options = [], note = "", quantity = 1) {
        const existingIndex = this.cart.items.findIndex(
          (cartItem) => this.isSameCartItem(cartItem, item2, options, note)
        );
        const itemPrice = this.calculateItemPrice(item2, options);
        if (existingIndex >= 0) {
          this.cart.items[existingIndex].quantity += quantity;
          this.cart.items[existingIndex].price = itemPrice * this.cart.items[existingIndex].quantity;
        } else {
          const cartItem = {
            item: item2,
            quantity,
            options,
            note,
            price: itemPrice * quantity
          };
          this.cart.items.push(cartItem);
        }
        this.recalculateCart();
        saveToStorage(this.$state);
      },
      removeOrder(index) {
        if (index >= 0 && index < this.cart.items.length) {
          this.cart.items.splice(index, 1);
          this.recalculateCart();
          saveToStorage(this.$state);
        }
      },
      updateCartItemQuantity(index, quantity) {
        if (index >= 0 && index < this.cart.items.length) {
          if (quantity <= 0) {
            this.cart.items.splice(index, 1);
          } else {
            const item2 = this.cart.items[index];
            const basePrice = item2.price / item2.quantity;
            item2.quantity = quantity;
            item2.price = basePrice * quantity;
          }
          this.recalculateCart();
          saveToStorage(this.$state);
        }
      },
      clearCart() {
        this.cart = {
          items: [],
          totalPrice: 0,
          totalCount: 0
        };
        localStorage.removeItem(STORAGE_KEY);
      },
      // Helper methods
      calculateItemPrice(item2, options) {
        let price = item2.price;
        if (options && item2.options) {
          options.forEach((selection) => {
            var _a;
            const option = (_a = item2.options) == null ? void 0 : _a.find((o) => o._id === selection.option);
            if (option) {
              selection.choices.forEach((choiceId) => {
                const choice = option.values.find((c) => c._id === choiceId);
                if (choice) {
                  price += choice.price;
                }
              });
            }
          });
        }
        return price;
      },
      isSameCartItem(cartItem, item2, options, note) {
        if (cartItem.item._id !== item2._id) return false;
        if (cartItem.note !== note) return false;
        return this.optionsEqual(cartItem.options, options);
      },
      optionsEqual(options1, options2) {
        if (!options1 && !options2) return true;
        if (!options1 || !options2) return false;
        if (options1.length !== options2.length) return false;
        const sorted1 = this.sortOptions(options1);
        const sorted2 = this.sortOptions(options2);
        return JSON.stringify(sorted1) === JSON.stringify(sorted2);
      },
      sortOptions(options) {
        return options.map((opt) => ({
          ...opt,
          choices: [...opt.choices].sort()
        })).sort((a, b) => a.option.localeCompare(b.option));
      },
      recalculateCart() {
        this.cart.totalPrice = this.cart.items.reduce(
          (sum, item2) => sum + item2.price,
          0
        );
        this.cart.totalCount = this.cart.items.reduce(
          (sum, item2) => sum + item2.quantity,
          0
        );
      }
    }
  });
  const useRestaurantStore = /* @__PURE__ */ defineStore("restaurant", {
    state: () => ({
      data: null
    }),
    getters: {
      getRestaurant: (state) => state.data,
      isOpen: (state) => {
        var _a;
        return ((_a = state.data) == null ? void 0 : _a.status) === "open";
      }
    },
    actions: {
      updateRestaurant(restaurant2) {
        this.data = restaurant2;
      }
    }
  });
  const pinia = createPinia();
  function transformCartItemForApi(cartItem) {
    const apiItem = {
      item: cartItem.item._id,
      quantity: cartItem.quantity
    };
    if (cartItem.note) {
      apiItem.note = cartItem.note;
    }
    if (cartItem.options && cartItem.options.length > 0) {
      apiItem.options = cartItem.options.map((selection) => {
        var _a;
        const option = (_a = cartItem.item.options) == null ? void 0 : _a.find(
          (o) => o._id === selection.option
        );
        if (!option) return null;
        const selectedValues = selection.choices.map((choiceId) => {
          const choice = option.values.find((c) => c._id === choiceId);
          return choice ? {
            _id: choice._id,
            name: choice.name,
            price: choice.price
          } : null;
        }).filter((v) => v !== null);
        if (selectedValues.length === 0) return null;
        return {
          _id: option._id,
          title: option.title,
          values: selectedValues
        };
      }).filter((o) => o !== null);
    }
    return apiItem;
  }
  function transformCartForApi(cartItems) {
    return cartItems.map(transformCartItemForApi);
  }
  function useCart() {
    const orderStore = useOrderStore();
    const cart2 = computed(() => orderStore.getCart);
    const deliveryFee = computed(() => {
      const restaurantStore = useRestaurantStore();
      const restaurant2 = restaurantStore.data;
      const mode = orderStore.type;
      if (!restaurant2 || mode !== "delivery") return 0;
      const threshold = restaurant2.delivery.feeThreshold || 0;
      const fee = restaurant2.delivery.fee || 0;
      return cart2.value.totalPrice >= threshold ? 0 : fee;
    });
    const totalWithDelivery = computed(
      () => cart2.value.totalPrice + deliveryFee.value
    );
    const getCartForApi = () => {
      return transformCartForApi(cart2.value.items);
    };
    const addToCart = (item2, options = [], note = "", quantity = 1) => {
      orderStore.addOrder(item2, options, note, quantity);
    };
    const updateCartItemQuantity = (index, newQuantity) => {
      orderStore.updateCartItemQuantity(index, newQuantity);
    };
    const removeFromCart = (index) => {
      orderStore.removeOrder(index);
    };
    const clearCart = () => {
      orderStore.clearCart();
    };
    return {
      cart: cart2,
      deliveryFee,
      totalWithDelivery,
      addToCart,
      updateCartItemQuantity,
      removeFromCart,
      clearCart,
      getCartForApi
    };
  }
  function useRestaurant() {
    const restaurantStore = useRestaurantStore();
    const menusStore = useMenusStore();
    const restaurant2 = computed(() => restaurantStore.data);
    const menus = computed(() => menusStore.data);
    return {
      restaurant: restaurant2,
      menus
    };
  }
  function useFormatPrice() {
    const metadataStore = useMetadataStore();
    const formatPrice = (price) => {
      const currency = metadataStore.currency;
      return `${price.toFixed(2)} ${currency}`;
    };
    return {
      formatPrice
    };
  }
  const _hoisted_1$6 = { class: "cart-container" };
  const _hoisted_2$6 = { class: "cart-header" };
  const _hoisted_3$6 = {
    key: "empty",
    class: "cart-empty"
  };
  const _hoisted_4$5 = {
    key: "full",
    class: "cart-full"
  };
  const _hoisted_5$5 = { class: "cart-items" };
  const _hoisted_6$5 = { class: "item-details" };
  const _hoisted_7$4 = { class: "item-name" };
  const _hoisted_8$3 = {
    key: 0,
    class: "item-options"
  };
  const _hoisted_9$3 = {
    key: 1,
    class: "item-note"
  };
  const _hoisted_10$3 = { class: "item-price" };
  const _hoisted_11$3 = { class: "item-quantity" };
  const _hoisted_12$3 = ["onClick"];
  const _hoisted_13$2 = ["onClick"];
  const _hoisted_14$2 = { class: "cart-summary" };
  const _hoisted_15$1 = { class: "summary-row" };
  const _hoisted_16 = { class: "summary-label" };
  const _hoisted_17 = { class: "summary-value" };
  const _hoisted_18 = ["disabled"];
  const _sfc_main$6 = /* @__PURE__ */ defineComponent({
    __name: "MenooCart",
    emits: ["checkoutClicked"],
    setup(__props, { emit: __emit }) {
      const emit2 = __emit;
      const { cart: cart2, updateCartItemQuantity } = useCart();
      const { formatPrice } = useFormatPrice();
      const restaurantStore = useRestaurantStore();
      const animatingItems = ref(/* @__PURE__ */ new Set());
      const isRestaurantOpen = computed(
        () => {
          var _a;
          return ((_a = restaurantStore.data) == null ? void 0 : _a.status) === "open";
        }
      );
      const getOptionsText = (cartItem) => {
        if (!cartItem.options || cartItem.options.length === 0) return "";
        const texts = [];
        cartItem.options.forEach((selection) => {
          var _a;
          const option = (_a = cartItem.item.options) == null ? void 0 : _a.find(
            (o) => o._id === selection.option
          );
          if (option) {
            const choiceNames = selection.choices.map((choiceId) => {
              const choice = option.values.find((c) => c._id === choiceId);
              return choice == null ? void 0 : choice.name;
            }).filter(Boolean).join(", ");
            if (choiceNames) {
              texts.push(`${option.title}: ${choiceNames}`);
            }
          }
        });
        return texts.join(" • ");
      };
      const increaseQuantity = (index) => {
        const item2 = cart2.value.items[index];
        if (item2) {
          animatingItems.value = new Set(animatingItems.value).add(index);
          updateCartItemQuantity(index, item2.quantity + 1);
          setTimeout(() => {
            const newSet = new Set(animatingItems.value);
            newSet.delete(index);
            animatingItems.value = newSet;
          }, 300);
        }
      };
      const decreaseQuantity = (index) => {
        const item2 = cart2.value.items[index];
        if (item2) {
          if (item2.quantity === 1) {
            updateCartItemQuantity(index, item2.quantity - 1);
          } else {
            animatingItems.value = new Set(animatingItems.value).add(index);
            updateCartItemQuantity(index, item2.quantity - 1);
            setTimeout(() => {
              const newSet = new Set(animatingItems.value);
              newSet.delete(index);
              animatingItems.value = newSet;
            }, 300);
          }
        }
      };
      const handleCheckout = () => {
        emit2("checkoutClicked");
      };
      const t = (key, replacements) => i18n.t(key, replacements);
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", _hoisted_1$6, [
          createBaseVNode("h2", _hoisted_2$6, toDisplayString(t("cart.title")), 1),
          createVNode(Transition, {
            name: "cart-transition",
            mode: "out-in"
          }, {
            default: withCtx(() => [
              unref(cart2).items.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_3$6, toDisplayString(t("cart.empty")), 1)) : (openBlock(), createElementBlock("div", _hoisted_4$5, [
                createBaseVNode("div", _hoisted_5$5, [
                  createVNode(TransitionGroup, { name: "cart-item" }, {
                    default: withCtx(() => [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(unref(cart2).items, (cartItem, index) => {
                        return openBlock(), createElementBlock("div", {
                          key: `${cartItem.item._id}-${index}`,
                          class: "cart-item"
                        }, [
                          createBaseVNode("div", _hoisted_6$5, [
                            createBaseVNode("div", _hoisted_7$4, toDisplayString(cartItem.item.name), 1),
                            getOptionsText(cartItem) ? (openBlock(), createElementBlock("div", _hoisted_8$3, toDisplayString(getOptionsText(cartItem)), 1)) : createCommentVNode("", true),
                            cartItem.note ? (openBlock(), createElementBlock("div", _hoisted_9$3, toDisplayString(cartItem.note), 1)) : createCommentVNode("", true),
                            createBaseVNode("div", _hoisted_10$3, toDisplayString(unref(formatPrice)(cartItem.price)), 1)
                          ]),
                          createBaseVNode("div", _hoisted_11$3, [
                            createBaseVNode("button", {
                              class: "qty-btn",
                              onClick: ($event) => decreaseQuantity(index)
                            }, " − ", 8, _hoisted_12$3),
                            createBaseVNode("span", {
                              class: normalizeClass(["qty-value", { "qty-animate": animatingItems.value.has(index) }])
                            }, toDisplayString(cartItem.quantity), 3),
                            createBaseVNode("button", {
                              class: "qty-btn",
                              onClick: ($event) => increaseQuantity(index)
                            }, " + ", 8, _hoisted_13$2)
                          ])
                        ]);
                      }), 128))
                    ]),
                    _: 1
                  })
                ]),
                createBaseVNode("div", _hoisted_14$2, [
                  createBaseVNode("div", _hoisted_15$1, [
                    createBaseVNode("span", _hoisted_16, toDisplayString(t("cart.subtotal")), 1),
                    createBaseVNode("span", _hoisted_17, toDisplayString(unref(formatPrice)(unref(cart2).totalPrice)), 1)
                  ])
                ]),
                createBaseVNode("button", {
                  class: "checkout-btn",
                  disabled: !isRestaurantOpen.value,
                  onClick: handleCheckout
                }, toDisplayString(t("cart.checkout")), 9, _hoisted_18)
              ]))
            ]),
            _: 1
          })
        ]);
      };
    }
  });
  const _style_0$6 = "\n.cart-container[data-v-8f6fd6aa] {\n  background: var(--menoo-surface, #ffffff);\n  border-radius: var(--menoo-radius-md, 8px);\n  box-shadow: var(--menoo-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.12));\n  padding: var(--menoo-spacing-2, 16px);\n  position: sticky;\n  top: var(--menoo-cart-top, 0);\n  max-height: calc(100vh - var(--menoo-cart-top, 0) - 32px);\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n.cart-header[data-v-8f6fd6aa] {\n  font-size: var(--menoo-font-size-xl, 1.25rem);\n  font-weight: var(--menoo-font-weight-bold, 700);\n  margin-bottom: var(--menoo-spacing-2, 16px);\n  padding-bottom: var(--menoo-spacing-1, 8px);\n  border-bottom: 2px solid var(--menoo-border, #e0e0e0);\n  margin-top: 0;\n}\n.cart-empty[data-v-8f6fd6aa] {\n  text-align: center;\n  padding: var(--menoo-spacing-4, 32px) var(--menoo-spacing-2, 16px);\n  color: var(--menoo-text-secondary, #757575);\n}\n.cart-transition-enter-active[data-v-8f6fd6aa],\n.cart-transition-leave-active[data-v-8f6fd6aa] {\n  transition: all 0.3s ease;\n}\n.cart-transition-enter-from[data-v-8f6fd6aa],\n.cart-transition-leave-to[data-v-8f6fd6aa] {\n  opacity: 0;\n  transform: scale(0.95);\n}\n.cart-full[data-v-8f6fd6aa] {\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n  min-height: 0;\n}\n.cart-items[data-v-8f6fd6aa] {\n  flex: 1;\n  overflow-y: auto;\n  overflow-x: hidden;\n  margin-bottom: var(--menoo-spacing-2, 16px);\n}\n\n/* Cart item transitions */\n.cart-item-move[data-v-8f6fd6aa] {\n  transition: transform 0.2s ease;\n}\n.cart-item-enter-active[data-v-8f6fd6aa] {\n  transition: all 0.2s ease;\n}\n.cart-item-leave-active[data-v-8f6fd6aa] {\n  transition: all 0.2s ease;\n  position: absolute;\n  width: calc(100% - var(--menoo-spacing-2, 16px) * 2);\n}\n.cart-item-enter-from[data-v-8f6fd6aa] {\n  opacity: 0;\n  transform: scale(0.8);\n}\n.cart-item-leave-to[data-v-8f6fd6aa] {\n  opacity: 0;\n  transform: scale(0.8);\n}\n.cart-item[data-v-8f6fd6aa] {\n  display: flex;\n  gap: var(--menoo-spacing-2, 16px);\n  padding: var(--menoo-spacing-2, 16px);\n  border-bottom: 1px solid var(--menoo-border, #e0e0e0);\n  background: var(--menoo-surface, #ffffff);\n}\n.cart-item[data-v-8f6fd6aa]:last-child {\n  border-bottom: none;\n}\n.item-details[data-v-8f6fd6aa] {\n  flex: 1;\n  min-width: 0;\n}\n.item-name[data-v-8f6fd6aa] {\n  font-weight: var(--menoo-font-weight-medium, 500);\n  margin-bottom: 4px;\n}\n.item-options[data-v-8f6fd6aa] {\n  font-size: var(--menoo-font-size-sm, 0.875rem);\n  color: var(--menoo-text-secondary, #757575);\n  margin-bottom: 4px;\n}\n.item-note[data-v-8f6fd6aa] {\n  font-size: var(--menoo-font-size-sm, 0.875rem);\n  color: var(--menoo-text-secondary, #757575);\n  font-style: italic;\n}\n.item-price[data-v-8f6fd6aa] {\n  font-weight: var(--menoo-font-weight-bold, 700);\n  color: var(--menoo-primary, #f0ac28);\n  margin-top: 4px;\n}\n.item-quantity[data-v-8f6fd6aa] {\n  display: flex;\n  align-items: center;\n  gap: var(--menoo-spacing-1, 8px);\n}\n.qty-btn[data-v-8f6fd6aa] {\n  width: 28px;\n  height: 28px;\n  border: 1px solid var(--menoo-border, #e0e0e0);\n  border-radius: var(--menoo-radius-sm, 4px);\n  background: white;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: all var(--menoo-transition-fast, 150ms);\n  font-size: 16px;\n  padding: 0;\n}\n.qty-btn[data-v-8f6fd6aa]:hover {\n  background: var(--menoo-hover, #f5f5f5);\n  transform: scale(1.1);\n}\n.qty-btn[data-v-8f6fd6aa]:active {\n  transform: scale(0.95);\n}\n.qty-value[data-v-8f6fd6aa] {\n  min-width: 24px;\n  text-align: center;\n  font-weight: var(--menoo-font-weight-medium, 500);\n  transition: all 0.3s ease;\n}\n.qty-value.qty-animate[data-v-8f6fd6aa] {\n  animation: qtyAnimation-8f6fd6aa 0.3s ease;\n}\n@keyframes qtyAnimation-8f6fd6aa {\n0% {\n    transform: scale(1);\n    color: inherit;\n}\n50% {\n    transform: scale(1.3);\n    color: var(--menoo-primary, #f0ac28);\n    font-weight: var(--menoo-font-weight-bold, 700);\n}\n100% {\n    transform: scale(1);\n    color: inherit;\n}\n}\n.cart-summary[data-v-8f6fd6aa] {\n  border-top: 2px solid var(--menoo-border, #e0e0e0);\n  padding-top: var(--menoo-spacing-2, 16px);\n}\n.summary-row[data-v-8f6fd6aa] {\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: var(--menoo-spacing-1, 8px);\n  font-size: var(--menoo-font-size-md, 1rem);\n}\n.summary-label[data-v-8f6fd6aa] {\n  color: var(--menoo-text-secondary, #757575);\n}\n.summary-value[data-v-8f6fd6aa] {\n  font-weight: var(--menoo-font-weight-medium, 500);\n}\n.summary-total[data-v-8f6fd6aa] {\n  font-size: var(--menoo-font-size-lg, 1.125rem);\n  font-weight: var(--menoo-font-weight-bold, 700);\n  margin-top: var(--menoo-spacing-1, 8px);\n  padding-top: var(--menoo-spacing-1, 8px);\n  border-top: 1px solid var(--menoo-border, #e0e0e0);\n}\n.summary-total .summary-value[data-v-8f6fd6aa] {\n  color: var(--menoo-primary, #f0ac28);\n}\n.checkout-btn[data-v-8f6fd6aa] {\n  width: 100%;\n  padding: var(--menoo-spacing-2, 16px);\n  margin-top: var(--menoo-spacing-2, 16px);\n  background: var(--menoo-primary, #f0ac28);\n  color: white;\n  border: none;\n  border-radius: var(--menoo-radius-md, 8px);\n  font-size: var(--menoo-font-size-md, 1rem);\n  font-weight: var(--menoo-font-weight-bold, 700);\n  cursor: pointer;\n  transition: all 0.3s ease;\n}\n.checkout-btn[data-v-8f6fd6aa]:hover:not(:disabled) {\n  background: var(--menoo-primary-dark, #996d1a);\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(240, 172, 40, 0.4);\n}\n.checkout-btn[data-v-8f6fd6aa]:active:not(:disabled) {\n  transform: translateY(0);\n  box-shadow: 0 2px 4px rgba(240, 172, 40, 0.3);\n}\n.checkout-btn[data-v-8f6fd6aa]:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n  background: var(--menoo-text-secondary, #757575);\n}\n.delivery-hint[data-v-8f6fd6aa] {\n  font-size: var(--menoo-font-size-xs, 0.75rem);\n  color: var(--menoo-success, #388e3c);\n  margin-top: 4px;\n}\n@media (max-width: 768px) {\n.cart-container[data-v-8f6fd6aa] {\n    position: static;\n    max-height: none;\n}\n}\n";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const MenooCart = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["styles", [_style_0$6]], ["__scopeId", "data-v-8f6fd6aa"]]);
  const delta = 2.5;
  const VueHorizontal = /* @__PURE__ */ defineComponent({
    name: "VueHorizontal",
    data() {
      return {
        left: 0,
        width: 0,
        scrollWidth: 0,
        hasPrev: false,
        hasNext: false,
        debounceId: void 0
      };
    },
    props: {
      /**
       * Navigation button visibility
       */
      button: {
        type: Boolean,
        default: () => true
      },
      /**
       * Navigation button alignment, default to between the edge of the horizontal axis.
       */
      buttonBetween: {
        type: Boolean,
        default: () => true
      },
      /**
       * Scrollbar visibility
       */
      scroll: {
        type: Boolean,
        default: () => false
      },
      /**
       * Move window, indicates the percent of width to travel when nav is triggered.
       */
      displacement: {
        type: Number,
        default: () => 1
      },
      /**
       * Snap to start|center|end
       */
      snap: {
        type: String,
        default: () => "start"
      }
    },
    mounted() {
      this.onScrollDebounce();
    },
    beforeDestroy() {
      clearTimeout(this.debounceId);
    },
    methods: {
      children() {
        const container = this.$refs.container;
        return container.children;
      },
      findPrevSlot(x) {
        const children = this.children();
        for (let i = 0; i < children.length; i++) {
          const rect = children[i].getBoundingClientRect();
          if (rect.left <= x && x <= rect.right) {
            return children[i];
          }
          if (x <= rect.left) {
            return children[i];
          }
        }
      },
      findNextSlot(x) {
        const children = this.children();
        for (let i = 0; i < children.length; i++) {
          const rect = children[i].getBoundingClientRect();
          if (rect.right <= x) {
            continue;
          } else if (rect.left <= x) {
            return children[i];
          }
          if (x <= rect.left) {
            return children[i];
          }
        }
      },
      /**
       * Toggle and scroll to the previous set of horizontal content.
       */
      prev(e) {
        e.stopPropagation();
        this.$emit("prev");
        const container = this.$refs.container;
        const left = container.getBoundingClientRect().left;
        const x = left + container.clientWidth * -this.displacement - delta;
        const element = this.findPrevSlot(x);
        if (element) {
          const width2 = element.getBoundingClientRect().left - left;
          this.scrollToLeft(container.scrollLeft + width2);
          return;
        }
        const width = container.clientWidth * this.displacement;
        this.scrollToLeft(container.scrollLeft - width);
      },
      /**
       * Toggle and scroll to the next set of horizontal content.
       */
      next(e) {
        e.stopPropagation();
        this.$emit("next");
        const container = this.$refs.container;
        const left = container.getBoundingClientRect().left;
        const x = left + container.clientWidth * this.displacement + delta;
        const element = this.findNextSlot(x);
        if (element) {
          const width2 = element.getBoundingClientRect().left - left;
          if (width2 > delta) {
            this.scrollToLeft(container.scrollLeft + width2);
            return;
          }
        }
        const width = container.clientWidth * this.displacement;
        this.scrollToLeft(container.scrollLeft + width);
      },
      /**
       * Index of the children to scroll to.
       * @param {number} i index
       */
      scrollToIndex(i) {
        const children = this.children();
        if (children[i]) {
          const container = this.$refs.container;
          const rect = children[i].getBoundingClientRect();
          const left = rect.left - container.getBoundingClientRect().left;
          this.scrollToLeft(container.scrollLeft + left);
        }
      },
      /**
       * Amount of pixel to scroll to on the left.
       * @param {number} left of the horizontal
       * @param {'smooth' | 'auto} [behavior='smooth']
       */
      scrollToLeft(left, behavior = "smooth") {
        const element = this.$refs.container;
        element.scrollTo({ left, behavior });
      },
      onScroll() {
        const container = this.$refs.container;
        if (!container) return;
        this.$emit("scroll", {
          left: container.scrollLeft
        });
        clearTimeout(this.debounceId);
        this.debounceId = setTimeout(this.onScrollDebounce, 100);
      },
      onScrollDebounce() {
        return this.refresh((data) => {
          this.$emit("scroll-debounce", data);
        });
      },
      /**
       * Manually refresh vue-horizontal
       * @param {(data: any) => void} [callback] after refreshed, optional
       */
      refresh(callback) {
        return nextTick(() => {
          const data = this.calculate();
          this.left = data.left;
          this.width = data.width;
          this.scrollWidth = data.scrollWidth;
          this.hasNext = data.hasNext;
          this.hasPrev = data.hasPrev;
          callback == null ? void 0 : callback(data);
        });
      },
      calculate() {
        const container = this.$refs.container;
        const firstChild = this.children()[0];
        function hasNext() {
          return container.scrollWidth > container.scrollLeft + container.clientWidth + delta;
        }
        function hasPrev() {
          var _a;
          if (container.scrollLeft === 0) {
            return false;
          }
          const containerVWLeft = container.getBoundingClientRect().left;
          const firstChildLeft = ((_a = firstChild == null ? void 0 : firstChild.getBoundingClientRect()) == null ? void 0 : _a.left) ?? 0;
          return Math.abs(containerVWLeft - firstChildLeft) >= delta;
        }
        return {
          left: container.scrollLeft,
          width: container.clientWidth,
          scrollWidth: container.scrollWidth,
          hasNext: hasNext(),
          hasPrev: hasPrev()
        };
      }
    },
    render() {
      const svgButton = (direction) => {
        const previous = h("path", { d: "m9.8 12 5 5a1 1 0 1 1-1.4 1.4l-5.7-5.7a1 1 0 0 1 0-1.4l5.7-5.7a1 1 0 0 1 1.4 1.4l-5 5z" });
        const next = h("path", { d: "m14.3 12.1-5-5a1 1 0 0 1 1.4-1.4l5.7 5.7a1 1 0 0 1 0 1.4l-5.7 5.7a1 1 0 0 1-1.4-1.4l5-5z" });
        return h("svg", {
          class: "v-hl-svg",
          viewBox: "0 0 24 24",
          "aria-label": `horizontal scroll area button for navigation to ${direction === "prev" ? "previous" : "next"} section`,
          style: {
            width: "40px",
            height: "40px",
            margin: "6px",
            padding: "6px",
            "border-radius": "20px",
            "box-sizing": "border-box",
            background: "white",
            color: "black",
            fill: "currentColor",
            "box-shadow": "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)"
          }
        }, [
          direction === "prev" ? previous : next
        ]);
      };
      const slotButton = (direction) => {
        if (!this.button) {
          return createCommentVNode("", true);
        }
        if (direction === "prev" && !this.hasPrev) {
          return createCommentVNode("", true);
        }
        if (direction === "next" && !this.hasNext) {
          return createCommentVNode("", true);
        }
        return h("div", {
          key: direction === "prev" ? 0 : 1,
          class: `v-hl-btn v-hl-btn-${direction}`,
          onClick: direction === "prev" ? this.prev : this.next,
          role: "button",
          style: {
            ...direction === "prev" ? {
              left: 0,
              transform: this.buttonBetween ? "translateX(-50%)" : "none"
            } : {
              right: 0,
              transform: this.buttonBetween ? "translateX(50%)" : "none"
            },
            cursor: "pointer",
            position: "absolute",
            top: 0,
            bottom: 0,
            display: "flex",
            "align-self": "center",
            "z-index": 1,
            "align-items": "center",
            // container scroll overflow mirroring/fix
            ...this.scroll ? {} : {
              "overflow-x": "scroll",
              "scrollbar-width": "none",
              "-ms-overflow-style": "none",
              "padding-bottom": "30px",
              "margin-bottom": "-30px",
              "clip-path": "inset(0 0 30px 0)"
            }
          }
        }, [
          direction === "prev" ? this.$slots["btn-prev"] ? this.$slots["btn-prev"]() : svgButton("prev") : this.$slots["btn-next"] ? this.$slots["btn-next"]() : svgButton("next")
        ]);
      };
      const slotItems = () => {
        if (!this.$slots.default) {
          return [];
        }
        const injectStyle = (slot) => {
          slot.props = slot.props || {};
          slot.props.style = slot.props.style || {};
          slot.props.style = {
            "flex-shrink": 0,
            "box-sizing": "border-box",
            /* Prevent content from collapsing when empty. E.g. image while loading height=0. */
            "min-height": "1px",
            "scroll-snap-align": this.snap
          };
        };
        const slots = this.$slots.default();
        slots.forEach((slot) => {
          if (slot.el) {
            return injectStyle(slot);
          }
          if (slot.children && Array.isArray(slot.children)) {
            slot.children.forEach((slot2) => {
              injectStyle(slot2);
            });
          }
        });
        return slots;
      };
      return h("div", {
        class: "vue-horizontal",
        style: {
          position: "relative",
          display: "flex"
        }
      }, [
        slotButton("prev"),
        slotButton("next"),
        h("div", {
          class: "v-hl-container",
          ref: "container",
          onScrollPassive: this.onScroll,
          style: {
            display: "flex",
            width: "100%",
            margin: 0,
            padding: 0,
            border: "none",
            "box-sizing": "content-box",
            "overflow-x": "scroll",
            "overflow-y": "hidden",
            "scroll-snap-type": "x mandatory",
            "-webkit-overflow-scrolling": "touch",
            ...this.scroll ? {} : {
              // container scroll overflow mirroring/fix
              "scrollbar-width": "none",
              "-ms-overflow-style": "none",
              "padding-bottom": "30px",
              "margin-bottom": "-30px",
              "clip-path": "inset(0 0 30px 0)"
            }
          }
        }, slotItems())
      ]);
    }
  });
  const _hoisted_1$5 = { class: "category-nav" };
  const _hoisted_2$5 = { class: "search-box" };
  const _hoisted_3$5 = ["placeholder"];
  const _hoisted_4$4 = { class: "category-title" };
  const _hoisted_5$4 = { class: "category-scroll-container" };
  const _hoisted_6$4 = ["onClick"];
  const _hoisted_7$3 = { class: "category-count" };
  const _sfc_main$5 = /* @__PURE__ */ defineComponent({
    __name: "MenooCategoryNav",
    emits: ["categorySelected", "categorySearch"],
    setup(__props, { expose: __expose, emit: __emit }) {
      const emit2 = __emit;
      const { menus } = useRestaurant();
      const searchTerm = ref("");
      const selectedCategory = ref(null);
      const horizontal = ref(null);
      const canScrollLeft = ref(false);
      const canScrollRight = ref(false);
      const categories = computed(() => {
        const cats = [];
        menus.value.forEach((menu2) => {
          if (menu2.categories) {
            cats.push(...menu2.categories);
          }
        });
        return cats.sort((a, b) => (a.order || 0) - (b.order || 0));
      });
      watch(selectedCategory, (newCategoryId) => {
        if (newCategoryId && horizontal.value) {
          const categoryIndex = categories.value.findIndex(
            (cat) => cat._id === newCategoryId
          );
          if (categoryIndex !== -1) {
            horizontal.value.scrollToIndex(categoryIndex);
          }
        }
      });
      const selectCategory = (categoryId) => {
        console.log("[MenooCategoryNav] selectCategory called with:", categoryId);
        const wasSelected = selectedCategory.value === categoryId;
        selectedCategory.value = wasSelected ? null : categoryId;
        console.log(
          "[MenooCategoryNav] Emitting categorySelected:",
          selectedCategory.value
        );
        emit2("categorySelected", { categoryId: selectedCategory.value });
      };
      const handleSearch = () => {
        emit2("categorySearch", { searchTerm: searchTerm.value });
      };
      const scrollLeft = () => {
        if (horizontal.value) {
          const event = new Event("click");
          horizontal.value.prev(event);
        }
      };
      const scrollRight = () => {
        if (horizontal.value) {
          const event = new Event("click");
          horizontal.value.next(event);
        }
      };
      const onScrollDebounce = ({
        left,
        width,
        scrollWidth
      }) => {
        canScrollLeft.value = left > 0;
        canScrollRight.value = left + width < scrollWidth - 1;
      };
      const t = (key) => i18n.t(key);
      __expose({
        getSelectedCategory: () => selectedCategory.value,
        setSelectedCategory: (id) => {
          selectedCategory.value = id;
        }
      });
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", _hoisted_1$5, [
          createBaseVNode("div", _hoisted_2$5, [
            withDirectives(createBaseVNode("input", {
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => searchTerm.value = $event),
              type: "text",
              class: "search-input",
              placeholder: t("menu.search"),
              onInput: handleSearch
            }, null, 40, _hoisted_3$5), [
              [vModelText, searchTerm.value]
            ])
          ]),
          createBaseVNode("h3", _hoisted_4$4, toDisplayString(t("menu.categories")), 1),
          createBaseVNode("div", _hoisted_5$4, [
            canScrollLeft.value ? (openBlock(), createElementBlock("button", {
              key: 0,
              class: "scroll-button scroll-left",
              onClick: scrollLeft,
              "aria-label": "Scroll left"
            }, " ‹ ")) : createCommentVNode("", true),
            createVNode(unref(VueHorizontal), {
              ref_key: "horizontal",
              ref: horizontal,
              class: "category-list",
              button: false,
              onScrollDebounce
            }, {
              default: withCtx(() => [
                (openBlock(true), createElementBlock(Fragment, null, renderList(categories.value, (category) => {
                  var _a;
                  return openBlock(), createElementBlock("div", {
                    key: category._id,
                    class: "category-item"
                  }, [
                    createBaseVNode("button", {
                      class: normalizeClass([
                        "category-button",
                        { active: selectedCategory.value === category._id }
                      ]),
                      onClick: ($event) => selectCategory(category._id)
                    }, [
                      createTextVNode(toDisplayString(category.name) + " ", 1),
                      createBaseVNode("span", _hoisted_7$3, toDisplayString(((_a = category.items) == null ? void 0 : _a.length) || 0), 1)
                    ], 10, _hoisted_6$4)
                  ]);
                }), 128))
              ]),
              _: 1
            }, 512),
            canScrollRight.value ? (openBlock(), createElementBlock("button", {
              key: 1,
              class: "scroll-button scroll-right",
              onClick: scrollRight,
              "aria-label": "Scroll right"
            }, " › ")) : createCommentVNode("", true)
          ])
        ]);
      };
    }
  });
  const _style_0$5 = "\n.category-nav[data-v-abe89e43] {\n  position: sticky;\n  top: 0;\n  z-index: 10;\n  background: var(--menoo-surface, #ffffff);\n  border-radius: var(--menoo-radius-md, 8px);\n  padding: var(--menoo-spacing-2, 16px);\n  box-shadow: var(--menoo-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.12));\n  margin-bottom: var(--menoo-spacing-2, 16px);\n}\n.search-box[data-v-abe89e43] {\n  margin-bottom: var(--menoo-spacing-2, 16px);\n}\n.search-input[data-v-abe89e43] {\n  width: 100%;\n  padding: var(--menoo-spacing-1, 8px) var(--menoo-spacing-2, 16px);\n  font-size: var(--menoo-font-size-md, 1rem);\n  border: 1px solid var(--menoo-border, #e0e0e0);\n  border-radius: var(--menoo-radius-md, 8px);\n  transition: all 0.3s ease;\n  box-sizing: border-box;\n}\n.search-input[data-v-abe89e43]:focus {\n  outline: none;\n  border-color: var(--menoo-primary, #f0ac28);\n  box-shadow: 0 0 0 3px rgba(240, 172, 40, 0.1);\n  transform: translateY(-1px);\n}\n.category-title[data-v-abe89e43] {\n  font-size: var(--menoo-font-size-lg, 1.125rem);\n  font-weight: var(--menoo-font-weight-bold, 700);\n  margin-bottom: var(--menoo-spacing-2, 16px);\n  color: var(--menoo-text-primary, #212121);\n  margin-top: 0;\n}\n.category-scroll-container[data-v-abe89e43] {\n  position: relative;\n  display: flex;\n  align-items: center;\n  gap: var(--menoo-spacing-1, 8px);\n  padding: 8px 0;\n  margin: -8px -8px;\n}\n.scroll-button[data-v-abe89e43] {\n  flex-shrink: 0;\n  width: 32px;\n  height: 32px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: var(--menoo-surface, #ffffff);\n  border: 1px solid var(--menoo-border, #e0e0e0);\n  border-radius: 50%;\n  cursor: pointer;\n  font-size: 24px;\n  color: var(--menoo-text-primary, #212121);\n  box-shadow: var(--menoo-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.12));\n  transition: all 0.3s ease;\n  z-index: 1;\n}\n.scroll-button[data-v-abe89e43]:hover {\n  background: var(--menoo-hover, #f5f5f5);\n  border-color: var(--menoo-primary, #f0ac28);\n  transform: scale(1.1);\n}\n.scroll-button[data-v-abe89e43]:active {\n  transform: scale(0.9);\n}\n.category-list[data-v-abe89e43] {\n  flex: 1;\n  display: flex;\n  gap: 12px;\n  overflow: hidden;\n  padding: 4px 8px;\n}\n.category-item[data-v-abe89e43] {\n  flex-shrink: 0;\n  margin: 4px 0;\n  padding: 0 4px;\n}\n.category-button[data-v-abe89e43] {\n  white-space: nowrap;\n  padding: var(--menoo-spacing-1, 8px) var(--menoo-spacing-2, 16px);\n  font-size: var(--menoo-font-size-md, 1rem);\n  color: var(--menoo-text-primary, #212121);\n  background: var(--menoo-hover, #f5f5f5);\n  border: 1px solid var(--menoo-border, #e0e0e0);\n  border-radius: var(--menoo-radius-lg, 12px);\n  cursor: pointer;\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n  display: inline-flex;\n  align-items: center;\n  gap: var(--menoo-spacing-1, 8px);\n}\n.category-button[data-v-abe89e43]:hover {\n  background: var(--menoo-surface, #ffffff);\n  border-color: var(--menoo-primary, #f0ac28);\n  transform: translateY(-2px);\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n}\n.category-button.active[data-v-abe89e43] {\n  background: var(--menoo-primary, #f0ac28);\n  color: var(--menoo-surface, #ffffff);\n  border-color: var(--menoo-primary, #f0ac28);\n  font-weight: var(--menoo-font-weight-medium, 500);\n  transform: scale(1.05);\n  box-shadow: 0 4px 12px rgba(240, 172, 40, 0.3);\n}\n.category-count[data-v-abe89e43] {\n  font-size: var(--menoo-font-size-sm, 0.875rem);\n  opacity: 0.8;\n}\n@media (max-width: 768px) {\n.category-nav[data-v-abe89e43] {\n    padding: var(--menoo-spacing-1, 8px);\n}\n.scroll-button[data-v-abe89e43] {\n    display: none;\n}\n.category-list[data-v-abe89e43] {\n    overflow-x: auto;\n    -webkit-overflow-scrolling: touch;\n    scrollbar-width: none;\n    -ms-overflow-style: none;\n}\n.category-list[data-v-abe89e43]::-webkit-scrollbar {\n    display: none;\n}\n}\n";
  const MenooCategoryNav = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["styles", [_style_0$5]], ["__scopeId", "data-v-abe89e43"]]);
  const p = typeof window > "u", j = 10;
  function nt(r) {
    Reflect.defineProperty(r, "v", { get: () => r.value, set(a) {
      r.value = a;
    } });
  }
  function tt(r) {
    const a = ref(r);
    return nt(a), a;
  }
  function H(r) {
    const a = computed(r);
    return Reflect.defineProperty(a, "v", { get: () => a.value }), a;
  }
  function et(r, a) {
    const E = customRef((d, m) => {
      let T = a;
      return { get: () => (d(), T), set(R) {
        T = r.value ? R : a, m();
      } };
    });
    return nt(E), E;
  }
  const f = { jumpToFirst: true, jumpToLast: true, overlayHeight: 0, minWidth: 0, replaceHash: false, root: null, boundaryOffset: { toTop: 0, toBottom: 0 }, edgeOffset: { first: 100, last: -100 } };
  function gt(r, a = f) {
    const { root: E = f.root, jumpToFirst: d = f.jumpToFirst, jumpToLast: m = f.jumpToLast, overlayHeight: T = f.overlayHeight, minWidth: R = f.minWidth, replaceHash: ot = f.replaceHash, boundaryOffset: { toTop: it = f.boundaryOffset.toTop, toBottom: st = f.boundaryOffset.toTop } = f.boundaryOffset, edgeOffset: { first: z = f.edgeOffset.first, last: $ = f.edgeOffset.last } = f.edgeOffset } = a, v = H(() => p ? null : unref(E) instanceof HTMLElement ? unref(E) : document.documentElement), b = H(() => v.v === document.documentElement), i = shallowReactive({ els: [], top: /* @__PURE__ */ new Map(), bottom: /* @__PURE__ */ new Map() }), w = tt(p || window.matchMedia(`(min-width: ${R}px)`).matches), h2 = et(w, false), x = tt(false), rt = H(() => h2.v ? L() : 0), s = et(w, null), F = H(() => {
      var t;
      return ((t = s.v) == null ? void 0 : t.id) || "";
    }), q = H(() => i.els.indexOf(s.v));
    let O, Y = p ? 0 : L(), I = true;
    function L() {
      return b.v ? window.scrollY : v.v.scrollTop;
    }
    function P() {
      return b.v ? v.v.getBoundingClientRect().top : -v.v.scrollTop;
    }
    function A() {
      if (p) return;
      let t = [];
      r.value[0] instanceof HTMLElement ? t = r.value : r.value.forEach((n) => {
        const o = document.getElementById(n);
        o && t.push(o);
      }), t.sort((n, o) => n.getBoundingClientRect().top - o.getBoundingClientRect().top), i.els = t;
      const e = v.v.getBoundingClientRect().top - (b.v ? 0 : v.v.scrollTop);
      i.top.clear(), i.bottom.clear(), t.forEach((n) => {
        const { top: o, bottom: c } = n.getBoundingClientRect(), l = n.id || Math.random().toString(36).substr(2, 9);
        i.top.set(l, o - e), i.bottom.set(l, c - e);
      });
    }
    function W({ prevY: t, isScrollCancel: e = false }) {
      const n = L();
      return n < t ? (function() {
        let o = m ? B(i.els) : null;
        const c = P(), l = j + T + it;
        if (Array.from(i.bottom).some(([u, g], Z) => {
          const lt = m || Z !== i.bottom.size - 1 ? 0 : $;
          if (c + g > l + lt) return o = i.els[Z], true;
        }), !d && o === i.els[0]) {
          const u = i.top.values().next().value;
          if (u && c + u > l + z) return s.v = null;
        }
        (i.els.indexOf(o) < i.els.indexOf(s.v) || o && !s.v) && (s.v = o);
      })() : M({ isScrollCancel: e }), n;
    }
    const B = (t) => t[t.length - 1];
    function C() {
      if (!d && !m) return false;
      const { isBottom: t, isTop: e } = (function(n) {
        const o = n === document.documentElement ? window.innerHeight : n.clientHeight;
        return { isTop: n.scrollTop <= 2 * j, isBottom: Math.abs(n.scrollHeight - o - n.scrollTop) <= 1 };
      })(v.v);
      return d && e ? (s.v = i.els[0], true) : m && t ? (s.v = B(i.els), true) : void 0;
    }
    function M({ isScrollCancel: t } = { isScrollCancel: false }) {
      let e = d ? i.els[0] : null;
      const n = P(), o = j + T + st;
      if (Array.from(i.top).some(([c, l], u) => !(n + l < o + (d || u !== 0 ? 0 : z)) || (e = i.els[u], false)), !m && e === B(i.els)) {
        const c = B(Array.from(i.bottom.values()));
        if (n + c < o + $) return s.v = null;
      }
      if (i.els.indexOf(e) > i.els.indexOf(s.v) || e && !s.v) return s.v = e;
      t && (s.v = e);
    }
    function k() {
      h2.v || (Y = W({ prevY: Y }), C());
    }
    function N(t = 20) {
      let e, n = L(), o = 0;
      e = window.requestAnimationFrame(function c() {
        o++;
        const l = L();
        if (n !== l) return o = 0, n = l, window.requestAnimationFrame(c);
        o === t ? (x.v = true, h2.v = false, cancelAnimationFrame(e)) : window.requestAnimationFrame(c);
      });
    }
    function U() {
      const t = i.els.find(({ id: e }) => e === location.hash.slice(1));
      if (t) return s.v = t, true;
    }
    function X(t) {
      var e;
      if (!((e = t == null ? void 0 : t.state) != null && e.current.includes("#")) && s.v) return s.v = d ? i.els[0] : null;
      U();
    }
    function D() {
      window.addEventListener("popstate", X);
    }
    function G() {
      window.removeEventListener("popstate", X);
    }
    function J() {
      w.v = window.matchMedia(`(min-width: ${R}px)`).matches;
    }
    function K() {
      O = new ResizeObserver(() => {
        I ? I = false : (A(), window.requestAnimationFrame(() => {
          C() || M();
        }));
      }), O.observe(v.v);
    }
    function Q() {
      O == null || O.disconnect();
    }
    function S() {
      h2.v = false;
    }
    onMounted(async () => {
      window.addEventListener("resize", J, { passive: true }), await new Promise((t) => window.setTimeout(t)), w.v && (A(), K(), location.hash ? N(10) : x.v = true, D(), U() || C() || M());
    }), watch(v, A, { flush: "post" }), watch(isRef(r) || isReactive(r) ? r : () => null, A, { flush: "post" }), watch(w, (t) => {
      t ? (A(), K(), D(), C() || M()) : (s.v = null, G(), Q());
    }), watch(q, (t) => {
      if (ot) {
        const e = location.href.split("#")[0], n = t > (d ? 0 : -1) ? `#${F.v}` : "";
        history.replaceState(history.state, "", `${e}${n}`);
      }
    }), onBeforeUnmount(() => {
      window.removeEventListener("resize", J), G(), Q();
    }), watch([x, w, v, r], ([t, e, n, o], c, l) => {
      if (p) return;
      const u = b.v ? document : n, g = u && t && e && o.length > 0;
      g && u.addEventListener("scroll", k, { passive: true }), l(() => {
        g && u.removeEventListener("scroll", k);
      });
    });
    const V = [["wheel", S, { once: true }], ["touchmove", S, { once: true }], ["keydown", function(t) {
      t.code === "Space" && S();
    }, { once: true }], ["scroll", N, { passive: true, once: true }], ["pointerdown", function(t) {
      if (t.target.tagName !== "A") {
        const e = window.CSS.supports("-moz-appearance", "none"), n = (function(o, c) {
          const l = c === document.documentElement ? window.innerWidth : c.clientWidth;
          return o.clientX >= l - 17;
        })(t, v.v);
        (e || n) && (S(), W({ prevY: rt.v, isScrollCancel: true }));
      }
    }]];
    return watch(h2, (t, e, n) => {
      const o = b.v ? document : v.v, c = r.value.length > 0;
      t && c && V.forEach(([l, u, g]) => o.addEventListener(l, u, g)), n(() => {
        t && c && V.forEach(([l, u]) => o.removeEventListener(l, u));
      });
    }), { isActive: function(t) {
      return !p && (typeof t == "string" ? t === F.v : t instanceof HTMLElement && t === s.v);
    }, setActive: function(t) {
      if (p) return;
      let e = null;
      typeof t == "string" ? e = i.els.find(({ id: n }) => n === t) || null : t instanceof HTMLElement && (e = i.els.find((n) => n === t) || null), e && (s.v = e, h2.v = true);
    }, activeEl: readonly(s), activeId: F, activeIndex: q };
  }
  const _hoisted_1$4 = {
    key: 0,
    class: "options-container"
  };
  const _hoisted_2$4 = { class: "option-header" };
  const _hoisted_3$4 = { class: "option-title" };
  const _hoisted_4$3 = {
    key: 0,
    class: "option-required"
  };
  const _hoisted_5$3 = {
    key: 1,
    class: "option-optional"
  };
  const _hoisted_6$3 = { class: "option-subtitle" };
  const _hoisted_7$2 = {
    key: 0,
    class: "option-choices"
  };
  const _hoisted_8$2 = ["name", "value", "onChange"];
  const _hoisted_9$2 = { class: "choice-label" };
  const _hoisted_10$2 = {
    key: 0,
    class: "choice-price"
  };
  const _hoisted_11$2 = {
    key: 1,
    class: "option-choices"
  };
  const _hoisted_12$2 = ["value", "onChange"];
  const _hoisted_13$1 = { class: "choice-label" };
  const _hoisted_14$1 = {
    key: 0,
    class: "choice-price"
  };
  const _sfc_main$4 = /* @__PURE__ */ defineComponent({
    __name: "MenooItemOptions",
    props: {
      options: { type: Array }
    },
    emits: ["update:selection"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      onMounted(() => {
        console.log("[MenooItemOptions] Options received:", props.options);
        console.log(
          "[MenooItemOptions] Raw options:",
          JSON.parse(JSON.stringify(props.options))
        );
        props.options.forEach((opt, idx) => {
          var _a;
          console.log(`[MenooItemOptions] Option ${idx}:`, {
            id: opt._id,
            title: opt.title,
            type: opt.type,
            required: opt.required,
            valuesCount: ((_a = opt.values) == null ? void 0 : _a.length) || 0,
            values: opt.values,
            rawOption: JSON.parse(JSON.stringify(opt))
          });
        });
      });
      const emit2 = __emit;
      const { formatPrice } = useFormatPrice();
      const { t } = i18n.global;
      const selections = ref(/* @__PURE__ */ new Map());
      const handleSingleSelection = (option, choiceId) => {
        selections.value.set(option._id, /* @__PURE__ */ new Set([choiceId]));
        emitSelections();
      };
      const handleMultipleSelection = (option, choiceId, event) => {
        const checked = event.target.checked;
        const current = selections.value.get(option._id) || /* @__PURE__ */ new Set();
        if (checked) {
          current.add(choiceId);
        } else {
          current.delete(choiceId);
        }
        selections.value.set(option._id, current);
        emitSelections();
      };
      const emitSelections = () => {
        const optionSelections = [];
        selections.value.forEach((choices, optionId) => {
          if (choices.size > 0) {
            optionSelections.push({
              option: optionId,
              choices: Array.from(choices)
            });
          }
        });
        const valid = props.options.filter((opt) => opt.required).every((opt) => {
          const selection = selections.value.get(opt._id);
          return selection && selection.size > 0;
        });
        emit2("update:selection", optionSelections, valid);
      };
      watch(
        () => props.options,
        () => {
          selections.value.clear();
          emitSelections();
        },
        { immediate: true }
      );
      return (_ctx, _cache) => {
        return __props.options && __props.options.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_1$4, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.options, (option) => {
            return openBlock(), createElementBlock("div", {
              key: option._id,
              class: "option-group"
            }, [
              createBaseVNode("div", _hoisted_2$4, [
                createBaseVNode("span", _hoisted_3$4, toDisplayString(option.title), 1),
                option.required ? (openBlock(), createElementBlock("span", _hoisted_4$3, toDisplayString(unref(t)("dialog.options.required")), 1)) : (openBlock(), createElementBlock("span", _hoisted_5$3, toDisplayString(unref(t)("dialog.options.optional")), 1))
              ]),
              createBaseVNode("div", _hoisted_6$3, toDisplayString(option.type === "single" ? unref(t)("dialog.options.singleChoice") : unref(t)("dialog.options.multipleChoice")), 1),
              option.type === "single" ? (openBlock(), createElementBlock("div", _hoisted_7$2, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(option.values, (choice) => {
                  return openBlock(), createElementBlock("label", {
                    key: choice._id,
                    class: "choice-item"
                  }, [
                    createBaseVNode("input", {
                      type: "radio",
                      name: `option-${option._id}`,
                      value: choice._id,
                      onChange: ($event) => handleSingleSelection(option, choice._id),
                      class: "choice-radio"
                    }, null, 40, _hoisted_8$2),
                    createBaseVNode("span", _hoisted_9$2, toDisplayString(choice.name), 1),
                    choice.price !== 0 ? (openBlock(), createElementBlock("span", _hoisted_10$2, toDisplayString(choice.price > 0 ? "+" : "") + toDisplayString(unref(formatPrice)(choice.price)), 1)) : createCommentVNode("", true)
                  ]);
                }), 128))
              ])) : (openBlock(), createElementBlock("div", _hoisted_11$2, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(option.values, (choice) => {
                  return openBlock(), createElementBlock("label", {
                    key: choice._id,
                    class: "choice-item"
                  }, [
                    createBaseVNode("input", {
                      type: "checkbox",
                      value: choice._id,
                      onChange: ($event) => handleMultipleSelection(option, choice._id, $event),
                      class: "choice-checkbox"
                    }, null, 40, _hoisted_12$2),
                    createBaseVNode("span", _hoisted_13$1, toDisplayString(choice.name), 1),
                    choice.price !== 0 ? (openBlock(), createElementBlock("span", _hoisted_14$1, toDisplayString(choice.price > 0 ? "+" : "") + toDisplayString(unref(formatPrice)(choice.price)), 1)) : createCommentVNode("", true)
                  ]);
                }), 128))
              ]))
            ]);
          }), 128))
        ])) : createCommentVNode("", true);
      };
    }
  });
  const _style_0$4 = "\n.options-container[data-v-fdad1253] {\n  margin-top: var(--menoo-spacing-3, 24px);\n  border-top: 1px solid var(--menoo-border, #e0e0e0);\n  padding-top: var(--menoo-spacing-3, 24px);\n}\n.option-group[data-v-fdad1253] {\n  margin-bottom: var(--menoo-spacing-4, 32px);\n}\n.option-group[data-v-fdad1253]:last-child {\n  margin-bottom: 0;\n}\n.option-header[data-v-fdad1253] {\n  display: flex;\n  align-items: center;\n  gap: var(--menoo-spacing-1, 8px);\n  margin-bottom: var(--menoo-spacing-1, 8px);\n}\n.option-title[data-v-fdad1253] {\n  font-size: var(--menoo-font-size-md, 1rem);\n  font-weight: var(--menoo-font-weight-medium, 500);\n  color: var(--menoo-text-primary, #212121);\n}\n.option-required[data-v-fdad1253] {\n  padding: 2px 8px;\n  background: #fff2d7;\n  color: var(--menoo-primary, #f0ac28);\n  font-size: var(--menoo-font-size-xs, 0.75rem);\n  font-weight: var(--menoo-font-weight-medium, 500);\n  border-radius: var(--menoo-radius-sm, 4px);\n  text-transform: uppercase;\n}\n.option-optional[data-v-fdad1253] {\n  padding: 2px 8px;\n  background: var(--menoo-surface-variant, #f5f5f5);\n  color: var(--menoo-text-secondary, #757575);\n  font-size: var(--menoo-font-size-xs, 0.75rem);\n  border-radius: var(--menoo-radius-sm, 4px);\n}\n.option-subtitle[data-v-fdad1253] {\n  font-size: var(--menoo-font-size-sm, 0.875rem);\n  color: var(--menoo-text-secondary, #757575);\n  margin-bottom: var(--menoo-spacing-2, 16px);\n}\n.option-choices[data-v-fdad1253] {\n  display: flex;\n  flex-direction: column;\n  gap: var(--menoo-spacing-2, 16px);\n}\n.choice-item[data-v-fdad1253] {\n  display: flex;\n  align-items: center;\n  gap: var(--menoo-spacing-2, 16px);\n  padding: var(--menoo-spacing-2, 16px);\n  border: 1px solid var(--menoo-border, #e0e0e0);\n  border-radius: var(--menoo-radius-md, 8px);\n  cursor: pointer;\n  transition: all 0.2s;\n}\n.choice-item[data-v-fdad1253]:hover {\n  border-color: var(--menoo-primary, #f0ac28);\n  background: var(--menoo-surface-variant, #f5f5f5);\n}\n.choice-radio[data-v-fdad1253],\n.choice-checkbox[data-v-fdad1253] {\n  width: 20px;\n  height: 20px;\n  cursor: pointer;\n  accent-color: var(--menoo-primary, #f0ac28);\n}\n.choice-label[data-v-fdad1253] {\n  flex: 1;\n  font-size: var(--menoo-font-size-md, 1rem);\n  color: var(--menoo-text-primary, #212121);\n}\n.choice-price[data-v-fdad1253] {\n  font-size: var(--menoo-font-size-sm, 0.875rem);\n  font-weight: var(--menoo-font-weight-medium, 500);\n  color: var(--menoo-primary, #f0ac28);\n}\n\n/* Checked state styling */\n.choice-item[data-v-fdad1253]:has(input:checked) {\n  border-color: var(--menoo-primary, #f0ac28);\n  background: #fff8e6;\n}\n@media (max-width: 768px) {\n.option-header[data-v-fdad1253] {\n    flex-wrap: wrap;\n}\n.choice-item[data-v-fdad1253] {\n    padding: var(--menoo-spacing-1, 8px) var(--menoo-spacing-2, 16px);\n}\n}\n";
  const MenooItemOptions = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["styles", [_style_0$4]], ["__scopeId", "data-v-fdad1253"]]);
  const _hoisted_1$3 = {
    key: 0,
    class: "dialog-container"
  };
  const _hoisted_2$3 = { class: "dialog-content" };
  const _hoisted_3$3 = {
    key: 0,
    class: "dialog-image"
  };
  const _hoisted_4$2 = ["src", "alt"];
  const _hoisted_5$2 = { class: "dialog-body" };
  const _hoisted_6$2 = { class: "dialog-title" };
  const _hoisted_7$1 = {
    key: 0,
    class: "dialog-description"
  };
  const _hoisted_8$1 = { class: "dialog-note" };
  const _hoisted_9$1 = { class: "note-label" };
  const _hoisted_10$1 = ["placeholder"];
  const _hoisted_11$1 = { class: "dialog-actions" };
  const _hoisted_12$1 = { class: "quantity-controls" };
  const _hoisted_13 = ["disabled"];
  const _hoisted_14 = { class: "quantity-value" };
  const _hoisted_15 = ["disabled"];
  const _sfc_main$3 = /* @__PURE__ */ defineComponent({
    __name: "MenooItemDialog",
    props: {
      show: { type: Boolean },
      item: { type: Object }
    },
    emits: ["close"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit2 = __emit;
      const { addToCart } = useCart();
      const { formatPrice } = useFormatPrice();
      const { t } = i18n.global;
      const quantity = ref(1);
      const note = ref("");
      const selectedOptions = ref([]);
      const optionsValid = ref(true);
      const totalPrice = computed(() => {
        let price = props.item.price;
        if (selectedOptions.value.length > 0 && props.item.options) {
          selectedOptions.value.forEach((selection) => {
            var _a;
            const option = (_a = props.item.options) == null ? void 0 : _a.find(
              (o) => o._id === selection.option
            );
            if (option) {
              selection.choices.forEach((choiceId) => {
                const choice = option.values.find((c) => c._id === choiceId);
                if (choice) {
                  price += choice.price;
                }
              });
            }
          });
        }
        return price * quantity.value;
      });
      const isValid = computed(() => {
        if (!props.item.options || props.item.options.length === 0) {
          return true;
        }
        return props.item.options.filter((opt) => opt.required).every((opt) => {
          const selection = selectedOptions.value.find((s) => s.option === opt._id);
          return selection && selection.choices.length > 0;
        });
      });
      const handleOptionsChange = (options, valid) => {
        selectedOptions.value = options;
        optionsValid.value = valid;
      };
      const handleAddToCart = () => {
        if (!isValid.value) return;
        addToCart(props.item, selectedOptions.value, note.value, quantity.value);
        handleClose();
      };
      const handleClose = () => {
        const event = new CustomEvent("close", {
          bubbles: true,
          composed: true
        });
        const host = document.querySelector("menoo-item-dialog");
        if (host) {
          host.dispatchEvent(event);
        }
        emit2("close");
        quantity.value = 1;
        note.value = "";
        selectedOptions.value = [];
      };
      watch(
        () => props.item,
        () => {
          quantity.value = 1;
          note.value = "";
          selectedOptions.value = [];
        }
      );
      return (_ctx, _cache) => {
        return openBlock(), createBlock(Transition, {
          name: "dialog-fade",
          appear: ""
        }, {
          default: withCtx(() => [
            __props.show ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: "dialog-overlay",
              onClick: withModifiers(handleClose, ["self"])
            }, [
              createVNode(Transition, { name: "dialog-slide" }, {
                default: withCtx(() => [
                  __props.show ? (openBlock(), createElementBlock("div", _hoisted_1$3, [
                    createBaseVNode("button", {
                      class: "dialog-close",
                      onClick: handleClose
                    }, [..._cache[3] || (_cache[3] = [
                      createBaseVNode("svg", {
                        width: "24",
                        height: "24",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": "2"
                      }, [
                        createBaseVNode("line", {
                          x1: "18",
                          y1: "6",
                          x2: "6",
                          y2: "18"
                        }),
                        createBaseVNode("line", {
                          x1: "6",
                          y1: "6",
                          x2: "18",
                          y2: "18"
                        })
                      ], -1)
                    ])]),
                    createBaseVNode("div", _hoisted_2$3, [
                      __props.item.images && __props.item.images.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_3$3, [
                        createBaseVNode("img", {
                          src: __props.item.images[0].url,
                          alt: __props.item.name
                        }, null, 8, _hoisted_4$2)
                      ])) : createCommentVNode("", true),
                      createBaseVNode("div", _hoisted_5$2, [
                        createBaseVNode("h2", _hoisted_6$2, toDisplayString(__props.item.name), 1),
                        __props.item.description ? (openBlock(), createElementBlock("p", _hoisted_7$1, toDisplayString(__props.item.description), 1)) : createCommentVNode("", true),
                        __props.item.options && __props.item.options.length > 0 ? (openBlock(), createBlock(MenooItemOptions, {
                          key: 1,
                          options: __props.item.options,
                          "onUpdate:selection": handleOptionsChange
                        }, null, 8, ["options"])) : createCommentVNode("", true),
                        createBaseVNode("div", _hoisted_8$1, [
                          createBaseVNode("label", _hoisted_9$1, toDisplayString(unref(t)("dialog.note")), 1),
                          withDirectives(createBaseVNode("textarea", {
                            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => note.value = $event),
                            class: "note-input",
                            placeholder: unref(t)("dialog.notePlaceholder"),
                            rows: "2"
                          }, null, 8, _hoisted_10$1), [
                            [vModelText, note.value]
                          ])
                        ]),
                        createBaseVNode("div", _hoisted_11$1, [
                          createBaseVNode("div", _hoisted_12$1, [
                            createBaseVNode("button", {
                              class: "qty-btn",
                              disabled: quantity.value <= 1,
                              onClick: _cache[1] || (_cache[1] = ($event) => quantity.value--)
                            }, " − ", 8, _hoisted_13),
                            createBaseVNode("span", _hoisted_14, toDisplayString(quantity.value), 1),
                            createBaseVNode("button", {
                              class: "qty-btn",
                              onClick: _cache[2] || (_cache[2] = ($event) => quantity.value++)
                            }, "+")
                          ]),
                          createBaseVNode("button", {
                            class: "add-to-cart-btn",
                            disabled: !isValid.value,
                            onClick: handleAddToCart
                          }, toDisplayString(unref(t)("dialog.addToCart", {
                            price: unref(formatPrice)(totalPrice.value)
                          })), 9, _hoisted_15)
                        ])
                      ])
                    ])
                  ])) : createCommentVNode("", true)
                ]),
                _: 1
              })
            ])) : createCommentVNode("", true)
          ]),
          _: 1
        });
      };
    }
  });
  const _style_0$3 = "\n/* Overlay fade transition */\n.dialog-fade-enter-active[data-v-e47fc4d7] {\n  transition: opacity 0.3s ease;\n}\n.dialog-fade-leave-active[data-v-e47fc4d7] {\n  transition: opacity 0.25s ease;\n}\n.dialog-fade-enter-from[data-v-e47fc4d7],\n.dialog-fade-leave-to[data-v-e47fc4d7] {\n  opacity: 0;\n}\n\n/* Dialog container slide transition */\n.dialog-slide-enter-active[data-v-e47fc4d7] {\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.dialog-slide-leave-active[data-v-e47fc4d7] {\n  transition: all 0.25s cubic-bezier(0.4, 0, 0.6, 1);\n}\n.dialog-slide-enter-from[data-v-e47fc4d7] {\n  opacity: 0;\n  transform: translateY(30px) scale(0.9);\n}\n.dialog-slide-leave-to[data-v-e47fc4d7] {\n  opacity: 0;\n  transform: translateY(-20px) scale(0.95);\n}\n.dialog-overlay[data-v-e47fc4d7] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 9999;\n  padding: var(--menoo-spacing-2, 16px);\n  overflow-y: auto;\n}\n.dialog-container[data-v-e47fc4d7] {\n  background: var(--menoo-surface, #ffffff);\n  border-radius: var(--menoo-radius-lg, 12px);\n  max-width: 600px;\n  width: 100%;\n  max-height: 90vh;\n  overflow-y: auto;\n  overflow-x: hidden;\n  position: relative;\n  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);\n  box-sizing: border-box;\n}\n.dialog-close[data-v-e47fc4d7] {\n  position: absolute;\n  top: var(--menoo-spacing-2, 16px);\n  right: var(--menoo-spacing-2, 16px);\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.9);\n  border: none;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1;\n  transition: transform 0.2s;\n}\n.dialog-close[data-v-e47fc4d7]:hover {\n  transform: scale(1.1);\n}\n.dialog-content[data-v-e47fc4d7] {\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  box-sizing: border-box;\n}\n.dialog-image[data-v-e47fc4d7] {\n  width: 100%;\n  height: 300px;\n  overflow: hidden;\n}\n.dialog-image img[data-v-e47fc4d7] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n.dialog-body[data-v-e47fc4d7] {\n  padding: var(--menoo-spacing-3, 24px);\n  box-sizing: border-box;\n  width: 100%;\n}\n.dialog-title[data-v-e47fc4d7] {\n  font-size: var(--menoo-font-size-xl, 1.5rem);\n  font-weight: var(--menoo-font-weight-bold, 700);\n  margin: 0 0 var(--menoo-spacing-2, 16px) 0;\n  color: var(--menoo-text-primary, #212121);\n}\n.dialog-description[data-v-e47fc4d7] {\n  font-size: var(--menoo-font-size-md, 1rem);\n  color: var(--menoo-text-secondary, #757575);\n  line-height: 1.5;\n  margin-bottom: var(--menoo-spacing-3, 24px);\n}\n.dialog-note[data-v-e47fc4d7] {\n  margin-top: var(--menoo-spacing-3, 24px);\n}\n.note-label[data-v-e47fc4d7] {\n  display: block;\n  font-size: var(--menoo-font-size-sm, 0.875rem);\n  font-weight: var(--menoo-font-weight-medium, 500);\n  margin-bottom: var(--menoo-spacing-1, 8px);\n  color: var(--menoo-text-primary, #212121);\n}\n.note-input[data-v-e47fc4d7] {\n  width: 100%;\n  padding: var(--menoo-spacing-2, 16px);\n  border: 1px solid var(--menoo-border, #e0e0e0);\n  border-radius: var(--menoo-radius-md, 8px);\n  font-size: var(--menoo-font-size-md, 1rem);\n  font-family: inherit;\n  resize: vertical;\n  transition: border-color 0.2s;\n  box-sizing: border-box;\n}\n.note-input[data-v-e47fc4d7]:focus {\n  outline: none;\n  border-color: var(--menoo-primary, #f0ac28);\n  transition: border-color 0.2s ease;\n}\n.dialog-actions[data-v-e47fc4d7] {\n  display: flex;\n  align-items: center;\n  gap: var(--menoo-spacing-2, 16px);\n  margin-top: var(--menoo-spacing-3, 24px);\n}\n.quantity-controls[data-v-e47fc4d7] {\n  display: flex;\n  align-items: center;\n  gap: var(--menoo-spacing-2, 16px);\n  padding: var(--menoo-spacing-1, 8px) var(--menoo-spacing-2, 16px);\n  border: 1px solid var(--menoo-border, #e0e0e0);\n  border-radius: var(--menoo-radius-md, 8px);\n}\n.qty-btn[data-v-e47fc4d7] {\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  border: 1px solid var(--menoo-primary, #f0ac28);\n  background: transparent;\n  color: var(--menoo-primary, #f0ac28);\n  font-size: 18px;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: all 0.2s;\n}\n.qty-btn[data-v-e47fc4d7]:not(:disabled):hover {\n  background: var(--menoo-primary, #f0ac28);\n  color: white;\n}\n.qty-btn[data-v-e47fc4d7]:disabled {\n  opacity: 0.3;\n  cursor: not-allowed;\n}\n.quantity-value[data-v-e47fc4d7] {\n  min-width: 24px;\n  text-align: center;\n  font-weight: var(--menoo-font-weight-medium, 500);\n}\n.add-to-cart-btn[data-v-e47fc4d7] {\n  flex: 1;\n  padding: var(--menoo-spacing-2, 16px) var(--menoo-spacing-3, 24px);\n  background: var(--menoo-primary, #f0ac28);\n  color: white;\n  border: none;\n  border-radius: var(--menoo-radius-md, 8px);\n  font-size: var(--menoo-font-size-md, 1rem);\n  font-weight: var(--menoo-font-weight-medium, 500);\n  cursor: pointer;\n  transition: all 0.2s;\n}\n.add-to-cart-btn[data-v-e47fc4d7]:not(:disabled):hover {\n  background: var(--menoo-primary-dark, #d89a1f);\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(240, 172, 40, 0.3);\n}\n.add-to-cart-btn[data-v-e47fc4d7]:not(:disabled):active {\n  transform: translateY(0);\n}\n.add-to-cart-btn[data-v-e47fc4d7]:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n  transform: none;\n}\n\n/* Mobile Responsive */\n@media (max-width: 768px) {\n.dialog-overlay[data-v-e47fc4d7] {\n    padding: 0;\n    align-items: flex-end;\n}\n.dialog-container[data-v-e47fc4d7] {\n    max-width: 100%;\n    max-height: 95vh;\n    border-bottom-left-radius: 0;\n    border-bottom-right-radius: 0;\n}\n.dialog-image[data-v-e47fc4d7] {\n    height: 200px;\n}\n.dialog-actions[data-v-e47fc4d7] {\n    flex-direction: column;\n}\n.quantity-controls[data-v-e47fc4d7] {\n    width: 100%;\n    justify-content: center;\n}\n.add-to-cart-btn[data-v-e47fc4d7] {\n    width: 100%;\n}\n}\n";
  const MenooItemDialog = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["styles", [_style_0$3]], ["__scopeId", "data-v-e47fc4d7"]]);
  const _hoisted_1$2 = {
    key: 0,
    class: "no-items"
  };
  const _hoisted_2$2 = ["id"];
  const _hoisted_3$2 = { class: "category-header" };
  const _hoisted_4$1 = { class: "items-grid" };
  const _hoisted_5$1 = ["onClick"];
  const _hoisted_6$1 = ["src", "alt"];
  const _hoisted_7 = { class: "item-content" };
  const _hoisted_8 = { class: "item-name" };
  const _hoisted_9 = {
    key: 0,
    class: "item-description"
  };
  const _hoisted_10 = { class: "item-footer" };
  const _hoisted_11 = { class: "item-price" };
  const _hoisted_12 = ["onClick"];
  const _sfc_main$2 = /* @__PURE__ */ defineComponent({
    __name: "MenooItemGrid",
    props: {
      category: { type: String },
      search: { type: String }
    },
    emits: ["activeCategoryChange"],
    setup(__props, { expose: __expose, emit: __emit }) {
      const props = __props;
      const emit2 = __emit;
      const { addToCart } = useCart();
      const { menus } = useRestaurant();
      const { formatPrice } = useFormatPrice();
      const itemGridRef = ref();
      const showDialog = ref(false);
      const selectedItem = ref(null);
      const filteredCategories = computed(() => {
        let categories = [];
        menus.value.forEach((menu2) => {
          if (menu2.categories) {
            categories.push(...menu2.categories);
          }
        });
        if (props.search) {
          const term = props.search.toLowerCase();
          categories = categories.map((cat) => ({
            ...cat,
            items: cat.items.filter(
              (item2) => {
                var _a;
                return item2.name.toLowerCase().includes(term) || ((_a = item2.description) == null ? void 0 : _a.toLowerCase().includes(term));
              }
            )
          })).filter((cat) => cat.items.length > 0);
        }
        return categories.sort((a, b) => (a.order || 0) - (b.order || 0));
      });
      const categorySectionRefs = ref([]);
      const setCategorySectionRef = (el, index) => {
        if (el) {
          categorySectionRefs.value[index] = el;
        }
      };
      const categoryElements = computed(() => {
        return categorySectionRefs.value.filter(Boolean);
      });
      watch(
        () => filteredCategories.value.length,
        () => {
          categorySectionRefs.value = [];
        }
      );
      const getOverlayHeight = () => {
        const categoryNav = document.querySelector(
          "menoo-category-nav"
        );
        const stickyOffset = parseInt(
          (categoryNav == null ? void 0 : categoryNav.getAttribute("data-sticky-offset")) || "0",
          10
        );
        const navHeight = (categoryNav == null ? void 0 : categoryNav.offsetHeight) || 100;
        return stickyOffset + navHeight + 20;
      };
      const { setActive, activeId } = gt(categoryElements, {
        overlayHeight: getOverlayHeight(),
        jumpToFirst: true,
        replaceHash: false
      });
      watch(activeId, (newActiveId) => {
        var _a;
        if (newActiveId) {
          console.log(
            "[MenooItemGrid] Active category changed via scroll:",
            newActiveId
          );
          emit2("activeCategoryChange", { categoryId: newActiveId });
          const event = new CustomEvent("active-category-change", {
            detail: { categoryId: newActiveId },
            bubbles: true,
            composed: true
          });
          (_a = itemGridRef.value) == null ? void 0 : _a.dispatchEvent(event);
        }
      });
      const handleItemClick = (item2) => {
        if (item2.available !== false) {
          selectedItem.value = item2;
          showDialog.value = true;
        }
      };
      const handleQuickAdd = (item2, event) => {
        console.log("[MenooItemGrid] handleQuickAdd called", event);
        if (item2.options && item2.options.length > 0) {
          selectedItem.value = item2;
          showDialog.value = true;
        } else {
          addToCart(item2, [], "", 1);
          const button = event.currentTarget;
          console.log("[MenooItemGrid] Adding animation to button", button);
          button.classList.add("item-add-btn--success");
          setTimeout(() => {
            button.classList.remove("item-add-btn--success");
            console.log("[MenooItemGrid] Animation removed");
          }, 600);
        }
      };
      const closeDialog = () => {
        showDialog.value = false;
        selectedItem.value = null;
      };
      const t = (key) => i18n.t(key);
      const scrollToCategory = (categoryId) => {
        console.log("[MenooItemGrid] scrollToCategory called with:", categoryId);
        const element = categorySectionRefs.value.find(
          (el) => el && el.id === categoryId
        );
        if (element) {
          const categoryNav = document.querySelector(
            "menoo-category-nav"
          );
          const stickyOffset = parseInt(
            (categoryNav == null ? void 0 : categoryNav.getAttribute("data-sticky-offset")) || "0",
            10
          );
          const navHeight = (categoryNav == null ? void 0 : categoryNav.offsetHeight) || 100;
          const headerOffset = stickyOffset + navHeight + 100;
          const elPos = element.getBoundingClientRect().top;
          const offset = elPos + window.scrollY - headerOffset;
          window.scrollTo({
            top: offset,
            behavior: "smooth"
          });
          setActive(element);
        } else {
          console.warn("[MenooItemGrid] Category element not found:", categoryId);
        }
      };
      watch(
        () => props.category,
        (newCategory) => {
          console.log("[MenooItemGrid] Category prop changed to:", newCategory);
          if (newCategory) {
            scrollToCategory(newCategory);
          }
        }
      );
      __expose({
        scrollToCategory
      });
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", {
          ref_key: "itemGridRef",
          ref: itemGridRef,
          class: "item-grid"
        }, [
          filteredCategories.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_1$2, toDisplayString(t("menu.noResults")), 1)) : createCommentVNode("", true),
          (openBlock(true), createElementBlock(Fragment, null, renderList(filteredCategories.value, (category, index) => {
            return openBlock(), createElementBlock("div", {
              key: category._id,
              id: category._id,
              ref_for: true,
              ref: (el) => setCategorySectionRef(el, index),
              class: "category-section"
            }, [
              createBaseVNode("h2", _hoisted_3$2, toDisplayString(category.name), 1),
              createBaseVNode("div", _hoisted_4$1, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(category.items.filter((i) => i.available !== false), (item2) => {
                  return openBlock(), createElementBlock("div", {
                    key: item2._id,
                    class: normalizeClass([
                      "item-card",
                      { "item-unavailable": item2.available === false }
                    ]),
                    onClick: ($event) => handleItemClick(item2)
                  }, [
                    item2.images && item2.images.length > 0 ? (openBlock(), createElementBlock("img", {
                      key: 0,
                      class: "item-image",
                      src: item2.images[0].thumbnailUrl,
                      alt: item2.name,
                      loading: "lazy"
                    }, null, 8, _hoisted_6$1)) : createCommentVNode("", true),
                    createBaseVNode("div", _hoisted_7, [
                      createBaseVNode("h3", _hoisted_8, toDisplayString(item2.name), 1),
                      item2.description ? (openBlock(), createElementBlock("p", _hoisted_9, toDisplayString(item2.description), 1)) : createCommentVNode("", true),
                      createBaseVNode("div", _hoisted_10, [
                        createBaseVNode("span", _hoisted_11, toDisplayString(unref(formatPrice)(item2.price)), 1),
                        item2.available !== false ? (openBlock(), createElementBlock("button", {
                          key: 0,
                          class: "item-add-btn",
                          onClick: withModifiers(($event) => handleQuickAdd(item2, $event), ["stop"])
                        }, toDisplayString(t("cart.add")), 9, _hoisted_12)) : createCommentVNode("", true)
                      ])
                    ])
                  ], 10, _hoisted_5$1);
                }), 128))
              ])
            ], 8, _hoisted_2$2);
          }), 128)),
          selectedItem.value ? (openBlock(), createBlock(MenooItemDialog, {
            key: 1,
            show: showDialog.value,
            item: selectedItem.value,
            onClose: closeDialog
          }, null, 8, ["show", "item"])) : createCommentVNode("", true)
        ], 512);
      };
    }
  });
  const _style_0$2 = '\n.item-grid[data-v-49f731c1] {\n  min-height: 400px;\n}\n.category-section[data-v-49f731c1] {\n  margin-bottom: var(--menoo-spacing-4, 32px);\n}\n.category-header[data-v-49f731c1] {\n  font-size: var(--menoo-font-size-xl, 1.25rem);\n  font-weight: var(--menoo-font-weight-bold, 700);\n  margin-bottom: var(--menoo-spacing-2, 16px);\n  color: var(--menoo-text-primary, #212121);\n  padding-bottom: var(--menoo-spacing-1, 8px);\n  border-bottom: 2px solid var(--menoo-border, #e0e0e0);\n  margin-top: 0;\n}\n.items-grid[data-v-49f731c1] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));\n  gap: var(--menoo-spacing-2, 16px);\n}\n.item-card[data-v-49f731c1] {\n  background: var(--menoo-surface, #ffffff);\n  border-radius: var(--menoo-radius-md, 8px);\n  box-shadow: var(--menoo-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.12));\n  overflow: hidden;\n  cursor: pointer;\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n  display: flex;\n  flex-direction: column;\n  min-height: 200px;\n}\n.item-card[data-v-49f731c1]:hover {\n  box-shadow: var(--menoo-shadow-md, 0 4px 12px rgba(0, 0, 0, 0.15));\n  transform: translateY(-4px) scale(1.02);\n}\n.item-image[data-v-49f731c1] {\n  width: 100%;\n  height: 180px;\n  object-fit: cover;\n  background: var(--menoo-background, #f5f5f5);\n  transition: transform 0.3s ease;\n}\n.item-card:hover .item-image[data-v-49f731c1] {\n  transform: scale(1.05);\n}\n.item-content[data-v-49f731c1] {\n  padding: var(--menoo-spacing-2, 16px);\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n}\n.item-name[data-v-49f731c1] {\n  font-size: var(--menoo-font-size-lg, 1.125rem);\n  font-weight: var(--menoo-font-weight-medium, 500);\n  margin-bottom: var(--menoo-spacing-1, 8px);\n  color: var(--menoo-text-primary, #212121);\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  margin-top: 0;\n}\n.item-description[data-v-49f731c1] {\n  font-size: var(--menoo-font-size-sm, 0.875rem);\n  color: var(--menoo-text-secondary, #757575);\n  margin-bottom: var(--menoo-spacing-2, 16px);\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  flex: 1;\n  margin-top: 0;\n}\n.item-footer[data-v-49f731c1] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-top: auto;\n}\n.item-price[data-v-49f731c1] {\n  font-size: var(--menoo-font-size-lg, 1.125rem);\n  font-weight: var(--menoo-font-weight-bold, 700);\n  color: var(--menoo-primary, #f0ac28);\n}\n.item-add-btn[data-v-49f731c1] {\n  padding: 6px 16px;\n  background: var(--menoo-primary, #f0ac28);\n  color: white;\n  border: none;\n  border-radius: var(--menoo-radius-md, 8px);\n  font-size: var(--menoo-font-size-sm, 0.875rem);\n  font-weight: var(--menoo-font-weight-medium, 500);\n  cursor: pointer;\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n  position: relative;\n  overflow: hidden;\n}\n.item-add-btn[data-v-49f731c1]::after {\n  content: "";\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 0;\n  height: 0;\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.5);\n  transform: translate(-50%, -50%);\n  transition: width 0.6s, height 0.6s;\n}\n.item-add-btn[data-v-49f731c1]:active::after {\n  width: 300px;\n  height: 300px;\n}\n.item-add-btn[data-v-49f731c1]:hover {\n  background: var(--menoo-primary-dark, #996d1a);\n  transform: translateY(-1px);\n  box-shadow: 0 2px 8px rgba(240, 172, 40, 0.3);\n}\n.item-add-btn[data-v-49f731c1]:active {\n  transform: translateY(0);\n}\n.item-add-btn--success[data-v-49f731c1] {\n  animation: add-to-cart-success-49f731c1 0.6s ease;\n}\n@keyframes add-to-cart-success-49f731c1 {\n0% {\n    transform: scale(1);\n}\n25% {\n    transform: scale(0.95);\n}\n50% {\n    transform: scale(1.05);\n    background: var(--menoo-success, #ffbe3b);\n}\n75% {\n    transform: scale(1);\n    background: var(--menoo-success, #ffbe3b);\n}\n100% {\n    transform: scale(1);\n    background: var(--menoo-primary, #f0ac28);\n}\n}\n.no-items[data-v-49f731c1] {\n  text-align: center;\n  padding: var(--menoo-spacing-4, 32px);\n  color: var(--menoo-text-secondary, #757575);\n}\n.item-unavailable[data-v-49f731c1] {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.item-unavailable[data-v-49f731c1]:hover {\n  transform: none;\n  box-shadow: var(--menoo-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.12));\n}\n@media (max-width: 768px) {\n.items-grid[data-v-49f731c1] {\n    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));\n}\n.item-image[data-v-49f731c1] {\n    height: 140px;\n}\n.item-name[data-v-49f731c1] {\n    font-size: var(--menoo-font-size-md, 1rem);\n}\n.item-description[data-v-49f731c1] {\n    font-size: var(--menoo-font-size-xs, 0.75rem);\n}\n.item-content[data-v-49f731c1] {\n    padding: var(--menoo-spacing-1, 8px);\n}\n.item-footer[data-v-49f731c1] {\n    flex-direction: column;\n    gap: 8px;\n    align-items: stretch;\n}\n.item-price[data-v-49f731c1] {\n    text-align: center;\n    font-size: var(--menoo-font-size-md, 1rem);\n}\n.item-add-btn[data-v-49f731c1] {\n    width: 100%;\n    padding: 8px 12px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}\n}\n';
  const MenooItemGrid = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["styles", [_style_0$2]], ["__scopeId", "data-v-49f731c1"]]);
  const _hoisted_1$1 = { class: "restaurant-header" };
  const _hoisted_2$1 = { class: "restaurant-info" };
  const _hoisted_3$1 = { class: "restaurant-name" };
  const _hoisted_4 = {
    key: 0,
    class: "restaurant-city"
  };
  const _hoisted_5 = {
    key: 0,
    class: "restaurant-meta"
  };
  const _hoisted_6 = {
    key: 0,
    class: "restaurant-hours"
  };
  const _sfc_main$1 = /* @__PURE__ */ defineComponent({
    __name: "MenooRestaurant",
    setup(__props) {
      const { restaurant: restaurant2 } = useRestaurant();
      const isOpen = computed(() => {
        var _a;
        return ((_a = restaurant2.value) == null ? void 0 : _a.status) === "open";
      });
      const statusClass = computed(
        () => isOpen.value ? "status-open" : "status-closed"
      );
      const statusText = computed(
        () => i18n.t(`restaurant.${isOpen.value ? "open" : "closed"}`)
      );
      const todayHours = computed(() => {
        var _a;
        if (!((_a = restaurant2.value) == null ? void 0 : _a.schedule)) return null;
        const days = [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday"
        ];
        const today = days[(/* @__PURE__ */ new Date()).getDay()];
        const schedule = restaurant2.value.schedule[today];
        if (!schedule || schedule.length === 0) {
          return i18n.t("restaurant.closed_today");
        }
        const hours = schedule.map(
          (slot) => `${slot.open} - ${slot.close}`
        ).join(", ");
        return `${i18n.t("restaurant.today")}: ${hours}`;
      });
      return (_ctx, _cache) => {
        var _a, _b;
        return openBlock(), createElementBlock("div", _hoisted_1$1, [
          createBaseVNode("div", _hoisted_2$1, [
            createBaseVNode("div", null, [
              createBaseVNode("h1", _hoisted_3$1, toDisplayString(((_a = unref(restaurant2)) == null ? void 0 : _a.name) || "Loading..."), 1),
              ((_b = unref(restaurant2)) == null ? void 0 : _b.city) ? (openBlock(), createElementBlock("p", _hoisted_4, toDisplayString(unref(restaurant2).city), 1)) : createCommentVNode("", true)
            ]),
            unref(restaurant2) ? (openBlock(), createElementBlock("div", _hoisted_5, [
              createBaseVNode("div", {
                class: normalizeClass(["restaurant-status", statusClass.value])
              }, [
                _cache[0] || (_cache[0] = createBaseVNode("span", { class: "status-dot" }, null, -1)),
                createBaseVNode("span", null, toDisplayString(statusText.value), 1)
              ], 2),
              todayHours.value ? (openBlock(), createElementBlock("p", _hoisted_6, toDisplayString(todayHours.value), 1)) : createCommentVNode("", true)
            ])) : createCommentVNode("", true)
          ])
        ]);
      };
    }
  });
  const _style_0$1 = '\n.restaurant-header[data-v-09b3114e] {\n  background: var(--menoo-surface, #ffffff);\n  padding: var(--menoo-spacing-2, 16px);\n  border-radius: var(--menoo-radius-md, 8px);\n  box-shadow: var(--menoo-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.12));\n  margin-bottom: var(--menoo-spacing-2, 16px);\n}\n.restaurant-info[data-v-09b3114e] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  flex-wrap: wrap;\n  gap: var(--menoo-spacing-1, 8px);\n}\n.restaurant-name[data-v-09b3114e] {\n  font-size: var(--menoo-font-size-xl, 1.25rem);\n  font-weight: var(--menoo-font-weight-bold, 700);\n  color: var(--menoo-text-primary, #212121);\n  margin: 0;\n}\n.restaurant-city[data-v-09b3114e] {\n  font-size: var(--menoo-font-size-sm, 0.875rem);\n  color: var(--menoo-text-secondary, #757575);\n  margin: 4px 0 0 0;\n}\n.restaurant-meta[data-v-09b3114e] {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  gap: 6px;\n}\n.restaurant-hours[data-v-09b3114e] {\n  font-size: var(--menoo-font-size-sm, 0.875rem);\n  color: var(--menoo-text-secondary, #757575);\n  margin: 0;\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  white-space: nowrap;\n}\n.restaurant-hours[data-v-09b3114e]::before {\n  content: "🕐";\n  font-size: 14px;\n}\n.restaurant-status[data-v-09b3114e] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  padding: 4px 12px;\n  border-radius: var(--menoo-radius-lg, 12px);\n  font-size: var(--menoo-font-size-sm, 0.875rem);\n  font-weight: var(--menoo-font-weight-medium, 500);\n}\n.status-open[data-v-09b3114e] {\n  background: #e8f5e9;\n  color: var(--menoo-success, #388e3c);\n}\n.status-closed[data-v-09b3114e] {\n  background: #ffebee;\n  color: var(--menoo-error, #d32f2f);\n}\n.status-dot[data-v-09b3114e] {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  background: currentColor;\n}\n';
  const MenooRestaurant = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["styles", [_style_0$1]], ["__scopeId", "data-v-09b3114e"]]);
  const _hoisted_1 = { class: "menoo-widget-container" };
  const _hoisted_2 = { class: "menoo-widget-main" };
  const _hoisted_3 = { class: "cart-badge" };
  const _sfc_main = /* @__PURE__ */ defineComponent({
    __name: "MenooWidget",
    props: {
      stickyOffset: { type: Number }
    },
    setup(__props) {
      useCssVars((_ctx) => ({
        "v1ea988be": _ctx.stickyOffset + "px"
      }));
      const props = __props;
      const categoryNavRef = ref(null);
      const itemGridRef = ref(null);
      const cartRef = ref(null);
      const selectedCategory = ref("");
      const searchTerm = ref("");
      const { cart: cart2 } = useCart();
      function handleCategorySelected(payload) {
        const categoryId = (payload == null ? void 0 : payload.categoryId) || "";
        selectedCategory.value = categoryId;
        if (categoryId && itemGridRef.value) {
          setTimeout(() => {
            var _a, _b;
            (_b = (_a = itemGridRef.value) == null ? void 0 : _a.scrollToCategory) == null ? void 0 : _b.call(_a, categoryId);
          }, 100);
        }
      }
      function handleActiveCategoryChange(payload) {
        var _a, _b;
        const categoryId = (payload == null ? void 0 : payload.categoryId) || "";
        if (categoryNavRef.value) {
          (_b = (_a = categoryNavRef.value) == null ? void 0 : _a.setSelectedCategory) == null ? void 0 : _b.call(_a, categoryId);
        }
      }
      function handleCategorySearch(payload) {
        searchTerm.value = (payload == null ? void 0 : payload.searchTerm) || "";
      }
      function handleCheckoutClicked() {
        var _a, _b;
        const event = new CustomEvent("checkout-clicked", {
          bubbles: true,
          composed: true
        });
        const host = (_b = (_a = cartRef.value) == null ? void 0 : _a.$el) == null ? void 0 : _b.getRootNode();
        if (host && host.host) {
          host.host.dispatchEvent(event);
        }
      }
      function scrollToCart() {
        var _a, _b;
        if ((_a = cartRef.value) == null ? void 0 : _a.$el) {
          const cartElement = cartRef.value.$el;
          const categoryNav = (_b = categoryNavRef.value) == null ? void 0 : _b.$el;
          const stickyOffset = props.stickyOffset || 0;
          const navHeight = (categoryNav == null ? void 0 : categoryNav.offsetHeight) || 100;
          const headerOffset = stickyOffset + navHeight + 20;
          const cartPos = cartElement.getBoundingClientRect().top;
          const offset = cartPos + window.scrollY - headerOffset;
          window.scrollTo({
            top: offset,
            behavior: "smooth"
          });
        }
      }
      onMounted(() => {
        updateCartStickyPosition();
      });
      watch(
        () => props.stickyOffset,
        () => {
          setTimeout(updateCartStickyPosition, 100);
        }
      );
      function updateCartStickyPosition() {
        var _a, _b;
        const categoryNav = (_a = categoryNavRef.value) == null ? void 0 : _a.$el;
        const cart22 = (_b = cartRef.value) == null ? void 0 : _b.$el;
        if (categoryNav && cart22) {
          const stickyOffset = props.stickyOffset || 0;
          const navHeight = categoryNav.offsetHeight || 0;
          const cartTop = stickyOffset + navHeight + 16;
          cart22.style.setProperty("--menoo-cart-top", `${cartTop}px`);
        }
      }
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", _hoisted_1, [
          createVNode(MenooRestaurant),
          createVNode(MenooCategoryNav, {
            ref_key: "categoryNavRef",
            ref: categoryNavRef,
            "data-sticky-offset": __props.stickyOffset,
            onCategorySelected: handleCategorySelected,
            onCategorySearch: handleCategorySearch
          }, null, 8, ["data-sticky-offset"]),
          createBaseVNode("div", _hoisted_2, [
            createVNode(MenooItemGrid, {
              ref_key: "itemGridRef",
              ref: itemGridRef,
              category: selectedCategory.value,
              search: searchTerm.value,
              onActiveCategoryChange: handleActiveCategoryChange
            }, null, 8, ["category", "search"]),
            createVNode(MenooCart, {
              ref_key: "cartRef",
              ref: cartRef,
              onCheckoutClicked: handleCheckoutClicked
            }, null, 512)
          ]),
          createVNode(Transition, { name: "floating-cart" }, {
            default: withCtx(() => [
              unref(cart2).items.length > 0 ? (openBlock(), createElementBlock("button", {
                key: 0,
                class: "floating-cart-btn",
                onClick: scrollToCart,
                "aria-label": "View cart"
              }, [
                _cache[0] || (_cache[0] = createBaseVNode("svg", {
                  class: "cart-icon",
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 24 24",
                  fill: "currentColor"
                }, [
                  createBaseVNode("path", { d: "M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" })
                ], -1)),
                createBaseVNode("span", _hoisted_3, toDisplayString(unref(cart2).items.length), 1)
              ])) : createCommentVNode("", true)
            ]),
            _: 1
          })
        ]);
      };
    }
  });
  const _style_0 = "\n.menoo-widget-container[data-v-0b086501] {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.menoo-widget-main[data-v-0b086501] {\n  display: grid;\n  grid-template-columns: 1fr 320px;\n  gap: 16px;\n  align-items: start;\n}\n.menoo-widget-main[data-v-0b086501] menoo-cart,\n.menoo-widget-main[data-v-0b086501] > *:last-child {\n  position: sticky;\n  top: var(--menoo-cart-top, calc(var(--v1ea988be) + 100px));\n  max-height: calc(\n    100vh - var(--menoo-cart-top, calc(var(--v1ea988be) + 100px)) -\n      32px\n  );\n  overflow-y: auto;\n}\n@media (max-width: 1024px) {\n.menoo-widget-main[data-v-0b086501] {\n    grid-template-columns: 1fr;\n}\n.menoo-widget-main[data-v-0b086501] menoo-cart,\n  .menoo-widget-main[data-v-0b086501] > *:last-child {\n    position: relative;\n    top: 0;\n    max-height: none;\n    order: 1;\n}\n.menoo-widget-main[data-v-0b086501] > *:first-child {\n    order: 2;\n}\n}\n.floating-cart-btn[data-v-0b086501] {\n  display: none;\n}\n@media (max-width: 1024px) {\n.floating-cart-btn[data-v-0b086501] {\n    display: flex;\n    position: fixed;\n    bottom: 20px;\n    right: 20px;\n    width: 60px;\n    height: 60px;\n    border-radius: 50%;\n    background: var(--menoo-primary, #f0ac28);\n    color: white;\n    border: none;\n    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);\n    cursor: pointer;\n    align-items: center;\n    justify-content: center;\n    z-index: 1000;\n    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.floating-cart-btn[data-v-0b086501]:hover {\n    transform: scale(1.1);\n    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);\n}\n.floating-cart-btn[data-v-0b086501]:active {\n    transform: scale(0.95);\n}\n.cart-icon[data-v-0b086501] {\n    width: 28px;\n    height: 28px;\n}\n.cart-badge[data-v-0b086501] {\n    position: absolute;\n    top: 6px;\n    right: 6px;\n    background: #ff4444;\n    color: white;\n    border-radius: 50%;\n    width: 20px;\n    height: 20px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 11px;\n    font-weight: bold;\n    border: 2px solid white;\n}\n.floating-cart-enter-active[data-v-0b086501],\n  .floating-cart-leave-active[data-v-0b086501] {\n    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.floating-cart-enter-from[data-v-0b086501] {\n    opacity: 0;\n    transform: scale(0.8);\n}\n.floating-cart-enter-to[data-v-0b086501] {\n    opacity: 1;\n    transform: scale(1);\n}\n.floating-cart-leave-from[data-v-0b086501] {\n    opacity: 1;\n    transform: scale(1);\n}\n.floating-cart-leave-to[data-v-0b086501] {\n    opacity: 0;\n    transform: scale(0.8);\n}\n}\n";
  const MenooWidgetVue = /* @__PURE__ */ _export_sfc(_sfc_main, [["styles", [_style_0]], ["__scopeId", "data-v-0b086501"]]);
  const MenooWidget = /* @__PURE__ */ defineCustomElement(MenooWidgetVue);
  function registerComponents() {
    if (typeof customElements !== "undefined") {
      if (!customElements.get("menoo-widget")) {
        customElements.define("menoo-widget", MenooWidget);
      }
    }
  }
  registerComponents();
  registerComponents();
  class MenooSDK {
    constructor() {
      __publicField(this, "config", null);
      __publicField(this, "container", null);
      __publicField(this, "initialized", false);
    }
    /**
     * Initialize the Menoo Widget
     */
    async init(config) {
      if (this.initialized) {
        console.warn("Menoo Widget is already initialized");
        return;
      }
      this.config = config;
      if (typeof config.container === "string") {
        this.container = document.querySelector(config.container);
      } else if (config.container instanceof HTMLElement) {
        this.container = config.container;
      } else {
        this.container = document.getElementById("menoo-widget");
      }
      if (!this.container) {
        throw new Error("Container element not found");
      }
      const language = config.language || "ro";
      await i18n.setLanguage(language);
      const metadataStore = useMetadataStore(pinia);
      metadataStore.setLanguage(language);
      try {
        const data = await apiClient.fetchRestaurant(
          config.restaurantId,
          language,
          true
        );
        const restaurantStore = useRestaurantStore(pinia);
        const menusStore = useMenusStore(pinia);
        const metadataStore2 = useMetadataStore(pinia);
        const orderStore = useOrderStore(pinia);
        restaurantStore.updateRestaurant(data.data);
        menusStore.updateMenus(data.menus);
        metadataStore2.updateMetadata(data.metadata);
        orderStore.initCart(config.restaurantId);
        this.renderFullLayout();
        this.setupEventListeners();
        this.initialized = true;
        window.dispatchEvent(
          new CustomEvent("menoo:ready", {
            detail: { restaurantId: config.restaurantId }
          })
        );
      } catch (error) {
        console.error("Failed to initialize Menoo Widget:", error);
        window.dispatchEvent(
          new CustomEvent("menoo:error", {
            detail: { error, phase: "initialization" }
          })
        );
        throw error;
      }
    }
    /**
     * Destroy the widget and cleanup
     */
    destroy() {
      if (!this.initialized || !this.container) return;
      this.container.innerHTML = "";
      this.initialized = false;
      this.config = null;
    }
    /**
     * Get current cart
     */
    getCart() {
      const orderStore = useOrderStore(pinia);
      return orderStore.getCart;
    }
    /**
     * Get cart formatted for API submission
     */
    getCartForApi() {
      var _a, _b;
      const orderStore = useOrderStore(pinia);
      const restaurantStore = useRestaurantStore(pinia);
      const restaurantId = ((_a = restaurantStore.data) == null ? void 0 : _a._id) || ((_b = this.config) == null ? void 0 : _b.restaurantId);
      return {
        restaurant: restaurantId || "",
        type: orderStore.type,
        items: transformCartForApi(orderStore.getCart.items)
      };
    }
    /**
     * Get item count in cart
     */
    getItemCount() {
      const orderStore = useOrderStore(pinia);
      return orderStore.itemCount;
    }
    /**
     * Get total price
     */
    getTotalPrice() {
      const orderStore = useOrderStore(pinia);
      const restaurantStore = useRestaurantStore(pinia);
      const cart2 = orderStore.getCart;
      const restaurant2 = restaurantStore.data;
      const mode = orderStore.type;
      let deliveryFee = 0;
      if (restaurant2 && mode === "delivery") {
        const threshold = restaurant2.delivery.feeThreshold || 0;
        const fee = restaurant2.delivery.fee || 0;
        deliveryFee = cart2.totalPrice >= threshold ? 0 : fee;
      }
      return cart2.totalPrice + deliveryFee;
    }
    /**
     * Clear cart
     */
    clearCart() {
      const orderStore = useOrderStore(pinia);
      orderStore.clearCart();
    }
    /**
     * Open checkout - Redirects to webapp checkout page
     */
    openCheckout() {
      var _a, _b;
      const restaurantStore = useRestaurantStore(pinia);
      const restaurantId = ((_a = restaurantStore.data) == null ? void 0 : _a._id) || ((_b = this.config) == null ? void 0 : _b.restaurantId);
      const language = i18n.getLanguage();
      if (!restaurantId) {
        console.error("Cannot open checkout: Restaurant ID not found");
        return;
      }
      const cartData = this.getCartForApi();
      const encodedCart = btoa(encodeURIComponent(JSON.stringify(cartData)));
      window.location.href = `https://menoo.ro/${language}/embedded/widget/${restaurantId}?cart=${encodedCart}`;
    }
    /**
     * Add event listener
     */
    addEventListener(event, callback) {
      window.addEventListener(event, callback);
    }
    /**
     * Remove event listener
     */
    removeEventListener(event, callback) {
      window.removeEventListener(event, callback);
    }
    renderFullLayout() {
      var _a;
      if (!this.container) return;
      this.container.innerHTML = `
      <menoo-widget sticky-offset="${((_a = this.config) == null ? void 0 : _a.stickyOffset) || 0}"></menoo-widget>
    `;
    }
    setupEventListeners() {
      if (!this.container) return;
      const widget = this.container.querySelector("menoo-widget");
      if (widget) {
        widget.addEventListener("checkout-clicked", () => {
          this.openCheckout();
        });
      }
    }
  }
  const menooSDK = new MenooSDK();
  if (typeof window !== "undefined") {
    window.MenooSDK = menooSDK;
  }
  exports2.MenooSDK = MenooSDK;
  exports2.MenooWidget = MenooWidget;
  exports2.apiClient = apiClient;
  exports2.default = menooSDK;
  exports2.i18n = i18n;
  exports2.menooSDK = menooSDK;
  exports2.pinia = pinia;
  exports2.registerComponents = registerComponents;
  exports2.useMenusStore = useMenusStore;
  exports2.useMetadataStore = useMetadataStore;
  exports2.useOrderStore = useOrderStore;
  exports2.useRestaurantStore = useRestaurantStore;
  Object.defineProperties(exports2, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
}));
//# sourceMappingURL=menoo-sdk.umd.js.map
