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
    "mtime": "2022-06-24T06:39:17.774Z",
    "path": "../public/avatar.jpg"
  },
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"1083e-BvV7vE5mRznpgMSqd51r4oQbOr0\"",
    "mtime": "2022-06-24T06:39:17.774Z",
    "path": "../public/favicon.ico"
  },
  "/github-contribution-grid-snake.gif": {
    "type": "image/gif",
    "etag": "\"3688b-J1I71HYBwc5cb/qbZXT40ecq2oo\"",
    "mtime": "2022-06-24T06:39:17.770Z",
    "path": "../public/github-contribution-grid-snake.gif"
  },
  "/github-contribution-grid-snake.svg": {
    "type": "image/svg+xml",
    "etag": "\"11393-M9PU7xofTi5vC4ayC6/1l87IU2k\"",
    "mtime": "2022-06-24T06:39:17.769Z",
    "path": "../public/github-contribution-grid-snake.svg"
  },
  "/robots.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"26-SG58r6mmzshIr97g7jLG5QJuRow\"",
    "mtime": "2022-06-24T06:39:17.768Z",
    "path": "../public/robots.txt"
  },
  "/_nuxt/Editor-057a9431.mjs": {
    "type": "application/javascript",
    "etag": "\"111d-Ru4IXfn6uR1Hq1y1S3wfemevvFY\"",
    "mtime": "2022-06-24T06:39:17.768Z",
    "path": "../public/_nuxt/Editor-057a9431.mjs"
  },
  "/_nuxt/Footer-0d44df87.mjs": {
    "type": "application/javascript",
    "etag": "\"da9-fIlphYSinJc33yxxt4tTExhlafY\"",
    "mtime": "2022-06-24T06:39:17.767Z",
    "path": "../public/_nuxt/Footer-0d44df87.mjs"
  },
  "/_nuxt/Logo-b0e6e822.mjs": {
    "type": "application/javascript",
    "etag": "\"13a4-XQGPrglK6J5LpmokWhkfrAuvoPo\"",
    "mtime": "2022-06-24T06:39:17.767Z",
    "path": "../public/_nuxt/Logo-b0e6e822.mjs"
  },
  "/_nuxt/PostList-60ac3378.mjs": {
    "type": "application/javascript",
    "etag": "\"20fe-swuaU5mJO85r/Y5C+Vq1A7P+Q0g\"",
    "mtime": "2022-06-24T06:39:17.767Z",
    "path": "../public/_nuxt/PostList-60ac3378.mjs"
  },
  "/_nuxt/_id_-3e65cab9.mjs": {
    "type": "application/javascript",
    "etag": "\"523-TV+DNQcUk3LLt1V9E1/PldngUew\"",
    "mtime": "2022-06-24T06:39:17.766Z",
    "path": "../public/_nuxt/_id_-3e65cab9.mjs"
  },
  "/_nuxt/_id_-6ae1750c.mjs": {
    "type": "application/javascript",
    "etag": "\"10f6-8aBYvAE3Kw5hEJ+5xKWoff6EYK0\"",
    "mtime": "2022-06-24T06:39:17.766Z",
    "path": "../public/_nuxt/_id_-6ae1750c.mjs"
  },
  "/_nuxt/_id_-e5af33dd.mjs": {
    "type": "application/javascript",
    "etag": "\"1051-pS5BlwxOoRGL4NotZOmuA83a7iU\"",
    "mtime": "2022-06-24T06:39:17.766Z",
    "path": "../public/_nuxt/_id_-e5af33dd.mjs"
  },
  "/_nuxt/dart-95a2c0e8.mjs": {
    "type": "application/javascript",
    "etag": "\"418-CbDYvkG5DMCqpHOBhX2J1eAnF08\"",
    "mtime": "2022-06-24T06:39:17.765Z",
    "path": "../public/_nuxt/dart-95a2c0e8.mjs"
  },
  "/_nuxt/default-7bfd34e2.mjs": {
    "type": "application/javascript",
    "etag": "\"34f-lQGQhUhVB99pwty21lDRS7Q7mMg\"",
    "mtime": "2022-06-24T06:39:17.765Z",
    "path": "../public/_nuxt/default-7bfd34e2.mjs"
  },
  "/_nuxt/default.a53239a6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1f4-MhGZKoHafAPQvzBEETHynP7Mnf8\"",
    "mtime": "2022-06-24T06:39:17.764Z",
    "path": "../public/_nuxt/default.a53239a6.css"
  },
  "/_nuxt/default.client-b4a32b21.mjs": {
    "type": "application/javascript",
    "etag": "\"e05-GV+5CbImV3Am2AfgSUfKlxg+AJQ\"",
    "mtime": "2022-06-24T06:39:17.764Z",
    "path": "../public/_nuxt/default.client-b4a32b21.mjs"
  },
  "/_nuxt/entry-66902768.mjs": {
    "type": "application/javascript",
    "etag": "\"95dc7-HSVUmZw5Kc31q2o6xUZCmSda7xg\"",
    "mtime": "2022-06-24T06:39:17.764Z",
    "path": "../public/_nuxt/entry-66902768.mjs"
  },
  "/_nuxt/entry.6d124def.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1fb8f-Q6BGNvndYaWEs5RKKRz2Gop+wW0\"",
    "mtime": "2022-06-24T06:39:17.762Z",
    "path": "../public/_nuxt/entry.6d124def.css"
  },
  "/_nuxt/fetch-48dfb965.mjs": {
    "type": "application/javascript",
    "etag": "\"17a0-SiUi7aGTStniX72k4v8DNGbL4fo\"",
    "mtime": "2022-06-24T06:39:17.762Z",
    "path": "../public/_nuxt/fetch-48dfb965.mjs"
  },
  "/_nuxt/index-06c899dc.mjs": {
    "type": "application/javascript",
    "etag": "\"402-pOeN68oAeA9cEq6zRKwMAM7kpBg\"",
    "mtime": "2022-06-24T06:39:17.761Z",
    "path": "../public/_nuxt/index-06c899dc.mjs"
  },
  "/_nuxt/index-15654b73.mjs": {
    "type": "application/javascript",
    "etag": "\"3c7-nFds9T6QzG8GoFCqHPfLhVF4q+I\"",
    "mtime": "2022-06-24T06:39:17.760Z",
    "path": "../public/_nuxt/index-15654b73.mjs"
  },
  "/_nuxt/index-92b1596d.mjs": {
    "type": "application/javascript",
    "etag": "\"1056-9jpxtH4nJZiiwZPH8nI+/q6oojo\"",
    "mtime": "2022-06-24T06:39:17.760Z",
    "path": "../public/_nuxt/index-92b1596d.mjs"
  },
  "/_nuxt/index-b97dec36.mjs": {
    "type": "application/javascript",
    "etag": "\"b6c-7gKpXAB2fh4TtJjJTjbvJilCI/I\"",
    "mtime": "2022-06-24T06:39:17.759Z",
    "path": "../public/_nuxt/index-b97dec36.mjs"
  },
  "/_nuxt/index-bb3a89cc.mjs": {
    "type": "application/javascript",
    "etag": "\"e6-Sd76kkYCKC+A9NntlUyDtkKbbHQ\"",
    "mtime": "2022-06-24T06:39:17.759Z",
    "path": "../public/_nuxt/index-bb3a89cc.mjs"
  },
  "/_nuxt/index-eac28e57.mjs": {
    "type": "application/javascript",
    "etag": "\"9da-V7uCfFlHEgdybF5qtjkhuv0pLjY\"",
    "mtime": "2022-06-24T06:39:17.758Z",
    "path": "../public/_nuxt/index-eac28e57.mjs"
  },
  "/_nuxt/index-ed8b9815.mjs": {
    "type": "application/javascript",
    "etag": "\"fc4f6-dedMwskqTOaDBLghqvLkVT+2ItA\"",
    "mtime": "2022-06-24T06:39:17.758Z",
    "path": "../public/_nuxt/index-ed8b9815.mjs"
  },
  "/_nuxt/index-f563500c.mjs": {
    "type": "application/javascript",
    "etag": "\"2329-6e0EeiW1de8y+CaEdZMTLcBFMxk\"",
    "mtime": "2022-06-24T06:39:17.756Z",
    "path": "../public/_nuxt/index-f563500c.mjs"
  },
  "/_nuxt/json-schema-8a80b015.mjs": {
    "type": "application/javascript",
    "etag": "\"3ee-8Yhp2TQpnGNT04qDSs6mmsfMBVM\"",
    "mtime": "2022-06-24T06:39:17.755Z",
    "path": "../public/_nuxt/json-schema-8a80b015.mjs"
  },
  "/_nuxt/jsonToMock.client-bf35b3a9.mjs": {
    "type": "application/javascript",
    "etag": "\"1b9-Z0aN1FOx++dr1hyYmzPdNXhlDQM\"",
    "mtime": "2022-06-24T06:39:17.755Z",
    "path": "../public/_nuxt/jsonToMock.client-bf35b3a9.mjs"
  },
  "/_nuxt/manifest.json": {
    "type": "application/json",
    "etag": "\"1b8d-v0cK8CP5xRtDBbeoIzOUS7/HFgg\"",
    "mtime": "2022-06-24T06:39:17.754Z",
    "path": "../public/_nuxt/manifest.json"
  },
  "/_nuxt/swiper-slide-78a733b9.mjs": {
    "type": "application/javascript",
    "etag": "\"53fc-nwD79mQHmHkp9UiLjb1r6WETb/c\"",
    "mtime": "2022-06-24T06:39:17.754Z",
    "path": "../public/_nuxt/swiper-slide-78a733b9.mjs"
  },
  "/_nuxt/tools-5cfaefa6.mjs": {
    "type": "application/javascript",
    "etag": "\"25d-0bEvWvB+Ccte6i5D4xaCsz9dU+E\"",
    "mtime": "2022-06-24T06:39:17.753Z",
    "path": "../public/_nuxt/tools-5cfaefa6.mjs"
  },
  "/_nuxt/typescript-aa4b5a27.mjs": {
    "type": "application/javascript",
    "etag": "\"42a-NdR4QWJEw5wdcrVIN9JUQxuN3sE\"",
    "mtime": "2022-06-24T06:39:17.752Z",
    "path": "../public/_nuxt/typescript-aa4b5a27.mjs"
  },
  "/_nuxt/useStrapi4-3f521c91.mjs": {
    "type": "application/javascript",
    "etag": "\"aab-tOIP8wvahp23SUED1yplmIvA5L4\"",
    "mtime": "2022-06-24T06:39:17.752Z",
    "path": "../public/_nuxt/useStrapi4-3f521c91.mjs"
  },
  "/_nuxt/xml-fd905647.mjs": {
    "type": "application/javascript",
    "etag": "\"1935-H80xb3FDsLni30M/1CYVjjyr92Y\"",
    "mtime": "2022-06-24T06:39:17.751Z",
    "path": "../public/_nuxt/xml-fd905647.mjs"
  },
  "/fragments/card/1.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"48e-yYoGtSKhkBGFqB3hwc0UFj+celE\"",
    "mtime": "2022-06-24T06:39:17.773Z",
    "path": "../public/fragments/card/1.html"
  },
  "/fragments/card/10.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"14eb-CaRMk0epq9PWVm8hf6sGJ5Zu3Zk\"",
    "mtime": "2022-06-24T06:39:17.773Z",
    "path": "../public/fragments/card/10.html"
  },
  "/fragments/card/2.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"42e-WgWZu5+eDllp+faUgwypWHqqfFI\"",
    "mtime": "2022-06-24T06:39:17.773Z",
    "path": "../public/fragments/card/2.html"
  },
  "/fragments/card/3.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"485-z7dodEe/F45duSTWfLmWgIwXnNw\"",
    "mtime": "2022-06-24T06:39:17.772Z",
    "path": "../public/fragments/card/3.html"
  },
  "/fragments/card/4.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"b0d-8rPaSg9Bb+bUz/XOp73ArYioXb0\"",
    "mtime": "2022-06-24T06:39:17.772Z",
    "path": "../public/fragments/card/4.html"
  },
  "/fragments/card/5.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"2dc-r2ynUJ4PFwRlraBWqesqeDmVZ68\"",
    "mtime": "2022-06-24T06:39:17.772Z",
    "path": "../public/fragments/card/5.html"
  },
  "/fragments/card/6.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"59f-dO/t/sW+Y2SaTbPrkfSmzjnY5Qw\"",
    "mtime": "2022-06-24T06:39:17.771Z",
    "path": "../public/fragments/card/6.html"
  },
  "/fragments/card/7.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"5d1-unrE6LjxSs5C1i0yPKa2MsJevLM\"",
    "mtime": "2022-06-24T06:39:17.771Z",
    "path": "../public/fragments/card/7.html"
  },
  "/fragments/card/8.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"90f-a65Agzp8LjP6VtNMTLW7wynvkGc\"",
    "mtime": "2022-06-24T06:39:17.771Z",
    "path": "../public/fragments/card/8.html"
  },
  "/fragments/card/9.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"11fa-/DSk682nrDgFLRIyR2FMa6VqR58\"",
    "mtime": "2022-06-24T06:39:17.770Z",
    "path": "../public/fragments/card/9.html"
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
