globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import 'node-fetch-native/polyfill';
import { Server as Server$1 } from 'http';
import { Server } from 'https';
import destr from 'destr';
import { defineEventHandler, handleCacheHeaders, createEvent, eventHandler, createError, createApp, createRouter, lazyEventHandler } from 'h3';
import { createFetch as createFetch$1, Headers } from 'ohmyfetch';
import { createRouter as createRouter$1 } from 'radix3';
import { createCall, createFetch } from 'unenv/runtime/fetch/index';
import { createHooks } from 'hookable';
import { snakeCase } from 'scule';
import { hash } from 'ohash';
import { createStorage } from 'unstorage';
import { withQuery, withLeadingSlash, withoutTrailingSlash, parseURL } from 'ufo';
import { promises } from 'fs';
import { resolve, dirname } from 'pathe';
import { fileURLToPath } from 'url';

const _runtimeConfig = {"app":{"baseURL":"/","buildAssetsDir":"/_nuxt/","cdnURL":""},"nitro":{"routes":{},"envPrefix":"NUXT_"},"public":{"strapi":{"url":"https://wcao.cc/strapi","prefix":"/api","version":"v4","cookie":{}}}};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _runtimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
const getEnv = (key) => {
  const envKey = snakeCase(key).toUpperCase();
  return destr(process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]);
};
function isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function overrideConfig(obj, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey);
    if (isObject(obj[key])) {
      if (isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
      }
      overrideConfig(obj[key], subKey);
    } else {
      obj[key] = envValue ?? obj[key];
    }
  }
}
overrideConfig(_runtimeConfig);
const config = deepFreeze(_runtimeConfig);
const useRuntimeConfig = () => config;
function deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }
  return Object.freeze(object);
}

const globalTiming = globalThis.__timing__ || {
  start: () => 0,
  end: () => 0,
  metrics: []
};
function timingMiddleware(_req, res, next) {
  const start = globalTiming.start();
  const _end = res.end;
  res.end = (data, encoding, callback) => {
    const metrics = [["Generate", globalTiming.end(start)], ...globalTiming.metrics];
    const serverTiming = metrics.map((m) => `-;dur=${m[1]};desc="${encodeURIComponent(m[0])}"`).join(", ");
    if (!res.headersSent) {
      res.setHeader("Server-Timing", serverTiming);
    }
    _end.call(res, data, encoding, callback);
  };
  next();
}

const _assets = {

};

function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
}

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

const storage = createStorage({});

const useStorage = () => storage;

storage.mount('/assets', assets$1);

