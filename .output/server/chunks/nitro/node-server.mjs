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
import { parseURL, withQuery, withLeadingSlash, withoutTrailingSlash } from 'ufo';
import { createStorage } from 'unstorage';
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
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl;
    const _resolve = async () => {
      if (!pending[key]) {
        entry.value = void 0;
        entry.integrity = void 0;
        entry.mtime = void 0;
        entry.expires = void 0;
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
      return decodeURI(parseURL(event.req.originalUrl || event.req.url).pathname).replace(/\/$/, "/index");
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
    "mtime": "2022-06-20T09:52:25.969Z",
    "path": "../public/avatar.jpg"
  },
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"1083e-tE4ui7iwGCCqvSw9JgARLIHd+EI\"",
    "mtime": "2022-06-20T09:52:25.969Z",
    "path": "../public/favicon.ico"
  },
  "/github-contribution-grid-snake.gif": {
    "type": "image/gif",
    "etag": "\"367bc-YgNaNYXydfvC8pHrWQe+IwOQCWA\"",
    "mtime": "2022-06-20T09:52:25.965Z",
    "path": "../public/github-contribution-grid-snake.gif"
  },
  "/github-contribution-grid-snake.svg": {
    "type": "image/svg+xml",
    "etag": "\"10e97-t43z/DovuyoqpS0fvt00ysSPJh4\"",
    "mtime": "2022-06-20T09:52:25.964Z",
    "path": "../public/github-contribution-grid-snake.svg"
  },
  "/robots.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"26-SG58r6mmzshIr97g7jLG5QJuRow\"",
    "mtime": "2022-06-20T09:52:25.964Z",
    "path": "../public/robots.txt"
  },
  "/sitemap.xml": {
    "type": "application/xml",
    "etag": "\"426-NieRg58Mp+iIUEaCkSLI3af8uvo\"",
    "mtime": "2022-06-20T09:52:25.948Z",
    "path": "../public/sitemap.xml"
  },
  "/_nuxt/Editor-cf68963d.mjs": {
    "type": "application/javascript",
    "etag": "\"f86-YJYermRSYKlU26DJ6MZCv71+Pjw\"",
    "mtime": "2022-06-20T09:52:25.963Z",
    "path": "../public/_nuxt/Editor-cf68963d.mjs"
  },
  "/_nuxt/Footer-4523e4bc.mjs": {
    "type": "application/javascript",
    "etag": "\"57f-oAG+dgl54/TpOFnmoAFvy/J0l9Q\"",
    "mtime": "2022-06-20T09:52:25.963Z",
    "path": "../public/_nuxt/Footer-4523e4bc.mjs"
  },
  "/_nuxt/Logo-4f891f00.mjs": {
    "type": "application/javascript",
    "etag": "\"b85-F0PQoWwcn/6kjj6D5HjLDO/52qg\"",
    "mtime": "2022-06-20T09:52:25.962Z",
    "path": "../public/_nuxt/Logo-4f891f00.mjs"
  },
  "/_nuxt/_id_-9f28a7ce.mjs": {
    "type": "application/javascript",
    "etag": "\"1034-M626u1RTst+q4Gf69Vvh44cflJw\"",
    "mtime": "2022-06-20T09:52:25.962Z",
    "path": "../public/_nuxt/_id_-9f28a7ce.mjs"
  },
  "/_nuxt/_page_-_id_-b9a17bb0.mjs": {
    "type": "application/javascript",
    "etag": "\"50e0-Z2uB1X3YS2L1tTlUhDxusjKdZRY\"",
    "mtime": "2022-06-20T09:52:25.961Z",
    "path": "../public/_nuxt/_page_-_id_-b9a17bb0.mjs"
  },
  "/_nuxt/dart-d86b5745.mjs": {
    "type": "application/javascript",
    "etag": "\"417-e51Kgs9g79e2mbDS00Heb6JHo5k\"",
    "mtime": "2022-06-20T09:52:25.961Z",
    "path": "../public/_nuxt/dart-d86b5745.mjs"
  },
  "/_nuxt/default-963a5e44.mjs": {
    "type": "application/javascript",
    "etag": "\"d12-ihh6ltYVunr9hFOGjysrOMRpPQ8\"",
    "mtime": "2022-06-20T09:52:25.961Z",
    "path": "../public/_nuxt/default-963a5e44.mjs"
  },
  "/_nuxt/default.9ee72091.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1c3-FU5I0saC/g6OpXwxbkn4fX5r90A\"",
    "mtime": "2022-06-20T09:52:25.960Z",
    "path": "../public/_nuxt/default.9ee72091.css"
  },
  "/_nuxt/entry-d96375f4.mjs": {
    "type": "application/javascript",
    "etag": "\"95405-hTlRIXx0lyTxCgd7IlAh9YOlSxA\"",
    "mtime": "2022-06-20T09:52:25.960Z",
    "path": "../public/_nuxt/entry-d96375f4.mjs"
  },
  "/_nuxt/entry.f023b8e6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1d377-MWPpBRoEzuAi5P2kOQhJ0q7OALU\"",
    "mtime": "2022-06-20T09:52:25.959Z",
    "path": "../public/_nuxt/entry.f023b8e6.css"
  },
  "/_nuxt/hooks-136b7bd0.mjs": {
    "type": "application/javascript",
    "etag": "\"16c-ZSPflvYO9e5jcVcxXT2Uy9XSm0c\"",
    "mtime": "2022-06-20T09:52:25.957Z",
    "path": "../public/_nuxt/hooks-136b7bd0.mjs"
  },
  "/_nuxt/index-17e439ce.mjs": {
    "type": "application/javascript",
    "etag": "\"405-NQ0kWVSntW04izXOWxolFlQUySI\"",
    "mtime": "2022-06-20T09:52:25.957Z",
    "path": "../public/_nuxt/index-17e439ce.mjs"
  },
  "/_nuxt/index-24757fc3.mjs": {
    "type": "application/javascript",
    "etag": "\"b84-Z8jfMsUd/rri4g+k7s0IK+nKKRI\"",
    "mtime": "2022-06-20T09:52:25.957Z",
    "path": "../public/_nuxt/index-24757fc3.mjs"
  },
  "/_nuxt/index-684f6e5a.mjs": {
    "type": "application/javascript",
    "etag": "\"3c6-qPikjb4cIUsvE7AiWXvEjFzfIls\"",
    "mtime": "2022-06-20T09:52:25.956Z",
    "path": "../public/_nuxt/index-684f6e5a.mjs"
  },
  "/_nuxt/index-8adf03ac.mjs": {
    "type": "application/javascript",
    "etag": "\"75c-e3G/L6uspAV0ExuiashvA/ghv+I\"",
    "mtime": "2022-06-20T09:52:25.956Z",
    "path": "../public/_nuxt/index-8adf03ac.mjs"
  },
  "/_nuxt/index-951ce687.mjs": {
    "type": "application/javascript",
    "etag": "\"e6-GCanSeNOOiqor727gMEUUeuF67Q\"",
    "mtime": "2022-06-20T09:52:25.955Z",
    "path": "../public/_nuxt/index-951ce687.mjs"
  },
  "/_nuxt/index-99f191f0.mjs": {
    "type": "application/javascript",
    "etag": "\"24e1-L+DlbLfvKardXg9tIt2dn7iEOBQ\"",
    "mtime": "2022-06-20T09:52:25.955Z",
    "path": "../public/_nuxt/index-99f191f0.mjs"
  },
  "/_nuxt/index-ed8b9815.mjs": {
    "type": "application/javascript",
    "etag": "\"fc4f6-dedMwskqTOaDBLghqvLkVT+2ItA\"",
    "mtime": "2022-06-20T09:52:25.954Z",
    "path": "../public/_nuxt/index-ed8b9815.mjs"
  },
  "/_nuxt/json-schema-960b64b0.mjs": {
    "type": "application/javascript",
    "etag": "\"3ec-BAiqEVOoMEPPtHVxMr5aMbNHsDw\"",
    "mtime": "2022-06-20T09:52:25.952Z",
    "path": "../public/_nuxt/json-schema-960b64b0.mjs"
  },
  "/_nuxt/jsonToMock.client-03194980.mjs": {
    "type": "application/javascript",
    "etag": "\"1b9-Z0aN1FOx++dr1hyYmzPdNXhlDQM\"",
    "mtime": "2022-06-20T09:52:25.952Z",
    "path": "../public/_nuxt/jsonToMock.client-03194980.mjs"
  },
  "/_nuxt/manifest.json": {
    "type": "application/json",
    "etag": "\"17c9-c3Ei+/dEMu8dH6jwPZfFaowKgJE\"",
    "mtime": "2022-06-20T09:52:25.951Z",
    "path": "../public/_nuxt/manifest.json"
  },
  "/_nuxt/swiper-slide-7cd299b0.mjs": {
    "type": "application/javascript",
    "etag": "\"53f7-gAY0sLloqX5t0I8wLVVrme8j5oQ\"",
    "mtime": "2022-06-20T09:52:25.951Z",
    "path": "../public/_nuxt/swiper-slide-7cd299b0.mjs"
  },
  "/_nuxt/tools-828b2860.mjs": {
    "type": "application/javascript",
    "etag": "\"25d-eFqRV0pYmCR6yFvcdRieVHmMP2I\"",
    "mtime": "2022-06-20T09:52:25.951Z",
    "path": "../public/_nuxt/tools-828b2860.mjs"
  },
  "/_nuxt/typescript-da8acbda.mjs": {
    "type": "application/javascript",
    "etag": "\"424-+apKWmMh4+xGzrUclKkPtCvJnx0\"",
    "mtime": "2022-06-20T09:52:25.950Z",
    "path": "../public/_nuxt/typescript-da8acbda.mjs"
  },
  "/_nuxt/useStrapi4-1f47343e.mjs": {
    "type": "application/javascript",
    "etag": "\"aab-QNJUpGORqme3bDyODU1rUUsRqHs\"",
    "mtime": "2022-06-20T09:52:25.950Z",
    "path": "../public/_nuxt/useStrapi4-1f47343e.mjs"
  },
  "/_nuxt/xml-5991cf7f.mjs": {
    "type": "application/javascript",
    "etag": "\"1934-uZfy7P2CjgcfqaI64kpXk/VmQjo\"",
    "mtime": "2022-06-20T09:52:25.949Z",
    "path": "../public/_nuxt/xml-5991cf7f.mjs"
  },
  "/fragments/card/1.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"414-GZrVVuYygKzeOJ5Tio/JsFZ9k5Q\"",
    "mtime": "2022-06-20T09:52:25.968Z",
    "path": "../public/fragments/card/1.html"
  },
  "/fragments/card/2.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"42e-WgWZu5+eDllp+faUgwypWHqqfFI\"",
    "mtime": "2022-06-20T09:52:25.968Z",
    "path": "../public/fragments/card/2.html"
  },
  "/fragments/card/3.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"485-z7dodEe/F45duSTWfLmWgIwXnNw\"",
    "mtime": "2022-06-20T09:52:25.968Z",
    "path": "../public/fragments/card/3.html"
  },
  "/fragments/card/4.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"b0d-8rPaSg9Bb+bUz/XOp73ArYioXb0\"",
    "mtime": "2022-06-20T09:52:25.967Z",
    "path": "../public/fragments/card/4.html"
  },
  "/fragments/card/5.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"2dc-r2ynUJ4PFwRlraBWqesqeDmVZ68\"",
    "mtime": "2022-06-20T09:52:25.967Z",
    "path": "../public/fragments/card/5.html"
  },
  "/fragments/card/6.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"59f-dO/t/sW+Y2SaTbPrkfSmzjnY5Qw\"",
    "mtime": "2022-06-20T09:52:25.967Z",
    "path": "../public/fragments/card/6.html"
  },
  "/fragments/card/7.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"5c5-O/E2AS2vEGMJOeY3ZLth8Oys11Y\"",
    "mtime": "2022-06-20T09:52:25.966Z",
    "path": "../public/fragments/card/7.html"
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
