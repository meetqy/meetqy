var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a3, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a3, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a3, prop, b[prop]);
    }
  return a3;
};
var __spreadProps = (a3, b) => __defProps(a3, __getOwnPropDescs(b));
import require$$0, { getCurrentInstance, reactive, isRef, ref, onBeforeMount, onUnmounted, onServerPrefetch, unref, toRef, defineComponent, computed, h, resolveComponent, watchEffect, markRaw, inject, provide, Suspense, Transition, defineAsyncComponent, useSSRContext, mergeProps, withCtx, createVNode, openBlock, createBlock, Fragment as Fragment$1, renderList, createTextVNode, toDisplayString as toDisplayString$1, withDirectives, vShow, watch, onMounted, shallowRef, onErrorCaptured, createApp, renderSlot, withAsyncContext, createCommentVNode } from "vue";
import { withBase, withQuery, joinURL, hasProtocol, isEqual } from "ufo";
import { stringify } from "qs";
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrRenderSuspense, ssrRenderSlot } from "vue/server-renderer";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import MarkdownIt from "markdown-it";
import { useScroll } from "@vueuse/core";
import hljs from "highlight.js";
import "swiper/css";
import "swiper/css/navigation";
import toJsonSchema from "to-json-schema";
import jsonFormat from "json-format";
import { useRuntimeConfig as useRuntimeConfig$1 } from "#internal/nitro";
const suspectProtoRx = /"(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^["{[]|^-?[0-9][0-9.]{0,14}$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor") {
    return;
  }
  return value;
}
function destr(val) {
  if (typeof val !== "string") {
    return val;
  }
  const _lval = val.toLowerCase();
  if (_lval === "true") {
    return true;
  }
  if (_lval === "false") {
    return false;
  }
  if (_lval === "null") {
    return null;
  }
  if (_lval === "nan") {
    return NaN;
  }
  if (_lval === "infinity") {
    return Infinity;
  }
  if (_lval === "undefined") {
    return void 0;
  }
  if (!JsonSigRx.test(val)) {
    return val;
  }
  try {
    if (suspectProtoRx.test(val) || suspectConstructorRx.test(val)) {
      return JSON.parse(val, jsonParseTransform);
    }
    return JSON.parse(val);
  } catch (_e) {
    return val;
  }
}
class FetchError extends Error {
  constructor() {
    super(...arguments);
    this.name = "FetchError";
  }
}
function createFetchError(request, error, response) {
  let message = "";
  if (request && response) {
    message = `${response.status} ${response.statusText} (${request.toString()})`;
  }
  if (error) {
    message = `${error.message} (${message})`;
  }
  const fetchError = new FetchError(message);
  Object.defineProperty(fetchError, "request", { get() {
    return request;
  } });
  Object.defineProperty(fetchError, "response", { get() {
    return response;
  } });
  Object.defineProperty(fetchError, "data", { get() {
    return response && response._data;
  } });
  return fetchError;
}
const payloadMethods = new Set(Object.freeze(["PATCH", "POST", "PUT", "DELETE"]));
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(val) {
  if (val === void 0) {
    return false;
  }
  const t = typeof val;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(val)) {
    return true;
  }
  return val.constructor && val.constructor.name === "Object" || typeof val.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*`\-.^~]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift();
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  409,
  425,
  429,
  500,
  502,
  503,
  504
]);
function createFetch(globalOptions) {
  const { fetch: fetch2, Headers: Headers2 } = globalOptions;
  function onError(ctx) {
    if (ctx.options.retry !== false) {
      const retries = typeof ctx.options.retry === "number" ? ctx.options.retry : isPayloadMethod(ctx.options.method) ? 0 : 1;
      const responseCode = ctx.response && ctx.response.status || 500;
      if (retries > 0 && retryStatusCodes.has(responseCode)) {
        return $fetchRaw(ctx.request, __spreadProps(__spreadValues({}, ctx.options), {
          retry: retries - 1
        }));
      }
    }
    const err = createFetchError(ctx.request, ctx.error, ctx.response);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(err, $fetchRaw);
    }
    throw err;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _opts = {}) {
    const ctx = {
      request: _request,
      options: __spreadValues(__spreadValues({}, globalOptions.defaults), _opts),
      response: void 0,
      error: void 0
    };
    if (ctx.options.onRequest) {
      await ctx.options.onRequest(ctx);
    }
    if (typeof ctx.request === "string") {
      if (ctx.options.baseURL) {
        ctx.request = withBase(ctx.request, ctx.options.baseURL);
      }
      if (ctx.options.params) {
        ctx.request = withQuery(ctx.request, ctx.options.params);
      }
      if (ctx.options.body && isPayloadMethod(ctx.options.method)) {
        if (isJSONSerializable(ctx.options.body)) {
          ctx.options.body = typeof ctx.options.body === "string" ? ctx.options.body : JSON.stringify(ctx.options.body);
          ctx.options.headers = new Headers2(ctx.options.headers);
          if (!ctx.options.headers.has("content-type")) {
            ctx.options.headers.set("content-type", "application/json");
          }
          if (!ctx.options.headers.has("accept")) {
            ctx.options.headers.set("accept", "application/json");
          }
        }
      }
    }
    ctx.response = await fetch2(ctx.request, ctx.options).catch(async (error) => {
      ctx.error = error;
      if (ctx.options.onRequestError) {
        await ctx.options.onRequestError(ctx);
      }
      return onError(ctx);
    });
    const responseType = (ctx.options.parseResponse ? "json" : ctx.options.responseType) || detectResponseType(ctx.response.headers.get("content-type") || "");
    if (responseType === "json") {
      const data = await ctx.response.text();
      const parseFn = ctx.options.parseResponse || destr;
      ctx.response._data = parseFn(data);
    } else {
      ctx.response._data = await ctx.response[responseType]();
    }
    if (ctx.options.onResponse) {
      await ctx.options.onResponse(ctx);
    }
    if (!ctx.response.ok) {
      if (ctx.options.onResponseError) {
        await ctx.options.onResponseError(ctx);
      }
    }
    return ctx.response.ok ? ctx.response : onError(ctx);
  };
  const $fetch2 = function $fetch22(request, opts) {
    return $fetchRaw(request, opts).then((r) => r._data);
  };
  $fetch2.raw = $fetchRaw;
  $fetch2.create = (defaultOptions = {}) => createFetch(__spreadProps(__spreadValues({}, globalOptions), {
    defaults: __spreadValues(__spreadValues({}, globalOptions.defaults), defaultOptions)
  }));
  return $fetch2;
}
const _globalThis$2 = function() {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw new Error("unable to locate global object");
}();
const fetch = _globalThis$2.fetch || (() => Promise.reject(new Error("[ohmyfetch] global.fetch is not supported!")));
const Headers = _globalThis$2.Headers;
const $fetch$1 = createFetch({ fetch, Headers });
const appConfig = useRuntimeConfig$1().app;
const baseURL = () => appConfig.baseURL;
const publicAssetsURL = (...path) => {
  const publicBase = appConfig.cdnURL || appConfig.baseURL;
  return path.length ? joinURL(publicBase, ...path) : publicBase;
};
function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
function serialCaller(hooks, args) {
  return hooks.reduce((promise, hookFn) => promise.then(() => hookFn.apply(void 0, args)), Promise.resolve(null));
}
function parallelCaller(hooks, args) {
  return Promise.all(hooks.map((hook) => hook.apply(void 0, args)));
}
class Hookable {
  constructor() {
    this._hooks = {};
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, fn) {
    if (!name || typeof fn !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let deprecatedHookObj;
    while (this._deprecatedHooks[name]) {
      const deprecatedHook = this._deprecatedHooks[name];
      if (typeof deprecatedHook === "string") {
        deprecatedHookObj = { to: deprecatedHook };
      } else {
        deprecatedHookObj = deprecatedHook;
      }
      name = deprecatedHookObj.to;
    }
    if (deprecatedHookObj) {
      if (!deprecatedHookObj.message) {
        console.warn(`${originalName} hook has been deprecated` + (deprecatedHookObj.to ? `, please use ${deprecatedHookObj.to}` : ""));
      } else {
        console.warn(deprecatedHookObj.message);
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(fn);
    return () => {
      if (fn) {
        this.removeHook(name, fn);
        fn = null;
      }
    };
  }
  hookOnce(name, fn) {
    let _unreg;
    let _fn = (...args) => {
      _unreg();
      _unreg = null;
      _fn = null;
      return fn(...args);
    };
    _unreg = this.hook(name, _fn);
    return _unreg;
  }
  removeHook(name, fn) {
    if (this._hooks[name]) {
      const idx = this._hooks[name].indexOf(fn);
      if (idx !== -1) {
        this._hooks[name].splice(idx, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = deprecated;
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map((key) => this.hook(key, hooks[key]));
    return () => {
      removeFns.splice(0, removeFns.length).forEach((unreg) => unreg());
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  callHook(name, ...args) {
    return serialCaller(this._hooks[name] || [], args);
  }
  callHookParallel(name, ...args) {
    return parallelCaller(this._hooks[name] || [], args);
  }
  callHookWith(caller, name, ...args) {
    return caller(this._hooks[name] || [], args);
  }
}
function createHooks() {
  return new Hookable();
}
function createContext() {
  let currentInstance = null;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  return {
    use: () => currentInstance,
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = null;
      isSingleton = false;
    },
    call: (instance, cb) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return cb();
      } finally {
        if (!isSingleton) {
          currentInstance = null;
        }
      }
    },
    async callAsync(instance, cb) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = cb();
        if (!isSingleton) {
          currentInstance = null;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace() {
  const contexts = {};
  return {
    get(key) {
      if (!contexts[key]) {
        contexts[key] = createContext();
      }
      contexts[key];
      return contexts[key];
    }
  };
}
const _globalThis$1 = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis$1[globalKey] || (_globalThis$1[globalKey] = createNamespace());
const getContext = (key) => defaultNamespace.get(key);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis$1[asyncHandlersKey] || (_globalThis$1[asyncHandlersKey] = /* @__PURE__ */ new Set());
function createMock(name, overrides = {}) {
  const fn = function() {
  };
  fn.prototype.name = name;
  const props = {};
  return new Proxy(fn, {
    get(_target, prop) {
      if (prop === "caller") {
        return null;
      }
      if (prop === "__createMock__") {
        return createMock;
      }
      if (prop in overrides) {
        return overrides[prop];
      }
      return props[prop] = props[prop] || createMock(`${name}.${prop.toString()}`);
    },
    apply(_target, _this, _args) {
      return createMock(`${name}()`);
    },
    construct(_target, _args, _newT) {
      return createMock(`[${name}]`);
    },
    enumerate(_target) {
      return [];
    }
  });
}
const mockContext = createMock("mock");
function mock(warning) {
  console.warn(warning);
  return mockContext;
}
const unsupported = /* @__PURE__ */ new Set([
  "store",
  "spa",
  "fetchCounters"
]);
const todo = /* @__PURE__ */ new Set([
  "isHMR",
  "base",
  "payload",
  "from",
  "next",
  "error",
  "redirect",
  "redirected",
  "enablePreview",
  "$preview",
  "beforeNuxtRender",
  "beforeSerialize"
]);
const routerKeys = ["route", "params", "query"];
const staticFlags = {
  isClient: false,
  isServer: true,
  isDev: false,
  isStatic: void 0,
  target: "server",
  modern: false
};
const legacyPlugin = (nuxtApp) => {
  nuxtApp._legacyContext = new Proxy(nuxtApp, {
    get(nuxt, p) {
      if (unsupported.has(p)) {
        return mock(`Accessing ${p} is not supported in Nuxt 3.`);
      }
      if (todo.has(p)) {
        return mock(`Accessing ${p} is not yet supported in Nuxt 3.`);
      }
      if (routerKeys.includes(p)) {
        if (!("$router" in nuxtApp)) {
          return mock("vue-router is not being used in this project.");
        }
        switch (p) {
          case "route":
            return nuxt.$router.currentRoute.value;
          case "params":
          case "query":
            return nuxt.$router.currentRoute.value[p];
        }
      }
      if (p === "$config" || p === "env") {
        return useRuntimeConfig();
      }
      if (p in staticFlags) {
        return staticFlags[p];
      }
      if (p === "ssrContext") {
        return nuxt._legacyContext;
      }
      if (nuxt.ssrContext && p in nuxt.ssrContext) {
        return nuxt.ssrContext[p];
      }
      if (p === "nuxt") {
        return nuxt.payload;
      }
      if (p === "nuxtState") {
        return nuxt.payload.data;
      }
      if (p in nuxtApp.vueApp) {
        return nuxtApp.vueApp[p];
      }
      if (p in nuxtApp) {
        return nuxtApp[p];
      }
      return mock(`Accessing ${p} is not supported in Nuxt3.`);
    }
  });
};
const nuxtAppCtx = getContext("nuxt-app");
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  const nuxtApp = __spreadValues({
    provide: void 0,
    globalName: "nuxt",
    payload: reactive(__spreadValues({
      data: {},
      state: {},
      _errors: {}
    }, { serverRendered: true })),
    isHydrating: false,
    _asyncDataPromises: {}
  }, options);
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  if (nuxtApp.ssrContext) {
    nuxtApp.ssrContext.nuxt = nuxtApp;
  }
  {
    nuxtApp.ssrContext = nuxtApp.ssrContext || {};
    nuxtApp.ssrContext.payload = nuxtApp.payload;
  }
  {
    nuxtApp.payload.config = {
      public: options.ssrContext.runtimeConfig.public,
      app: options.ssrContext.runtimeConfig.app
    };
  }
  const runtimeConfig = options.ssrContext.runtimeConfig;
  const compatibilityConfig = new Proxy(runtimeConfig, {
    get(target, prop) {
      var _a;
      if (prop === "public") {
        return target.public;
      }
      return (_a = target[prop]) != null ? _a : target.public[prop];
    },
    set(target, prop, value) {
      {
        return false;
      }
    }
  });
  nuxtApp.provide("config", compatibilityConfig);
  return nuxtApp;
}
async function applyPlugin(nuxtApp, plugin) {
  if (typeof plugin !== "function") {
    return;
  }
  const { provide: provide2 } = await callWithNuxt(nuxtApp, plugin, [nuxtApp]) || {};
  if (provide2 && typeof provide2 === "object") {
    for (const key in provide2) {
      nuxtApp.provide(key, provide2[key]);
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  for (const plugin of plugins2) {
    await applyPlugin(nuxtApp, plugin);
  }
}
function normalizePlugins(_plugins2) {
  let needsLegacyContext = false;
  const plugins2 = _plugins2.map((plugin) => {
    if (typeof plugin !== "function") {
      return () => {
      };
    }
    if (isLegacyPlugin(plugin)) {
      needsLegacyContext = true;
      return (nuxtApp) => plugin(nuxtApp._legacyContext, nuxtApp.provide);
    }
    return plugin;
  });
  if (needsLegacyContext) {
    plugins2.unshift(legacyPlugin);
  }
  return plugins2;
}
function defineNuxtPlugin(plugin) {
  plugin[NuxtPluginIndicator] = true;
  return plugin;
}
function isLegacyPlugin(plugin) {
  return !plugin[NuxtPluginIndicator];
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => args ? setup(...args) : setup();
  {
    return nuxtAppCtx.callAsync(nuxt, fn);
  }
}
function useNuxtApp() {
  const vm = getCurrentInstance();
  if (!vm) {
    const nuxtAppInstance = nuxtAppCtx.use();
    if (!nuxtAppInstance) {
      throw new Error("nuxt instance unavailable");
    }
    return nuxtAppInstance;
  }
  return vm.appContext.app.$nuxt;
}
function useRuntimeConfig() {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var vueRouter_cjs_prod = {};
/*!
  * vue-router v4.0.15
  * (c) 2022 Eduardo San Martin Morote
  * @license MIT
  */
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  var vue = require$$0;
  const hasSymbol = typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol";
  const PolySymbol = (name) => hasSymbol ? Symbol(name) : "_vr_" + name;
  const matchedRouteKey = /* @__PURE__ */ PolySymbol("rvlm");
  const viewDepthKey = /* @__PURE__ */ PolySymbol("rvd");
  const routerKey = /* @__PURE__ */ PolySymbol("r");
  const routeLocationKey = /* @__PURE__ */ PolySymbol("rl");
  const routerViewLocationKey = /* @__PURE__ */ PolySymbol("rvl");
  function isESModule(obj) {
    return obj.__esModule || hasSymbol && obj[Symbol.toStringTag] === "Module";
  }
  const assign = Object.assign;
  function applyToParams(fn, params) {
    const newParams = {};
    for (const key in params) {
      const value = params[key];
      newParams[key] = Array.isArray(value) ? value.map(fn) : fn(value);
    }
    return newParams;
  }
  const noop = () => {
  };
  const TRAILING_SLASH_RE = /\/$/;
  const removeTrailingSlash = (path) => path.replace(TRAILING_SLASH_RE, "");
  function parseURL(parseQuery2, location2, currentLocation = "/") {
    let path, query = {}, searchString = "", hash = "";
    const searchPos = location2.indexOf("?");
    const hashPos = location2.indexOf("#", searchPos > -1 ? searchPos : 0);
    if (searchPos > -1) {
      path = location2.slice(0, searchPos);
      searchString = location2.slice(searchPos + 1, hashPos > -1 ? hashPos : location2.length);
      query = parseQuery2(searchString);
    }
    if (hashPos > -1) {
      path = path || location2.slice(0, hashPos);
      hash = location2.slice(hashPos, location2.length);
    }
    path = resolveRelativePath(path != null ? path : location2, currentLocation);
    return {
      fullPath: path + (searchString && "?") + searchString + hash,
      path,
      query,
      hash
    };
  }
  function stringifyURL(stringifyQuery2, location2) {
    const query = location2.query ? stringifyQuery2(location2.query) : "";
    return location2.path + (query && "?") + query + (location2.hash || "");
  }
  function stripBase(pathname, base) {
    if (!base || !pathname.toLowerCase().startsWith(base.toLowerCase()))
      return pathname;
    return pathname.slice(base.length) || "/";
  }
  function isSameRouteLocation(stringifyQuery2, a3, b) {
    const aLastIndex = a3.matched.length - 1;
    const bLastIndex = b.matched.length - 1;
    return aLastIndex > -1 && aLastIndex === bLastIndex && isSameRouteRecord(a3.matched[aLastIndex], b.matched[bLastIndex]) && isSameRouteLocationParams(a3.params, b.params) && stringifyQuery2(a3.query) === stringifyQuery2(b.query) && a3.hash === b.hash;
  }
  function isSameRouteRecord(a3, b) {
    return (a3.aliasOf || a3) === (b.aliasOf || b);
  }
  function isSameRouteLocationParams(a3, b) {
    if (Object.keys(a3).length !== Object.keys(b).length)
      return false;
    for (const key in a3) {
      if (!isSameRouteLocationParamsValue(a3[key], b[key]))
        return false;
    }
    return true;
  }
  function isSameRouteLocationParamsValue(a3, b) {
    return Array.isArray(a3) ? isEquivalentArray(a3, b) : Array.isArray(b) ? isEquivalentArray(b, a3) : a3 === b;
  }
  function isEquivalentArray(a3, b) {
    return Array.isArray(b) ? a3.length === b.length && a3.every((value, i) => value === b[i]) : a3.length === 1 && a3[0] === b;
  }
  function resolveRelativePath(to, from) {
    if (to.startsWith("/"))
      return to;
    if (!to)
      return from;
    const fromSegments = from.split("/");
    const toSegments = to.split("/");
    let position = fromSegments.length - 1;
    let toPosition;
    let segment;
    for (toPosition = 0; toPosition < toSegments.length; toPosition++) {
      segment = toSegments[toPosition];
      if (position === 1 || segment === ".")
        continue;
      if (segment === "..")
        position--;
      else
        break;
    }
    return fromSegments.slice(0, position).join("/") + "/" + toSegments.slice(toPosition - (toPosition === toSegments.length ? 1 : 0)).join("/");
  }
  var NavigationType;
  (function(NavigationType2) {
    NavigationType2["pop"] = "pop";
    NavigationType2["push"] = "push";
  })(NavigationType || (NavigationType = {}));
  var NavigationDirection;
  (function(NavigationDirection2) {
    NavigationDirection2["back"] = "back";
    NavigationDirection2["forward"] = "forward";
    NavigationDirection2["unknown"] = "";
  })(NavigationDirection || (NavigationDirection = {}));
  const START = "";
  function normalizeBase(base) {
    if (!base) {
      {
        base = "/";
      }
    }
    if (base[0] !== "/" && base[0] !== "#")
      base = "/" + base;
    return removeTrailingSlash(base);
  }
  const BEFORE_HASH_RE = /^[^#]+#/;
  function createHref(base, location2) {
    return base.replace(BEFORE_HASH_RE, "#") + location2;
  }
  const computeScrollPosition = () => ({
    left: window.pageXOffset,
    top: window.pageYOffset
  });
  let createBaseLocation = () => location.protocol + "//" + location.host;
  function createCurrentLocation(base, location2) {
    const { pathname, search, hash } = location2;
    const hashPos = base.indexOf("#");
    if (hashPos > -1) {
      let slicePos = hash.includes(base.slice(hashPos)) ? base.slice(hashPos).length : 1;
      let pathFromHash = hash.slice(slicePos);
      if (pathFromHash[0] !== "/")
        pathFromHash = "/" + pathFromHash;
      return stripBase(pathFromHash, "");
    }
    const path = stripBase(pathname, base);
    return path + search + hash;
  }
  function useHistoryListeners(base, historyState, currentLocation, replace) {
    let listeners = [];
    let teardowns = [];
    let pauseState = null;
    const popStateHandler = ({ state }) => {
      const to = createCurrentLocation(base, location);
      const from = currentLocation.value;
      const fromState = historyState.value;
      let delta = 0;
      if (state) {
        currentLocation.value = to;
        historyState.value = state;
        if (pauseState && pauseState === from) {
          pauseState = null;
          return;
        }
        delta = fromState ? state.position - fromState.position : 0;
      } else {
        replace(to);
      }
      listeners.forEach((listener) => {
        listener(currentLocation.value, from, {
          delta,
          type: NavigationType.pop,
          direction: delta ? delta > 0 ? NavigationDirection.forward : NavigationDirection.back : NavigationDirection.unknown
        });
      });
    };
    function pauseListeners() {
      pauseState = currentLocation.value;
    }
    function listen(callback) {
      listeners.push(callback);
      const teardown = () => {
        const index2 = listeners.indexOf(callback);
        if (index2 > -1)
          listeners.splice(index2, 1);
      };
      teardowns.push(teardown);
      return teardown;
    }
    function beforeUnloadListener() {
      const { history: history2 } = window;
      if (!history2.state)
        return;
      history2.replaceState(assign({}, history2.state, { scroll: computeScrollPosition() }), "");
    }
    function destroy() {
      for (const teardown of teardowns)
        teardown();
      teardowns = [];
      window.removeEventListener("popstate", popStateHandler);
      window.removeEventListener("beforeunload", beforeUnloadListener);
    }
    window.addEventListener("popstate", popStateHandler);
    window.addEventListener("beforeunload", beforeUnloadListener);
    return {
      pauseListeners,
      listen,
      destroy
    };
  }
  function buildState(back, current, forward, replaced = false, computeScroll = false) {
    return {
      back,
      current,
      forward,
      replaced,
      position: window.history.length,
      scroll: computeScroll ? computeScrollPosition() : null
    };
  }
  function useHistoryStateNavigation(base) {
    const { history: history2, location: location2 } = window;
    const currentLocation = {
      value: createCurrentLocation(base, location2)
    };
    const historyState = { value: history2.state };
    if (!historyState.value) {
      changeLocation(currentLocation.value, {
        back: null,
        current: currentLocation.value,
        forward: null,
        position: history2.length - 1,
        replaced: true,
        scroll: null
      }, true);
    }
    function changeLocation(to, state, replace2) {
      const hashIndex = base.indexOf("#");
      const url = hashIndex > -1 ? (location2.host && document.querySelector("base") ? base : base.slice(hashIndex)) + to : createBaseLocation() + base + to;
      try {
        history2[replace2 ? "replaceState" : "pushState"](state, "", url);
        historyState.value = state;
      } catch (err) {
        {
          console.error(err);
        }
        location2[replace2 ? "replace" : "assign"](url);
      }
    }
    function replace(to, data) {
      const state = assign({}, history2.state, buildState(historyState.value.back, to, historyState.value.forward, true), data, { position: historyState.value.position });
      changeLocation(to, state, true);
      currentLocation.value = to;
    }
    function push(to, data) {
      const currentState = assign({}, historyState.value, history2.state, {
        forward: to,
        scroll: computeScrollPosition()
      });
      changeLocation(currentState.current, currentState, true);
      const state = assign({}, buildState(currentLocation.value, to, null), { position: currentState.position + 1 }, data);
      changeLocation(to, state, false);
      currentLocation.value = to;
    }
    return {
      location: currentLocation,
      state: historyState,
      push,
      replace
    };
  }
  function createWebHistory(base) {
    base = normalizeBase(base);
    const historyNavigation = useHistoryStateNavigation(base);
    const historyListeners = useHistoryListeners(base, historyNavigation.state, historyNavigation.location, historyNavigation.replace);
    function go(delta, triggerListeners = true) {
      if (!triggerListeners)
        historyListeners.pauseListeners();
      history.go(delta);
    }
    const routerHistory = assign({
      location: "",
      base,
      go,
      createHref: createHref.bind(null, base)
    }, historyNavigation, historyListeners);
    Object.defineProperty(routerHistory, "location", {
      enumerable: true,
      get: () => historyNavigation.location.value
    });
    Object.defineProperty(routerHistory, "state", {
      enumerable: true,
      get: () => historyNavigation.state.value
    });
    return routerHistory;
  }
  function createMemoryHistory(base = "") {
    let listeners = [];
    let queue = [START];
    let position = 0;
    base = normalizeBase(base);
    function setLocation(location2) {
      position++;
      if (position === queue.length) {
        queue.push(location2);
      } else {
        queue.splice(position);
        queue.push(location2);
      }
    }
    function triggerListeners(to, from, { direction, delta }) {
      const info = {
        direction,
        delta,
        type: NavigationType.pop
      };
      for (const callback of listeners) {
        callback(to, from, info);
      }
    }
    const routerHistory = {
      location: START,
      state: {},
      base,
      createHref: createHref.bind(null, base),
      replace(to) {
        queue.splice(position--, 1);
        setLocation(to);
      },
      push(to, data) {
        setLocation(to);
      },
      listen(callback) {
        listeners.push(callback);
        return () => {
          const index2 = listeners.indexOf(callback);
          if (index2 > -1)
            listeners.splice(index2, 1);
        };
      },
      destroy() {
        listeners = [];
        queue = [START];
        position = 0;
      },
      go(delta, shouldTrigger = true) {
        const from = this.location;
        const direction = delta < 0 ? NavigationDirection.back : NavigationDirection.forward;
        position = Math.max(0, Math.min(position + delta, queue.length - 1));
        if (shouldTrigger) {
          triggerListeners(this.location, from, {
            direction,
            delta
          });
        }
      }
    };
    Object.defineProperty(routerHistory, "location", {
      enumerable: true,
      get: () => queue[position]
    });
    return routerHistory;
  }
  function createWebHashHistory(base) {
    base = location.host ? base || location.pathname + location.search : "";
    if (!base.includes("#"))
      base += "#";
    return createWebHistory(base);
  }
  function isRouteLocation(route) {
    return typeof route === "string" || route && typeof route === "object";
  }
  function isRouteName(name) {
    return typeof name === "string" || typeof name === "symbol";
  }
  const START_LOCATION_NORMALIZED = {
    path: "/",
    name: void 0,
    params: {},
    query: {},
    hash: "",
    fullPath: "/",
    matched: [],
    meta: {},
    redirectedFrom: void 0
  };
  const NavigationFailureSymbol = /* @__PURE__ */ PolySymbol("nf");
  exports.NavigationFailureType = void 0;
  (function(NavigationFailureType) {
    NavigationFailureType[NavigationFailureType["aborted"] = 4] = "aborted";
    NavigationFailureType[NavigationFailureType["cancelled"] = 8] = "cancelled";
    NavigationFailureType[NavigationFailureType["duplicated"] = 16] = "duplicated";
  })(exports.NavigationFailureType || (exports.NavigationFailureType = {}));
  const ErrorTypeMessages = {
    [1]({ location: location2, currentLocation }) {
      return `No match for
 ${JSON.stringify(location2)}${currentLocation ? "\nwhile being at\n" + JSON.stringify(currentLocation) : ""}`;
    },
    [2]({ from, to }) {
      return `Redirected from "${from.fullPath}" to "${stringifyRoute(to)}" via a navigation guard.`;
    },
    [4]({ from, to }) {
      return `Navigation aborted from "${from.fullPath}" to "${to.fullPath}" via a navigation guard.`;
    },
    [8]({ from, to }) {
      return `Navigation cancelled from "${from.fullPath}" to "${to.fullPath}" with a new navigation.`;
    },
    [16]({ from, to }) {
      return `Avoided redundant navigation to current location: "${from.fullPath}".`;
    }
  };
  function createRouterError(type, params) {
    {
      return assign(new Error(ErrorTypeMessages[type](params)), {
        type,
        [NavigationFailureSymbol]: true
      }, params);
    }
  }
  function isNavigationFailure(error, type) {
    return error instanceof Error && NavigationFailureSymbol in error && (type == null || !!(error.type & type));
  }
  const propertiesToLog = ["params", "query", "hash"];
  function stringifyRoute(to) {
    if (typeof to === "string")
      return to;
    if ("path" in to)
      return to.path;
    const location2 = {};
    for (const key of propertiesToLog) {
      if (key in to)
        location2[key] = to[key];
    }
    return JSON.stringify(location2, null, 2);
  }
  const BASE_PARAM_PATTERN = "[^/]+?";
  const BASE_PATH_PARSER_OPTIONS = {
    sensitive: false,
    strict: false,
    start: true,
    end: true
  };
  const REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g;
  function tokensToParser(segments, extraOptions) {
    const options = assign({}, BASE_PATH_PARSER_OPTIONS, extraOptions);
    const score = [];
    let pattern = options.start ? "^" : "";
    const keys = [];
    for (const segment of segments) {
      const segmentScores = segment.length ? [] : [90];
      if (options.strict && !segment.length)
        pattern += "/";
      for (let tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
        const token = segment[tokenIndex];
        let subSegmentScore = 40 + (options.sensitive ? 0.25 : 0);
        if (token.type === 0) {
          if (!tokenIndex)
            pattern += "/";
          pattern += token.value.replace(REGEX_CHARS_RE, "\\$&");
          subSegmentScore += 40;
        } else if (token.type === 1) {
          const { value, repeatable, optional, regexp } = token;
          keys.push({
            name: value,
            repeatable,
            optional
          });
          const re2 = regexp ? regexp : BASE_PARAM_PATTERN;
          if (re2 !== BASE_PARAM_PATTERN) {
            subSegmentScore += 10;
            try {
              new RegExp(`(${re2})`);
            } catch (err) {
              throw new Error(`Invalid custom RegExp for param "${value}" (${re2}): ` + err.message);
            }
          }
          let subPattern = repeatable ? `((?:${re2})(?:/(?:${re2}))*)` : `(${re2})`;
          if (!tokenIndex)
            subPattern = optional && segment.length < 2 ? `(?:/${subPattern})` : "/" + subPattern;
          if (optional)
            subPattern += "?";
          pattern += subPattern;
          subSegmentScore += 20;
          if (optional)
            subSegmentScore += -8;
          if (repeatable)
            subSegmentScore += -20;
          if (re2 === ".*")
            subSegmentScore += -50;
        }
        segmentScores.push(subSegmentScore);
      }
      score.push(segmentScores);
    }
    if (options.strict && options.end) {
      const i = score.length - 1;
      score[i][score[i].length - 1] += 0.7000000000000001;
    }
    if (!options.strict)
      pattern += "/?";
    if (options.end)
      pattern += "$";
    else if (options.strict)
      pattern += "(?:/|$)";
    const re = new RegExp(pattern, options.sensitive ? "" : "i");
    function parse2(path) {
      const match = path.match(re);
      const params = {};
      if (!match)
        return null;
      for (let i = 1; i < match.length; i++) {
        const value = match[i] || "";
        const key = keys[i - 1];
        params[key.name] = value && key.repeatable ? value.split("/") : value;
      }
      return params;
    }
    function stringify2(params) {
      let path = "";
      let avoidDuplicatedSlash = false;
      for (const segment of segments) {
        if (!avoidDuplicatedSlash || !path.endsWith("/"))
          path += "/";
        avoidDuplicatedSlash = false;
        for (const token of segment) {
          if (token.type === 0) {
            path += token.value;
          } else if (token.type === 1) {
            const { value, repeatable, optional } = token;
            const param = value in params ? params[value] : "";
            if (Array.isArray(param) && !repeatable)
              throw new Error(`Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`);
            const text = Array.isArray(param) ? param.join("/") : param;
            if (!text) {
              if (optional) {
                if (segment.length < 2 && segments.length > 1) {
                  if (path.endsWith("/"))
                    path = path.slice(0, -1);
                  else
                    avoidDuplicatedSlash = true;
                }
              } else
                throw new Error(`Missing required param "${value}"`);
            }
            path += text;
          }
        }
      }
      return path;
    }
    return {
      re,
      score,
      keys,
      parse: parse2,
      stringify: stringify2
    };
  }
  function compareScoreArray(a3, b) {
    let i = 0;
    while (i < a3.length && i < b.length) {
      const diff = b[i] - a3[i];
      if (diff)
        return diff;
      i++;
    }
    if (a3.length < b.length) {
      return a3.length === 1 && a3[0] === 40 + 40 ? -1 : 1;
    } else if (a3.length > b.length) {
      return b.length === 1 && b[0] === 40 + 40 ? 1 : -1;
    }
    return 0;
  }
  function comparePathParserScore(a3, b) {
    let i = 0;
    const aScore = a3.score;
    const bScore = b.score;
    while (i < aScore.length && i < bScore.length) {
      const comp = compareScoreArray(aScore[i], bScore[i]);
      if (comp)
        return comp;
      i++;
    }
    return bScore.length - aScore.length;
  }
  const ROOT_TOKEN = {
    type: 0,
    value: ""
  };
  const VALID_PARAM_RE = /[a-zA-Z0-9_]/;
  function tokenizePath(path) {
    if (!path)
      return [[]];
    if (path === "/")
      return [[ROOT_TOKEN]];
    if (!path.startsWith("/")) {
      throw new Error(`Invalid path "${path}"`);
    }
    function crash(message) {
      throw new Error(`ERR (${state})/"${buffer}": ${message}`);
    }
    let state = 0;
    let previousState = state;
    const tokens = [];
    let segment;
    function finalizeSegment() {
      if (segment)
        tokens.push(segment);
      segment = [];
    }
    let i = 0;
    let char;
    let buffer = "";
    let customRe = "";
    function consumeBuffer() {
      if (!buffer)
        return;
      if (state === 0) {
        segment.push({
          type: 0,
          value: buffer
        });
      } else if (state === 1 || state === 2 || state === 3) {
        if (segment.length > 1 && (char === "*" || char === "+"))
          crash(`A repeatable param (${buffer}) must be alone in its segment. eg: '/:ids+.`);
        segment.push({
          type: 1,
          value: buffer,
          regexp: customRe,
          repeatable: char === "*" || char === "+",
          optional: char === "*" || char === "?"
        });
      } else {
        crash("Invalid state to consume buffer");
      }
      buffer = "";
    }
    function addCharToBuffer() {
      buffer += char;
    }
    while (i < path.length) {
      char = path[i++];
      if (char === "\\" && state !== 2) {
        previousState = state;
        state = 4;
        continue;
      }
      switch (state) {
        case 0:
          if (char === "/") {
            if (buffer) {
              consumeBuffer();
            }
            finalizeSegment();
          } else if (char === ":") {
            consumeBuffer();
            state = 1;
          } else {
            addCharToBuffer();
          }
          break;
        case 4:
          addCharToBuffer();
          state = previousState;
          break;
        case 1:
          if (char === "(") {
            state = 2;
          } else if (VALID_PARAM_RE.test(char)) {
            addCharToBuffer();
          } else {
            consumeBuffer();
            state = 0;
            if (char !== "*" && char !== "?" && char !== "+")
              i--;
          }
          break;
        case 2:
          if (char === ")") {
            if (customRe[customRe.length - 1] == "\\")
              customRe = customRe.slice(0, -1) + char;
            else
              state = 3;
          } else {
            customRe += char;
          }
          break;
        case 3:
          consumeBuffer();
          state = 0;
          if (char !== "*" && char !== "?" && char !== "+")
            i--;
          customRe = "";
          break;
        default:
          crash("Unknown state");
          break;
      }
    }
    if (state === 2)
      crash(`Unfinished custom RegExp for param "${buffer}"`);
    consumeBuffer();
    finalizeSegment();
    return tokens;
  }
  function createRouteRecordMatcher(record, parent, options) {
    const parser = tokensToParser(tokenizePath(record.path), options);
    const matcher = assign(parser, {
      record,
      parent,
      children: [],
      alias: []
    });
    if (parent) {
      if (!matcher.record.aliasOf === !parent.record.aliasOf)
        parent.children.push(matcher);
    }
    return matcher;
  }
  function createRouterMatcher(routes2, globalOptions) {
    const matchers = [];
    const matcherMap = /* @__PURE__ */ new Map();
    globalOptions = mergeOptions({ strict: false, end: true, sensitive: false }, globalOptions);
    function getRecordMatcher(name) {
      return matcherMap.get(name);
    }
    function addRoute(record, parent, originalRecord) {
      const isRootAdd = !originalRecord;
      const mainNormalizedRecord = normalizeRouteRecord(record);
      mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record;
      const options = mergeOptions(globalOptions, record);
      const normalizedRecords = [
        mainNormalizedRecord
      ];
      if ("alias" in record) {
        const aliases = typeof record.alias === "string" ? [record.alias] : record.alias;
        for (const alias of aliases) {
          normalizedRecords.push(assign({}, mainNormalizedRecord, {
            components: originalRecord ? originalRecord.record.components : mainNormalizedRecord.components,
            path: alias,
            aliasOf: originalRecord ? originalRecord.record : mainNormalizedRecord
          }));
        }
      }
      let matcher;
      let originalMatcher;
      for (const normalizedRecord of normalizedRecords) {
        const { path } = normalizedRecord;
        if (parent && path[0] !== "/") {
          const parentPath = parent.record.path;
          const connectingSlash = parentPath[parentPath.length - 1] === "/" ? "" : "/";
          normalizedRecord.path = parent.record.path + (path && connectingSlash + path);
        }
        matcher = createRouteRecordMatcher(normalizedRecord, parent, options);
        if (originalRecord) {
          originalRecord.alias.push(matcher);
        } else {
          originalMatcher = originalMatcher || matcher;
          if (originalMatcher !== matcher)
            originalMatcher.alias.push(matcher);
          if (isRootAdd && record.name && !isAliasRecord(matcher))
            removeRoute(record.name);
        }
        if ("children" in mainNormalizedRecord) {
          const children = mainNormalizedRecord.children;
          for (let i = 0; i < children.length; i++) {
            addRoute(children[i], matcher, originalRecord && originalRecord.children[i]);
          }
        }
        originalRecord = originalRecord || matcher;
        insertMatcher(matcher);
      }
      return originalMatcher ? () => {
        removeRoute(originalMatcher);
      } : noop;
    }
    function removeRoute(matcherRef) {
      if (isRouteName(matcherRef)) {
        const matcher = matcherMap.get(matcherRef);
        if (matcher) {
          matcherMap.delete(matcherRef);
          matchers.splice(matchers.indexOf(matcher), 1);
          matcher.children.forEach(removeRoute);
          matcher.alias.forEach(removeRoute);
        }
      } else {
        const index2 = matchers.indexOf(matcherRef);
        if (index2 > -1) {
          matchers.splice(index2, 1);
          if (matcherRef.record.name)
            matcherMap.delete(matcherRef.record.name);
          matcherRef.children.forEach(removeRoute);
          matcherRef.alias.forEach(removeRoute);
        }
      }
    }
    function getRoutes() {
      return matchers;
    }
    function insertMatcher(matcher) {
      let i = 0;
      while (i < matchers.length && comparePathParserScore(matcher, matchers[i]) >= 0 && (matcher.record.path !== matchers[i].record.path || !isRecordChildOf(matcher, matchers[i])))
        i++;
      matchers.splice(i, 0, matcher);
      if (matcher.record.name && !isAliasRecord(matcher))
        matcherMap.set(matcher.record.name, matcher);
    }
    function resolve(location2, currentLocation) {
      let matcher;
      let params = {};
      let path;
      let name;
      if ("name" in location2 && location2.name) {
        matcher = matcherMap.get(location2.name);
        if (!matcher)
          throw createRouterError(1, {
            location: location2
          });
        name = matcher.record.name;
        params = assign(paramsFromLocation(currentLocation.params, matcher.keys.filter((k) => !k.optional).map((k) => k.name)), location2.params);
        path = matcher.stringify(params);
      } else if ("path" in location2) {
        path = location2.path;
        matcher = matchers.find((m) => m.re.test(path));
        if (matcher) {
          params = matcher.parse(path);
          name = matcher.record.name;
        }
      } else {
        matcher = currentLocation.name ? matcherMap.get(currentLocation.name) : matchers.find((m) => m.re.test(currentLocation.path));
        if (!matcher)
          throw createRouterError(1, {
            location: location2,
            currentLocation
          });
        name = matcher.record.name;
        params = assign({}, currentLocation.params, location2.params);
        path = matcher.stringify(params);
      }
      const matched = [];
      let parentMatcher = matcher;
      while (parentMatcher) {
        matched.unshift(parentMatcher.record);
        parentMatcher = parentMatcher.parent;
      }
      return {
        name,
        path,
        params,
        matched,
        meta: mergeMetaFields(matched)
      };
    }
    routes2.forEach((route) => addRoute(route));
    return { addRoute, resolve, removeRoute, getRoutes, getRecordMatcher };
  }
  function paramsFromLocation(params, keys) {
    const newParams = {};
    for (const key of keys) {
      if (key in params)
        newParams[key] = params[key];
    }
    return newParams;
  }
  function normalizeRouteRecord(record) {
    return {
      path: record.path,
      redirect: record.redirect,
      name: record.name,
      meta: record.meta || {},
      aliasOf: void 0,
      beforeEnter: record.beforeEnter,
      props: normalizeRecordProps(record),
      children: record.children || [],
      instances: {},
      leaveGuards: /* @__PURE__ */ new Set(),
      updateGuards: /* @__PURE__ */ new Set(),
      enterCallbacks: {},
      components: "components" in record ? record.components || {} : { default: record.component }
    };
  }
  function normalizeRecordProps(record) {
    const propsObject = {};
    const props = record.props || false;
    if ("component" in record) {
      propsObject.default = props;
    } else {
      for (const name in record.components)
        propsObject[name] = typeof props === "boolean" ? props : props[name];
    }
    return propsObject;
  }
  function isAliasRecord(record) {
    while (record) {
      if (record.record.aliasOf)
        return true;
      record = record.parent;
    }
    return false;
  }
  function mergeMetaFields(matched) {
    return matched.reduce((meta2, record) => assign(meta2, record.meta), {});
  }
  function mergeOptions(defaults, partialOptions) {
    const options = {};
    for (const key in defaults) {
      options[key] = key in partialOptions ? partialOptions[key] : defaults[key];
    }
    return options;
  }
  function isRecordChildOf(record, parent) {
    return parent.children.some((child) => child === record || isRecordChildOf(record, child));
  }
  const HASH_RE = /#/g;
  const AMPERSAND_RE = /&/g;
  const SLASH_RE = /\//g;
  const EQUAL_RE = /=/g;
  const IM_RE = /\?/g;
  const PLUS_RE = /\+/g;
  const ENC_BRACKET_OPEN_RE = /%5B/g;
  const ENC_BRACKET_CLOSE_RE = /%5D/g;
  const ENC_CARET_RE = /%5E/g;
  const ENC_BACKTICK_RE = /%60/g;
  const ENC_CURLY_OPEN_RE = /%7B/g;
  const ENC_PIPE_RE = /%7C/g;
  const ENC_CURLY_CLOSE_RE = /%7D/g;
  const ENC_SPACE_RE = /%20/g;
  function commonEncode(text) {
    return encodeURI("" + text).replace(ENC_PIPE_RE, "|").replace(ENC_BRACKET_OPEN_RE, "[").replace(ENC_BRACKET_CLOSE_RE, "]");
  }
  function encodeHash(text) {
    return commonEncode(text).replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
  }
  function encodeQueryValue(text) {
    return commonEncode(text).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
  }
  function encodeQueryKey(text) {
    return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
  }
  function encodePath(text) {
    return commonEncode(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F");
  }
  function encodeParam(text) {
    return text == null ? "" : encodePath(text).replace(SLASH_RE, "%2F");
  }
  function decode2(text) {
    try {
      return decodeURIComponent("" + text);
    } catch (err) {
    }
    return "" + text;
  }
  function parseQuery(search) {
    const query = {};
    if (search === "" || search === "?")
      return query;
    const hasLeadingIM = search[0] === "?";
    const searchParams = (hasLeadingIM ? search.slice(1) : search).split("&");
    for (let i = 0; i < searchParams.length; ++i) {
      const searchParam = searchParams[i].replace(PLUS_RE, " ");
      const eqPos = searchParam.indexOf("=");
      const key = decode2(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
      const value = eqPos < 0 ? null : decode2(searchParam.slice(eqPos + 1));
      if (key in query) {
        let currentValue = query[key];
        if (!Array.isArray(currentValue)) {
          currentValue = query[key] = [currentValue];
        }
        currentValue.push(value);
      } else {
        query[key] = value;
      }
    }
    return query;
  }
  function stringifyQuery(query) {
    let search = "";
    for (let key in query) {
      const value = query[key];
      key = encodeQueryKey(key);
      if (value == null) {
        if (value !== void 0) {
          search += (search.length ? "&" : "") + key;
        }
        continue;
      }
      const values = Array.isArray(value) ? value.map((v) => v && encodeQueryValue(v)) : [value && encodeQueryValue(value)];
      values.forEach((value2) => {
        if (value2 !== void 0) {
          search += (search.length ? "&" : "") + key;
          if (value2 != null)
            search += "=" + value2;
        }
      });
    }
    return search;
  }
  function normalizeQuery(query) {
    const normalizedQuery = {};
    for (const key in query) {
      const value = query[key];
      if (value !== void 0) {
        normalizedQuery[key] = Array.isArray(value) ? value.map((v) => v == null ? null : "" + v) : value == null ? value : "" + value;
      }
    }
    return normalizedQuery;
  }
  function useCallbacks() {
    let handlers = [];
    function add(handler) {
      handlers.push(handler);
      return () => {
        const i = handlers.indexOf(handler);
        if (i > -1)
          handlers.splice(i, 1);
      };
    }
    function reset() {
      handlers = [];
    }
    return {
      add,
      list: () => handlers,
      reset
    };
  }
  function registerGuard(record, name, guard) {
    const removeFromList = () => {
      record[name].delete(guard);
    };
    vue.onUnmounted(removeFromList);
    vue.onDeactivated(removeFromList);
    vue.onActivated(() => {
      record[name].add(guard);
    });
    record[name].add(guard);
  }
  function onBeforeRouteLeave(leaveGuard) {
    const activeRecord = vue.inject(matchedRouteKey, {}).value;
    if (!activeRecord) {
      return;
    }
    registerGuard(activeRecord, "leaveGuards", leaveGuard);
  }
  function onBeforeRouteUpdate(updateGuard) {
    const activeRecord = vue.inject(matchedRouteKey, {}).value;
    if (!activeRecord) {
      return;
    }
    registerGuard(activeRecord, "updateGuards", updateGuard);
  }
  function guardToPromiseFn(guard, to, from, record, name) {
    const enterCallbackArray = record && (record.enterCallbacks[name] = record.enterCallbacks[name] || []);
    return () => new Promise((resolve, reject) => {
      const next = (valid) => {
        if (valid === false)
          reject(createRouterError(4, {
            from,
            to
          }));
        else if (valid instanceof Error) {
          reject(valid);
        } else if (isRouteLocation(valid)) {
          reject(createRouterError(2, {
            from: to,
            to: valid
          }));
        } else {
          if (enterCallbackArray && record.enterCallbacks[name] === enterCallbackArray && typeof valid === "function")
            enterCallbackArray.push(valid);
          resolve();
        }
      };
      const guardReturn = guard.call(record && record.instances[name], to, from, next);
      let guardCall = Promise.resolve(guardReturn);
      if (guard.length < 3)
        guardCall = guardCall.then(next);
      guardCall.catch((err) => reject(err));
    });
  }
  function extractComponentsGuards(matched, guardType, to, from) {
    const guards = [];
    for (const record of matched) {
      for (const name in record.components) {
        let rawComponent = record.components[name];
        if (guardType !== "beforeRouteEnter" && !record.instances[name])
          continue;
        if (isRouteComponent(rawComponent)) {
          const options = rawComponent.__vccOpts || rawComponent;
          const guard = options[guardType];
          guard && guards.push(guardToPromiseFn(guard, to, from, record, name));
        } else {
          let componentPromise = rawComponent();
          guards.push(() => componentPromise.then((resolved) => {
            if (!resolved)
              return Promise.reject(new Error(`Couldn't resolve component "${name}" at "${record.path}"`));
            const resolvedComponent = isESModule(resolved) ? resolved.default : resolved;
            record.components[name] = resolvedComponent;
            const options = resolvedComponent.__vccOpts || resolvedComponent;
            const guard = options[guardType];
            return guard && guardToPromiseFn(guard, to, from, record, name)();
          }));
        }
      }
    }
    return guards;
  }
  function isRouteComponent(component) {
    return typeof component === "object" || "displayName" in component || "props" in component || "__vccOpts" in component;
  }
  function useLink(props) {
    const router = vue.inject(routerKey);
    const currentRoute = vue.inject(routeLocationKey);
    const route = vue.computed(() => router.resolve(vue.unref(props.to)));
    const activeRecordIndex = vue.computed(() => {
      const { matched } = route.value;
      const { length } = matched;
      const routeMatched = matched[length - 1];
      const currentMatched = currentRoute.matched;
      if (!routeMatched || !currentMatched.length)
        return -1;
      const index2 = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
      if (index2 > -1)
        return index2;
      const parentRecordPath = getOriginalPath(matched[length - 2]);
      return length > 1 && getOriginalPath(routeMatched) === parentRecordPath && currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2])) : index2;
    });
    const isActive = vue.computed(() => activeRecordIndex.value > -1 && includesParams(currentRoute.params, route.value.params));
    const isExactActive = vue.computed(() => activeRecordIndex.value > -1 && activeRecordIndex.value === currentRoute.matched.length - 1 && isSameRouteLocationParams(currentRoute.params, route.value.params));
    function navigate(e = {}) {
      if (guardEvent(e)) {
        return router[vue.unref(props.replace) ? "replace" : "push"](vue.unref(props.to)).catch(noop);
      }
      return Promise.resolve();
    }
    return {
      route,
      href: vue.computed(() => route.value.href),
      isActive,
      isExactActive,
      navigate
    };
  }
  const RouterLinkImpl = /* @__PURE__ */ vue.defineComponent({
    name: "RouterLink",
    props: {
      to: {
        type: [String, Object],
        required: true
      },
      replace: Boolean,
      activeClass: String,
      exactActiveClass: String,
      custom: Boolean,
      ariaCurrentValue: {
        type: String,
        default: "page"
      }
    },
    useLink,
    setup(props, { slots }) {
      const link = vue.reactive(useLink(props));
      const { options } = vue.inject(routerKey);
      const elClass = vue.computed(() => ({
        [getLinkClass(props.activeClass, options.linkActiveClass, "router-link-active")]: link.isActive,
        [getLinkClass(props.exactActiveClass, options.linkExactActiveClass, "router-link-exact-active")]: link.isExactActive
      }));
      return () => {
        const children = slots.default && slots.default(link);
        return props.custom ? children : vue.h("a", {
          "aria-current": link.isExactActive ? props.ariaCurrentValue : null,
          href: link.href,
          onClick: link.navigate,
          class: elClass.value
        }, children);
      };
    }
  });
  const RouterLink = RouterLinkImpl;
  function guardEvent(e) {
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
      return;
    if (e.defaultPrevented)
      return;
    if (e.button !== void 0 && e.button !== 0)
      return;
    if (e.currentTarget && e.currentTarget.getAttribute) {
      const target = e.currentTarget.getAttribute("target");
      if (/\b_blank\b/i.test(target))
        return;
    }
    if (e.preventDefault)
      e.preventDefault();
    return true;
  }
  function includesParams(outer, inner) {
    for (const key in inner) {
      const innerValue = inner[key];
      const outerValue = outer[key];
      if (typeof innerValue === "string") {
        if (innerValue !== outerValue)
          return false;
      } else {
        if (!Array.isArray(outerValue) || outerValue.length !== innerValue.length || innerValue.some((value, i) => value !== outerValue[i]))
          return false;
      }
    }
    return true;
  }
  function getOriginalPath(record) {
    return record ? record.aliasOf ? record.aliasOf.path : record.path : "";
  }
  const getLinkClass = (propClass, globalClass, defaultClass) => propClass != null ? propClass : globalClass != null ? globalClass : defaultClass;
  const RouterViewImpl = /* @__PURE__ */ vue.defineComponent({
    name: "RouterView",
    inheritAttrs: false,
    props: {
      name: {
        type: String,
        default: "default"
      },
      route: Object
    },
    compatConfig: { MODE: 3 },
    setup(props, { attrs, slots }) {
      const injectedRoute = vue.inject(routerViewLocationKey);
      const routeToDisplay = vue.computed(() => props.route || injectedRoute.value);
      const depth = vue.inject(viewDepthKey, 0);
      const matchedRouteRef = vue.computed(() => routeToDisplay.value.matched[depth]);
      vue.provide(viewDepthKey, depth + 1);
      vue.provide(matchedRouteKey, matchedRouteRef);
      vue.provide(routerViewLocationKey, routeToDisplay);
      const viewRef = vue.ref();
      vue.watch(() => [viewRef.value, matchedRouteRef.value, props.name], ([instance, to, name], [oldInstance, from, oldName]) => {
        if (to) {
          to.instances[name] = instance;
          if (from && from !== to && instance && instance === oldInstance) {
            if (!to.leaveGuards.size) {
              to.leaveGuards = from.leaveGuards;
            }
            if (!to.updateGuards.size) {
              to.updateGuards = from.updateGuards;
            }
          }
        }
        if (instance && to && (!from || !isSameRouteRecord(to, from) || !oldInstance)) {
          (to.enterCallbacks[name] || []).forEach((callback) => callback(instance));
        }
      }, { flush: "post" });
      return () => {
        const route = routeToDisplay.value;
        const matchedRoute = matchedRouteRef.value;
        const ViewComponent = matchedRoute && matchedRoute.components[props.name];
        const currentName = props.name;
        if (!ViewComponent) {
          return normalizeSlot(slots.default, { Component: ViewComponent, route });
        }
        const routePropsOption = matchedRoute.props[props.name];
        const routeProps = routePropsOption ? routePropsOption === true ? route.params : typeof routePropsOption === "function" ? routePropsOption(route) : routePropsOption : null;
        const onVnodeUnmounted = (vnode) => {
          if (vnode.component.isUnmounted) {
            matchedRoute.instances[currentName] = null;
          }
        };
        const component = vue.h(ViewComponent, assign({}, routeProps, attrs, {
          onVnodeUnmounted,
          ref: viewRef
        }));
        return normalizeSlot(slots.default, { Component: component, route }) || component;
      };
    }
  });
  function normalizeSlot(slot, data) {
    if (!slot)
      return null;
    const slotContent = slot(data);
    return slotContent.length === 1 ? slotContent[0] : slotContent;
  }
  const RouterView = RouterViewImpl;
  function createRouter(options) {
    const matcher = createRouterMatcher(options.routes, options);
    const parseQuery$1 = options.parseQuery || parseQuery;
    const stringifyQuery$1 = options.stringifyQuery || stringifyQuery;
    const routerHistory = options.history;
    const beforeGuards = useCallbacks();
    const beforeResolveGuards = useCallbacks();
    const afterGuards = useCallbacks();
    const currentRoute = vue.shallowRef(START_LOCATION_NORMALIZED);
    let pendingLocation = START_LOCATION_NORMALIZED;
    const normalizeParams = applyToParams.bind(null, (paramValue) => "" + paramValue);
    const encodeParams = applyToParams.bind(null, encodeParam);
    const decodeParams = applyToParams.bind(null, decode2);
    function addRoute(parentOrRoute, route) {
      let parent;
      let record;
      if (isRouteName(parentOrRoute)) {
        parent = matcher.getRecordMatcher(parentOrRoute);
        record = route;
      } else {
        record = parentOrRoute;
      }
      return matcher.addRoute(record, parent);
    }
    function removeRoute(name) {
      const recordMatcher = matcher.getRecordMatcher(name);
      if (recordMatcher) {
        matcher.removeRoute(recordMatcher);
      }
    }
    function getRoutes() {
      return matcher.getRoutes().map((routeMatcher) => routeMatcher.record);
    }
    function hasRoute(name) {
      return !!matcher.getRecordMatcher(name);
    }
    function resolve(rawLocation, currentLocation) {
      currentLocation = assign({}, currentLocation || currentRoute.value);
      if (typeof rawLocation === "string") {
        const locationNormalized = parseURL(parseQuery$1, rawLocation, currentLocation.path);
        const matchedRoute2 = matcher.resolve({ path: locationNormalized.path }, currentLocation);
        const href2 = routerHistory.createHref(locationNormalized.fullPath);
        return assign(locationNormalized, matchedRoute2, {
          params: decodeParams(matchedRoute2.params),
          hash: decode2(locationNormalized.hash),
          redirectedFrom: void 0,
          href: href2
        });
      }
      let matcherLocation;
      if ("path" in rawLocation) {
        matcherLocation = assign({}, rawLocation, {
          path: parseURL(parseQuery$1, rawLocation.path, currentLocation.path).path
        });
      } else {
        const targetParams = assign({}, rawLocation.params);
        for (const key in targetParams) {
          if (targetParams[key] == null) {
            delete targetParams[key];
          }
        }
        matcherLocation = assign({}, rawLocation, {
          params: encodeParams(rawLocation.params)
        });
        currentLocation.params = encodeParams(currentLocation.params);
      }
      const matchedRoute = matcher.resolve(matcherLocation, currentLocation);
      const hash = rawLocation.hash || "";
      matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params));
      const fullPath = stringifyURL(stringifyQuery$1, assign({}, rawLocation, {
        hash: encodeHash(hash),
        path: matchedRoute.path
      }));
      const href = routerHistory.createHref(fullPath);
      return assign({
        fullPath,
        hash,
        query: stringifyQuery$1 === stringifyQuery ? normalizeQuery(rawLocation.query) : rawLocation.query || {}
      }, matchedRoute, {
        redirectedFrom: void 0,
        href
      });
    }
    function locationAsObject(to) {
      return typeof to === "string" ? parseURL(parseQuery$1, to, currentRoute.value.path) : assign({}, to);
    }
    function checkCanceledNavigation(to, from) {
      if (pendingLocation !== to) {
        return createRouterError(8, {
          from,
          to
        });
      }
    }
    function push(to) {
      return pushWithRedirect(to);
    }
    function replace(to) {
      return push(assign(locationAsObject(to), { replace: true }));
    }
    function handleRedirectRecord(to) {
      const lastMatched = to.matched[to.matched.length - 1];
      if (lastMatched && lastMatched.redirect) {
        const { redirect } = lastMatched;
        let newTargetLocation = typeof redirect === "function" ? redirect(to) : redirect;
        if (typeof newTargetLocation === "string") {
          newTargetLocation = newTargetLocation.includes("?") || newTargetLocation.includes("#") ? newTargetLocation = locationAsObject(newTargetLocation) : { path: newTargetLocation };
          newTargetLocation.params = {};
        }
        return assign({
          query: to.query,
          hash: to.hash,
          params: to.params
        }, newTargetLocation);
      }
    }
    function pushWithRedirect(to, redirectedFrom) {
      const targetLocation = pendingLocation = resolve(to);
      const from = currentRoute.value;
      const data = to.state;
      const force = to.force;
      const replace2 = to.replace === true;
      const shouldRedirect = handleRedirectRecord(targetLocation);
      if (shouldRedirect)
        return pushWithRedirect(assign(locationAsObject(shouldRedirect), {
          state: data,
          force,
          replace: replace2
        }), redirectedFrom || targetLocation);
      const toLocation = targetLocation;
      toLocation.redirectedFrom = redirectedFrom;
      let failure;
      if (!force && isSameRouteLocation(stringifyQuery$1, from, targetLocation)) {
        failure = createRouterError(16, { to: toLocation, from });
        handleScroll();
      }
      return (failure ? Promise.resolve(failure) : navigate(toLocation, from)).catch((error) => isNavigationFailure(error) ? isNavigationFailure(error, 2) ? error : markAsReady(error) : triggerError(error, toLocation, from)).then((failure2) => {
        if (failure2) {
          if (isNavigationFailure(failure2, 2)) {
            return pushWithRedirect(assign(locationAsObject(failure2.to), {
              state: data,
              force,
              replace: replace2
            }), redirectedFrom || toLocation);
          }
        } else {
          failure2 = finalizeNavigation(toLocation, from, true, replace2, data);
        }
        triggerAfterEach(toLocation, from, failure2);
        return failure2;
      });
    }
    function checkCanceledNavigationAndReject(to, from) {
      const error = checkCanceledNavigation(to, from);
      return error ? Promise.reject(error) : Promise.resolve();
    }
    function navigate(to, from) {
      let guards;
      const [leavingRecords, updatingRecords, enteringRecords] = extractChangingRecords(to, from);
      guards = extractComponentsGuards(leavingRecords.reverse(), "beforeRouteLeave", to, from);
      for (const record of leavingRecords) {
        record.leaveGuards.forEach((guard) => {
          guards.push(guardToPromiseFn(guard, to, from));
        });
      }
      const canceledNavigationCheck = checkCanceledNavigationAndReject.bind(null, to, from);
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards).then(() => {
        guards = [];
        for (const guard of beforeGuards.list()) {
          guards.push(guardToPromiseFn(guard, to, from));
        }
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).then(() => {
        guards = extractComponentsGuards(updatingRecords, "beforeRouteUpdate", to, from);
        for (const record of updatingRecords) {
          record.updateGuards.forEach((guard) => {
            guards.push(guardToPromiseFn(guard, to, from));
          });
        }
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).then(() => {
        guards = [];
        for (const record of to.matched) {
          if (record.beforeEnter && !from.matched.includes(record)) {
            if (Array.isArray(record.beforeEnter)) {
              for (const beforeEnter of record.beforeEnter)
                guards.push(guardToPromiseFn(beforeEnter, to, from));
            } else {
              guards.push(guardToPromiseFn(record.beforeEnter, to, from));
            }
          }
        }
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).then(() => {
        to.matched.forEach((record) => record.enterCallbacks = {});
        guards = extractComponentsGuards(enteringRecords, "beforeRouteEnter", to, from);
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).then(() => {
        guards = [];
        for (const guard of beforeResolveGuards.list()) {
          guards.push(guardToPromiseFn(guard, to, from));
        }
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).catch((err) => isNavigationFailure(err, 8) ? err : Promise.reject(err));
    }
    function triggerAfterEach(to, from, failure) {
      for (const guard of afterGuards.list())
        guard(to, from, failure);
    }
    function finalizeNavigation(toLocation, from, isPush, replace2, data) {
      const error = checkCanceledNavigation(toLocation, from);
      if (error)
        return error;
      const isFirstNavigation = from === START_LOCATION_NORMALIZED;
      const state = {};
      if (isPush) {
        if (replace2 || isFirstNavigation)
          routerHistory.replace(toLocation.fullPath, assign({
            scroll: isFirstNavigation && state && state.scroll
          }, data));
        else
          routerHistory.push(toLocation.fullPath, data);
      }
      currentRoute.value = toLocation;
      handleScroll();
      markAsReady();
    }
    let removeHistoryListener;
    function setupListeners() {
      if (removeHistoryListener)
        return;
      removeHistoryListener = routerHistory.listen((to, _from, info) => {
        const toLocation = resolve(to);
        const shouldRedirect = handleRedirectRecord(toLocation);
        if (shouldRedirect) {
          pushWithRedirect(assign(shouldRedirect, { replace: true }), toLocation).catch(noop);
          return;
        }
        pendingLocation = toLocation;
        const from = currentRoute.value;
        navigate(toLocation, from).catch((error) => {
          if (isNavigationFailure(error, 4 | 8)) {
            return error;
          }
          if (isNavigationFailure(error, 2)) {
            pushWithRedirect(error.to, toLocation).then((failure) => {
              if (isNavigationFailure(failure, 4 | 16) && !info.delta && info.type === NavigationType.pop) {
                routerHistory.go(-1, false);
              }
            }).catch(noop);
            return Promise.reject();
          }
          if (info.delta)
            routerHistory.go(-info.delta, false);
          return triggerError(error, toLocation, from);
        }).then((failure) => {
          failure = failure || finalizeNavigation(toLocation, from, false);
          if (failure) {
            if (info.delta) {
              routerHistory.go(-info.delta, false);
            } else if (info.type === NavigationType.pop && isNavigationFailure(failure, 4 | 16)) {
              routerHistory.go(-1, false);
            }
          }
          triggerAfterEach(toLocation, from, failure);
        }).catch(noop);
      });
    }
    let readyHandlers = useCallbacks();
    let errorHandlers = useCallbacks();
    let ready;
    function triggerError(error, to, from) {
      markAsReady(error);
      const list = errorHandlers.list();
      if (list.length) {
        list.forEach((handler) => handler(error, to, from));
      } else {
        console.error(error);
      }
      return Promise.reject(error);
    }
    function isReady() {
      if (ready && currentRoute.value !== START_LOCATION_NORMALIZED)
        return Promise.resolve();
      return new Promise((resolve2, reject) => {
        readyHandlers.add([resolve2, reject]);
      });
    }
    function markAsReady(err) {
      if (!ready) {
        ready = !err;
        setupListeners();
        readyHandlers.list().forEach(([resolve2, reject]) => err ? reject(err) : resolve2());
        readyHandlers.reset();
      }
      return err;
    }
    function handleScroll(to, from, isPush, isFirstNavigation) {
      return Promise.resolve();
    }
    const go = (delta) => routerHistory.go(delta);
    const installedApps = /* @__PURE__ */ new Set();
    const router = {
      currentRoute,
      addRoute,
      removeRoute,
      hasRoute,
      getRoutes,
      resolve,
      options,
      push,
      replace,
      go,
      back: () => go(-1),
      forward: () => go(1),
      beforeEach: beforeGuards.add,
      beforeResolve: beforeResolveGuards.add,
      afterEach: afterGuards.add,
      onError: errorHandlers.add,
      isReady,
      install(app) {
        const router2 = this;
        app.component("RouterLink", RouterLink);
        app.component("RouterView", RouterView);
        app.config.globalProperties.$router = router2;
        Object.defineProperty(app.config.globalProperties, "$route", {
          enumerable: true,
          get: () => vue.unref(currentRoute)
        });
        const reactiveRoute = {};
        for (const key in START_LOCATION_NORMALIZED) {
          reactiveRoute[key] = vue.computed(() => currentRoute.value[key]);
        }
        app.provide(routerKey, router2);
        app.provide(routeLocationKey, vue.reactive(reactiveRoute));
        app.provide(routerViewLocationKey, currentRoute);
        const unmountApp = app.unmount;
        installedApps.add(app);
        app.unmount = function() {
          installedApps.delete(app);
          if (installedApps.size < 1) {
            pendingLocation = START_LOCATION_NORMALIZED;
            removeHistoryListener && removeHistoryListener();
            removeHistoryListener = null;
            currentRoute.value = START_LOCATION_NORMALIZED;
            ready = false;
          }
          unmountApp();
        };
      }
    };
    return router;
  }
  function runGuardQueue(guards) {
    return guards.reduce((promise, guard) => promise.then(() => guard()), Promise.resolve());
  }
  function extractChangingRecords(to, from) {
    const leavingRecords = [];
    const updatingRecords = [];
    const enteringRecords = [];
    const len = Math.max(from.matched.length, to.matched.length);
    for (let i = 0; i < len; i++) {
      const recordFrom = from.matched[i];
      if (recordFrom) {
        if (to.matched.find((record) => isSameRouteRecord(record, recordFrom)))
          updatingRecords.push(recordFrom);
        else
          leavingRecords.push(recordFrom);
      }
      const recordTo = to.matched[i];
      if (recordTo) {
        if (!from.matched.find((record) => isSameRouteRecord(record, recordTo))) {
          enteringRecords.push(recordTo);
        }
      }
    }
    return [leavingRecords, updatingRecords, enteringRecords];
  }
  function useRouter2() {
    return vue.inject(routerKey);
  }
  function useRoute2() {
    return vue.inject(routeLocationKey);
  }
  exports.RouterLink = RouterLink;
  exports.RouterView = RouterView;
  exports.START_LOCATION = START_LOCATION_NORMALIZED;
  exports.createMemoryHistory = createMemoryHistory;
  exports.createRouter = createRouter;
  exports.createRouterMatcher = createRouterMatcher;
  exports.createWebHashHistory = createWebHashHistory;
  exports.createWebHistory = createWebHistory;
  exports.isNavigationFailure = isNavigationFailure;
  exports.matchedRouteKey = matchedRouteKey;
  exports.onBeforeRouteLeave = onBeforeRouteLeave;
  exports.onBeforeRouteUpdate = onBeforeRouteUpdate;
  exports.parseQuery = parseQuery;
  exports.routeLocationKey = routeLocationKey;
  exports.routerKey = routerKey;
  exports.routerViewLocationKey = routerViewLocationKey;
  exports.stringifyQuery = stringifyQuery;
  exports.useLink = useLink;
  exports.useRoute = useRoute2;
  exports.useRouter = useRouter2;
  exports.viewDepthKey = viewDepthKey;
})(vueRouter_cjs_prod);
const wrapInRef = (value) => isRef(value) ? value : ref(value);
const getDefault = () => null;
function useAsyncData(key, handler, options = {}) {
  var _a, _b, _c, _d, _e;
  if (typeof key !== "string") {
    throw new TypeError("asyncData key must be a string");
  }
  if (typeof handler !== "function") {
    throw new TypeError("asyncData handler must be a function");
  }
  options = __spreadValues({ server: true, default: getDefault }, options);
  if (options.defer) {
    console.warn("[useAsyncData] `defer` has been renamed to `lazy`. Support for `defer` will be removed in RC.");
  }
  options.lazy = (_b = (_a = options.lazy) != null ? _a : options.defer) != null ? _b : false;
  options.initialCache = (_c = options.initialCache) != null ? _c : true;
  const nuxt = useNuxtApp();
  const instance = getCurrentInstance();
  if (instance && !instance._nuxtOnBeforeMountCbs) {
    const cbs = instance._nuxtOnBeforeMountCbs = [];
    if (instance && false) {
      onBeforeMount(() => {
        cbs.forEach((cb) => {
          cb();
        });
        cbs.splice(0, cbs.length);
      });
      onUnmounted(() => cbs.splice(0, cbs.length));
    }
  }
  const useInitialCache = () => options.initialCache && nuxt.payload.data[key] !== void 0;
  const asyncData = {
    data: wrapInRef((_d = nuxt.payload.data[key]) != null ? _d : options.default()),
    pending: ref(!useInitialCache()),
    error: ref((_e = nuxt.payload._errors[key]) != null ? _e : null)
  };
  asyncData.refresh = (opts = {}) => {
    if (nuxt._asyncDataPromises[key]) {
      return nuxt._asyncDataPromises[key];
    }
    if (opts._initial && useInitialCache()) {
      return nuxt.payload.data[key];
    }
    asyncData.pending.value = true;
    nuxt._asyncDataPromises[key] = Promise.resolve(handler(nuxt)).then((result) => {
      if (options.transform) {
        result = options.transform(result);
      }
      if (options.pick) {
        result = pick(result, options.pick);
      }
      asyncData.data.value = result;
      asyncData.error.value = null;
    }).catch((error) => {
      asyncData.error.value = error;
      asyncData.data.value = unref(options.default());
    }).finally(() => {
      asyncData.pending.value = false;
      nuxt.payload.data[key] = asyncData.data.value;
      if (asyncData.error.value) {
        nuxt.payload._errors[key] = true;
      }
      delete nuxt._asyncDataPromises[key];
    });
    return nuxt._asyncDataPromises[key];
  };
  const initialFetch = () => asyncData.refresh({ _initial: true });
  const fetchOnServer = options.server !== false && nuxt.payload.serverRendered;
  if (fetchOnServer) {
    const promise = initialFetch();
    onServerPrefetch(() => promise);
  }
  const asyncDataPromise = Promise.resolve(nuxt._asyncDataPromises[key]).then(() => asyncData);
  Object.assign(asyncDataPromise, asyncData);
  return asyncDataPromise;
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
const useState = (key, init) => {
  const nuxt = useNuxtApp();
  const state = toRef(nuxt.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxt.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
};
const useError = () => {
  const nuxtApp = useNuxtApp();
  return useState("error", () => nuxtApp.ssrContext.error);
};
const throwError = (_err) => {
  const nuxtApp = useNuxtApp();
  useError();
  const err = typeof _err === "string" ? new Error(_err) : _err;
  nuxtApp.callHook("app:error", err);
  {
    nuxtApp.ssrContext.error = nuxtApp.ssrContext.error || err;
  }
  return err;
};
const decode = decodeURIComponent;
const encode = encodeURIComponent;
const pairSplitRegExp = /; */;
const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
function parse(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  let obj = {};
  let opt = options || {};
  let pairs = str.split(pairSplitRegExp);
  let dec = opt.decode || decode;
  for (let i = 0; i < pairs.length; i++) {
    let pair = pairs[i];
    let eq_idx = pair.indexOf("=");
    if (eq_idx < 0) {
      continue;
    }
    let key = pair.substr(0, eq_idx).trim();
    let val = pair.substr(++eq_idx, pair.length).trim();
    if (val[0] == '"') {
      val = val.slice(1, -1);
    }
    if (obj[key] == void 0) {
      obj[key] = tryDecode(val, dec);
    }
  }
  return obj;
}
function serialize(name, value, options) {
  let opt = options || {};
  let enc = opt.encode || encode;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  let encodedValue = enc(value);
  if (encodedValue && !fieldContentRegExp.test(encodedValue)) {
    throw new TypeError("argument val is invalid");
  }
  let str = name + "=" + encodedValue;
  if (opt.maxAge != null) {
    let maxAge = opt.maxAge - 0;
    if (isNaN(maxAge) || !isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    if (typeof opt.expires.toUTCString !== "function") {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + opt.expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.sameSite) {
    let sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true:
        str += "; SameSite=Strict";
        break;
      case "lax":
        str += "; SameSite=Lax";
        break;
      case "strict":
        str += "; SameSite=Strict";
        break;
      case "none":
        str += "; SameSite=None";
        break;
      default:
        throw new TypeError("option sameSite is invalid");
    }
  }
  return str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch (e) {
    return str;
  }
}
const MIMES = {
  html: "text/html",
  json: "application/json"
};
const defer = typeof setImmediate !== "undefined" ? setImmediate : (fn) => fn();
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      event.res.end(data);
      resolve(void 0);
    });
  });
}
function defaultContentType(event, type) {
  if (type && !event.res.getHeader("Content-Type")) {
    event.res.setHeader("Content-Type", type);
  }
}
function sendRedirect(event, location2, code = 302) {
  event.res.statusCode = code;
  event.res.setHeader("Location", location2);
  return send(event, "Redirecting to " + location2, MIMES.html);
}
function appendHeader(event, name, value) {
  let current = event.res.getHeader(name);
  if (!current) {
    event.res.setHeader(name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  event.res.setHeader(name, current.concat(value));
}
class H3Error extends Error {
  constructor() {
    super(...arguments);
    this.statusCode = 500;
    this.statusMessage = "H3Error";
  }
}
function createError(input) {
  var _a;
  if (input instanceof H3Error) {
    return input;
  }
  const err = new H3Error((_a = input.message) != null ? _a : input.statusMessage);
  if (input.statusCode) {
    err.statusCode = input.statusCode;
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  }
  if (input.data) {
    err.data = input.data;
  }
  return err;
}
function useRequestEvent(nuxtApp = useNuxtApp()) {
  var _a;
  return (_a = nuxtApp.ssrContext) == null ? void 0 : _a.event;
}
const CookieDefaults = {
  path: "/",
  decode: (val) => destr(decodeURIComponent(val)),
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  var _a, _b;
  const opts = __spreadValues(__spreadValues({}, CookieDefaults), _opts);
  const cookies = readRawCookies(opts);
  const cookie = wrapInRef((_b = cookies[name]) != null ? _b : (_a = opts.default) == null ? void 0 : _a.call(opts));
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      if (cookie.value !== cookies[name]) {
        writeServerCookie(useRequestEvent(nuxtApp), name, cookie.value, opts);
      }
    };
    nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:redirected", writeFinalCookieValue);
  }
  return cookie;
}
function readRawCookies(opts = {}) {
  var _a;
  {
    return parse(((_a = useRequestEvent()) == null ? void 0 : _a.req.headers.cookie) || "", opts);
  }
}
function serializeCookie(name, value, opts = {}) {
  if (value === null || value === void 0) {
    return serialize(name, value, __spreadProps(__spreadValues({}, opts), { maxAge: -1 }));
  }
  return serialize(name, value, opts);
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    appendHeader(event, "Set-Cookie", serializeCookie(name, value, opts));
  }
}
const useRouter = () => {
  var _a;
  return (_a = useNuxtApp()) == null ? void 0 : _a.$router;
};
const useRoute = () => {
  return useNuxtApp()._route;
};
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return true;
  }
  return false;
};
const navigateTo = (to, options = {}) => {
  if (!to) {
    to = "/";
  }
  if (isProcessingMiddleware()) {
    return to;
  }
  const router = useRouter();
  {
    const nuxtApp = useNuxtApp();
    if (nuxtApp.ssrContext && nuxtApp.ssrContext.event) {
      const redirectLocation = router.resolve(to).fullPath || "/";
      return nuxtApp.callHook("app:redirected").then(() => sendRedirect(nuxtApp.ssrContext.event, redirectLocation, options.redirectCode || 301));
    }
  }
  return options.replace ? router.replace(to) : router.push(to);
};
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
const DEFAULT_EXTERNAL_REL_ATTRIBUTE = "noopener noreferrer";
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  const checkPropConflicts = (props, main, sub) => {
  };
  return defineComponent({
    name: componentName,
    props: {
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      }
    },
    setup(props, { slots }) {
      const router = useRouter();
      const to = computed(() => {
        checkPropConflicts(props, "to", "href");
        return props.to || props.href || "";
      });
      const isExternal = computed(() => {
        if (props.external) {
          return true;
        }
        if (props.target && props.target !== "_self") {
          return true;
        }
        if (typeof to.value === "object") {
          return false;
        }
        return to.value === "" || hasProtocol(to.value, true);
      });
      return () => {
        var _a, _b, _c;
        if (!isExternal.value) {
          return h(resolveComponent("RouterLink"), {
            to: to.value,
            activeClass: props.activeClass || options.activeClass,
            exactActiveClass: props.exactActiveClass || options.exactActiveClass,
            replace: props.replace,
            ariaCurrentValue: props.ariaCurrentValue
          }, slots.default);
        }
        const href = typeof to.value === "object" ? (_b = (_a = router.resolve(to.value)) == null ? void 0 : _a.href) != null ? _b : null : to.value || null;
        const target = props.target || null;
        checkPropConflicts(props, "noRel", "rel");
        const rel = props.noRel ? null : firstNonUndefined(props.rel, options.externalRelAttribute, href ? DEFAULT_EXTERNAL_REL_ATTRIBUTE : "") || null;
        return h("a", { href, rel, target }, (_c = slots.default) == null ? void 0 : _c.call(slots));
      };
    }
  });
}
const __nuxt_component_1$2 = defineNuxtLink({ componentName: "NuxtLink" });
var shared_cjs_prod = {};
Object.defineProperty(shared_cjs_prod, "__esModule", { value: true });
function makeMap(str, expectsLowerCase) {
  const map = /* @__PURE__ */ Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
const PatchFlagNames = {
  [1]: `TEXT`,
  [2]: `CLASS`,
  [4]: `STYLE`,
  [8]: `PROPS`,
  [16]: `FULL_PROPS`,
  [32]: `HYDRATE_EVENTS`,
  [64]: `STABLE_FRAGMENT`,
  [128]: `KEYED_FRAGMENT`,
  [256]: `UNKEYED_FRAGMENT`,
  [512]: `NEED_PATCH`,
  [1024]: `DYNAMIC_SLOTS`,
  [2048]: `DEV_ROOT_FRAGMENT`,
  [-1]: `HOISTED`,
  [-2]: `BAIL`
};
const slotFlagsText = {
  [1]: "STABLE",
  [2]: "DYNAMIC",
  [3]: "FORWARDED"
};
const GLOBALS_WHITE_LISTED = "Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt";
const isGloballyWhitelisted = /* @__PURE__ */ makeMap(GLOBALS_WHITE_LISTED);
const range = 2;
function generateCodeFrame(source, start = 0, end = source.length) {
  let lines = source.split(/(\r?\n)/);
  const newlineSequences = lines.filter((_, idx) => idx % 2 === 1);
  lines = lines.filter((_, idx) => idx % 2 === 0);
  let count = 0;
  const res = [];
  for (let i = 0; i < lines.length; i++) {
    count += lines[i].length + (newlineSequences[i] && newlineSequences[i].length || 0);
    if (count >= start) {
      for (let j = i - range; j <= i + range || end > count; j++) {
        if (j < 0 || j >= lines.length)
          continue;
        const line = j + 1;
        res.push(`${line}${" ".repeat(Math.max(3 - String(line).length, 0))}|  ${lines[j]}`);
        const lineLength = lines[j].length;
        const newLineSeqLength = newlineSequences[j] && newlineSequences[j].length || 0;
        if (j === i) {
          const pad = start - (count - (lineLength + newLineSeqLength));
          const length = Math.max(1, end > count ? lineLength - pad : end - start);
          res.push(`   |  ` + " ".repeat(pad) + "^".repeat(length));
        } else if (j > i) {
          if (end > count) {
            const length = Math.max(Math.min(end - count, lineLength), 1);
            res.push(`   |  ` + "^".repeat(length));
          }
          count += lineLength + newLineSeqLength;
        }
      }
      break;
    }
  }
  return res.join("\n");
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
const isBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
const unsafeAttrCharRE = /[>/="'\u0009\u000a\u000c\u0020]/;
const attrValidationCache = {};
function isSSRSafeAttrName(name) {
  if (attrValidationCache.hasOwnProperty(name)) {
    return attrValidationCache[name];
  }
  const isUnsafe = unsafeAttrCharRE.test(name);
  if (isUnsafe) {
    console.error(`unsafe attribute name: ${name}`);
  }
  return attrValidationCache[name] = !isUnsafe;
}
const propsToAttrMap = {
  acceptCharset: "accept-charset",
  className: "class",
  htmlFor: "for",
  httpEquiv: "http-equiv"
};
const isNoUnitNumericStyleProp = /* @__PURE__ */ makeMap(`animation-iteration-count,border-image-outset,border-image-slice,border-image-width,box-flex,box-flex-group,box-ordinal-group,column-count,columns,flex,flex-grow,flex-positive,flex-shrink,flex-negative,flex-order,grid-row,grid-row-end,grid-row-span,grid-row-start,grid-column,grid-column-end,grid-column-span,grid-column-start,font-weight,line-clamp,line-height,opacity,order,orphans,tab-size,widows,z-index,zoom,fill-opacity,flood-opacity,stop-opacity,stroke-dasharray,stroke-dashoffset,stroke-miterlimit,stroke-opacity,stroke-width`);
const isKnownHtmlAttr = /* @__PURE__ */ makeMap(`accept,accept-charset,accesskey,action,align,allow,alt,async,autocapitalize,autocomplete,autofocus,autoplay,background,bgcolor,border,buffered,capture,challenge,charset,checked,cite,class,code,codebase,color,cols,colspan,content,contenteditable,contextmenu,controls,coords,crossorigin,csp,data,datetime,decoding,default,defer,dir,dirname,disabled,download,draggable,dropzone,enctype,enterkeyhint,for,form,formaction,formenctype,formmethod,formnovalidate,formtarget,headers,height,hidden,high,href,hreflang,http-equiv,icon,id,importance,integrity,ismap,itemprop,keytype,kind,label,lang,language,loading,list,loop,low,manifest,max,maxlength,minlength,media,min,multiple,muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,preload,radiogroup,readonly,referrerpolicy,rel,required,reversed,rows,rowspan,sandbox,scope,scoped,selected,shape,size,sizes,slot,span,spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,target,title,translate,type,usemap,value,width,wrap`);
const isKnownSvgAttr = /* @__PURE__ */ makeMap(`xmlns,accent-height,accumulate,additive,alignment-baseline,alphabetic,amplitude,arabic-form,ascent,attributeName,attributeType,azimuth,baseFrequency,baseline-shift,baseProfile,bbox,begin,bias,by,calcMode,cap-height,class,clip,clipPathUnits,clip-path,clip-rule,color,color-interpolation,color-interpolation-filters,color-profile,color-rendering,contentScriptType,contentStyleType,crossorigin,cursor,cx,cy,d,decelerate,descent,diffuseConstant,direction,display,divisor,dominant-baseline,dur,dx,dy,edgeMode,elevation,enable-background,end,exponent,fill,fill-opacity,fill-rule,filter,filterRes,filterUnits,flood-color,flood-opacity,font-family,font-size,font-size-adjust,font-stretch,font-style,font-variant,font-weight,format,from,fr,fx,fy,g1,g2,glyph-name,glyph-orientation-horizontal,glyph-orientation-vertical,glyphRef,gradientTransform,gradientUnits,hanging,height,href,hreflang,horiz-adv-x,horiz-origin-x,id,ideographic,image-rendering,in,in2,intercept,k,k1,k2,k3,k4,kernelMatrix,kernelUnitLength,kerning,keyPoints,keySplines,keyTimes,lang,lengthAdjust,letter-spacing,lighting-color,limitingConeAngle,local,marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mask,maskContentUnits,maskUnits,mathematical,max,media,method,min,mode,name,numOctaves,offset,opacity,operator,order,orient,orientation,origin,overflow,overline-position,overline-thickness,panose-1,paint-order,path,pathLength,patternContentUnits,patternTransform,patternUnits,ping,pointer-events,points,pointsAtX,pointsAtY,pointsAtZ,preserveAlpha,preserveAspectRatio,primitiveUnits,r,radius,referrerPolicy,refX,refY,rel,rendering-intent,repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,result,rotate,rx,ry,scale,seed,shape-rendering,slope,spacing,specularConstant,specularExponent,speed,spreadMethod,startOffset,stdDeviation,stemh,stemv,stitchTiles,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,string,stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,style,surfaceScale,systemLanguage,tabindex,tableValues,target,targetX,targetY,text-anchor,text-decoration,text-rendering,textLength,to,transform,transform-origin,type,u1,u2,underline-position,underline-thickness,unicode,unicode-bidi,unicode-range,units-per-em,v-alphabetic,v-hanging,v-ideographic,v-mathematical,values,vector-effect,version,vert-adv-y,vert-origin-x,vert-origin-y,viewBox,viewTarget,visibility,width,widths,word-spacing,writing-mode,x,x-height,x1,x2,xChannelSelector,xlink:actuate,xlink:arcrole,xlink:href,xlink:role,xlink:show,xlink:title,xlink:type,xml:base,xml:lang,xml:space,y,y1,y2,yChannelSelector,z,zoomAndPan`);
function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value)) {
    return value;
  } else if (isObject$1(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:(.+)/;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function stringifyStyle(styles) {
  let ret = "";
  if (!styles || isString(styles)) {
    return ret;
  }
  for (const key in styles) {
    const value = styles[key];
    const normalizedKey = key.startsWith(`--`) ? key : hyphenate(key);
    if (isString(value) || typeof value === "number" && isNoUnitNumericStyleProp(normalizedKey)) {
      ret += `${normalizedKey}:${value};`;
    }
  }
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
  } else if (isObject$1(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
function normalizeProps(props) {
  if (!props)
    return null;
  let { class: klass, style } = props;
  if (klass && !isString(klass)) {
    props.class = normalizeClass(klass);
  }
  if (style) {
    props.style = normalizeStyle(style);
  }
  return props;
}
const HTML_TAGS = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot";
const SVG_TAGS = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistanceLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view";
const VOID_TAGS = "area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr";
const isHTMLTag = /* @__PURE__ */ makeMap(HTML_TAGS);
const isSVGTag = /* @__PURE__ */ makeMap(SVG_TAGS);
const isVoidTag = /* @__PURE__ */ makeMap(VOID_TAGS);
const escapeRE = /["'&<>]/;
function escapeHtml(string) {
  const str = "" + string;
  const match = escapeRE.exec(str);
  if (!match) {
    return str;
  }
  let html = "";
  let escaped;
  let index2;
  let lastIndex = 0;
  for (index2 = match.index; index2 < str.length; index2++) {
    switch (str.charCodeAt(index2)) {
      case 34:
        escaped = "&quot;";
        break;
      case 38:
        escaped = "&amp;";
        break;
      case 39:
        escaped = "&#39;";
        break;
      case 60:
        escaped = "&lt;";
        break;
      case 62:
        escaped = "&gt;";
        break;
      default:
        continue;
    }
    if (lastIndex !== index2) {
      html += str.slice(lastIndex, index2);
    }
    lastIndex = index2 + 1;
    html += escaped;
  }
  return lastIndex !== index2 ? html + str.slice(lastIndex, index2) : html;
}
const commentStripRE = /^-?>|<!--|-->|--!>|<!-$/g;
function escapeHtmlComment(src) {
  return src.replace(commentStripRE, "");
}
function looseCompareArrays(a3, b) {
  if (a3.length !== b.length)
    return false;
  let equal = true;
  for (let i = 0; equal && i < a3.length; i++) {
    equal = looseEqual(a3[i], b[i]);
  }
  return equal;
}
function looseEqual(a3, b) {
  if (a3 === b)
    return true;
  let aValidType = isDate(a3);
  let bValidType = isDate(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? a3.getTime() === b.getTime() : false;
  }
  aValidType = isSymbol(a3);
  bValidType = isSymbol(b);
  if (aValidType || bValidType) {
    return a3 === b;
  }
  aValidType = isArray(a3);
  bValidType = isArray(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? looseCompareArrays(a3, b) : false;
  }
  aValidType = isObject$1(a3);
  bValidType = isObject$1(b);
  if (aValidType || bValidType) {
    if (!aValidType || !bValidType) {
      return false;
    }
    const aKeysCount = Object.keys(a3).length;
    const bKeysCount = Object.keys(b).length;
    if (aKeysCount !== bKeysCount) {
      return false;
    }
    for (const key in a3) {
      const aHasKey = a3.hasOwnProperty(key);
      const bHasKey = b.hasOwnProperty(key);
      if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a3[key], b[key])) {
        return false;
      }
    }
  }
  return String(a3) === String(b);
}
function looseIndexOf(arr, val) {
  return arr.findIndex((item) => looseEqual(item, val));
}
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray(val) || isObject$1(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2]) => {
        entries[`${key} =>`] = val2;
        return entries;
      }, {})
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()]
    };
  } else if (isObject$1(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isDate = (val) => toTypeString(val) === "[object Date]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject$1 = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return isObject$1(val) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");
const isBuiltInDirective = /* @__PURE__ */ makeMap("bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo");
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
const capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
const toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const toNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof commonjsGlobal !== "undefined" ? commonjsGlobal : {});
};
const identRE = /^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*$/;
function genPropsAccessExp(name) {
  return identRE.test(name) ? `__props.${name}` : `__props[${JSON.stringify(name)}]`;
}
shared_cjs_prod.EMPTY_ARR = EMPTY_ARR;
shared_cjs_prod.EMPTY_OBJ = EMPTY_OBJ;
shared_cjs_prod.NO = NO;
shared_cjs_prod.NOOP = NOOP;
shared_cjs_prod.PatchFlagNames = PatchFlagNames;
shared_cjs_prod.camelize = camelize;
shared_cjs_prod.capitalize = capitalize;
shared_cjs_prod.def = def;
shared_cjs_prod.escapeHtml = escapeHtml;
shared_cjs_prod.escapeHtmlComment = escapeHtmlComment;
shared_cjs_prod.extend = extend;
shared_cjs_prod.genPropsAccessExp = genPropsAccessExp;
shared_cjs_prod.generateCodeFrame = generateCodeFrame;
shared_cjs_prod.getGlobalThis = getGlobalThis;
shared_cjs_prod.hasChanged = hasChanged;
shared_cjs_prod.hasOwn = hasOwn;
shared_cjs_prod.hyphenate = hyphenate;
shared_cjs_prod.includeBooleanAttr = includeBooleanAttr;
shared_cjs_prod.invokeArrayFns = invokeArrayFns;
shared_cjs_prod.isArray = isArray;
shared_cjs_prod.isBooleanAttr = isBooleanAttr;
shared_cjs_prod.isBuiltInDirective = isBuiltInDirective;
shared_cjs_prod.isDate = isDate;
var isFunction_1 = shared_cjs_prod.isFunction = isFunction;
shared_cjs_prod.isGloballyWhitelisted = isGloballyWhitelisted;
shared_cjs_prod.isHTMLTag = isHTMLTag;
shared_cjs_prod.isIntegerKey = isIntegerKey;
shared_cjs_prod.isKnownHtmlAttr = isKnownHtmlAttr;
shared_cjs_prod.isKnownSvgAttr = isKnownSvgAttr;
shared_cjs_prod.isMap = isMap;
shared_cjs_prod.isModelListener = isModelListener;
shared_cjs_prod.isNoUnitNumericStyleProp = isNoUnitNumericStyleProp;
shared_cjs_prod.isObject = isObject$1;
shared_cjs_prod.isOn = isOn;
shared_cjs_prod.isPlainObject = isPlainObject;
shared_cjs_prod.isPromise = isPromise;
shared_cjs_prod.isReservedProp = isReservedProp;
shared_cjs_prod.isSSRSafeAttrName = isSSRSafeAttrName;
shared_cjs_prod.isSVGTag = isSVGTag;
shared_cjs_prod.isSet = isSet;
shared_cjs_prod.isSpecialBooleanAttr = isSpecialBooleanAttr;
shared_cjs_prod.isString = isString;
shared_cjs_prod.isSymbol = isSymbol;
shared_cjs_prod.isVoidTag = isVoidTag;
shared_cjs_prod.looseEqual = looseEqual;
shared_cjs_prod.looseIndexOf = looseIndexOf;
shared_cjs_prod.makeMap = makeMap;
shared_cjs_prod.normalizeClass = normalizeClass;
shared_cjs_prod.normalizeProps = normalizeProps;
shared_cjs_prod.normalizeStyle = normalizeStyle;
shared_cjs_prod.objectToString = objectToString;
shared_cjs_prod.parseStringStyle = parseStringStyle;
shared_cjs_prod.propsToAttrMap = propsToAttrMap;
shared_cjs_prod.remove = remove;
shared_cjs_prod.slotFlagsText = slotFlagsText;
shared_cjs_prod.stringifyStyle = stringifyStyle;
shared_cjs_prod.toDisplayString = toDisplayString;
shared_cjs_prod.toHandlerKey = toHandlerKey;
shared_cjs_prod.toNumber = toNumber;
shared_cjs_prod.toRawType = toRawType;
shared_cjs_prod.toTypeString = toTypeString;
function useHead(meta2) {
  const resolvedMeta = isFunction_1(meta2) ? computed(meta2) : meta2;
  useNuxtApp()._useHead(resolvedMeta);
}
const tailwind = "";
const iconfont = "";
const preload = defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.mixin({
    beforeCreate() {
      const { _registeredComponents } = this.$nuxt.ssrContext;
      const { __moduleIdentifier } = this.$options;
      _registeredComponents.add(__moduleIdentifier);
    }
  });
});
const components = {};
function componentsPlugin_2c84ef57(nuxtApp) {
  for (const name in components) {
    nuxtApp.vueApp.component(name, components[name]);
    nuxtApp.vueApp.component("Lazy" + name, components[name]);
  }
}
var __defProp2 = Object.defineProperty;
var __defProps2 = Object.defineProperties;
var __getOwnPropDescs2 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols2 = Object.getOwnPropertySymbols;
var __hasOwnProp2 = Object.prototype.hasOwnProperty;
var __propIsEnum2 = Object.prototype.propertyIsEnumerable;
var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues2 = (a3, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp2.call(b, prop))
      __defNormalProp2(a3, prop, b[prop]);
  if (__getOwnPropSymbols2)
    for (var prop of __getOwnPropSymbols2(b)) {
      if (__propIsEnum2.call(b, prop))
        __defNormalProp2(a3, prop, b[prop]);
    }
  return a3;
};
var __spreadProps2 = (a3, b) => __defProps2(a3, __getOwnPropDescs2(b));
var PROVIDE_KEY = `usehead`;
var HEAD_COUNT_KEY = `head:count`;
var HEAD_ATTRS_KEY = `data-head-attrs`;
var SELF_CLOSING_TAGS = ["meta", "link", "base"];
var createElement = (tag, attrs, document2) => {
  const el = document2.createElement(tag);
  for (const key of Object.keys(attrs)) {
    let value = attrs[key];
    if (key === "key" || value === false) {
      continue;
    }
    if (key === "children") {
      el.textContent = value;
    } else {
      el.setAttribute(key, value);
    }
  }
  return el;
};
var htmlEscape = (str) => str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
var stringifyAttrs = (attributes) => {
  const handledAttributes = [];
  for (let [key, value] of Object.entries(attributes)) {
    if (key === "children" || key === "key") {
      continue;
    }
    if (value === false || value == null) {
      continue;
    }
    let attribute = htmlEscape(key);
    if (value !== true) {
      attribute += `="${htmlEscape(String(value))}"`;
    }
    handledAttributes.push(attribute);
  }
  return handledAttributes.length > 0 ? " " + handledAttributes.join(" ") : "";
};
function isEqualNode(oldTag, newTag) {
  if (oldTag instanceof HTMLElement && newTag instanceof HTMLElement) {
    const nonce = newTag.getAttribute("nonce");
    if (nonce && !oldTag.getAttribute("nonce")) {
      const cloneTag = newTag.cloneNode(true);
      cloneTag.setAttribute("nonce", "");
      cloneTag.nonce = nonce;
      return nonce === oldTag.nonce && oldTag.isEqualNode(cloneTag);
    }
  }
  return oldTag.isEqualNode(newTag);
}
var getTagKey = (props) => {
  const names = ["key", "id", "name", "property"];
  for (const n of names) {
    const value = typeof props.getAttribute === "function" ? props.hasAttribute(n) ? props.getAttribute(n) : void 0 : props[n];
    if (value !== void 0) {
      return { name: n, value };
    }
  }
};
var acceptFields = [
  "title",
  "meta",
  "link",
  "base",
  "style",
  "script",
  "htmlAttrs",
  "bodyAttrs"
];
var headObjToTags = (obj) => {
  const tags = [];
  for (const key of Object.keys(obj)) {
    if (obj[key] == null)
      continue;
    if (key === "title") {
      tags.push({ tag: key, props: { children: obj[key] } });
    } else if (key === "base") {
      tags.push({ tag: key, props: __spreadValues2({ key: "default" }, obj[key]) });
    } else if (acceptFields.includes(key)) {
      const value = obj[key];
      if (Array.isArray(value)) {
        value.forEach((item) => {
          tags.push({ tag: key, props: item });
        });
      } else if (value) {
        tags.push({ tag: key, props: value });
      }
    }
  }
  return tags;
};
var setAttrs = (el, attrs) => {
  const existingAttrs = el.getAttribute(HEAD_ATTRS_KEY);
  if (existingAttrs) {
    for (const key of existingAttrs.split(",")) {
      if (!(key in attrs)) {
        el.removeAttribute(key);
      }
    }
  }
  const keys = [];
  for (const key in attrs) {
    const value = attrs[key];
    if (value == null)
      continue;
    if (value === false) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
    keys.push(key);
  }
  if (keys.length) {
    el.setAttribute(HEAD_ATTRS_KEY, keys.join(","));
  } else {
    el.removeAttribute(HEAD_ATTRS_KEY);
  }
};
var updateElements = (document2 = window.document, type, tags) => {
  var _a;
  const head = document2.head;
  let headCountEl = head.querySelector(`meta[name="${HEAD_COUNT_KEY}"]`);
  const headCount = headCountEl ? Number(headCountEl.getAttribute("content")) : 0;
  const oldElements = [];
  if (headCountEl) {
    for (let i = 0, j = headCountEl.previousElementSibling; i < headCount; i++, j = (j == null ? void 0 : j.previousElementSibling) || null) {
      if (((_a = j == null ? void 0 : j.tagName) == null ? void 0 : _a.toLowerCase()) === type) {
        oldElements.push(j);
      }
    }
  } else {
    headCountEl = document2.createElement("meta");
    headCountEl.setAttribute("name", HEAD_COUNT_KEY);
    headCountEl.setAttribute("content", "0");
    head.append(headCountEl);
  }
  let newElements = tags.map((tag) => createElement(tag.tag, tag.props, document2));
  newElements = newElements.filter((newEl) => {
    for (let i = 0; i < oldElements.length; i++) {
      const oldEl = oldElements[i];
      if (isEqualNode(oldEl, newEl)) {
        oldElements.splice(i, 1);
        return false;
      }
    }
    return true;
  });
  oldElements.forEach((t) => {
    var _a2;
    return (_a2 = t.parentNode) == null ? void 0 : _a2.removeChild(t);
  });
  newElements.forEach((t) => {
    head.insertBefore(t, headCountEl);
  });
  headCountEl.setAttribute("content", "" + (headCount - oldElements.length + newElements.length));
};
var createHead = () => {
  let allHeadObjs = [];
  let previousTags = /* @__PURE__ */ new Set();
  const head = {
    install(app) {
      app.config.globalProperties.$head = head;
      app.provide(PROVIDE_KEY, head);
    },
    get headTags() {
      const deduped = [];
      allHeadObjs.forEach((objs) => {
        const tags = headObjToTags(objs.value);
        tags.forEach((tag) => {
          if (tag.tag === "meta" || tag.tag === "base" || tag.tag === "script") {
            const key = getTagKey(tag.props);
            if (key) {
              let index2 = -1;
              for (let i = 0; i < deduped.length; i++) {
                const prev = deduped[i];
                const prevValue = prev.props[key.name];
                const nextValue = tag.props[key.name];
                if (prev.tag === tag.tag && prevValue === nextValue) {
                  index2 = i;
                  break;
                }
              }
              if (index2 !== -1) {
                deduped.splice(index2, 1);
              }
            }
          }
          deduped.push(tag);
        });
      });
      return deduped;
    },
    addHeadObjs(objs) {
      allHeadObjs.push(objs);
    },
    removeHeadObjs(objs) {
      allHeadObjs = allHeadObjs.filter((_objs) => _objs !== objs);
    },
    updateDOM(document2 = window.document) {
      let title;
      let htmlAttrs = {};
      let bodyAttrs = {};
      const actualTags = {};
      for (const tag of head.headTags) {
        if (tag.tag === "title") {
          title = tag.props.children;
          continue;
        }
        if (tag.tag === "htmlAttrs") {
          Object.assign(htmlAttrs, tag.props);
          continue;
        }
        if (tag.tag === "bodyAttrs") {
          Object.assign(bodyAttrs, tag.props);
          continue;
        }
        actualTags[tag.tag] = actualTags[tag.tag] || [];
        actualTags[tag.tag].push(tag);
      }
      if (title !== void 0) {
        document2.title = title;
      }
      setAttrs(document2.documentElement, htmlAttrs);
      setAttrs(document2.body, bodyAttrs);
      const tags = /* @__PURE__ */ new Set([...Object.keys(actualTags), ...previousTags]);
      for (const tag of tags) {
        updateElements(document2, tag, actualTags[tag] || []);
      }
      previousTags.clear();
      Object.keys(actualTags).forEach((i) => previousTags.add(i));
    }
  };
  return head;
};
var tagToString = (tag) => {
  let attrs = stringifyAttrs(tag.props);
  if (SELF_CLOSING_TAGS.includes(tag.tag)) {
    return `<${tag.tag}${attrs}>`;
  }
  return `<${tag.tag}${attrs}>${tag.props.children || ""}</${tag.tag}>`;
};
var renderHeadToString = (head) => {
  const tags = [];
  let titleTag = "";
  let htmlAttrs = {};
  let bodyAttrs = {};
  for (const tag of head.headTags) {
    if (tag.tag === "title") {
      titleTag = tagToString(tag);
    } else if (tag.tag === "htmlAttrs") {
      Object.assign(htmlAttrs, tag.props);
    } else if (tag.tag === "bodyAttrs") {
      Object.assign(bodyAttrs, tag.props);
    } else {
      tags.push(tagToString(tag));
    }
  }
  tags.push(`<meta name="${HEAD_COUNT_KEY}" content="${tags.length}">`);
  return {
    get headTags() {
      return titleTag + tags.join("");
    },
    get htmlAttrs() {
      return stringifyAttrs(__spreadProps2(__spreadValues2({}, htmlAttrs), {
        [HEAD_ATTRS_KEY]: Object.keys(htmlAttrs).join(",")
      }));
    },
    get bodyAttrs() {
      return stringifyAttrs(__spreadProps2(__spreadValues2({}, bodyAttrs), {
        [HEAD_ATTRS_KEY]: Object.keys(bodyAttrs).join(",")
      }));
    }
  };
};
function isObject(val) {
  return val !== null && typeof val === "object";
}
function _defu(baseObj, defaults, namespace = ".", merger) {
  if (!isObject(defaults)) {
    return _defu(baseObj, {}, namespace, merger);
  }
  const obj = Object.assign({}, defaults);
  for (const key in baseObj) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const val = baseObj[key];
    if (val === null || val === void 0) {
      continue;
    }
    if (merger && merger(obj, key, val, namespace)) {
      continue;
    }
    if (Array.isArray(val) && Array.isArray(obj[key])) {
      obj[key] = val.concat(obj[key]);
    } else if (isObject(val) && isObject(obj[key])) {
      obj[key] = _defu(val, obj[key], (namespace ? `${namespace}.` : "") + key.toString(), merger);
    } else {
      obj[key] = val;
    }
  }
  return obj;
}
function createDefu(merger) {
  return (...args) => args.reduce((p, c) => _defu(p, c, "", merger), {});
}
const defu = createDefu();
const vueuseHead_0e2c7a21 = defineNuxtPlugin((nuxtApp) => {
  const head = createHead();
  nuxtApp.vueApp.use(head);
  nuxtApp.hooks.hookOnce("app:mounted", () => {
    watchEffect(() => {
      head.updateDOM();
    });
  });
  const titleTemplate = ref();
  nuxtApp._useHead = (_meta) => {
    const meta2 = ref(_meta);
    if ("titleTemplate" in meta2.value) {
      titleTemplate.value = meta2.value.titleTemplate;
    }
    const headObj = computed(() => {
      const overrides = { meta: [] };
      if (titleTemplate.value && "title" in meta2.value) {
        overrides.title = typeof titleTemplate.value === "function" ? titleTemplate.value(meta2.value.title) : titleTemplate.value.replace(/%s/g, meta2.value.title);
      }
      if (meta2.value.charset) {
        overrides.meta.push({ key: "charset", charset: meta2.value.charset });
      }
      if (meta2.value.viewport) {
        overrides.meta.push({ name: "viewport", content: meta2.value.viewport });
      }
      return defu(overrides, meta2.value);
    });
    head.addHeadObjs(headObj);
    {
      return;
    }
  };
  {
    nuxtApp.ssrContext.renderMeta = () => renderHeadToString(head);
  }
});
const removeUndefinedProps = (props) => Object.fromEntries(Object.entries(props).filter(([, value]) => value !== void 0));
const setupForUseMeta = (metaFactory, renderChild) => (props, ctx) => {
  useHead(() => metaFactory(__spreadValues(__spreadValues({}, removeUndefinedProps(props)), ctx.attrs), ctx));
  return () => {
    var _a, _b;
    return renderChild ? (_b = (_a = ctx.slots).default) == null ? void 0 : _b.call(_a) : null;
  };
};
const globalProps = {
  accesskey: String,
  autocapitalize: String,
  autofocus: {
    type: Boolean,
    default: void 0
  },
  class: String,
  contenteditable: {
    type: Boolean,
    default: void 0
  },
  contextmenu: String,
  dir: String,
  draggable: {
    type: Boolean,
    default: void 0
  },
  enterkeyhint: String,
  exportparts: String,
  hidden: {
    type: Boolean,
    default: void 0
  },
  id: String,
  inputmode: String,
  is: String,
  itemid: String,
  itemprop: String,
  itemref: String,
  itemscope: String,
  itemtype: String,
  lang: String,
  nonce: String,
  part: String,
  slot: String,
  spellcheck: {
    type: Boolean,
    default: void 0
  },
  style: String,
  tabindex: String,
  title: String,
  translate: String
};
const Script = defineComponent({
  name: "Script",
  props: __spreadProps(__spreadValues({}, globalProps), {
    async: Boolean,
    crossorigin: {
      type: [Boolean, String],
      default: void 0
    },
    defer: Boolean,
    integrity: String,
    nomodule: Boolean,
    nonce: String,
    referrerpolicy: String,
    src: String,
    type: String,
    charset: String,
    language: String
  }),
  setup: setupForUseMeta((script) => ({
    script: [script]
  }))
});
const Link = defineComponent({
  name: "Link",
  props: __spreadProps(__spreadValues({}, globalProps), {
    as: String,
    crossorigin: String,
    disabled: Boolean,
    href: String,
    hreflang: String,
    imagesizes: String,
    imagesrcset: String,
    integrity: String,
    media: String,
    prefetch: {
      type: Boolean,
      default: void 0
    },
    referrerpolicy: String,
    rel: String,
    sizes: String,
    title: String,
    type: String,
    methods: String,
    target: String
  }),
  setup: setupForUseMeta((link) => ({
    link: [link]
  }))
});
const Base = defineComponent({
  name: "Base",
  props: __spreadProps(__spreadValues({}, globalProps), {
    href: String,
    target: String
  }),
  setup: setupForUseMeta((base) => ({
    base
  }))
});
const Title = defineComponent({
  name: "Title",
  setup: setupForUseMeta((_, { slots }) => {
    var _a, _b, _c;
    const title = ((_c = (_b = (_a = slots.default) == null ? void 0 : _a.call(slots)) == null ? void 0 : _b[0]) == null ? void 0 : _c.children) || null;
    return {
      title
    };
  })
});
const Meta = defineComponent({
  name: "Meta",
  props: __spreadProps(__spreadValues({}, globalProps), {
    charset: String,
    content: String,
    httpEquiv: String,
    name: String
  }),
  setup: setupForUseMeta((meta2) => ({
    meta: [meta2]
  }))
});
const Style = defineComponent({
  name: "Style",
  props: __spreadProps(__spreadValues({}, globalProps), {
    type: String,
    media: String,
    nonce: String,
    title: String,
    scoped: {
      type: Boolean,
      default: void 0
    }
  }),
  setup: setupForUseMeta((props, { slots }) => {
    var _a, _b, _c;
    const style = __spreadValues({}, props);
    const textContent = (_c = (_b = (_a = slots.default) == null ? void 0 : _a.call(slots)) == null ? void 0 : _b[0]) == null ? void 0 : _c.children;
    if (textContent) {
      style.children = textContent;
    }
    return {
      style: [style]
    };
  })
});
const Head = defineComponent({
  name: "Head",
  setup: (_props, ctx) => () => {
    var _a, _b;
    return (_b = (_a = ctx.slots).default) == null ? void 0 : _b.call(_a);
  }
});
const Html = defineComponent({
  name: "Html",
  props: __spreadProps(__spreadValues({}, globalProps), {
    manifest: String,
    version: String,
    xmlns: String
  }),
  setup: setupForUseMeta((htmlAttrs) => ({ htmlAttrs }), true)
});
const Body = defineComponent({
  name: "Body",
  props: globalProps,
  setup: setupForUseMeta((bodyAttrs) => ({ bodyAttrs }), true)
});
const Components = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Script,
  Link,
  Base,
  Title,
  Meta,
  Style,
  Head,
  Html,
  Body
}, Symbol.toStringTag, { value: "Module" }));
const metaConfig = { "globalMeta": { "charset": "utf-8", "viewport": "width=device-width, initial-scale=1", "meta": [{ "name": "keywords", "content": "web\u524D\u7AEF,flutter,uniapp,\u6A21\u677F,template,flutter,\u524D\u7AEF\u5DE5\u5177,blog" }, { "name": "description", "content": "\u5367\u69FD(wo ca\xF2),\u5367\u69FD(w\xF2 cao),\u5367\u69FD(w\u01D2 ca\xF3),\u5367\u69FD(w\u01D2 ca\xF2),\u5367\u69FD(w\u014D ca\u014D),\u5367\u69FD(w\u014D ca\u014D)" }, { "name": "theme-color", "content": "#6d327c" }], "link": [], "style": [], "script": [], "title": " " } };
const metaMixin = {
  created() {
    const instance = getCurrentInstance();
    if (!instance) {
      return;
    }
    const options = instance.type;
    if (!options || !("head" in options)) {
      return;
    }
    const nuxtApp = useNuxtApp();
    const source = typeof options.head === "function" ? computed(() => options.head(nuxtApp)) : options.head;
    useHead(source);
  }
};
const _fd96d7d6 = defineNuxtPlugin((nuxtApp) => {
  useHead(markRaw(metaConfig.globalMeta));
  nuxtApp.vueApp.mixin(metaMixin);
  for (const name in Components) {
    nuxtApp.vueApp.component(name, Components[name]);
  }
});
const interpolatePath = (route, match) => {
  return match.path.replace(/(:\w+)\([^)]+\)/g, "$1").replace(/(:\w+)[?+*]/g, "$1").replace(/:\w+/g, (r) => {
    var _a;
    return ((_a = route.params[r.slice(1)]) == null ? void 0 : _a.toString()) || "";
  });
};
const generateRouteKey = (override, routeProps) => {
  var _a;
  const matchedRoute = routeProps.route.matched.find((m) => m.components.default === routeProps.Component.type);
  const source = (_a = override != null ? override : matchedRoute == null ? void 0 : matchedRoute.meta.key) != null ? _a : interpolatePath(routeProps.route, matchedRoute);
  return typeof source === "function" ? source(routeProps.route) : source;
};
const wrapInKeepAlive = (props, children) => {
  return { default: () => children };
};
const Fragment = {
  setup(_props, { slots }) {
    return () => {
      var _a;
      return (_a = slots.default) == null ? void 0 : _a.call(slots);
    };
  }
};
const _wrapIf = (component, props, slots) => {
  return { default: () => props ? h(component, props === true ? {} : props, slots) : h(Fragment, {}, slots) };
};
const isNestedKey = Symbol("isNested");
const NuxtPage = defineComponent({
  name: "NuxtPage",
  props: {
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props) {
    const nuxtApp = useNuxtApp();
    const isNested = inject(isNestedKey, false);
    provide(isNestedKey, true);
    return () => {
      return h(vueRouter_cjs_prod.RouterView, {}, {
        default: (routeProps) => {
          var _a;
          return routeProps.Component && _wrapIf(Transition, (_a = routeProps.route.meta.pageTransition) != null ? _a : defaultPageTransition, wrapInKeepAlive(routeProps.route.meta.keepalive, isNested && nuxtApp.isHydrating ? h(routeProps.Component, { key: generateRouteKey(props.pageKey, routeProps) }) : h(Suspense, {
            onPending: () => nuxtApp.callHook("page:start", routeProps.Component),
            onResolve: () => nuxtApp.callHook("page:finish", routeProps.Component)
          }, { default: () => h(routeProps.Component, { key: generateRouteKey(props.pageKey, routeProps) }) }))).default();
        }
      });
    };
  }
});
const defaultPageTransition = { name: "page", mode: "out-in" };
const layouts = {
  default: defineAsyncComponent(() => Promise.resolve().then(function() {
    return _default;
  })),
  tools: defineAsyncComponent(() => Promise.resolve().then(function() {
    return tools$1;
  }))
};
const defaultLayoutTransition = { name: "layout", mode: "out-in" };
const __nuxt_component_0$1 = defineComponent({
  props: {
    name: {
      type: [String, Boolean, Object],
      default: null
    }
  },
  setup(props, context) {
    const route = useRoute();
    return () => {
      var _a, _b, _c;
      const layout = (_b = (_a = isRef(props.name) ? props.name.value : props.name) != null ? _a : route.meta.layout) != null ? _b : "default";
      const hasLayout = layout && layout in layouts;
      return _wrapIf(Transition, hasLayout && ((_c = route.meta.layoutTransition) != null ? _c : defaultLayoutTransition), _wrapIf(layouts[layout], hasLayout, context.slots)).default();
    };
  }
});
const useStrapiUrl = () => {
  const config = useRuntimeConfig().public;
  const version = config.strapi.version;
  return version === "v3" ? config.strapi.url : `${config.strapi.url}${config.strapi.prefix}`;
};
const useCdnUrl = () => useStrapiUrl().replace("/api", "");
const useTitle = () => {
  const cao = ["cao", "ca\u014D", "ca\xF3", "ca\u01D2", "ca\xF2"];
  const day = new Date().getDay();
  const week = ["\u5929", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D"][day];
  const result = day ? 7 % day : 0;
  return {
    title: `\u5367\u69FD(w ${cao[result]})\uFF0C\u4ECA\u5929\u661F\u671F${week}`,
    cao: cao[result],
    week,
    day
  };
};
const GridItemB_vue_vue_type_style_index_0_scoped_true_lang = "";
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$v = /* @__PURE__ */ defineComponent({
  name: "GridItemB",
  __ssrInlineRender: true,
  props: {
    id: null,
    title: null,
    desciption: null,
    time: null,
    visit: { default: 0 },
    comment: { default: 0 },
    tag: null,
    headerImages: null,
    to: null
  },
  setup(__props) {
    const $cdn = useCdnUrl();
    const modules = [Navigation];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_link = __nuxt_component_1$2;
      _push(`<article${ssrRenderAttrs(mergeProps({ class: "article-b" }, _attrs))} data-v-73dde911><div class="tags relative z-10" data-v-73dde911><a href="javascript:;" style="${ssrRenderStyle(`color: ${__props.tag.color};background-color: ${__props.tag.bgColor}`)}" data-v-73dde911>${ssrInterpolate(__props.tag.name)}</a></div><header data-v-73dde911>`);
      _push(ssrRenderComponent(unref(Swiper), {
        class: "rounded-t-2xl",
        modules,
        navigation: ""
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(__props.headerImages, (item) => {
              _push2(ssrRenderComponent(unref(SwiperSlide), { key: item }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="bg-cover hover:bg-bottom transition-all duration-500 ease-linear delay-200" style="${ssrRenderStyle(`background-image:url(${unref($cdn) + item});height: 225px`)}" data-v-73dde911${_scopeId2}></div>`);
                  } else {
                    return [
                      createVNode("div", {
                        class: "bg-cover hover:bg-bottom transition-all duration-500 ease-linear delay-200",
                        style: `background-image:url(${unref($cdn) + item});height: 225px`
                      }, null, 4)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment$1, null, renderList(__props.headerImages, (item) => {
                return openBlock(), createBlock(unref(SwiperSlide), { key: item }, {
                  default: withCtx(() => [
                    createVNode("div", {
                      class: "bg-cover hover:bg-bottom transition-all duration-500 ease-linear delay-200",
                      style: `background-image:url(${unref($cdn) + item});height: 225px`
                    }, null, 4)
                  ]),
                  _: 2
                }, 1024);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex justify-center mt-5 flex-col items-center" data-v-73dde911><time class="flex items-center capitalize" data-v-73dde911><i class="text-2xl iconfont" style="${ssrRenderStyle({ "color": "#e84e89" })}" data-v-73dde911>\uE8B4</i><span class="ml-2 text-sm" data-v-73dde911>${ssrInterpolate(__props.time)}</span></time></div></header><main class="text-center px-4" data-v-73dde911><h1 class="title py-2 text-center" data-v-73dde911>`);
      _push(ssrRenderComponent(_component_nuxt_link, {
        to: __props.to || "/posts/" + __props.id
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.title)}`);
          } else {
            return [
              createTextVNode(toDisplayString$1(__props.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</h1><p class="text-opacity-60 text-black font-light text-center" data-v-73dde911>${ssrInterpolate(__props.desciption)}</p></main><footer class="flex justify-between items-center mt-10" data-v-73dde911><a href="javascript:;" class="flex items-center" data-v-73dde911><span class="author-image" style="${ssrRenderStyle({ "background-image": "url('/avatar.jpg')" })}" data-v-73dde911></span><span class="author-name" data-v-73dde911>meetqy</span></a><div class="text-sm text-black text-opacity-60" data-v-73dde911><a href="javascript:;" data-v-73dde911><span class="mr-1" data-v-73dde911>${ssrInterpolate(__props.visit)}</span><i class="iconfont" style="${ssrRenderStyle({ "color": "#e84e89" })}" data-v-73dde911>\uE8F4</i></a><a href="javascript:;" class="ml-4" data-v-73dde911><span class="mr-1" data-v-73dde911>${ssrInterpolate(__props.comment)}</span><i class="iconfont" style="${ssrRenderStyle({ "color": "#e84e89" })}" data-v-73dde911>\uE8B5</i></a></div></footer></article>`);
    };
  }
});
const _sfc_setup$v = _sfc_main$v.setup;
_sfc_main$v.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/GridItemB.vue");
  return _sfc_setup$v ? _sfc_setup$v(props, ctx) : void 0;
};
const __nuxt_component_1$1 = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["__scopeId", "data-v-73dde911"]]);
const GridItemA_vue_vue_type_style_index_0_lang = "";
const _sfc_main$u = /* @__PURE__ */ defineComponent({
  name: "GridItemA",
  __ssrInlineRender: true,
  props: {
    title: null,
    desciption: null,
    time: null,
    tag: null,
    headerImages: null,
    link: null
  },
  setup(__props) {
    const $cdn = useCdnUrl();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_link = __nuxt_component_1$2;
      _push(`<article${ssrRenderAttrs(mergeProps({
        class: "article-a",
        style: `background-image:url(${unref($cdn)}${__props.headerImages[0]})`
      }, _attrs))}><div class="bg-black pt-10 rounded-2xl bg-opacity-60"><div class="tags"><a href="javascript:;">${ssrInterpolate(__props.tag)}</a></div><header class="relative flex justify-center items-center flex-col px-4"><time class="flex items-center text-white capitalize"><i class="text-2xl iconfont">\uE8B4</i><span class="ml-2 text-sm">${ssrInterpolate(__props.time)}</span></time></header><main class="text-white text-center px-4"><h1 class="title py-2">`);
      _push(ssrRenderComponent(_component_nuxt_link, {
        to: "/tools" + __props.link
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.title)}`);
          } else {
            return [
              createTextVNode(toDisplayString$1(__props.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</h1><p class="text-opacity-60">${ssrInterpolate(__props.desciption)}</p></main><footer class="flex justify-between items-center mt-10"><a href="javascript:;" class="flex items-center"><span class="author-image" style="${ssrRenderStyle({ "background-image": "url('/avatar.jpg')" })}"></span><span class="author-name">meetqy</span></a><div class="text-white text-sm"><a href="javascript:;"><span class="mr-1">23719</span><i class="iconfont">\uE8F4</i></a><a href="javascript:;" class="ml-4"><span class="mr-1">23719</span><i class="iconfont">\uE8B5</i></a></div></footer></div></article>`);
    };
  }
});
const _sfc_setup$u = _sfc_main$u.setup;
_sfc_main$u.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/GridItemA.vue");
  return _sfc_setup$u ? _sfc_setup$u(props, ctx) : void 0;
};
const useStrapiVersion = () => {
  const config = useRuntimeConfig().public;
  return config.strapi.version;
};
const useStrapiToken = () => {
  const nuxtApp = useNuxtApp();
  const config = useRuntimeConfig().public;
  nuxtApp._cookies = nuxtApp._cookies || {};
  if (nuxtApp._cookies.strapi_jwt) {
    return nuxtApp._cookies.strapi_jwt;
  }
  const cookie = useCookie("strapi_jwt", config.strapi.cookie);
  nuxtApp._cookies.strapi_jwt = cookie;
  return cookie;
};
const defaultErrors = (err) => ({
  v4: {
    error: {
      status: 500,
      name: "UnknownError",
      message: err.message,
      details: err
    }
  },
  v3: {
    error: "UnknownError",
    message: err.message,
    statusCode: 500
  }
});
const useStrapiClient = () => {
  const nuxt = useNuxtApp();
  const baseURL2 = useStrapiUrl();
  const version = useStrapiVersion();
  const token = useStrapiToken();
  return async (url, fetchOptions = {}) => {
    const headers = {};
    if (token && token.value) {
      headers.Authorization = `Bearer ${token.value}`;
    }
    if (version === "v4" && fetchOptions.params) {
      url = `${url}?${stringify(fetchOptions.params, { encodeValuesOnly: true })}`;
      delete fetchOptions.params;
    }
    try {
      return await $fetch(url, __spreadProps(__spreadValues({
        retry: 0,
        baseURL: baseURL2
      }, fetchOptions), {
        headers: __spreadValues(__spreadValues({}, headers), fetchOptions.headers)
      }));
    } catch (err) {
      const e = err.data || defaultErrors(err)[version];
      nuxt.hooks.callHook("strapi:error", e);
      throw e;
    }
  };
};
const useStrapi4 = () => {
  const client = useStrapiClient();
  const version = useStrapiVersion();
  if (version !== "v4") {
    console.warn("useStrapi4 is only available for v4");
  }
  const find = (contentType, params) => {
    return client(`/${contentType}`, { method: "GET", params });
  };
  const findOne = (contentType, id, params) => {
    return client(`/${contentType}/${id}`, { method: "GET", params });
  };
  const create = (contentType, data) => {
    return client(`/${contentType}`, { method: "POST", body: { data } });
  };
  const update = (contentType, id, data) => {
    if (typeof id === "object") {
      data = id;
      id = void 0;
    }
    const path = [contentType, id].filter(Boolean).join("/");
    return client(path, { method: "PUT", body: { data } });
  };
  const _delete = (contentType, id) => {
    const path = [contentType, id].filter(Boolean).join("/");
    return client(path, { method: "DELETE" });
  };
  return {
    find,
    findOne,
    create,
    update,
    delete: _delete
  };
};
const _imports_0 = publicAssetsURL(`avatar.jpg`);
const index_vue_vue_type_style_index_0_scoped_true_lang$1 = "";
const meta$c = void 0;
const _sfc_main$t = /* @__PURE__ */ defineComponent({
  name: "W",
  __ssrInlineRender: true,
  props: {
    size: { default: 16 },
    class: null
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<svg${ssrRenderAttrs(mergeProps({
        t: "1653486614133",
        class: props.class,
        viewBox: "0 0 1024 1024",
        version: "1.1",
        xmlns: "http://www.w3.org/2000/svg",
        "p-id": "3234",
        width: props.size,
        height: props.size
      }, _attrs))}><path d="M928 64H672a32 32 0 0 0-32.00000001 32v327l-106.74-94.92000001a32 32 0 0 0-42.51999998 0L383.99999999 423V96a32 32 0 0 0-31.99999999-32H96a32 32 0 0 0-32 32v832a32 32 0 0 0 32 32h91.50000001a127.86000001 127.86000001 0 0 0 83.33999999-30.85l1.05-0.9L512 714.81000001l239.46000001 212.85999999a127.88 127.88 0 0 0 85 32.33H928a32 32 0 0 0 32-32V96a32 32 0 0 0-32-32z m-96 63.99999999h63.99999999v696.74000002l-58.54999999-52a987.37 987.37 0 0 1-222.34000001-286.27000002l163.63 145.45000001A32 32 0 0 0 832 608z m-128 0h64v408.74000002l-64-56.89000001zM187.49999999 896.00000001H127.99999999V127.99999999h64.00000001v764.37000001c0 1.16 0 2.32 0.13 3.45999999-1.54000001 0.11-3.08 0.17-4.62999999 0.17z m303.29000001-248.00000002h-0.04999999L256 856.74000001V127.99999999h64v526.22000002a32 32 0 0 0 53.21 23.99999998h0.05000001l95.99999998-85.35999998q13.88 25.59 29.08 50.27a31.86000001 31.86000001 0 0 0-7.56 4.99999999zM836.50000001 896.00000001a63.92 63.92 0 0 1-42.50000001-16.17000003l-55.75-49.53A987.52000001 987.52000001 0 0 1 510 532.50000001l-2.64-5.27000001a32 32 0 0 0-42.93-14.31 31.46000001 31.46000001 0 0 0-7 4.77000001L383.99999999 583v-74.41l118.04999999-104.93000001L552.00000001 503.53a1051.24 1051.24 0 0 0 242.94 317L879.83000001 896.00000001z" p-id="3235"></path></svg>`);
    };
  }
});
const _sfc_setup$t = _sfc_main$t.setup;
_sfc_main$t.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/W.vue");
  return _sfc_setup$t ? _sfc_setup$t(props, ctx) : void 0;
};
const Logo_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main$s = /* @__PURE__ */ defineComponent({
  name: "Logo",
  __ssrInlineRender: true,
  props: {
    showWeek: { type: Boolean, default: true }
  },
  setup(__props) {
    const props = __props;
    const { cao, week } = useTitle();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_W = _sfc_main$t;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-end" }, _attrs))} data-v-73662c7c><div class="flex items-center cursor-pointer logo" data-v-73662c7c><div class="w-12 h-12 rounded-full transition-all flex items-center justify-center" data-v-73662c7c>`);
      _push(ssrRenderComponent(_component_W, { size: 30 }, null, _parent));
      _push(`</div><div class="h-12 text-2xl uppercase inline-flex items-center px-2 rounded-full" data-v-73662c7c><span class="font-serif font-semibold" data-v-73662c7c>${ssrInterpolate(unref(cao))} `);
      if (props.showWeek) {
        _push(`<i data-v-73662c7c>\uFF0C</i>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</span></div></div>`);
      if (props.showWeek) {
        _push(`<div class="inline-flex h-12 items-center text-white text-2xl" data-v-73662c7c><span class="text-yellow-400" data-v-73662c7c>\u4ECA\u5929\u661F\u671F${ssrInterpolate(unref(week))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$s = _sfc_main$s.setup;
_sfc_main$s.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Logo.vue");
  return _sfc_setup$s ? _sfc_setup$s(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["__scopeId", "data-v-73662c7c"]]);
const atomOneDark = "";
const meta$b = void 0;
const meta$a = void 0;
const a1 = `
<div class="max-w-2xl px-8 py-4 mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800">
  <div class="flex items-center justify-between">
    <span class="text-sm font-light text-gray-600 dark:text-gray-400">Mar 10, 2019</span>
    <a class="px-3 py-1 text-sm font-bold text-gray-100 transition-colors duration-200 transform bg-gray-600 rounded cursor-pointer hover:bg-gray-500">Design</a>
  </div>

  <div class="mt-2">
    <a href="#" class="text-2xl font-bold text-gray-700 dark:text-white hover:text-gray-600 dark:hover:text-gray-200 hover:underline">Accessibility tools for designers and developers</a>
    <p class="mt-2 text-gray-600 dark:text-gray-300">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!</p>
  </div>

  <div class="flex items-center justify-between mt-4">
    <a href="#" class="text-blue-600 dark:text-blue-400 hover:underline">Read more</a>

    <div class="flex items-center">
      <img class="hidden object-cover w-10 h-10 mx-4 rounded-full sm:block" src="https://images.unsplash.com/photo-1502980426475-b83966705988?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=40&q=80" alt="avatar">
      <a class="font-bold text-gray-700 cursor-pointer dark:text-gray-200">Khatab wedaa</a>
    </div>
  </div>
</div>
`;
const a2 = `
<div class="w-full max-w-sm px-4 py-3 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800">
  <div class="flex items-center justify-between">
    <span class="text-sm font-light text-gray-800 dark:text-gray-400">Courses and MOOCs</span>
    <span class="px-3 py-1 text-xs text-blue-800 uppercase bg-blue-200 rounded-full dark:bg-blue-300 dark:text-blue-900">psychology</span>
  </div>

  <div>
    <h1 class="mt-2 text-lg font-semibold text-gray-800 dark:text-white">AP\xAE Psychology - Course 5: Health and Behavior</h1>
    <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odio eligendi similique exercitationem optio libero vitae accusamus cupiditate laborum eos.</p>
  </div>

  <div>
    <div class="flex items-center mt-2 text-gray-700 dark:text-gray-200">
      <span>Visit on:</span>
      <a class="mx-2 text-blue-600 cursor-pointer dark:text-blue-400 hover:underline">edx.org</a>
      <span>or</span>
      <a class="mx-2 text-blue-600 cursor-pointer dark:text-blue-400 hover:underline">classcentral.com</a>
    </div>

    <div class="flex items-center justify-center mt-4">
      <a class="mr-2 text-gray-800 cursor-pointer dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
        <svg class="w-5 h-5 fill-current" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
          <path d='M496,109.5a201.8,201.8,0,0,1-56.55,15.3,97.51,97.51,0,0,0,43.33-53.6,197.74,197.74,0,0,1-62.56,23.5A99.14,99.14,0,0,0,348.31,64c-54.42,0-98.46,43.4-98.46,96.9a93.21,93.21,0,0,0,2.54,22.1,280.7,280.7,0,0,1-203-101.3A95.69,95.69,0,0,0,36,130.4C36,164,53.53,193.7,80,211.1A97.5,97.5,0,0,1,35.22,199v1.2c0,47,34,86.1,79,95a100.76,100.76,0,0,1-25.94,3.4,94.38,94.38,0,0,1-18.51-1.8c12.51,38.5,48.92,66.5,92.05,67.3A199.59,199.59,0,0,1,39.5,405.6,203,203,0,0,1,16,404.2,278.68,278.68,0,0,0,166.74,448c181.36,0,280.44-147.7,280.44-275.8,0-4.2-.11-8.4-.31-12.5A198.48,198.48,0,0,0,496,109.5Z' />
        </svg>
      </a>

      <a class="mr-2 text-gray-800 cursor-pointer dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
        <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.8283 12L16.2426 13.4142L19.071 10.5858C20.6331 9.02365 20.6331 6.49099 19.071 4.9289C17.5089 3.3668 14.9762 3.3668 13.4141 4.9289L10.5857 7.75732L11.9999 9.17154L14.8283 6.34311C15.6094 5.56206 16.8757 5.56206 17.6568 6.34311C18.4378 7.12416 18.4378 8.39049 17.6568 9.17154L14.8283 12Z" />
          <path d="M12 14.8285L13.4142 16.2427L10.5858 19.0711C9.02365 20.6332 6.49099 20.6332 4.9289 19.0711C3.3668 17.509 3.3668 14.9764 4.9289 13.4143L7.75732 10.5858L9.17154 12L6.34311 14.8285C5.56206 15.6095 5.56206 16.8758 6.34311 17.6569C7.12416 18.4379 8.39049 18.4379 9.17154 17.6569L12 14.8285Z" />
          <path d="M14.8284 10.5857C15.2189 10.1952 15.2189 9.56199 14.8284 9.17147C14.4379 8.78094 13.8047 8.78094 13.4142 9.17147L9.17154 13.4141C8.78101 13.8046 8.78101 14.4378 9.17154 14.8283C9.56206 15.2188 10.1952 15.2188 10.5857 14.8283L14.8284 10.5857Z" />
        </svg>
      </a>
    </div>
  </div>
</div>
`;
const a = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  a1,
  a2
}, Symbol.toStringTag, { value: "Module" }));
const index_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main$r = /* @__PURE__ */ defineComponent({
  name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const temps = ref([
      {
        html: a2,
        preview: true
      },
      {
        html: a1,
        preview: true
      }
    ]);
    const showCode = (index2) => {
      const item = temps.value[index2];
      item.preview = !item.preview;
      if (!item.preview) {
        hljs.highlightBlock(document.querySelector("#pre-" + index2));
      }
    };
    const curTemp = ref(0);
    const onChange = (y) => {
      asideFixed.value = y > 150;
    };
    const asideFixed = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0$1;
      const _component_Logo = __nuxt_component_1;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({ onChange }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<main class="main-content flex" data-v-f9d32580${_scopeId}><aside class="${ssrRenderClass([
              { fixed: asideFixed.value },
              "top-0 w-96 flex-shrink-0 max-h-screen hidden lg:flex flex-col z-10 "
            ])}" data-v-f9d32580${_scopeId}><section class="${ssrRenderClass([{ hidden: !asideFixed.value }, "w-full lg:pr-10 my-5"])}" data-v-f9d32580${_scopeId}><div class="p-2 h-min rounded-box" data-v-f9d32580${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Logo, null, null, _parent2, _scopeId));
            _push2(`</div></section><section class="w-full lg:pr-10" data-v-f9d32580${_scopeId}><ul class="menu bg-base-100 p-2 w-full h-min rounded-box" data-v-f9d32580${_scopeId}><li class="menu-title py-2" data-v-f9d32580${_scopeId}><span data-v-f9d32580${_scopeId}>List</span></li><!--[-->`);
            ssrRenderList(temps.value, (item, index2) => {
              _push2(`<li class="text-xl" data-v-f9d32580${_scopeId}><a${ssrRenderAttr("href", "#card-a" + index2)} class="${ssrRenderClass({
                active: curTemp.value === index2,
                capitalize: curTemp.value === index2
              })}" data-v-f9d32580${_scopeId}>${ssrInterpolate(index2 + 1)} . card </a></li>`);
            });
            _push2(`<!--]--></ul></section></aside><aside class="w-96 flex-shrink-0 opacity-0 hidden lg:flex" style="${ssrRenderStyle(asideFixed.value ? null : { display: "none" })}" data-v-f9d32580${_scopeId}></aside><div class="flex-1 relative overflow-hidden px-5 bg-base-100 py-10 rounded-box prose" data-v-f9d32580${_scopeId}><h1 data-v-f9d32580${_scopeId}>Tailwind CSS - Card</h1><p data-v-f9d32580${_scopeId}> \u6536\u96C6\u7684\u4E00\u4E9B<code data-v-f9d32580${_scopeId}>Card</code>\u6837\u5F0F\uFF0C\u6240\u6709\u7684\u6A21\u677F\u5747\u6539\u9020\u4E3A <code data-v-f9d32580${_scopeId}>DaisyUI</code> \u4E3B\u9898\u6837\u5F0F\uFF0C\u53EF\u4EE5\u5B8C\u7F8E\u652F\u6301\u4E3B\u9898\u5207\u6362\u3002 </p><!--[-->`);
            ssrRenderList(temps.value, (item, index2) => {
              _push2(`<div class="mockup-window border bg-base-300 w-full mb-8"${ssrRenderAttr("id", "card-a" + index2)} data-v-f9d32580${_scopeId}><div class="${ssrRenderClass([{ "btn-outline": item.preview }, "btn btn-sm btn-square btn-primary absolute right-8 top-2 gap-2"])}" data-v-f9d32580${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-f9d32580${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" data-v-f9d32580${_scopeId}></path></svg></div><div class="flex justify-center px-4 lg:pt-16 lg:pb-10 pt-8 pb-5 bg-base-200" data-v-f9d32580${_scopeId}>${item.html}</div><pre class="bg-base-200 px-4" style="${ssrRenderStyle(!item.preview ? null : { display: "none" })}" data-v-f9d32580${_scopeId}>            <code${ssrRenderAttr("id", "pre-" + index2)} class="rounded-box" data-v-f9d32580${_scopeId}>${ssrInterpolate(item.html)}</code>
          </pre></div>`);
            });
            _push2(`<!--]--></div></main>`);
          } else {
            return [
              createVNode("main", { class: "main-content flex" }, [
                createVNode("aside", {
                  class: [
                    { fixed: asideFixed.value },
                    "top-0 w-96 flex-shrink-0 max-h-screen hidden lg:flex flex-col z-10 "
                  ]
                }, [
                  createVNode("section", {
                    class: ["w-full lg:pr-10 my-5", { hidden: !asideFixed.value }]
                  }, [
                    createVNode("div", { class: "p-2 h-min rounded-box" }, [
                      createVNode(_component_Logo)
                    ])
                  ], 2),
                  createVNode("section", { class: "w-full lg:pr-10" }, [
                    createVNode("ul", { class: "menu bg-base-100 p-2 w-full h-min rounded-box" }, [
                      createVNode("li", { class: "menu-title py-2" }, [
                        createVNode("span", null, "List")
                      ]),
                      (openBlock(true), createBlock(Fragment$1, null, renderList(temps.value, (item, index2) => {
                        return openBlock(), createBlock("li", {
                          class: "text-xl",
                          key: index2,
                          onClick: ($event) => curTemp.value = index2
                        }, [
                          createVNode("a", {
                            href: "#card-a" + index2,
                            class: {
                              active: curTemp.value === index2,
                              capitalize: curTemp.value === index2
                            }
                          }, toDisplayString$1(index2 + 1) + " . card ", 11, ["href"])
                        ], 8, ["onClick"]);
                      }), 128))
                    ])
                  ])
                ], 2),
                withDirectives(createVNode("aside", { class: "w-96 flex-shrink-0 opacity-0 hidden lg:flex" }, null, 512), [
                  [vShow, asideFixed.value]
                ]),
                createVNode("div", { class: "flex-1 relative overflow-hidden px-5 bg-base-100 py-10 rounded-box prose" }, [
                  createVNode("h1", null, "Tailwind CSS - Card"),
                  createVNode("p", null, [
                    createTextVNode(" \u6536\u96C6\u7684\u4E00\u4E9B"),
                    createVNode("code", null, "Card"),
                    createTextVNode("\u6837\u5F0F\uFF0C\u6240\u6709\u7684\u6A21\u677F\u5747\u6539\u9020\u4E3A "),
                    createVNode("code", null, "DaisyUI"),
                    createTextVNode(" \u4E3B\u9898\u6837\u5F0F\uFF0C\u53EF\u4EE5\u5B8C\u7F8E\u652F\u6301\u4E3B\u9898\u5207\u6362\u3002 ")
                  ]),
                  (openBlock(true), createBlock(Fragment$1, null, renderList(temps.value, (item, index2) => {
                    return openBlock(), createBlock("div", {
                      class: "mockup-window border bg-base-300 w-full mb-8",
                      id: "card-a" + index2,
                      key: index2
                    }, [
                      createVNode("div", {
                        class: ["btn btn-sm btn-square btn-primary absolute right-8 top-2 gap-2", { "btn-outline": item.preview }],
                        onClick: ($event) => showCode(index2)
                      }, [
                        (openBlock(), createBlock("svg", {
                          xmlns: "http://www.w3.org/2000/svg",
                          class: "h-6 w-6",
                          fill: "none",
                          viewBox: "0 0 24 24",
                          stroke: "currentColor",
                          "stroke-width": "2"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            d: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                          })
                        ]))
                      ], 10, ["onClick"]),
                      createVNode("div", {
                        class: "flex justify-center px-4 lg:pt-16 lg:pb-10 pt-8 pb-5 bg-base-200",
                        innerHTML: item.html
                      }, null, 8, ["innerHTML"]),
                      withDirectives(createVNode("pre", { class: "bg-base-200 px-4" }, [
                        createTextVNode("            "),
                        createVNode("code", {
                          id: "pre-" + index2,
                          class: "rounded-box"
                        }, toDisplayString$1(item.html), 9, ["id"]),
                        createTextVNode("\n          ")
                      ], 512), [
                        [vShow, !item.preview]
                      ])
                    ], 8, ["id"]);
                  }), 128))
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$r = _sfc_main$r.setup;
_sfc_main$r.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/template/cards/index.vue");
  return _sfc_setup$r ? _sfc_setup$r(props, ctx) : void 0;
};
const meta$9 = void 0;
const meta$8 = void 0;
const meta$7 = void 0;
const useJsonToLanguage = async (lang, value) => {
  const res = await $fetch("/api/tools/jsonToLanguage", {
    method: "post",
    body: {
      lang,
      typeName: "Hello",
      jsonString: value
    }
  });
  return res.join("\n");
};
const useJsonDefaultValue = () => {
  const _ = JSON.stringify({
    name: "\u5F20\u4E09"
  });
  try {
    return localStorage.getItem("json-to-language") || _;
  } catch (e) {
    return _;
  }
};
const allLanguage = [
  {
    className: "bg-gradient-to-r from-green-400 to-blue-500 language text-white",
    name: "Dart",
    language: "dart",
    mode: "dart"
  },
  {
    className: "text-white language bg-blue-500",
    name: "TS",
    language: "typescript",
    mode: "application/typescript"
  },
  {
    name: "{\u221Ax}",
    className: "bg-white language text-black",
    language: "json-schema",
    mode: "application/ld+json"
  },
  {
    name: "Mock",
    className: "bg-green-600 language text-white",
    language: "mockjs",
    mode: "application/ld+json"
  }
];
const codemirror = "";
const mdnLike = "";
const simplescrollbars = "";
const Editor_vue_vue_type_style_index_0_lang = "";
const Editor_vue_vue_type_style_index_1_scoped_true_lang = "";
const _sfc_main$q = /* @__PURE__ */ defineComponent({
  name: "Editor",
  __ssrInlineRender: true,
  props: {
    jsonValue: null,
    codeOption: null
  },
  emits: ["change"],
  setup(__props, { emit }) {
    const props = __props;
    watch(() => props.jsonValue, (val) => setJsonMirror(val));
    watch(props.codeOption, (val) => setCodeMirror(val));
    const { $codemirror } = useNuxtApp();
    const language = allLanguage;
    const curLanguageIndex = computed(() => {
      let lang = useRoute().path.replace("/tools/json-to-language/", "");
      if (lang === "/tools/json-to-language")
        lang = "dart";
      return language.findIndex((item) => item.language === lang);
    });
    const jsonEditorElement = ref();
    const langEditorElement = ref();
    let _jsonCodeMirror = null;
    let _langCodeMirror = null;
    const setJsonMirror = (code) => {
      if (!code)
        return;
      _jsonCodeMirror.setValue(jsonFormat(JSON.parse(code)));
      setTimeout(() => {
        _jsonCodeMirror.refresh();
      }, 50);
    };
    const setCodeMirror = async (codeOption) => {
      _langCodeMirror.setValue(codeOption.code);
      setTimeout(() => {
        _langCodeMirror.refresh();
      }, 50);
    };
    let t;
    onMounted(async () => {
      _jsonCodeMirror = $codemirror(jsonEditorElement.value, {
        mode: "application/ld+json",
        theme: "mdn-like",
        scrollbarStyle: "overlay",
        lineNumbers: true
      });
      _langCodeMirror = $codemirror(langEditorElement.value, {
        mode: language[curLanguageIndex.value].mode,
        theme: "mdn-like",
        lineNumbers: true,
        scrollbarStyle: "overlay",
        innerHeight: "auto"
      });
      setJsonMirror(props.jsonValue);
      setCodeMirror(props.codeOption);
      _jsonCodeMirror.on("change", async (e) => {
        if (t) {
          clearTimeout(t);
        }
        t = setTimeout(() => {
          emit("change", e);
        }, 1e3);
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0$1;
      const _component_nuxt_link = __nuxt_component_1$2;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({ name: "tools" }, _attrs), {
        title: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` to ${ssrInterpolate(unref(curLanguageIndex) > -1 && unref(language)[unref(curLanguageIndex)].language)}`);
          } else {
            return [
              createTextVNode(" to " + toDisplayString$1(unref(curLanguageIndex) > -1 && unref(language)[unref(curLanguageIndex)].language), 1)
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="hidden lg:block" data-v-40230bd6${_scopeId}><main class="json-to-language flex" data-v-40230bd6${_scopeId}><div class="w-2/5" data-v-40230bd6${_scopeId}></div><div class="w-16 flex-shrink-0 bg-white bg-opacity-50 border-r-8 border-r-white border-y-8 border-y-orange-600 flex flex-col items-center" data-v-40230bd6${_scopeId}><!--[-->`);
            ssrRenderList(unref(language), (item, index2) => {
              _push2(ssrRenderComponent(_component_nuxt_link, {
                key: item.name,
                to: "/tools/json-to-language/" + item.language
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="${ssrRenderClass([item.className, { active: unref(curLanguageIndex) === index2 }])}" data-v-40230bd6${_scopeId2}>${ssrInterpolate(item.name)}</div>`);
                  } else {
                    return [
                      createVNode("div", {
                        class: [item.className, { active: unref(curLanguageIndex) === index2 }]
                      }, toDisplayString$1(item.name), 3)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div><div class="flex-1 lang-editor" data-v-40230bd6${_scopeId}></div></main></div><div class="prose flex justify-center items-center h-full lg:hidden" data-v-40230bd6${_scopeId}><h2 class="text-white" data-v-40230bd6${_scopeId}>\u5DE5\u5177\u7C7B\u4E0D\u9002\u5408\u5728\u624B\u673A\u7AEF\u4E0A\u663E\u793A</h2></div>`);
          } else {
            return [
              createVNode("div", { class: "hidden lg:block" }, [
                createVNode("main", { class: "json-to-language flex" }, [
                  createVNode("div", {
                    ref_key: "jsonEditorElement",
                    ref: jsonEditorElement,
                    class: "w-2/5"
                  }, null, 512),
                  createVNode("div", { class: "w-16 flex-shrink-0 bg-white bg-opacity-50 border-r-8 border-r-white border-y-8 border-y-orange-600 flex flex-col items-center" }, [
                    (openBlock(true), createBlock(Fragment$1, null, renderList(unref(language), (item, index2) => {
                      return openBlock(), createBlock(_component_nuxt_link, {
                        key: item.name,
                        to: "/tools/json-to-language/" + item.language
                      }, {
                        default: withCtx(() => [
                          createVNode("div", {
                            class: [item.className, { active: unref(curLanguageIndex) === index2 }]
                          }, toDisplayString$1(item.name), 3)
                        ]),
                        _: 2
                      }, 1032, ["to"]);
                    }), 128))
                  ]),
                  createVNode("div", {
                    class: "flex-1 lang-editor",
                    ref_key: "langEditorElement",
                    ref: langEditorElement
                  }, null, 512)
                ])
              ]),
              createVNode("div", { class: "prose flex justify-center items-center h-full lg:hidden" }, [
                createVNode("h2", { class: "text-white" }, "\u5DE5\u5177\u7C7B\u4E0D\u9002\u5408\u5728\u624B\u673A\u7AEF\u4E0A\u663E\u793A")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$q = _sfc_main$q.setup;
_sfc_main$q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Editor.vue");
  return _sfc_setup$q ? _sfc_setup$q(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["__scopeId", "data-v-40230bd6"]]);
const _sfc_main$p = /* @__PURE__ */ defineComponent({
  name: "dart",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      titleTemplate: `JSON\u5728\u7EBF\u8F6C\u6362\u5DE5\u5177(to dart) - ${useTitle().title}`,
      meta: [
        {
          name: "description",
          content: "json\u8F6C\u6362\u4E3Adart class, json transform to dart"
        }
      ]
    });
    const change = async (e) => {
      jsonValue.value = e.getValue();
      const code = await useJsonToLanguage(useRoute().path.replace("/tools/json-to-language/", ""), jsonValue.value);
      localStorage.setItem("json-to-language", jsonValue.value);
      codeOption.code = code;
    };
    const jsonValue = ref(useJsonDefaultValue());
    watch(() => useRoute(), (e) => {
      jsonValue.value = useJsonDefaultValue();
    });
    const codeOption = reactive({
      code: "",
      codeMirrorMode: "dart"
    });
    onMounted(async () => {
      const code = await useJsonToLanguage(useRoute().path.replace("/tools/json-to-language/", ""), jsonValue.value);
      codeOption.code = code;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Editor = __nuxt_component_0;
      _push(ssrRenderComponent(_component_Editor, mergeProps({
        onChange: change,
        "json-value": jsonValue.value,
        "code-option": codeOption
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$p = _sfc_main$p.setup;
_sfc_main$p.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/json-to-language/dart.vue");
  return _sfc_setup$p ? _sfc_setup$p(props, ctx) : void 0;
};
const meta$6 = void 0;
const _sfc_main$o = /* @__PURE__ */ defineComponent({
  name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      titleTemplate: `JSON\u5728\u7EBF\u8F6C\u6362\u5DE5\u5177(to dart) - ${useTitle().title}`,
      meta: [
        {
          name: "description",
          content: "json\u8F6C\u6362\u4E3Adart class, json transform to dart"
        }
      ]
    });
    const change = async (e) => {
      jsonValue.value = e.getValue();
      const code = await useJsonToLanguage("dart", jsonValue.value);
      localStorage.setItem("json-to-language", jsonValue.value);
      codeOption.code = code;
    };
    const jsonValue = ref(useJsonDefaultValue());
    watch(() => useRoute(), (e) => {
      jsonValue.value = useJsonDefaultValue();
    });
    const codeOption = reactive({
      code: "",
      codeMirrorMode: "dart"
    });
    onMounted(async () => {
      const code = await useJsonToLanguage("dart", jsonValue.value);
      codeOption.code = code;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Editor = __nuxt_component_0;
      _push(ssrRenderComponent(_component_Editor, mergeProps({
        onChange: change,
        "json-value": jsonValue.value,
        "code-option": codeOption
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/json-to-language/index.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const meta$5 = void 0;
const _sfc_main$n = /* @__PURE__ */ defineComponent({
  name: "json-schema",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      titleTemplate: `JSON\u5728\u7EBF\u8F6C\u6362\u5DE5\u5177(to json-schema) - ${useTitle().title}`,
      meta: [
        {
          name: "description",
          content: "json\u8F6C\u6362json-schema, json transform to json-schema"
        }
      ]
    });
    const change = async (e) => {
      jsonValue.value = e.getValue();
      localStorage.setItem("json-to-language", jsonValue.value);
      codeOption.code = formatJson(jsonValue.value);
    };
    const jsonValue = ref(useJsonDefaultValue());
    watch(() => useRoute(), (e) => {
      jsonValue.value = useJsonDefaultValue();
    });
    const codeOption = reactive({
      code: "",
      codeMirrorMode: "dart"
    });
    onMounted(async () => {
      codeOption.code = formatJson(jsonValue.value);
    });
    const formatJson = (value) => {
      const res = toJsonSchema(JSON.parse(value));
      return jsonFormat(res);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Editor = __nuxt_component_0;
      _push(ssrRenderComponent(_component_Editor, mergeProps({
        onChange: change,
        "json-value": jsonValue.value,
        "code-option": codeOption
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/json-to-language/json-schema.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const meta$4 = void 0;
function useJsontoMock(json) {
  let str = "";
  for (let k in json) {
    const v = json[k];
    if (v.type === "array") {
      if (v.items.type === "object") {
        str += `"${k}|0-10": [${useJsontoMock(v.items.properties)}],`;
      }
      if (v.items.type === "string") {
        str += `"${k}|0-10": ["@cword(2,10)"],`;
      }
    } else if (v.type === "string") {
      str += `"${k}": "@cword(2,10)",`;
    } else if (v.type === "integer") {
      str += `"${k}": "@integer(0,10000)",`;
    } else if (v.type === "boolean") {
      str += `"${k}": "@boolean",`;
    } else {
      str += `"${k}": "${v.type}",`;
    }
  }
  return `{${str}}`.replaceAll(",}", "}");
}
const jsonToMock = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  useJsontoMock
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$m = /* @__PURE__ */ defineComponent({
  name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      titleTemplate: `JSON\u5728\u7EBF\u8F6C\u6362\u5DE5\u5177(to mockjs) - ${useTitle().title}`,
      meta: [
        {
          name: "description",
          content: "json\u8F6C\u6362mockjs, json transform to mockjs"
        }
      ]
    });
    const change = async (e) => {
      jsonValue.value = e.getValue();
      codeOption.code = toMockjs(jsonValue.value);
    };
    const jsonValue = ref(useJsonDefaultValue());
    watch(() => useRoute(), (e) => {
      jsonValue.value = useJsonDefaultValue();
    });
    const codeOption = reactive({
      code: "",
      codeMirrorMode: "mockjs"
    });
    onMounted(async () => {
      codeOption.code = toMockjs(jsonValue.value);
    });
    const toMockjs = (value) => {
      const res = toJsonSchema(JSON.parse(value));
      const str = useJsontoMock(res.properties);
      console.log(str);
      return jsonFormat(JSON.parse(str));
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Editor = __nuxt_component_0;
      _push(ssrRenderComponent(_component_Editor, mergeProps({
        onChange: change,
        "json-value": jsonValue.value,
        "code-option": codeOption
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/json-to-language/mockjs/index.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const meta$3 = void 0;
const meta$2 = void 0;
const _sfc_main$l = /* @__PURE__ */ defineComponent({
  name: "typescript",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      titleTemplate: `JSON\u5728\u7EBF\u8F6C\u6362\u5DE5\u5177(to typescript) - ${useTitle().title}`,
      meta: [
        {
          name: "description",
          content: "json\u8F6C\u6362\u4E3Atypescript, json transform to typescript"
        }
      ]
    });
    const change = async (e) => {
      jsonValue.value = e.getValue();
      const code = await useJsonToLanguage(useRoute().path.replace("/tools/json-to-language/", ""), jsonValue.value);
      localStorage.setItem("json-to-language", jsonValue.value);
      codeOption.code = code;
    };
    const jsonValue = ref(useJsonDefaultValue());
    watch(() => useRoute(), (e) => {
      jsonValue.value = useJsonDefaultValue();
    });
    const codeOption = reactive({
      code: "",
      codeMirrorMode: "dart"
    });
    onMounted(async () => {
      const code = await useJsonToLanguage(useRoute().path.replace("/tools/json-to-language/", ""), jsonValue.value);
      codeOption.code = code;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Editor = __nuxt_component_0;
      _push(ssrRenderComponent(_component_Editor, mergeProps({
        onChange: change,
        "json-value": jsonValue.value,
        "code-option": codeOption
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/json-to-language/typescript.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const meta$1 = void 0;
const meta = void 0;
const routes = [
  {
    name: "index",
    path: "/",
    file: "/Users/meetqy/Desktop/my-template/nuxt-wcao.cc/pages/index/index.vue",
    children: [],
    meta: meta$c,
    alias: (meta$c == null ? void 0 : meta$c.alias) || [],
    component: () => Promise.resolve().then(function() {
      return index$9;
    })
  },
  {
    name: "posts-id",
    path: "/posts/:id",
    file: "/Users/meetqy/Desktop/my-template/nuxt-wcao.cc/pages/posts/[id].vue",
    children: [],
    meta: meta$b,
    alias: (meta$b == null ? void 0 : meta$b.alias) || [],
    component: () => Promise.resolve().then(function() {
      return _id_;
    })
  },
  {
    name: "template-cards-a",
    path: "/template/cards/a",
    file: "/Users/meetqy/Desktop/my-template/nuxt-wcao.cc/pages/template/cards/a.js",
    children: [],
    meta: meta$a,
    alias: (meta$a == null ? void 0 : meta$a.alias) || [],
    component: () => Promise.resolve().then(function() {
      return a;
    })
  },
  {
    name: "template-cards",
    path: "/template/cards",
    file: "/Users/meetqy/Desktop/my-template/nuxt-wcao.cc/pages/template/cards/index.vue",
    children: [],
    meta: meta$9,
    alias: (meta$9 == null ? void 0 : meta$9.alias) || [],
    component: () => Promise.resolve().then(function() {
      return index$7;
    })
  },
  {
    name: "tools-image-space",
    path: "/tools/image-space",
    file: "/Users/meetqy/Desktop/my-template/nuxt-wcao.cc/pages/tools/image-space/index.vue",
    children: [],
    meta: meta$8,
    alias: (meta$8 == null ? void 0 : meta$8.alias) || [],
    component: () => Promise.resolve().then(function() {
      return index$5;
    })
  },
  {
    name: "tools-index",
    path: "/tools",
    file: "/Users/meetqy/Desktop/my-template/nuxt-wcao.cc/pages/tools/index/index.vue",
    children: [],
    meta: meta$7,
    alias: (meta$7 == null ? void 0 : meta$7.alias) || [],
    component: () => Promise.resolve().then(function() {
      return index$4;
    })
  },
  {
    name: "tools-json-to-language-dart",
    path: "/tools/json-to-language/dart",
    file: "/Users/meetqy/Desktop/my-template/nuxt-wcao.cc/pages/tools/json-to-language/dart.vue",
    children: [],
    meta: meta$6,
    alias: (meta$6 == null ? void 0 : meta$6.alias) || [],
    component: () => Promise.resolve().then(function() {
      return dart;
    })
  },
  {
    name: "tools-json-to-language",
    path: "/tools/json-to-language",
    file: "/Users/meetqy/Desktop/my-template/nuxt-wcao.cc/pages/tools/json-to-language/index.vue",
    children: [],
    meta: meta$5,
    alias: (meta$5 == null ? void 0 : meta$5.alias) || [],
    component: () => Promise.resolve().then(function() {
      return index$2;
    })
  },
  {
    name: "tools-json-to-language-json-schema",
    path: "/tools/json-to-language/json-schema",
    file: "/Users/meetqy/Desktop/my-template/nuxt-wcao.cc/pages/tools/json-to-language/json-schema.vue",
    children: [],
    meta: meta$4,
    alias: (meta$4 == null ? void 0 : meta$4.alias) || [],
    component: () => Promise.resolve().then(function() {
      return jsonSchema;
    })
  },
  {
    name: "tools-json-to-language-mockjs",
    path: "/tools/json-to-language/mockjs",
    file: "/Users/meetqy/Desktop/my-template/nuxt-wcao.cc/pages/tools/json-to-language/mockjs/index.vue",
    children: [],
    meta: meta$3,
    alias: (meta$3 == null ? void 0 : meta$3.alias) || [],
    component: () => Promise.resolve().then(function() {
      return index$1;
    })
  },
  {
    name: "tools-json-to-language-mockjs-jsonToMock",
    path: "/tools/json-to-language/mockjs/jsonToMock",
    file: "/Users/meetqy/Desktop/my-template/nuxt-wcao.cc/pages/tools/json-to-language/mockjs/jsonToMock.ts",
    children: [],
    meta: meta$2,
    alias: (meta$2 == null ? void 0 : meta$2.alias) || [],
    component: () => Promise.resolve().then(function() {
      return jsonToMock;
    })
  },
  {
    name: "tools-json-to-language-typescript",
    path: "/tools/json-to-language/typescript",
    file: "/Users/meetqy/Desktop/my-template/nuxt-wcao.cc/pages/tools/json-to-language/typescript.vue",
    children: [],
    meta: meta$1,
    alias: (meta$1 == null ? void 0 : meta$1.alias) || [],
    component: () => Promise.resolve().then(function() {
      return typescript;
    })
  },
  {
    name: "tools-parsing-video",
    path: "/tools/parsing-video",
    file: "/Users/meetqy/Desktop/my-template/nuxt-wcao.cc/pages/tools/parsing-video/index.vue",
    children: [],
    meta,
    alias: (meta == null ? void 0 : meta.alias) || [],
    component: () => Promise.resolve().then(function() {
      return index;
    })
  }
];
const configRouterOptions = {};
const routerOptions = __spreadValues({}, configRouterOptions);
const globalMiddleware = [];
const namedMiddleware = {};
const _6bc72fcf = defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.component("NuxtPage", NuxtPage);
  nuxtApp.vueApp.component("NuxtNestedPage", NuxtPage);
  nuxtApp.vueApp.component("NuxtChild", NuxtPage);
  const baseURL2 = useRuntimeConfig().app.baseURL;
  const routerHistory = vueRouter_cjs_prod.createMemoryHistory(baseURL2);
  const initialURL = nuxtApp.ssrContext.url;
  const router = vueRouter_cjs_prod.createRouter(__spreadProps(__spreadValues({}, routerOptions), {
    history: routerHistory,
    routes
  }));
  nuxtApp.vueApp.use(router);
  const previousRoute = shallowRef(router.currentRoute.value);
  router.afterEach((_to, from) => {
    previousRoute.value = from;
  });
  Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
    get: () => previousRoute.value
  });
  const route = {};
  for (const key in router.currentRoute.value) {
    route[key] = computed(() => router.currentRoute.value[key]);
  }
  const _activeRoute = shallowRef(router.resolve(initialURL));
  const syncCurrentRoute = () => {
    _activeRoute.value = router.currentRoute.value;
  };
  nuxtApp.hook("page:finish", syncCurrentRoute);
  router.afterEach((to, from) => {
    var _a, _b, _c, _d;
    if (((_b = (_a = to.matched[0]) == null ? void 0 : _a.components) == null ? void 0 : _b.default) === ((_d = (_c = from.matched[0]) == null ? void 0 : _c.components) == null ? void 0 : _d.default)) {
      syncCurrentRoute();
    }
  });
  const activeRoute = {};
  for (const key in _activeRoute.value) {
    activeRoute[key] = computed(() => _activeRoute.value[key]);
  }
  nuxtApp._route = reactive(route);
  nuxtApp._activeRoute = reactive(activeRoute);
  nuxtApp._middleware = nuxtApp._middleware || {
    global: [],
    named: {}
  };
  useError();
  router.afterEach(async (to) => {
    if (to.matched.length === 0) {
      callWithNuxt(nuxtApp, throwError, [createError({
        statusCode: 404,
        statusMessage: `Page not found: ${to.fullPath}`
      })]);
    } else if (to.matched[0].name === "404" && nuxtApp.ssrContext) {
      nuxtApp.ssrContext.res.statusCode = 404;
    }
  });
  try {
    if (true) {
      await router.push(initialURL);
    }
    await router.isReady();
  } catch (error2) {
    callWithNuxt(nuxtApp, throwError, [error2]);
  }
  router.beforeEach(async (to, from) => {
    var _a;
    to.meta = reactive(to.meta);
    nuxtApp._processingMiddleware = true;
    const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
    for (const component of to.matched) {
      const componentMiddleware = component.meta.middleware;
      if (!componentMiddleware) {
        continue;
      }
      if (Array.isArray(componentMiddleware)) {
        for (const entry2 of componentMiddleware) {
          middlewareEntries.add(entry2);
        }
      } else {
        middlewareEntries.add(componentMiddleware);
      }
    }
    for (const entry2 of middlewareEntries) {
      const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await ((_a = namedMiddleware[entry2]) == null ? void 0 : _a.call(namedMiddleware).then((r) => r.default || r)) : entry2;
      const result = await callWithNuxt(nuxtApp, middleware, [to, from]);
      {
        if (result === false || result instanceof Error) {
          const error2 = result || createError({
            statusMessage: `Route navigation aborted: ${initialURL}`
          });
          return callWithNuxt(nuxtApp, throwError, [error2]);
        }
      }
      if (result || result === false) {
        return result;
      }
    }
  });
  router.afterEach(async (to) => {
    delete nuxtApp._processingMiddleware;
    {
      const currentURL = to.fullPath || "/";
      if (!isEqual(currentURL, initialURL)) {
        await callWithNuxt(nuxtApp, navigateTo, [currentURL]);
      }
    }
  });
  nuxtApp.hooks.hookOnce("app:created", async () => {
    try {
      await router.replace(__spreadProps(__spreadValues({}, router.resolve(initialURL)), {
        force: true
      }));
    } catch (error2) {
      callWithNuxt(nuxtApp, throwError, [error2]);
    }
  });
  return { provide: { router } };
});
const useStrapiUser = () => useState("strapi_user");
const useStrapiAuth = () => {
  const url = useStrapiUrl();
  const token = useStrapiToken();
  const user = useStrapiUser();
  const client = useStrapiClient();
  const setToken = (value) => {
    token.value = value;
  };
  const setUser = (value) => {
    user.value = value;
  };
  const fetchUser = async () => {
    if (token.value && !user.value) {
      try {
        user.value = await client("/users/me");
      } catch (e) {
        setToken(null);
      }
    }
    return user;
  };
  const login = async (data) => {
    setToken(null);
    const { jwt } = await client("/auth/local", { method: "POST", body: data });
    setToken(jwt);
    const user2 = await fetchUser();
    return {
      user: user2,
      jwt
    };
  };
  const logout = () => {
    setToken(null);
    setUser(null);
  };
  const register = async (data) => {
    setToken(null);
    const { jwt } = await client("/auth/local/register", { method: "POST", body: data });
    setToken(jwt);
    const user2 = await fetchUser();
    return {
      user: user2,
      jwt
    };
  };
  const forgotPassword = async (data) => {
    setToken(null);
    await client("/auth/forgot-password", { method: "POST", body: data });
  };
  const resetPassword = async (data) => {
    setToken(null);
    const { jwt } = await client("/auth/reset-password", { method: "POST", body: data });
    setToken(jwt);
    const user2 = await fetchUser();
    return {
      user: user2,
      jwt
    };
  };
  const sendEmailConfirmation = async (data) => {
    await client("/auth/send-email-confirmation", { method: "POST", body: data });
  };
  const getProviderAuthenticationUrl = (provider) => {
    return `${url}/connect/${provider}`;
  };
  const authenticateProvider = async (provider, access_token) => {
    setToken(null);
    const { jwt } = await client(`/auth/${provider}/callback`, { method: "GET", params: { access_token } });
    setToken(jwt);
    const user2 = await fetchUser();
    return {
      user: user2,
      jwt
    };
  };
  return {
    setToken,
    setUser,
    fetchUser,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    sendEmailConfirmation,
    getProviderAuthenticationUrl,
    authenticateProvider
  };
};
const strapi_e6fa3718 = defineNuxtPlugin(async () => {
  const { fetchUser } = useStrapiAuth();
  await fetchUser();
});
const _plugins = [
  preload,
  componentsPlugin_2c84ef57,
  vueuseHead_0e2c7a21,
  _fd96d7d6,
  _6bc72fcf,
  strapi_e6fa3718
];
const error404_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main$k = {
  name: "error-404",
  __ssrInlineRender: true,
  props: {
    appName: {
      type: String,
      default: "Nuxt"
    },
    version: {
      type: String,
      default: ""
    },
    statusCode: {
      type: String,
      default: "404"
    },
    statusMessage: {
      type: String,
      default: "Not Found"
    },
    description: {
      type: String,
      default: "Sorry, the page you are looking for could not be found."
    },
    backHome: {
      type: String,
      default: "Go back home"
    }
  },
  setup(__props) {
    const props = __props;
    useHead({
      title: `${props.statusCode} - ${props.statusMessage} | ${props.appName}`,
      script: [],
      style: [
        {
          children: `*,:before,:after{-webkit-box-sizing:border-box;box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}*{--tw-ring-inset:var(--tw-empty, );--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(14, 165, 233, .5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000}:root{-moz-tab-size:4;-o-tab-size:4;tab-size:4}a{color:inherit;text-decoration:inherit}body{margin:0;font-family:inherit;line-height:inherit}html{-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";line-height:1.5}h1,p{margin:0}h1{font-size:inherit;font-weight:inherit}`
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_1$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "font-sans antialiased bg-white dark:bg-black text-black dark:text-white grid min-h-screen place-content-center overflow-hidden" }, _attrs))} data-v-011aae6d><div class="fixed left-0 right-0 spotlight z-10" data-v-011aae6d></div><div class="max-w-520px text-center z-20" data-v-011aae6d><h1 class="text-8xl sm:text-10xl font-medium mb-8" data-v-011aae6d>${ssrInterpolate(__props.statusCode)}</h1><p class="text-xl px-8 sm:px-0 sm:text-4xl font-light mb-16 leading-tight" data-v-011aae6d>${ssrInterpolate(__props.description)}</p><div class="w-full flex items-center justify-center" data-v-011aae6d>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "gradient-border text-md sm:text-xl py-2 px-4 sm:py-3 sm:px-6 cursor-pointer"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.backHome)}`);
          } else {
            return [
              createTextVNode(toDisplayString$1(__props.backHome), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui-templates/dist/templates/error-404.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const Error404 = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["__scopeId", "data-v-011aae6d"]]);
const error500_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main$j = {
  name: "error-500",
  __ssrInlineRender: true,
  props: {
    appName: {
      type: String,
      default: "Nuxt"
    },
    version: {
      type: String,
      default: ""
    },
    statusCode: {
      type: String,
      default: "500"
    },
    statusMessage: {
      type: String,
      default: "Server error"
    },
    description: {
      type: String,
      default: "This page is temporarily unavailable."
    }
  },
  setup(__props) {
    const props = __props;
    useHead({
      title: `${props.statusCode} - ${props.statusMessage} | ${props.appName}`,
      script: [],
      style: [
        {
          children: `*,:before,:after{-webkit-box-sizing:border-box;box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}*{--tw-ring-inset:var(--tw-empty, );--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(14, 165, 233, .5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000}:root{-moz-tab-size:4;-o-tab-size:4;tab-size:4}body{margin:0;font-family:inherit;line-height:inherit}html{-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";line-height:1.5}h1,p{margin:0}h1{font-size:inherit;font-weight:inherit}`
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "font-sans antialiased bg-white dark:bg-black text-black dark:text-white grid min-h-screen place-content-center overflow-hidden" }, _attrs))} data-v-6aee6495><div class="fixed -bottom-1/2 left-0 right-0 h-1/2 spotlight" data-v-6aee6495></div><div class="max-w-520px text-center" data-v-6aee6495><h1 class="text-8xl sm:text-10xl font-medium mb-8" data-v-6aee6495>${ssrInterpolate(__props.statusCode)}</h1><p class="text-xl px-8 sm:px-0 sm:text-4xl font-light mb-16 leading-tight" data-v-6aee6495>${ssrInterpolate(__props.description)}</p></div></div>`);
    };
  }
};
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui-templates/dist/templates/error-500.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const Error500 = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["__scopeId", "data-v-6aee6495"]]);
const errorDev_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main$i = {
  name: "error-dev",
  __ssrInlineRender: true,
  props: {
    appName: {
      type: String,
      default: "Nuxt"
    },
    version: {
      type: String,
      default: ""
    },
    statusCode: {
      type: String,
      default: "500"
    },
    statusMessage: {
      type: String,
      default: "Server error"
    },
    description: {
      type: String,
      default: "An error occurred in the application and the page could not be served. If you are the application owner, check your server logs for details."
    },
    stack: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    const props = __props;
    useHead({
      title: `${props.statusCode} - ${props.statusMessage} | ${props.appName}`,
      script: [],
      style: [
        {
          children: `*,:before,:after{-webkit-box-sizing:border-box;box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}*{--tw-ring-inset:var(--tw-empty, );--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(14, 165, 233, .5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000}:root{-moz-tab-size:4;-o-tab-size:4;tab-size:4}body{margin:0;font-family:inherit;line-height:inherit}html{-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";line-height:1.5}h1,p,pre{margin:0}h1{font-size:inherit;font-weight:inherit}pre{font-size:1em;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace}`
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "font-sans antialiased bg-white px-10 pt-14 dark:bg-black text-black dark:text-white min-h-screen flex flex-col" }, _attrs))} data-v-693cabb2><div class="fixed left-0 right-0 spotlight" data-v-693cabb2></div><h1 class="text-6xl sm:text-8xl font-medium mb-6" data-v-693cabb2>${ssrInterpolate(__props.statusCode)}</h1><p class="text-xl sm:text-2xl font-light mb-8 leading-tight" data-v-693cabb2>${ssrInterpolate(__props.description)}</p><div class="bg-white rounded-t-md bg-black/5 dark:bg-white/10 flex-1 overflow-y-auto h-auto" data-v-693cabb2><pre class="text-xl font-light leading-tight z-10 p-8" data-v-693cabb2>${__props.stack}</pre></div></div>`);
    };
  }
};
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui-templates/dist/templates/error-dev.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const _sfc_main$h = {
  name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    var _a;
    const props = __props;
    const error = props.error;
    (error.stack || "").split("\n").splice(1).map((line) => {
      const text = line.replace("webpack:/", "").replace(".vue", ".js").trim();
      return {
        text,
        internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
      };
    }).map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n");
    const statusCode = String(error.statusCode || 500);
    const is404 = statusCode === "404";
    const statusMessage = (_a = error.statusMessage) != null ? _a : is404 ? "Page Not Found" : "Internal Server Error";
    const description = error.message || error.toString();
    const stack = void 0;
    const ErrorTemplate = is404 ? Error404 : Error500;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const _sfc_main$g = {
  name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const nuxtApp = useNuxtApp();
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        callWithNuxt(nuxtApp, throwError, [err]);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_App = resolveComponent("App");
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$h), { error: unref(error) }, null, _parent));
          } else {
            _push(ssrRenderComponent(_component_App, null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const app_vue_vue_type_style_index_0_lang = "";
const _sfc_main$f = {
  name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    onMounted(() => {
      const appHeight = () => {
        const doc = document.documentElement;
        doc.style.setProperty("--app-height", `${window.innerHeight}px`);
      };
      window.addEventListener("resize", appHeight);
      appHeight();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtPage = resolveComponent("NuxtPage");
      _push(ssrRenderComponent(_component_NuxtPage, _attrs, null, _parent));
    };
  }
};
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch$1.create({
    baseURL: baseURL()
  });
}
let entry;
const plugins = normalizePlugins(_plugins);
{
  entry = async function createNuxtAppServer(ssrContext = {}) {
    const vueApp = createApp(_sfc_main$g);
    vueApp.component("App", _sfc_main$f);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (err) {
      await nuxt.callHook("app:error", err);
      ssrContext.error = ssrContext.error || err;
    }
    return vueApp;
  };
}
const entry$1 = (ctx) => entry(ctx);
const _sfc_main$e = /* @__PURE__ */ defineComponent({
  name: "Header",
  __ssrInlineRender: true,
  props: {
    height: null,
    class: null
  },
  setup(__props) {
    useTitle();
    const navs = [
      {
        name: "\u9996\u9875",
        url: "/",
        children: []
      },
      {
        name: "\u6A21\u677F",
        url: "javascript:;",
        children: []
      },
      {
        name: "\u5DE5\u5177",
        url: "javascript:;",
        children: [
          {
            name: "JSON\u5728\u7EBF\u5DE5\u5177",
            url: "/tools/json-to-language"
          },
          {
            name: "Image Space",
            url: "/tools/image-space"
          }
        ]
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Logo = __nuxt_component_1;
      const _component_nuxt_link = __nuxt_component_1$2;
      _push(`<header${ssrRenderAttrs(mergeProps({
        class: ["flex justify-between items-center", __props.class]
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Logo, null, null, _parent));
      _push(`<span class="text-white underline">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</span><ul class="text-white text-lg md:flex hidden"><!--[-->`);
      ssrRenderList(navs, (item) => {
        _push(`<li class="py-5 pl-12">`);
        _push(ssrRenderComponent(_component_nuxt_link, {
          to: item.url
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(item.name)}`);
            } else {
              return [
                createTextVNode(toDisplayString$1(item.name), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></header>`);
    };
  }
});
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Header.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const _sfc_main$d = /* @__PURE__ */ defineComponent({
  name: "Footer",
  __ssrInlineRender: true,
  props: {
    class: null,
    showLogo: { type: Boolean, default: true }
  },
  setup(__props) {
    useTitle();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Logo = __nuxt_component_1;
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: __props.class }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Logo, {
        style: __props.showLogo ? null : { display: "none" },
        "show-week": false
      }, null, _parent));
      _push(`<p class="${ssrRenderClass([{ "mt-4": __props.showLogo }, "text-black text-opacity-70 text-sm"])}"> Copyright \xA9 2022 wcao.cc </p></footer>`);
    };
  }
});
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Footer.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const default_vue_vue_type_style_index_0_lang = "";
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  name: "default",
  __ssrInlineRender: true,
  emits: ["change"],
  setup(__props, { emit }) {
    useHead({
      titleTemplate: useTitle().title
    });
    const el = ref(null);
    const { y } = useScroll(el);
    watch(y, (val) => emit("change", val));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Header = _sfc_main$e;
      const _component_Footer = _sfc_main$d;
      _push(`<div${ssrRenderAttrs(mergeProps({
        id: "container",
        ref_key: "el",
        ref: el
      }, _attrs))}><div class="container lg:max-w-full xl:container mx-auto p-6">`);
      _push(ssrRenderComponent(_component_Header, { class: "border-b-2 border-white border-opacity-25 py-8" }, null, _parent));
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(ssrRenderComponent(_component_Footer, { class: "flex flex-col items-center justify-center mt-20" }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main$c
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$b = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  const _component_Header = _sfc_main$e;
  const _component_Footer = _sfc_main$d;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "m-auto h-screen overflow-hidden flex-col flex" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_Header, { class: "container m-auto flex-shrink-0 h-20 xl:px-32 px-4" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        ssrRenderSlot(_ctx.$slots, "title", {}, null, _push2, _parent2, _scopeId);
      } else {
        return [
          renderSlot(_ctx.$slots, "title")
        ];
      }
    }),
    _: 3
  }, _parent));
  _push(`<div class="flex-1">`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div>`);
  _push(ssrRenderComponent(_component_Footer, {
    class: "flex justify-center items-center flex-shrink-0 h-20",
    "show-logo": false
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/tools.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const tools = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["ssrRender", _sfc_ssrRender$1]]);
const tools$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": tools
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$a = {
  name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("posts", () => useStrapi4().find("posts", {
      populate: ["category", "headerImages", "tags"]
    }))), __temp = await __temp, __restore(), __temp);
    const posts = computed(() => data.value.data);
    const getTags = (post) => {
      const tags = post.attributes.tags.data;
      return tags.length > 0 ? tags[0].attributes : "";
    };
    const getCategory = (post) => {
      return post.attributes.category.data.attributes;
    };
    const getHeaderImages = (post) => {
      return post.attributes.headerImages.data.map((item) => item.attributes.url);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0$1;
      const _component_grid_item_b = __nuxt_component_1$1;
      const _component_grid_item_a = _sfc_main$u;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({ name: "default" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(posts)) {
              _push2(`<div class="multi-columns pt-5 md:pt-10 md:columns-2 xl:columns-3" data-v-2ad854f4${_scopeId}><!--[-->`);
              ssrRenderList(unref(posts), (post) => {
                _push2(`<div class="block" data-v-2ad854f4${_scopeId}>`);
                if (getCategory(post).name === "\u6A21\u677F") {
                  _push2(ssrRenderComponent(_component_grid_item_b, {
                    title: post.attributes.title,
                    desciption: post.attributes.desciption,
                    time: post.attributes.updatedAt.split("T")[0],
                    visit: post.attributes.visit,
                    comment: post.attributes.comment,
                    tag: getTags(post),
                    "header-images": getHeaderImages(post),
                    id: post.id + "",
                    to: post.attributes.to
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                if (getCategory(post).name === "\u5DE5\u5177") {
                  _push2(ssrRenderComponent(_component_grid_item_a, {
                    title: post.attributes.title,
                    desciption: post.attributes.desciption,
                    time: post.attributes.updatedAt.split("T")[0],
                    tag: getCategory(post).name,
                    "header-images": getHeaderImages(post),
                    link: post.attributes.link
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="paging md:py-10 py-5" data-v-2ad854f4${_scopeId}><a href="javasciprt:;" class="btn" data-v-2ad854f4${_scopeId}>Prev</a><span class="px-5" data-v-2ad854f4${_scopeId}>Page 1 of 2</span><a href="javasciprt:;" class="btn" data-v-2ad854f4${_scopeId}>Next</a></div><div class="bottom-aside lg:grid-cols-3 md:grid-cols-2" data-v-2ad854f4${_scopeId}><div data-v-2ad854f4${_scopeId}><p class="bottom-title" data-v-2ad854f4${_scopeId}>Recent posts</p><ul data-v-2ad854f4${_scopeId}><!--[-->`);
            ssrRenderList(3, (item) => {
              _push2(`<li class="flex mt-5" data-v-2ad854f4${_scopeId}><img src="http://estudiopatagon.com/themes/wordpress/breek/wp-content/uploads/2019/06/480016-PGKTGR-852-120x120.jpg" alt="" data-v-2ad854f4${_scopeId}><div class="flex flex-col justify-center ml-5" data-v-2ad854f4${_scopeId}><span class="text-sm text-white text-opacity-50" data-v-2ad854f4${_scopeId}>June 5, 2019</span><p class="text-base font-semibold text-white" data-v-2ad854f4${_scopeId}> Mars is the fourth planet from the Sun </p></div></li>`);
            });
            _push2(`<!--]--></ul></div><div data-v-2ad854f4${_scopeId}><p class="bottom-title" data-v-2ad854f4${_scopeId}>Tag Cloud</p><div class="flex mt-5 flex-wrap" data-v-2ad854f4${_scopeId}><!--[-->`);
            ssrRenderList([
              "bg-blue-400",
              "bg-red-500",
              "bg-yellow-500",
              "bg-green-500",
              "bg-orange-500"
            ], (item) => {
              _push2(`<a href="javascript:;" class="${ssrRenderClass([item, "px-4 py-2 text-white rounded-full mr-2 mb-4"])}" data-v-2ad854f4${_scopeId}> Astronomy </a>`);
            });
            _push2(`<!--]--></div></div><div data-v-2ad854f4${_scopeId}><p class="bottom-title" data-v-2ad854f4${_scopeId}>\u5173\u4E8E\u6211</p><div class="mt-5" data-v-2ad854f4${_scopeId}><div class="flex" data-v-2ad854f4${_scopeId}><img class="w-24 h-24 rounded-full border-4 border-cyan-500"${ssrRenderAttr("src", _imports_0)} alt="meetqy" data-v-2ad854f4${_scopeId}><div class="ml-5 flex flex-col justify-center" data-v-2ad854f4${_scopeId}><p class="text-lg font-semibold text-white" data-v-2ad854f4${_scopeId}> meetqy <sup class="inline-block line-through decoration-red-500 decoration-4" data-v-2ad854f4${_scopeId}> \u90FD${ssrInterpolate(new Date().getFullYear() - 1996)}\u4E86 </sup></p><p class="text-white text-opacity-70 text-sm my-1" data-v-2ad854f4${_scopeId}> \u524D\u7AEFCV\u5DE5\u7A0B\u5E08 - \u64C5\u957FCV\u5927\u6CD5 </p></div></div><p class="text-white mt-5 text-base text-opacity-90" data-v-2ad854f4${_scopeId}> \u6478\u9C7C\u3001\u517B\u72D7\u3001\u5E72\u996D\u3001\u627E\u6A21\u677F\u3001\u5199\u6A21\u677F\uFF0C\u751F\u6D3B\u5C31\u662F\u5982\u6B64\u7684\u6734\u5B9E\u65E0\u534E\uFF01 </p><p class="mt-4 about" data-v-2ad854f4${_scopeId}><span class="tag sm !text-black uppercase" style="${ssrRenderStyle({ "background-color": "#e5d836" })}" data-v-2ad854f4${_scopeId}> js </span><span class="tag sm uppercase" style="${ssrRenderStyle({ "background-color": "#4266bb" })}" data-v-2ad854f4${_scopeId}> ts </span><span class="tag sm capitalize" style="${ssrRenderStyle({ "background": "linear-gradient(to bottom right, #69bcf0, #28468a)" })}" data-v-2ad854f4${_scopeId}> flutter </span><span class="tag sm capitalize" style="${ssrRenderStyle({ "background": "linear-gradient(to bottom right, #8bb840, #35362d)" })}" data-v-2ad854f4${_scopeId}>node </span><span class="tag sm shadow !text-black" style="${ssrRenderStyle({ "background": "linear-gradient(to bottom right, #4ea1c5, #55b3a8)" })}" data-v-2ad854f4${_scopeId}> Tailwind CSS </span><span class="tag sm shadow" style="${ssrRenderStyle({ "background": "linear-gradient(to bottom right, #c15029, #cf642d)" })}" data-v-2ad854f4${_scopeId}> HTML </span><span class="tag sm shadow" style="${ssrRenderStyle({ "background": "linear-gradient(to bottom right, #335ca4, #5697de)" })}" data-v-2ad854f4${_scopeId}> CSS </span></p></div></div></div>`);
          } else {
            return [
              unref(posts) ? (openBlock(), createBlock("div", {
                key: 0,
                class: "multi-columns pt-5 md:pt-10 md:columns-2 xl:columns-3"
              }, [
                (openBlock(true), createBlock(Fragment$1, null, renderList(unref(posts), (post) => {
                  return openBlock(), createBlock("div", {
                    class: "block",
                    key: post.id
                  }, [
                    getCategory(post).name === "\u6A21\u677F" ? (openBlock(), createBlock(_component_grid_item_b, {
                      key: 0,
                      title: post.attributes.title,
                      desciption: post.attributes.desciption,
                      time: post.attributes.updatedAt.split("T")[0],
                      visit: post.attributes.visit,
                      comment: post.attributes.comment,
                      tag: getTags(post),
                      "header-images": getHeaderImages(post),
                      id: post.id + "",
                      to: post.attributes.to
                    }, null, 8, ["title", "desciption", "time", "visit", "comment", "tag", "header-images", "id", "to"])) : createCommentVNode("", true),
                    getCategory(post).name === "\u5DE5\u5177" ? (openBlock(), createBlock(_component_grid_item_a, {
                      key: 1,
                      title: post.attributes.title,
                      desciption: post.attributes.desciption,
                      time: post.attributes.updatedAt.split("T")[0],
                      tag: getCategory(post).name,
                      "header-images": getHeaderImages(post),
                      link: post.attributes.link
                    }, null, 8, ["title", "desciption", "time", "tag", "header-images", "link"])) : createCommentVNode("", true)
                  ]);
                }), 128))
              ])) : createCommentVNode("", true),
              createVNode("div", { class: "paging md:py-10 py-5" }, [
                createVNode("a", {
                  href: "javasciprt:;",
                  class: "btn"
                }, "Prev"),
                createVNode("span", { class: "px-5" }, "Page 1 of 2"),
                createVNode("a", {
                  href: "javasciprt:;",
                  class: "btn"
                }, "Next")
              ]),
              createVNode("div", { class: "bottom-aside lg:grid-cols-3 md:grid-cols-2" }, [
                createVNode("div", null, [
                  createVNode("p", { class: "bottom-title" }, "Recent posts"),
                  createVNode("ul", null, [
                    (openBlock(), createBlock(Fragment$1, null, renderList(3, (item) => {
                      return createVNode("li", { class: "flex mt-5" }, [
                        createVNode("img", {
                          src: "http://estudiopatagon.com/themes/wordpress/breek/wp-content/uploads/2019/06/480016-PGKTGR-852-120x120.jpg",
                          alt: ""
                        }),
                        createVNode("div", { class: "flex flex-col justify-center ml-5" }, [
                          createVNode("span", { class: "text-sm text-white text-opacity-50" }, "June 5, 2019"),
                          createVNode("p", { class: "text-base font-semibold text-white" }, " Mars is the fourth planet from the Sun ")
                        ])
                      ]);
                    }), 64))
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("p", { class: "bottom-title" }, "Tag Cloud"),
                  createVNode("div", { class: "flex mt-5 flex-wrap" }, [
                    (openBlock(), createBlock(Fragment$1, null, renderList([
                      "bg-blue-400",
                      "bg-red-500",
                      "bg-yellow-500",
                      "bg-green-500",
                      "bg-orange-500"
                    ], (item) => {
                      return createVNode("a", {
                        href: "javascript:;",
                        class: ["px-4 py-2 text-white rounded-full mr-2 mb-4", item]
                      }, " Astronomy ", 2);
                    }), 64))
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("p", { class: "bottom-title" }, "\u5173\u4E8E\u6211"),
                  createVNode("div", { class: "mt-5" }, [
                    createVNode("div", { class: "flex" }, [
                      createVNode("img", {
                        class: "w-24 h-24 rounded-full border-4 border-cyan-500",
                        src: _imports_0,
                        alt: "meetqy"
                      }),
                      createVNode("div", { class: "ml-5 flex flex-col justify-center" }, [
                        createVNode("p", { class: "text-lg font-semibold text-white" }, [
                          createTextVNode(" meetqy "),
                          createVNode("sup", { class: "inline-block line-through decoration-red-500 decoration-4" }, " \u90FD" + toDisplayString$1(new Date().getFullYear() - 1996) + "\u4E86 ", 1)
                        ]),
                        createVNode("p", { class: "text-white text-opacity-70 text-sm my-1" }, " \u524D\u7AEFCV\u5DE5\u7A0B\u5E08 - \u64C5\u957FCV\u5927\u6CD5 ")
                      ])
                    ]),
                    createVNode("p", { class: "text-white mt-5 text-base text-opacity-90" }, " \u6478\u9C7C\u3001\u517B\u72D7\u3001\u5E72\u996D\u3001\u627E\u6A21\u677F\u3001\u5199\u6A21\u677F\uFF0C\u751F\u6D3B\u5C31\u662F\u5982\u6B64\u7684\u6734\u5B9E\u65E0\u534E\uFF01 "),
                    createVNode("p", { class: "mt-4 about" }, [
                      createVNode("span", {
                        class: "tag sm !text-black uppercase",
                        style: { "background-color": "#e5d836" }
                      }, " js "),
                      createVNode("span", {
                        class: "tag sm uppercase",
                        style: { "background-color": "#4266bb" }
                      }, " ts "),
                      createVNode("span", {
                        class: "tag sm capitalize",
                        style: { "background": "linear-gradient(to bottom right, #69bcf0, #28468a)" }
                      }, " flutter "),
                      createVNode("span", {
                        class: "tag sm capitalize",
                        style: { "background": "linear-gradient(to bottom right, #8bb840, #35362d)" }
                      }, "node "),
                      createVNode("span", {
                        class: "tag sm shadow !text-black",
                        style: { "background": "linear-gradient(to bottom right, #4ea1c5, #55b3a8)" }
                      }, " Tailwind CSS "),
                      createVNode("span", {
                        class: "tag sm shadow",
                        style: { "background": "linear-gradient(to bottom right, #c15029, #cf642d)" }
                      }, " HTML "),
                      createVNode("span", {
                        class: "tag sm shadow",
                        style: { "background": "linear-gradient(to bottom right, #335ca4, #5697de)" }
                      }, " CSS ")
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index/index.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const index$8 = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-2ad854f4"]]);
const index$9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": index$8
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$9 = {
  name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const onChange = (y) => {
      asideFixed.value = y > 150;
    };
    const asideFixed = ref(false);
    const md = new MarkdownIt({
      highlight: function(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return '<pre class="hljs"><code>' + hljs.highlight(str, { language: lang, ignoreIllegals: true }).value + "</code></pre>";
          } catch (__) {
          }
        }
        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + "</code></pre>";
      }
    });
    const { id } = useRoute().params;
    const { data } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("posts/:id", () => useStrapi4().find(`posts/${id}`, {
      populate: ["category", "tags", "previewImages"]
    }))), __temp = await __temp, __restore(), __temp);
    const post = computed(() => {
      return data.value.data.attributes;
    });
    const previewImages = computed(() => post.value.previewImages.data);
    const content = computed(() => md.render(post.value.content));
    const modules = [Navigation];
    const $cdn = useCdnUrl();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0$1;
      const _component_Logo = __nuxt_component_1;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({ onChange }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<main class="main-content flex"${_scopeId}><aside class="${ssrRenderClass([
              { fixed: asideFixed.value },
              "top-0 w-96 max-h-screen hidden lg:flex flex-col z-10 flex-shrink-0"
            ])}"${_scopeId}><section class="${ssrRenderClass([{ hidden: !asideFixed.value }, "w-full lg:pr-10 my-5"])}"${_scopeId}><div class="p-2 h-min rounded-box"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Logo, null, null, _parent2, _scopeId));
            _push2(`</div></section><section class="w-full lg:pr-10"${_scopeId}><ul class="menu bg-base-100 p-2 w-full h-min rounded-box"${_scopeId}><li class="menu-title py-2"${_scopeId}><span${_scopeId}>Type</span></li><!--[-->`);
            ssrRenderList(_ctx.types, (item, index2) => {
              _push2(`<li class="text-xl"${_scopeId}><a${ssrRenderAttr("href", "#" + item.name)} class="${ssrRenderClass({
                active: _ctx.curTypes === index2,
                capitalize: _ctx.curTypes === index2
              })}"${_scopeId}>${ssrInterpolate(item.name)}</a></li>`);
            });
            _push2(`<!--]--></ul></section></aside><aside class="w-96 opacity-0 hidden lg:flex" style="${ssrRenderStyle(asideFixed.value ? null : { display: "none" })}"${_scopeId}></aside><div class="flex-1 relative overflow-hidden p-5 bg-base-100 rounded-md prose prose-neutral prose-a:text-blue-500"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Swiper), {
              class: "swiper w-full bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl",
              modules,
              navigation: true
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(unref(previewImages), (item) => {
                    _push3(ssrRenderComponent(unref(SwiperSlide), {
                      class: "flex justify-center items-center",
                      key: item.id
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<img class="rounded-2xl xl:w-1/5 md:w-1/3 w-1/2"${ssrRenderAttr("src", unref($cdn) + item.attributes.url)}${_scopeId3}>`);
                        } else {
                          return [
                            createVNode("img", {
                              class: "rounded-2xl xl:w-1/5 md:w-1/3 w-1/2",
                              src: unref($cdn) + item.attributes.url
                            }, null, 8, ["src"])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment$1, null, renderList(unref(previewImages), (item) => {
                      return openBlock(), createBlock(unref(SwiperSlide), {
                        class: "flex justify-center items-center",
                        key: item.id
                      }, {
                        default: withCtx(() => [
                          createVNode("img", {
                            class: "rounded-2xl xl:w-1/5 md:w-1/3 w-1/2",
                            src: unref($cdn) + item.attributes.url
                          }, null, 8, ["src"])
                        ]),
                        _: 2
                      }, 1024);
                    }), 128))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="flex items-center mt-6 flex-wrap"${_scopeId}><a href="javascript:;" class="flex items-center justify-center"${_scopeId}><img class="w-8 h-8 rounded-full relative -top-0.5" style="${ssrRenderStyle({ "box-shadow": "2px 2px 5px 1px rgb(0 0 0 / 20%)" })}"${ssrRenderAttr("src", _imports_0)}${_scopeId}><span class="ml-3"${_scopeId}> meetqy </span></a><a href="javascript:;" class="ml-6"${_scopeId}><i class="iconfont" style="${ssrRenderStyle({ "color": "#e84e89" })}"${_scopeId}>\uE8B4</i><span class="ml-2"${_scopeId}>${ssrInterpolate(unref(post).updatedAt.split("T")[0])}</span></a><a href="javascript:;" class="ml-6"${_scopeId}><i class="iconfont" style="${ssrRenderStyle({ "color": "#e84e89" })}"${_scopeId}>\uE8F4</i><span class="ml-2"${_scopeId}>${ssrInterpolate(unref(post).visit)}</span></a><a href="javascript:;" class="ml-6"${_scopeId}><i class="iconfont" style="${ssrRenderStyle({ "color": "#e84e89" })}"${_scopeId}>\uE8B5</i><span class="ml-2"${_scopeId}>${ssrInterpolate(unref(post).comment)}</span></a></div><article class="prose prose-neutral prose-a:text-blue-500 break-words"${_scopeId}>${unref(content)}</article><div class="py-16 mt-12 flex justify-center items-center flex-wrap" style="${ssrRenderStyle({ "border-top": "1px solid #f4f4f4", "border-bottom": "1px solid #f4f4f4" })}"${_scopeId}><span class="text-lg font-semibold mr-4"${_scopeId}>Link:</span><a${ssrRenderAttr("href", unref(post).link)} class="underline text-blue-500 break-words inline-block w-full text-center md:w-auto"${_scopeId}>${ssrInterpolate(unref(post).link)}</a></div></div></main>`);
          } else {
            return [
              createVNode("main", { class: "main-content flex" }, [
                createVNode("aside", {
                  class: [
                    { fixed: asideFixed.value },
                    "top-0 w-96 max-h-screen hidden lg:flex flex-col z-10 flex-shrink-0"
                  ]
                }, [
                  createVNode("section", {
                    class: ["w-full lg:pr-10 my-5", { hidden: !asideFixed.value }]
                  }, [
                    createVNode("div", { class: "p-2 h-min rounded-box" }, [
                      createVNode(_component_Logo)
                    ])
                  ], 2),
                  createVNode("section", { class: "w-full lg:pr-10" }, [
                    createVNode("ul", { class: "menu bg-base-100 p-2 w-full h-min rounded-box" }, [
                      createVNode("li", { class: "menu-title py-2" }, [
                        createVNode("span", null, "Type")
                      ]),
                      (openBlock(true), createBlock(Fragment$1, null, renderList(_ctx.types, (item, index2) => {
                        return openBlock(), createBlock("li", {
                          class: "text-xl",
                          key: item,
                          onClick: ($event) => _ctx.curTypes = index2
                        }, [
                          createVNode("a", {
                            href: "#" + item.name,
                            class: {
                              active: _ctx.curTypes === index2,
                              capitalize: _ctx.curTypes === index2
                            }
                          }, toDisplayString$1(item.name), 11, ["href"])
                        ], 8, ["onClick"]);
                      }), 128))
                    ])
                  ])
                ], 2),
                withDirectives(createVNode("aside", { class: "w-96 opacity-0 hidden lg:flex" }, null, 512), [
                  [vShow, asideFixed.value]
                ]),
                createVNode("div", { class: "flex-1 relative overflow-hidden p-5 bg-base-100 rounded-md prose prose-neutral prose-a:text-blue-500" }, [
                  createVNode(unref(Swiper), {
                    class: "swiper w-full bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl",
                    modules,
                    navigation: true
                  }, {
                    default: withCtx(() => [
                      (openBlock(true), createBlock(Fragment$1, null, renderList(unref(previewImages), (item) => {
                        return openBlock(), createBlock(unref(SwiperSlide), {
                          class: "flex justify-center items-center",
                          key: item.id
                        }, {
                          default: withCtx(() => [
                            createVNode("img", {
                              class: "rounded-2xl xl:w-1/5 md:w-1/3 w-1/2",
                              src: unref($cdn) + item.attributes.url
                            }, null, 8, ["src"])
                          ]),
                          _: 2
                        }, 1024);
                      }), 128))
                    ]),
                    _: 1
                  }),
                  createVNode("div", { class: "flex items-center mt-6 flex-wrap" }, [
                    createVNode("a", {
                      href: "javascript:;",
                      class: "flex items-center justify-center"
                    }, [
                      createVNode("img", {
                        class: "w-8 h-8 rounded-full relative -top-0.5",
                        style: { "box-shadow": "2px 2px 5px 1px rgb(0 0 0 / 20%)" },
                        src: _imports_0
                      }),
                      createVNode("span", { class: "ml-3" }, " meetqy ")
                    ]),
                    createVNode("a", {
                      href: "javascript:;",
                      class: "ml-6"
                    }, [
                      createVNode("i", {
                        class: "iconfont",
                        style: { "color": "#e84e89" }
                      }, "\uE8B4"),
                      createVNode("span", { class: "ml-2" }, toDisplayString$1(unref(post).updatedAt.split("T")[0]), 1)
                    ]),
                    createVNode("a", {
                      href: "javascript:;",
                      class: "ml-6"
                    }, [
                      createVNode("i", {
                        class: "iconfont",
                        style: { "color": "#e84e89" }
                      }, "\uE8F4"),
                      createVNode("span", { class: "ml-2" }, toDisplayString$1(unref(post).visit), 1)
                    ]),
                    createVNode("a", {
                      href: "javascript:;",
                      class: "ml-6"
                    }, [
                      createVNode("i", {
                        class: "iconfont",
                        style: { "color": "#e84e89" }
                      }, "\uE8B5"),
                      createVNode("span", { class: "ml-2" }, toDisplayString$1(unref(post).comment), 1)
                    ])
                  ]),
                  createVNode("article", {
                    class: "prose prose-neutral prose-a:text-blue-500 break-words",
                    innerHTML: unref(content)
                  }, null, 8, ["innerHTML"]),
                  createVNode("div", {
                    class: "py-16 mt-12 flex justify-center items-center flex-wrap",
                    style: { "border-top": "1px solid #f4f4f4", "border-bottom": "1px solid #f4f4f4" }
                  }, [
                    createVNode("span", { class: "text-lg font-semibold mr-4" }, "Link:"),
                    createVNode("a", {
                      href: unref(post).link,
                      class: "underline text-blue-500 break-words inline-block w-full text-center md:w-auto"
                    }, toDisplayString$1(unref(post).link), 9, ["href"])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/posts/[id].vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main$9
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const temps = ref([
      {
        html: a2,
        preview: true
      },
      {
        html: a1,
        preview: true
      }
    ]);
    const showCode = (index2) => {
      const item = temps.value[index2];
      item.preview = !item.preview;
      if (!item.preview) {
        hljs.highlightBlock(document.querySelector("#pre-" + index2));
      }
    };
    const curTemp = ref(0);
    const onChange = (y) => {
      asideFixed.value = y > 150;
    };
    const asideFixed = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0$1;
      const _component_Logo = __nuxt_component_1;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({ onChange }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<main class="main-content flex" data-v-f9d32580${_scopeId}><aside class="${ssrRenderClass([
              { fixed: asideFixed.value },
              "top-0 w-96 flex-shrink-0 max-h-screen hidden lg:flex flex-col z-10 "
            ])}" data-v-f9d32580${_scopeId}><section class="${ssrRenderClass([{ hidden: !asideFixed.value }, "w-full lg:pr-10 my-5"])}" data-v-f9d32580${_scopeId}><div class="p-2 h-min rounded-box" data-v-f9d32580${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Logo, null, null, _parent2, _scopeId));
            _push2(`</div></section><section class="w-full lg:pr-10" data-v-f9d32580${_scopeId}><ul class="menu bg-base-100 p-2 w-full h-min rounded-box" data-v-f9d32580${_scopeId}><li class="menu-title py-2" data-v-f9d32580${_scopeId}><span data-v-f9d32580${_scopeId}>List</span></li><!--[-->`);
            ssrRenderList(temps.value, (item, index2) => {
              _push2(`<li class="text-xl" data-v-f9d32580${_scopeId}><a${ssrRenderAttr("href", "#card-a" + index2)} class="${ssrRenderClass({
                active: curTemp.value === index2,
                capitalize: curTemp.value === index2
              })}" data-v-f9d32580${_scopeId}>${ssrInterpolate(index2 + 1)} . card </a></li>`);
            });
            _push2(`<!--]--></ul></section></aside><aside class="w-96 flex-shrink-0 opacity-0 hidden lg:flex" style="${ssrRenderStyle(asideFixed.value ? null : { display: "none" })}" data-v-f9d32580${_scopeId}></aside><div class="flex-1 relative overflow-hidden px-5 bg-base-100 py-10 rounded-box prose" data-v-f9d32580${_scopeId}><h1 data-v-f9d32580${_scopeId}>Tailwind CSS - Card</h1><p data-v-f9d32580${_scopeId}> \u6536\u96C6\u7684\u4E00\u4E9B<code data-v-f9d32580${_scopeId}>Card</code>\u6837\u5F0F\uFF0C\u6240\u6709\u7684\u6A21\u677F\u5747\u6539\u9020\u4E3A <code data-v-f9d32580${_scopeId}>DaisyUI</code> \u4E3B\u9898\u6837\u5F0F\uFF0C\u53EF\u4EE5\u5B8C\u7F8E\u652F\u6301\u4E3B\u9898\u5207\u6362\u3002 </p><!--[-->`);
            ssrRenderList(temps.value, (item, index2) => {
              _push2(`<div class="mockup-window border bg-base-300 w-full mb-8"${ssrRenderAttr("id", "card-a" + index2)} data-v-f9d32580${_scopeId}><div class="${ssrRenderClass([{ "btn-outline": item.preview }, "btn btn-sm btn-square btn-primary absolute right-8 top-2 gap-2"])}" data-v-f9d32580${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-f9d32580${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" data-v-f9d32580${_scopeId}></path></svg></div><div class="flex justify-center px-4 lg:pt-16 lg:pb-10 pt-8 pb-5 bg-base-200" data-v-f9d32580${_scopeId}>${item.html}</div><pre class="bg-base-200 px-4" style="${ssrRenderStyle(!item.preview ? null : { display: "none" })}" data-v-f9d32580${_scopeId}>            <code${ssrRenderAttr("id", "pre-" + index2)} class="rounded-box" data-v-f9d32580${_scopeId}>${ssrInterpolate(item.html)}</code>
          </pre></div>`);
            });
            _push2(`<!--]--></div></main>`);
          } else {
            return [
              createVNode("main", { class: "main-content flex" }, [
                createVNode("aside", {
                  class: [
                    { fixed: asideFixed.value },
                    "top-0 w-96 flex-shrink-0 max-h-screen hidden lg:flex flex-col z-10 "
                  ]
                }, [
                  createVNode("section", {
                    class: ["w-full lg:pr-10 my-5", { hidden: !asideFixed.value }]
                  }, [
                    createVNode("div", { class: "p-2 h-min rounded-box" }, [
                      createVNode(_component_Logo)
                    ])
                  ], 2),
                  createVNode("section", { class: "w-full lg:pr-10" }, [
                    createVNode("ul", { class: "menu bg-base-100 p-2 w-full h-min rounded-box" }, [
                      createVNode("li", { class: "menu-title py-2" }, [
                        createVNode("span", null, "List")
                      ]),
                      (openBlock(true), createBlock(Fragment$1, null, renderList(temps.value, (item, index2) => {
                        return openBlock(), createBlock("li", {
                          class: "text-xl",
                          key: index2,
                          onClick: ($event) => curTemp.value = index2
                        }, [
                          createVNode("a", {
                            href: "#card-a" + index2,
                            class: {
                              active: curTemp.value === index2,
                              capitalize: curTemp.value === index2
                            }
                          }, toDisplayString$1(index2 + 1) + " . card ", 11, ["href"])
                        ], 8, ["onClick"]);
                      }), 128))
                    ])
                  ])
                ], 2),
                withDirectives(createVNode("aside", { class: "w-96 flex-shrink-0 opacity-0 hidden lg:flex" }, null, 512), [
                  [vShow, asideFixed.value]
                ]),
                createVNode("div", { class: "flex-1 relative overflow-hidden px-5 bg-base-100 py-10 rounded-box prose" }, [
                  createVNode("h1", null, "Tailwind CSS - Card"),
                  createVNode("p", null, [
                    createTextVNode(" \u6536\u96C6\u7684\u4E00\u4E9B"),
                    createVNode("code", null, "Card"),
                    createTextVNode("\u6837\u5F0F\uFF0C\u6240\u6709\u7684\u6A21\u677F\u5747\u6539\u9020\u4E3A "),
                    createVNode("code", null, "DaisyUI"),
                    createTextVNode(" \u4E3B\u9898\u6837\u5F0F\uFF0C\u53EF\u4EE5\u5B8C\u7F8E\u652F\u6301\u4E3B\u9898\u5207\u6362\u3002 ")
                  ]),
                  (openBlock(true), createBlock(Fragment$1, null, renderList(temps.value, (item, index2) => {
                    return openBlock(), createBlock("div", {
                      class: "mockup-window border bg-base-300 w-full mb-8",
                      id: "card-a" + index2,
                      key: index2
                    }, [
                      createVNode("div", {
                        class: ["btn btn-sm btn-square btn-primary absolute right-8 top-2 gap-2", { "btn-outline": item.preview }],
                        onClick: ($event) => showCode(index2)
                      }, [
                        (openBlock(), createBlock("svg", {
                          xmlns: "http://www.w3.org/2000/svg",
                          class: "h-6 w-6",
                          fill: "none",
                          viewBox: "0 0 24 24",
                          stroke: "currentColor",
                          "stroke-width": "2"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            d: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                          })
                        ]))
                      ], 10, ["onClick"]),
                      createVNode("div", {
                        class: "flex justify-center px-4 lg:pt-16 lg:pb-10 pt-8 pb-5 bg-base-200",
                        innerHTML: item.html
                      }, null, 8, ["innerHTML"]),
                      withDirectives(createVNode("pre", { class: "bg-base-200 px-4" }, [
                        createTextVNode("            "),
                        createVNode("code", {
                          id: "pre-" + index2,
                          class: "rounded-box"
                        }, toDisplayString$1(item.html), 9, ["id"]),
                        createTextVNode("\n          ")
                      ], 512), [
                        [vShow, !item.preview]
                      ])
                    ], 8, ["id"]);
                  }), 128))
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/template/cards/index.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const index$6 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-f9d32580"]]);
const index$7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": index$6
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$7 = {
  name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const curTypes = ref(0);
    useHead({
      titleTemplate: `Image Space - ${useTitle().title}`,
      meta: [
        {
          name: "description",
          content: "\u6839\u636E\u7C7B\u578B\u968F\u673A\u751F\u6210\u56FE\u7247\uFF0C\u53EF\u4EE5\u7406\u89E3\u4E3A\u6709\u771F\u5B9E\u56FE\u7247\u7684\u5360\u4F4D\u56FE\uFF0C\u652F\u6301\u7C7B\u578B\uFF1Aavatar/coffee/dog/girls..."
        }
      ]
    });
    const { data } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("image-space", () => useStrapi4().find(`posts/4`))), __temp = await __temp, __restore(), __temp);
    const post = computed(() => {
      return data.value.data.attributes;
    });
    const types = computed(() => {
      return post.value.imageSpace;
    });
    const onChange = (y) => {
      asideFixed.value = y > 150;
    };
    const asideFixed = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0$1;
      const _component_Logo = __nuxt_component_1;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({ onChange }, _attrs), {
        title: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Random Image`);
          } else {
            return [
              createTextVNode("Random Image")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<main class="main-content flex"${_scopeId}><aside class="${ssrRenderClass([
              { fixed: asideFixed.value },
              "top-0 w-96 max-h-screen hidden lg:flex flex-col z-10 "
            ])}"${_scopeId}><section class="${ssrRenderClass([{ hidden: !asideFixed.value }, "w-full lg:pr-10 my-5"])}"${_scopeId}><div class="p-2 h-min rounded-box"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Logo, null, null, _parent2, _scopeId));
            _push2(`</div></section><section class="w-full lg:pr-10"${_scopeId}><ul class="menu bg-base-100 p-2 w-full h-min rounded-box"${_scopeId}><li class="menu-title py-2"${_scopeId}><span${_scopeId}>Type</span></li><!--[-->`);
            ssrRenderList(unref(types), (item, index2) => {
              _push2(`<li class="text-xl"${_scopeId}><a${ssrRenderAttr("href", "#" + item.name)} class="${ssrRenderClass({
                active: curTypes.value === index2,
                capitalize: curTypes.value === index2
              })}"${_scopeId}>${ssrInterpolate(item.name)}</a></li>`);
            });
            _push2(`<!--]--></ul></section></aside><aside class="w-96 opacity-0 hidden lg:flex" style="${ssrRenderStyle(asideFixed.value ? null : { display: "none" })}"${_scopeId}></aside><div class="flex-1 px-5 py-10 bg-white rounded-md prose prose-neutral prose-a:text-blue-500"${_scopeId}><h1${_scopeId}>Random Image</h1><p${_scopeId}>\u6839\u636E\u7C7B\u578B\u968F\u673A\u751F\u6210\u4E00\u5F20\u56FE\u7247</p><ul${_scopeId}><li${_scopeId}>\u89C4\u5219: https://wcao.cc/image-space/api/{\u7C7B\u578B}</li><li${_scopeId}>\u4E00\u4E2A\u9875\u9762\u4F7F\u7528\u591A\u5F20: \u89C4\u5219\u540E\u9762\u52A0\u4E0A\u53C2\u6570\uFF0C\u4FDD\u8BC1\u94FE\u63A5\u4E0D\u540C\uFF01\uFF01\uFF01</li></ul><!--[-->`);
            ssrRenderList(unref(types), (item) => {
              _push2(`<article${_scopeId}><h2${ssrRenderAttr("id", item.name)} class="capitalize flex justify-between"${_scopeId}><span${_scopeId}><small class="text-gray-400"${_scopeId}># </small>${ssrInterpolate(item.name)}</span>`);
              if (item.link) {
                _push2(`<a${ssrRenderAttr("href", item.link)} target="_blank" class="font-normal text-base"${_scopeId}> \u6570\u636E\u6765\u6E90 \u{1F449}\u{1F3FB} </a>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</h2><div class="grid grid-cols-4 gap-4"${_scopeId}><!--[-->`);
              ssrRenderList(4, (num) => {
                _push2(`<img class="w-48 rounded-md my-0"${ssrRenderAttr("src", `https://wcao.cc/image-space/api/${item.name}?${num}`)}${_scopeId}>`);
              });
              _push2(`<!--]--></div><p${_scopeId}>Try</p><pre${_scopeId}> https://wcao.cc/image-space/api/${ssrInterpolate(item.name)}?xxx </pre></article>`);
            });
            _push2(`<!--]--></div></main>`);
          } else {
            return [
              createVNode("main", { class: "main-content flex" }, [
                createVNode("aside", {
                  class: [
                    { fixed: asideFixed.value },
                    "top-0 w-96 max-h-screen hidden lg:flex flex-col z-10 "
                  ]
                }, [
                  createVNode("section", {
                    class: ["w-full lg:pr-10 my-5", { hidden: !asideFixed.value }]
                  }, [
                    createVNode("div", { class: "p-2 h-min rounded-box" }, [
                      createVNode(_component_Logo)
                    ])
                  ], 2),
                  createVNode("section", { class: "w-full lg:pr-10" }, [
                    createVNode("ul", { class: "menu bg-base-100 p-2 w-full h-min rounded-box" }, [
                      createVNode("li", { class: "menu-title py-2" }, [
                        createVNode("span", null, "Type")
                      ]),
                      (openBlock(true), createBlock(Fragment$1, null, renderList(unref(types), (item, index2) => {
                        return openBlock(), createBlock("li", {
                          class: "text-xl",
                          key: item,
                          onClick: ($event) => curTypes.value = index2
                        }, [
                          createVNode("a", {
                            href: "#" + item.name,
                            class: {
                              active: curTypes.value === index2,
                              capitalize: curTypes.value === index2
                            }
                          }, toDisplayString$1(item.name), 11, ["href"])
                        ], 8, ["onClick"]);
                      }), 128))
                    ])
                  ])
                ], 2),
                withDirectives(createVNode("aside", { class: "w-96 opacity-0 hidden lg:flex" }, null, 512), [
                  [vShow, asideFixed.value]
                ]),
                createVNode("div", { class: "flex-1 px-5 py-10 bg-white rounded-md prose prose-neutral prose-a:text-blue-500" }, [
                  createVNode("h1", null, "Random Image"),
                  createVNode("p", null, "\u6839\u636E\u7C7B\u578B\u968F\u673A\u751F\u6210\u4E00\u5F20\u56FE\u7247"),
                  createVNode("ul", null, [
                    createVNode("li", null, "\u89C4\u5219: https://wcao.cc/image-space/api/{\u7C7B\u578B}"),
                    createVNode("li", null, "\u4E00\u4E2A\u9875\u9762\u4F7F\u7528\u591A\u5F20: \u89C4\u5219\u540E\u9762\u52A0\u4E0A\u53C2\u6570\uFF0C\u4FDD\u8BC1\u94FE\u63A5\u4E0D\u540C\uFF01\uFF01\uFF01")
                  ]),
                  (openBlock(true), createBlock(Fragment$1, null, renderList(unref(types), (item) => {
                    return openBlock(), createBlock("article", null, [
                      createVNode("h2", {
                        id: item.name,
                        class: "capitalize flex justify-between"
                      }, [
                        createVNode("span", null, [
                          createVNode("small", { class: "text-gray-400" }, "# "),
                          createTextVNode(toDisplayString$1(item.name), 1)
                        ]),
                        item.link ? (openBlock(), createBlock("a", {
                          key: 0,
                          href: item.link,
                          target: "_blank",
                          class: "font-normal text-base"
                        }, " \u6570\u636E\u6765\u6E90 \u{1F449}\u{1F3FB} ", 8, ["href"])) : createCommentVNode("", true)
                      ], 8, ["id"]),
                      createVNode("div", { class: "grid grid-cols-4 gap-4" }, [
                        (openBlock(), createBlock(Fragment$1, null, renderList(4, (num) => {
                          return createVNode("img", {
                            class: "w-48 rounded-md my-0",
                            src: `https://wcao.cc/image-space/api/${item.name}?${num}`
                          }, null, 8, ["src"]);
                        }), 64))
                      ]),
                      createVNode("p", null, "Try"),
                      createVNode("pre", null, " https://wcao.cc/image-space/api/" + toDisplayString$1(item.name) + "?xxx ", 1)
                    ]);
                  }), 256))
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/image-space/index.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const index$5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main$7
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$6 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLayout = __nuxt_component_0$1;
  _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({ name: "default" }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` 123132 `);
      } else {
        return [
          createTextVNode(" 123132 ")
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/index/index.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const index$3 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender]]);
const index$4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": index$3
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  name: "dart",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      titleTemplate: `JSON\u5728\u7EBF\u8F6C\u6362\u5DE5\u5177(to dart) - ${useTitle().title}`,
      meta: [
        {
          name: "description",
          content: "json\u8F6C\u6362\u4E3Adart class, json transform to dart"
        }
      ]
    });
    const change = async (e) => {
      jsonValue.value = e.getValue();
      const code = await useJsonToLanguage(useRoute().path.replace("/tools/json-to-language/", ""), jsonValue.value);
      localStorage.setItem("json-to-language", jsonValue.value);
      codeOption.code = code;
    };
    const jsonValue = ref(useJsonDefaultValue());
    watch(() => useRoute(), (e) => {
      jsonValue.value = useJsonDefaultValue();
    });
    const codeOption = reactive({
      code: "",
      codeMirrorMode: "dart"
    });
    onMounted(async () => {
      const code = await useJsonToLanguage(useRoute().path.replace("/tools/json-to-language/", ""), jsonValue.value);
      codeOption.code = code;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Editor = __nuxt_component_0;
      _push(ssrRenderComponent(_component_Editor, mergeProps({
        onChange: change,
        "json-value": jsonValue.value,
        "code-option": codeOption
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/json-to-language/dart.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const dart = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main$5
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      titleTemplate: `JSON\u5728\u7EBF\u8F6C\u6362\u5DE5\u5177(to dart) - ${useTitle().title}`,
      meta: [
        {
          name: "description",
          content: "json\u8F6C\u6362\u4E3Adart class, json transform to dart"
        }
      ]
    });
    const change = async (e) => {
      jsonValue.value = e.getValue();
      const code = await useJsonToLanguage("dart", jsonValue.value);
      localStorage.setItem("json-to-language", jsonValue.value);
      codeOption.code = code;
    };
    const jsonValue = ref(useJsonDefaultValue());
    watch(() => useRoute(), (e) => {
      jsonValue.value = useJsonDefaultValue();
    });
    const codeOption = reactive({
      code: "",
      codeMirrorMode: "dart"
    });
    onMounted(async () => {
      const code = await useJsonToLanguage("dart", jsonValue.value);
      codeOption.code = code;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Editor = __nuxt_component_0;
      _push(ssrRenderComponent(_component_Editor, mergeProps({
        onChange: change,
        "json-value": jsonValue.value,
        "code-option": codeOption
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/json-to-language/index.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const index$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main$4
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  name: "json-schema",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      titleTemplate: `JSON\u5728\u7EBF\u8F6C\u6362\u5DE5\u5177(to json-schema) - ${useTitle().title}`,
      meta: [
        {
          name: "description",
          content: "json\u8F6C\u6362json-schema, json transform to json-schema"
        }
      ]
    });
    const change = async (e) => {
      jsonValue.value = e.getValue();
      localStorage.setItem("json-to-language", jsonValue.value);
      codeOption.code = formatJson(jsonValue.value);
    };
    const jsonValue = ref(useJsonDefaultValue());
    watch(() => useRoute(), (e) => {
      jsonValue.value = useJsonDefaultValue();
    });
    const codeOption = reactive({
      code: "",
      codeMirrorMode: "dart"
    });
    onMounted(async () => {
      codeOption.code = formatJson(jsonValue.value);
    });
    const formatJson = (value) => {
      const res = toJsonSchema(JSON.parse(value));
      return jsonFormat(res);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Editor = __nuxt_component_0;
      _push(ssrRenderComponent(_component_Editor, mergeProps({
        onChange: change,
        "json-value": jsonValue.value,
        "code-option": codeOption
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/json-to-language/json-schema.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const jsonSchema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main$3
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      titleTemplate: `JSON\u5728\u7EBF\u8F6C\u6362\u5DE5\u5177(to mockjs) - ${useTitle().title}`,
      meta: [
        {
          name: "description",
          content: "json\u8F6C\u6362mockjs, json transform to mockjs"
        }
      ]
    });
    const change = async (e) => {
      jsonValue.value = e.getValue();
      codeOption.code = toMockjs(jsonValue.value);
    };
    const jsonValue = ref(useJsonDefaultValue());
    watch(() => useRoute(), (e) => {
      jsonValue.value = useJsonDefaultValue();
    });
    const codeOption = reactive({
      code: "",
      codeMirrorMode: "mockjs"
    });
    onMounted(async () => {
      codeOption.code = toMockjs(jsonValue.value);
    });
    const toMockjs = (value) => {
      const res = toJsonSchema(JSON.parse(value));
      const str = useJsontoMock(res.properties);
      console.log(str);
      return jsonFormat(JSON.parse(str));
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Editor = __nuxt_component_0;
      _push(ssrRenderComponent(_component_Editor, mergeProps({
        onChange: change,
        "json-value": jsonValue.value,
        "code-option": codeOption
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/json-to-language/mockjs/index.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const index$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main$2
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  name: "typescript",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      titleTemplate: `JSON\u5728\u7EBF\u8F6C\u6362\u5DE5\u5177(to typescript) - ${useTitle().title}`,
      meta: [
        {
          name: "description",
          content: "json\u8F6C\u6362\u4E3Atypescript, json transform to typescript"
        }
      ]
    });
    const change = async (e) => {
      jsonValue.value = e.getValue();
      const code = await useJsonToLanguage(useRoute().path.replace("/tools/json-to-language/", ""), jsonValue.value);
      localStorage.setItem("json-to-language", jsonValue.value);
      codeOption.code = code;
    };
    const jsonValue = ref(useJsonDefaultValue());
    watch(() => useRoute(), (e) => {
      jsonValue.value = useJsonDefaultValue();
    });
    const codeOption = reactive({
      code: "",
      codeMirrorMode: "dart"
    });
    onMounted(async () => {
      const code = await useJsonToLanguage(useRoute().path.replace("/tools/json-to-language/", ""), jsonValue.value);
      codeOption.code = code;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Editor = __nuxt_component_0;
      _push(ssrRenderComponent(_component_Editor, mergeProps({
        onChange: change,
        "json-value": jsonValue.value,
        "code-option": codeOption
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/json-to-language/typescript.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const typescript = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main$1
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main = {
  name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const opts = [
      "//www.ckmov.com/?url=",
      "//www.ckmov.vip/api.php?url=",
      "//jx.playerjy.com/?url=",
      "//pangujiexi.cc/jiexi.php?url=",
      "//jx.xmflv.com/?url=",
      "//jx.aidouer.net/?url=",
      "//jx.m3u8.tv/jiexi/?url=",
      "//jiexi.8old.cn/m3u8tv20210705%60/?url="
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({ name: "tools" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="container h-full m-auto px-32 flex flex-col"${_scopeId}><div class="px-8 bg-black bg-opacity-25 rounded-md py-4"${_scopeId}><div class="w-48"${_scopeId}><select class="p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"${_scopeId}><option selected disabled${_scopeId}>\u9009\u62E9\u7EBF\u8DEF</option><!--[-->`);
            ssrRenderList(opts, (item, index2) => {
              _push2(`<option${ssrRenderAttr("value", item)}${_scopeId}> \u89E3\u6790\u7EBF\u8DEF ${ssrInterpolate(index2 + 1)}</option>`);
            });
            _push2(`<!--]--></select></div></div><iframe class="m-auto flex-1 w-full border border-white mt-4 rounded-md" src="https://jx.playerjy.com/?url=https://v.qq.com/x/cover/m441e3rjq9kwpsc/j00428z3ci0.html" frameborder="0"${_scopeId}></iframe></div>`);
          } else {
            return [
              createVNode("div", { class: "container h-full m-auto px-32 flex flex-col" }, [
                createVNode("div", { class: "px-8 bg-black bg-opacity-25 rounded-md py-4" }, [
                  createVNode("div", { class: "w-48" }, [
                    createVNode("select", { class: "p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" }, [
                      createVNode("option", {
                        selected: "",
                        disabled: ""
                      }, "\u9009\u62E9\u7EBF\u8DEF"),
                      (openBlock(), createBlock(Fragment$1, null, renderList(opts, (item, index2) => {
                        return createVNode("option", { value: item }, " \u89E3\u6790\u7EBF\u8DEF " + toDisplayString$1(index2 + 1), 9, ["value"]);
                      }), 64))
                    ])
                  ])
                ]),
                createVNode("iframe", {
                  class: "m-auto flex-1 w-full border border-white mt-4 rounded-md",
                  src: "https://jx.playerjy.com/?url=https://v.qq.com/x/cover/m441e3rjq9kwpsc/j00428z3ci0.html",
                  frameborder: "0"
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/parsing-video/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main
}, Symbol.toStringTag, { value: "Module" }));
export { entry$1 as default };