const defaultCacheOptions = {
  name: "_",
  base: "/cache",
  swr: true,
  maxAge: 1
};
function defineCachedFunction(fn, opts) {
  opts = { ...defaultCacheOptions, ...opts };
  const pending = {};
  const group = opts.group || "nitro";
  const name = opts.name || fn.name || "_";
  const integrity = hash([opts.integrity, fn, opts]);
  async function get(key, resolver) {
    const cacheKey = [opts.base, group, name, key].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl;
    const _resolve = async () => {
      if (!pending[key]) {
        pending[key] = Promise.resolve(resolver());
      }
      entry.value = await pending[key];
      entry.mtime = Date.now();
      entry.integrity = integrity;
      delete pending[key];
      useStorage().setItem(cacheKey, entry).catch((error) => console.error("[nitro] [cache]", error));
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (opts.swr && entry.value) {
      _resolvePromise.catch(console.error);
      return Promise.resolve(entry);
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const key = (opts.getKey || getKey)(...args);
    const entry = await get(key, () => fn(...args));
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
const cachedFunction = defineCachedFunction;
function getKey(...args) {
  return args.length ? hash(args, {}) : "";
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions) {
  const _opts = {
    ...opts,
    getKey: (event) => {
      return event.req.originalUrl || event.req.url;
    },
    group: opts.group || "nitro/handlers",
    integrity: [
      opts.integrity,
      handler
    ]
  };
  const _cachedHandler = cachedFunction(async (incomingEvent) => {
    const reqProxy = cloneWithProxy(incomingEvent.req, { headers: {} });
    const resHeaders = {};
    const resProxy = cloneWithProxy(incomingEvent.res, {
      statusCode: 200,
      getHeader(name) {
        return resHeaders[name];
      },
      setHeader(name, value) {
        resHeaders[name] = value;
        return this;
      },
      getHeaderNames() {
        return Object.keys(resHeaders);
      },
      hasHeader(name) {
        return name in resHeaders;
      },
      removeHeader(name) {
        delete resHeaders[name];
      },
      getHeaders() {
        return resHeaders;
      }
    });
    const event = createEvent(reqProxy, resProxy);
    event.context = incomingEvent.context;
    const body = await handler(event);
    const headers = event.res.getHeaders();
    headers.Etag = `W/"${hash(body)}"`;
    headers["Last-Modified"] = new Date().toUTCString();
    const cacheControl = [];
    if (opts.swr) {
      if (opts.maxAge) {
        cacheControl.push(`s-maxage=${opts.maxAge}`);
      }
      if (opts.staleMaxAge) {
        cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
      } else {
        cacheControl.push("stale-while-revalidate");
      }
    } else if (opts.maxAge) {
      cacheControl.push(`max-age=${opts.maxAge}`);
    }
    if (cacheControl.length) {
      headers["Cache-Control"] = cacheControl.join(", ");
    }
    const cacheEntry = {
      code: event.res.statusCode,
      headers,
      body
    };
    return cacheEntry;
  }, _opts);
  return defineEventHandler(async (event) => {
    const response = await _cachedHandler(event);
    if (event.res.headersSent || event.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["Last-Modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.res.statusCode = response.code;
    for (const name in response.headers) {
      event.res.setHeader(name, response.headers[name]);
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const plugins = [
  
];

function hasReqHeader(req, header, includes) {
  const value = req.headers[header];
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  return hasReqHeader(event.req, "accept", "application/json") || hasReqHeader(event.req, "user-agent", "curl/") || hasReqHeader(event.req, "user-agent", "httpie/") || event.req.url?.endsWith(".json") || event.req.url?.includes("/api/");
}
function normalizeError(error) {
  const cwd = process.cwd();
  const stack = (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Route Not Found" : "Internal Server Error");
  const message = error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}

const errorHandler = (async function errorhandler(_error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(_error);
  const errorObject = {
    url: event.req.url,
    statusCode,
    statusMessage,
    message,
    description: "",
    data: _error.data
  };
  event.res.statusCode = errorObject.statusCode;
  event.res.statusMessage = errorObject.statusMessage;
  if (errorObject.statusCode !== 404) {
    console.error("[nuxt] [request error]", errorObject.message + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  if (isJsonRequest(event)) {
    event.res.setHeader("Content-Type", "application/json");
    event.res.end(JSON.stringify(errorObject));
    return;
  }
  const url = withQuery("/__nuxt_error", errorObject);
  const html = await $fetch(url).catch((error) => {
    console.error("[nitro] Error while generating error response", error);
    return errorObject.statusMessage;
  });
  event.res.setHeader("Content-Type", "text/html;charset=UTF-8");
  event.res.end(html);
});

const assets = {
  "/avatar.jpg": {
    "type": "image/jpeg",
    "etag": "\"3edb-MqMXKlI1VNFCrXABCXREW+TV35Y\"",
    "mtime": "2022-06-13T08:14:12.245Z",
    "path": "../public/avatar.jpg"
  },
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"1083e-tE4ui7iwGCCqvSw9JgARLIHd+EI\"",
    "mtime": "2022-06-13T08:14:12.245Z",
    "path": "../public/favicon.ico"
  },
  "/robots.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"26-SG58r6mmzshIr97g7jLG5QJuRow\"",
    "mtime": "2022-06-13T08:14:12.244Z",
    "path": "../public/robots.txt"
  },
  "/sitemap.xml": {
    "type": "application/xml",
    "etag": "\"40f-gfM568fGJsGWbiyMd0CwQHzENdI\"",
    "mtime": "2022-06-13T08:14:12.230Z",
    "path": "../public/sitemap.xml"
  },
  "/_nuxt/Editor-3a35710b.mjs": {
    "type": "application/javascript",
    "etag": "\"f84-4Nw4jnMJVHqb1MS4Q8wav5S2bJY\"",
    "mtime": "2022-06-13T08:14:12.244Z",
    "path": "../public/_nuxt/Editor-3a35710b.mjs"
  },
  "/_nuxt/Footer-b5fa0347.mjs": {
    "type": "application/javascript",
    "etag": "\"571-lm9KbYaA8EX+qrcw8GVJ767WuDA\"",
    "mtime": "2022-06-13T08:14:12.243Z",
    "path": "../public/_nuxt/Footer-b5fa0347.mjs"
  },
  "/_nuxt/Logo-0807f729.mjs": {
    "type": "application/javascript",
    "etag": "\"b53-x2qTmu3vdSuXbXfza+bEct0InIs\"",
    "mtime": "2022-06-13T08:14:12.243Z",
    "path": "../public/_nuxt/Logo-0807f729.mjs"
  },
  "/_nuxt/_id_-3dcc3d76.mjs": {
    "type": "application/javascript",
    "etag": "\"101a-fcGBg3XEkDLjT1ZkEHEYxiqO+pA\"",
    "mtime": "2022-06-13T08:14:12.243Z",
    "path": "../public/_nuxt/_id_-3dcc3d76.mjs"
  },
  "/_nuxt/dart-9e361d80.mjs": {
    "type": "application/javascript",
    "etag": "\"452-LE/h39bpoDEj0O+pwN9/XVdrQ80\"",
    "mtime": "2022-06-13T08:14:12.242Z",
    "path": "../public/_nuxt/dart-9e361d80.mjs"
  },
  "/_nuxt/default-eed6f74a.mjs": {
    "type": "application/javascript",
    "etag": "\"36f-+fJtKiVS6pCG+yk088bwepBbohM\"",
    "mtime": "2022-06-13T08:14:12.242Z",
    "path": "../public/_nuxt/default-eed6f74a.mjs"
  },
  "/_nuxt/default.9ee72091.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1c3-FU5I0saC/g6OpXwxbkn4fX5r90A\"",
    "mtime": "2022-06-13T08:14:12.242Z",
    "path": "../public/_nuxt/default.9ee72091.css"
  },
  "/_nuxt/entry-64645e6b.mjs": {
    "type": "application/javascript",
    "etag": "\"94f75-ixGqRla2veFqSnSiRa+MySDxc6U\"",
    "mtime": "2022-06-13T08:14:12.241Z",
    "path": "../public/_nuxt/entry-64645e6b.mjs"
  },
  "/_nuxt/entry.26502565.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1ae5f-3kMh0zThK5vEukuhUYl9xbFkuv0\"",
    "mtime": "2022-06-13T08:14:12.240Z",
    "path": "../public/_nuxt/entry.26502565.css"
  },
  "/_nuxt/hooks-6ec93a60.mjs": {
    "type": "application/javascript",
    "etag": "\"147-BxKKDQr8JwO9y9FcYR/wq22/dJg\"",
    "mtime": "2022-06-13T08:14:12.239Z",
    "path": "../public/_nuxt/hooks-6ec93a60.mjs"
  },
  "/_nuxt/index-1776a497.mjs": {
    "type": "application/javascript",
    "etag": "\"2226-ExQt7BtB6l0WWGiIdPqCYPGVLNQ\"",
    "mtime": "2022-06-13T08:14:12.239Z",
    "path": "../public/_nuxt/index-1776a497.mjs"
  },
  "/_nuxt/index-a377f99b.mjs": {
    "type": "application/javascript",
    "etag": "\"cc4-xh5P2supndX7r1+pCCTaSdgYF6k\"",
    "mtime": "2022-06-13T08:14:12.239Z",
    "path": "../public/_nuxt/index-a377f99b.mjs"
  },
  "/_nuxt/index-b367dbb0.mjs": {
    "type": "application/javascript",
    "etag": "\"e6-4aONAgziAECiDVf7DzxbtNvi8L8\"",
    "mtime": "2022-06-13T08:14:12.238Z",
    "path": "../public/_nuxt/index-b367dbb0.mjs"
  },
  "/_nuxt/index-b5d4248c.mjs": {
    "type": "application/javascript",
    "etag": "\"439-wM4miR463Q/RGH4eN87N7J8Y1P8\"",
    "mtime": "2022-06-13T08:14:12.238Z",
    "path": "../public/_nuxt/index-b5d4248c.mjs"
  },
  "/_nuxt/index-b9c9cd0a.mjs": {
    "type": "application/javascript",
    "etag": "\"401-F5uEz9X45JKy2x9cMwEFr0j3/qI\"",
    "mtime": "2022-06-13T08:14:12.238Z",
    "path": "../public/_nuxt/index-b9c9cd0a.mjs"
  },
  "/_nuxt/index-d4998365.mjs": {
    "type": "application/javascript",
    "etag": "\"c35-+vW0uuL1Ftds4PqLEfwdhHqmqUQ\"",
    "mtime": "2022-06-13T08:14:12.237Z",
    "path": "../public/_nuxt/index-d4998365.mjs"
  },
  "/_nuxt/index-ed8b9815.mjs": {
    "type": "application/javascript",
    "etag": "\"fc4f6-dedMwskqTOaDBLghqvLkVT+2ItA\"",
    "mtime": "2022-06-13T08:14:12.237Z",
    "path": "../public/_nuxt/index-ed8b9815.mjs"
  },
  "/_nuxt/index-ef78177c.mjs": {
    "type": "application/javascript",
    "etag": "\"1dc4-qNQl4vtsSgQW6uzW5VwNApmZqUU\"",
    "mtime": "2022-06-13T08:14:12.235Z",
    "path": "../public/_nuxt/index-ef78177c.mjs"
  },
  "/_nuxt/index-f31ef74c.mjs": {
    "type": "application/javascript",
    "etag": "\"5a6-FiIvYgUgblME2Sxf9nX5Jijw9Iw\"",
    "mtime": "2022-06-13T08:14:12.234Z",
    "path": "../public/_nuxt/index-f31ef74c.mjs"
  },
  "/_nuxt/json-schema-3fa0e26d.mjs": {
    "type": "application/javascript",
    "etag": "\"41d-PcEglbF10U0i/uAkCI9W8KEkUZg\"",
    "mtime": "2022-06-13T08:14:12.234Z",
    "path": "../public/_nuxt/json-schema-3fa0e26d.mjs"
  },
  "/_nuxt/jsonToMock-e1744ddc.mjs": {
    "type": "application/javascript",
    "etag": "\"1b9-Z0aN1FOx++dr1hyYmzPdNXhlDQM\"",
    "mtime": "2022-06-13T08:14:12.233Z",
    "path": "../public/_nuxt/jsonToMock-e1744ddc.mjs"
  },
  "/_nuxt/manifest.json": {
    "type": "application/json",
    "etag": "\"17c8-i4UtZCGcpQif15vTxKbUFLFxdGU\"",
    "mtime": "2022-06-13T08:14:12.233Z",
    "path": "../public/_nuxt/manifest.json"
  },
  "/_nuxt/swiper-slide-cc32f4bc.mjs": {
    "type": "application/javascript",
    "etag": "\"53fc-L6dhQyviAGCNQpMK83BpvuJ3/N8\"",
    "mtime": "2022-06-13T08:14:12.233Z",
    "path": "../public/_nuxt/swiper-slide-cc32f4bc.mjs"
  },
  "/_nuxt/tools-daad8190.mjs": {
    "type": "application/javascript",
    "etag": "\"25c-m8HG/m6POqXcgKU6RAxLpyYSH04\"",
    "mtime": "2022-06-13T08:14:12.232Z",
    "path": "../public/_nuxt/tools-daad8190.mjs"
  },
  "/_nuxt/typescript-4ccc9a12.mjs": {
    "type": "application/javascript",
    "etag": "\"464-oQUBQhC7xjYLCM0q11ftPds9hAw\"",
    "mtime": "2022-06-13T08:14:12.232Z",
    "path": "../public/_nuxt/typescript-4ccc9a12.mjs"
  },
  "/_nuxt/useStrapi4-27da70da.mjs": {
    "type": "application/javascript",
    "etag": "\"aa6-1HoqzW0PqJTKxY/9rnycAMuoY3k\"",
    "mtime": "2022-06-13T08:14:12.231Z",
    "path": "../public/_nuxt/useStrapi4-27da70da.mjs"
  }
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = ["/_nuxt"];

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return
  }
  for (const base of publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = ["HEAD", "GET"];
const _152570 = eventHandler(async (event) => {
  if (event.req.method && !METHODS.includes(event.req.method)) {
    return;
  }
  let id = decodeURIComponent(withLeadingSlash(withoutTrailingSlash(parseURL(event.req.url).pathname)));
  let asset;
  for (const _id of [id, id + "/index.html"]) {
    const _asset = getAsset(_id);
    if (_asset) {
      asset = _asset;
      id = _id;
      break;
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = event.req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    event.res.statusCode = 304;
    event.res.end("Not Modified (etag)");
    return;
  }
  const ifModifiedSinceH = event.req.headers["if-modified-since"];
  if (ifModifiedSinceH && asset.mtime) {
    if (new Date(ifModifiedSinceH) >= new Date(asset.mtime)) {
      event.res.statusCode = 304;
      event.res.end("Not Modified (mtime)");
      return;
    }
  }
  if (asset.type) {
    event.res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag) {
    event.res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime) {
    event.res.setHeader("Last-Modified", asset.mtime);
  }
  const contents = await readAsset(id);
  event.res.end(contents);
});

const _lazy_391826 = () => import('../jsonToLanguage.mjs');
const _lazy_380681 = () => import('../handlers/renderer.mjs').then(function (n) { return n.a; });

const handlers = [
  { route: '', handler: _152570, lazy: false, middleware: true, method: undefined },
  { route: '/api/tools/jsonToLanguage', handler: _lazy_391826, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_380681, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_380681, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const h3App = createApp({
    debug: destr(false),
    onError: errorHandler
  });
  h3App.use(config.app.baseURL, timingMiddleware);
  const router = createRouter();
  const routerOptions = createRouter$1({ routes: config.nitro.routes });
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    const referenceRoute = h.route.replace(/:\w+|\*\*/g, "_");
    const routeOptions = routerOptions.lookup(referenceRoute) || {};
    if (routeOptions.swr) {
      handler = cachedEventHandler(handler, {
        group: "nitro/routes"
      });
    }
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(/\/+/g, "/");
      h3App.use(middlewareBase, handler);
    } else {
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router);
  const localCall = createCall(h3App.nodeHandler);
  const localFetch = createFetch(localCall, globalThis.fetch);
  const $fetch = createFetch$1({ fetch: localFetch, Headers, defaults: { baseURL: config.app.baseURL } });
  globalThis.$fetch = $fetch;
  const app = {
    hooks,
    h3App,
    localCall,
    localFetch
  };
  for (const plugin of plugins) {
    plugin(app);
  }
  return app;
}
const nitroApp = createNitroApp();

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const server = cert && key ? new Server({ key, cert }, nitroApp.h3App.nodeHandler) : new Server$1(nitroApp.h3App.nodeHandler);
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const hostname = process.env.NITRO_HOST || process.env.HOST || "0.0.0.0";
server.listen(port, hostname, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  console.log(`Listening on ${protocol}://${hostname}:${port}${useRuntimeConfig().app.baseURL}`);
});
{
  process.on("unhandledRejection", (err) => console.error("[nitro] [dev] [unhandledRejection] " + err));
  process.on("uncaughtException", (err) => console.error("[nitro] [dev] [uncaughtException] " + err));
}
const nodeServer = {};

export { nodeServer as n, useRuntimeConfig as u };
//# sourceMappingURL=node-server.mjs.map
