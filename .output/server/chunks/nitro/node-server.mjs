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
    "mtime": "2022-06-21T05:22:41.335Z",
    "path": "../public/avatar.jpg"
  },
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"1083e-tE4ui7iwGCCqvSw9JgARLIHd+EI\"",
    "mtime": "2022-06-21T05:22:41.334Z",
    "path": "../public/favicon.ico"
  },
  "/github-contribution-grid-snake.gif": {
    "type": "image/gif",
    "etag": "\"367bc-YgNaNYXydfvC8pHrWQe+IwOQCWA\"",
    "mtime": "2022-06-21T05:22:41.331Z",
    "path": "../public/github-contribution-grid-snake.gif"
  },
  "/github-contribution-grid-snake.svg": {
    "type": "image/svg+xml",
    "etag": "\"10e97-t43z/DovuyoqpS0fvt00ysSPJh4\"",
    "mtime": "2022-06-21T05:22:41.331Z",
    "path": "../public/github-contribution-grid-snake.svg"
  },
  "/robots.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"26-SG58r6mmzshIr97g7jLG5QJuRow\"",
    "mtime": "2022-06-21T05:22:41.330Z",
    "path": "../public/robots.txt"
  },
  "/sitemap.xml": {
    "type": "application/xml",
    "etag": "\"426-NieRg58Mp+iIUEaCkSLI3af8uvo\"",
    "mtime": "2022-06-21T05:22:41.318Z",
    "path": "../public/sitemap.xml"
  },
  "/_nuxt/Editor-09ff0ac8.mjs": {
    "type": "application/javascript",
    "etag": "\"f86-iLXyBFivLZulpS0naccoy8h2fmQ\"",
    "mtime": "2022-06-21T05:22:41.330Z",
    "path": "../public/_nuxt/Editor-09ff0ac8.mjs"
  },
  "/_nuxt/Footer-49aba6d7.mjs": {
    "type": "application/javascript",
    "etag": "\"57f-2MQ8bTmEnE016IO2Mjm6icrbFJA\"",
    "mtime": "2022-06-21T05:22:41.329Z",
    "path": "../public/_nuxt/Footer-49aba6d7.mjs"
  },
  "/_nuxt/Logo-8473fde4.mjs": {
    "type": "application/javascript",
    "etag": "\"b85-6uh0uIteQ+ocv/mPoDMhF6pOIe0\"",
    "mtime": "2022-06-21T05:22:41.329Z",
    "path": "../public/_nuxt/Logo-8473fde4.mjs"
  },
  "/_nuxt/_id_-921f2894.mjs": {
    "type": "application/javascript",
    "etag": "\"1034-49y0cRZI0HSiQD2jhj2rJl+dUDE\"",
    "mtime": "2022-06-21T05:22:41.329Z",
    "path": "../public/_nuxt/_id_-921f2894.mjs"
  },
  "/_nuxt/_page_-_id_-d4aa9086.mjs": {
    "type": "application/javascript",
    "etag": "\"50db-AJZa7hJro8VtWLolUvvX8ytIsQ8\"",
    "mtime": "2022-06-21T05:22:41.329Z",
    "path": "../public/_nuxt/_page_-_id_-d4aa9086.mjs"
  },
  "/_nuxt/dart-0252cdce.mjs": {
    "type": "application/javascript",
    "etag": "\"417-KxkUxfDQa56jSVQlnRk4xnHG/yo\"",
    "mtime": "2022-06-21T05:22:41.328Z",
    "path": "../public/_nuxt/dart-0252cdce.mjs"
  },
  "/_nuxt/default-674e8351.mjs": {
    "type": "application/javascript",
    "etag": "\"d12-Op66hL5/T44mHrw7Ge9ITbp7zmQ\"",
    "mtime": "2022-06-21T05:22:41.328Z",
    "path": "../public/_nuxt/default-674e8351.mjs"
  },
  "/_nuxt/default.9ee72091.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1c3-FU5I0saC/g6OpXwxbkn4fX5r90A\"",
    "mtime": "2022-06-21T05:22:41.327Z",
    "path": "../public/_nuxt/default.9ee72091.css"
  },
  "/_nuxt/entry-b7f7d747.mjs": {
    "type": "application/javascript",
    "etag": "\"95405-kOL5SkpQBpu2kSkTptgFOkHUUTA\"",
    "mtime": "2022-06-21T05:22:41.327Z",
    "path": "../public/_nuxt/entry-b7f7d747.mjs"
  },
  "/_nuxt/entry.f023b8e6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1d377-MWPpBRoEzuAi5P2kOQhJ0q7OALU\"",
    "mtime": "2022-06-21T05:22:41.326Z",
    "path": "../public/_nuxt/entry.f023b8e6.css"
  },
  "/_nuxt/hooks-2b488082.mjs": {
    "type": "application/javascript",
    "etag": "\"166-Pjo6JBwAqG0Pkl3az9SHW5S5G1c\"",
    "mtime": "2022-06-21T05:22:41.325Z",
    "path": "../public/_nuxt/hooks-2b488082.mjs"
  },
  "/_nuxt/index-299165f8.mjs": {
    "type": "application/javascript",
    "etag": "\"b84-obgF1r0fqh9RmIN5XgvwZU2zvsc\"",
    "mtime": "2022-06-21T05:22:41.325Z",
    "path": "../public/_nuxt/index-299165f8.mjs"
  },
  "/_nuxt/index-53e1282c.mjs": {
    "type": "application/javascript",
    "etag": "\"76a-hr1y5et+DR3yFcZYkmO8l3OoXAs\"",
    "mtime": "2022-06-21T05:22:41.324Z",
    "path": "../public/_nuxt/index-53e1282c.mjs"
  },
  "/_nuxt/index-6328707e.mjs": {
    "type": "application/javascript",
    "etag": "\"24de-GosNXugQSIf4LP5gdb0hnbA0/Mo\"",
    "mtime": "2022-06-21T05:22:41.324Z",
    "path": "../public/_nuxt/index-6328707e.mjs"
  },
  "/_nuxt/index-81d15550.mjs": {
    "type": "application/javascript",
    "etag": "\"405-EAsNAu03q/yeWob/F9g0yHK0tTk\"",
    "mtime": "2022-06-21T05:22:41.324Z",
    "path": "../public/_nuxt/index-81d15550.mjs"
  },
  "/_nuxt/index-b716eb7e.mjs": {
    "type": "application/javascript",
    "etag": "\"e6-gmDXeWnUeOUpALfZ138+oNtW/dA\"",
    "mtime": "2022-06-21T05:22:41.324Z",
    "path": "../public/_nuxt/index-b716eb7e.mjs"
  },
  "/_nuxt/index-e384fc85.mjs": {
    "type": "application/javascript",
    "etag": "\"3c6-aUJ8L6QF/K9f6a9BR97+3sl1Bl8\"",
    "mtime": "2022-06-21T05:22:41.323Z",
    "path": "../public/_nuxt/index-e384fc85.mjs"
  },
  "/_nuxt/index-ed8b9815.mjs": {
    "type": "application/javascript",
    "etag": "\"fc4f6-dedMwskqTOaDBLghqvLkVT+2ItA\"",
    "mtime": "2022-06-21T05:22:41.323Z",
    "path": "../public/_nuxt/index-ed8b9815.mjs"
  },
  "/_nuxt/json-schema-e2720f3c.mjs": {
    "type": "application/javascript",
    "etag": "\"3ec-vJ4JnTF8xVzwV/wnz9a3J003IFo\"",
    "mtime": "2022-06-21T05:22:41.321Z",
    "path": "../public/_nuxt/json-schema-e2720f3c.mjs"
  },
  "/_nuxt/jsonToMock.client-03194980.mjs": {
    "type": "application/javascript",
    "etag": "\"1b9-Z0aN1FOx++dr1hyYmzPdNXhlDQM\"",
    "mtime": "2022-06-21T05:22:41.321Z",
    "path": "../public/_nuxt/jsonToMock.client-03194980.mjs"
  },
  "/_nuxt/manifest.json": {
    "type": "application/json",
    "etag": "\"17c9-loywuH0d0MvYP60etCrj1FPMX7I\"",
    "mtime": "2022-06-21T05:22:41.321Z",
    "path": "../public/_nuxt/manifest.json"
  },
  "/_nuxt/swiper-slide-a8216f10.mjs": {
    "type": "application/javascript",
    "etag": "\"53f7-BCoOfeOtxsiSzvFqbtvWAiw66Xg\"",
    "mtime": "2022-06-21T05:22:41.320Z",
    "path": "../public/_nuxt/swiper-slide-a8216f10.mjs"
  },
  "/_nuxt/tools-6f8ac000.mjs": {
    "type": "application/javascript",
    "etag": "\"25d-ivuTzSRqAbBwroi+eP9Y0ABeyZA\"",
    "mtime": "2022-06-21T05:22:41.320Z",
    "path": "../public/_nuxt/tools-6f8ac000.mjs"
  },
  "/_nuxt/typescript-fca330fc.mjs": {
    "type": "application/javascript",
    "etag": "\"424-VZCI0XTD6/ex0Rwa+/3Q7E7jqCM\"",
    "mtime": "2022-06-21T05:22:41.320Z",
    "path": "../public/_nuxt/typescript-fca330fc.mjs"
  },
  "/_nuxt/useStrapi4-f82bcb4d.mjs": {
    "type": "application/javascript",
    "etag": "\"aab-MWTfPAXLJXSlSeGUQgiP3mgfXf8\"",
    "mtime": "2022-06-21T05:22:41.319Z",
    "path": "../public/_nuxt/useStrapi4-f82bcb4d.mjs"
  },
  "/_nuxt/xml-5ad48020.mjs": {
    "type": "application/javascript",
    "etag": "\"1934-ztXQmP2i9hK3hOHDF4ewhFEEXOY\"",
    "mtime": "2022-06-21T05:22:41.319Z",
    "path": "../public/_nuxt/xml-5ad48020.mjs"
  },
  "/fragments/card/1.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"414-GZrVVuYygKzeOJ5Tio/JsFZ9k5Q\"",
    "mtime": "2022-06-21T05:22:41.334Z",
    "path": "../public/fragments/card/1.html"
  },
  "/fragments/card/2.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"42e-WgWZu5+eDllp+faUgwypWHqqfFI\"",
    "mtime": "2022-06-21T05:22:41.334Z",
    "path": "../public/fragments/card/2.html"
  },
  "/fragments/card/3.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"485-z7dodEe/F45duSTWfLmWgIwXnNw\"",
    "mtime": "2022-06-21T05:22:41.333Z",
    "path": "../public/fragments/card/3.html"
  },
  "/fragments/card/4.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"b0d-8rPaSg9Bb+bUz/XOp73ArYioXb0\"",
    "mtime": "2022-06-21T05:22:41.333Z",
    "path": "../public/fragments/card/4.html"
  },
  "/fragments/card/5.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"2dc-r2ynUJ4PFwRlraBWqesqeDmVZ68\"",
    "mtime": "2022-06-21T05:22:41.333Z",
    "path": "../public/fragments/card/5.html"
  },
  "/fragments/card/6.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"59f-dO/t/sW+Y2SaTbPrkfSmzjnY5Qw\"",
    "mtime": "2022-06-21T05:22:41.332Z",
    "path": "../public/fragments/card/6.html"
  },
  "/fragments/card/7.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"5d1-unrE6LjxSs5C1i0yPKa2MsJevLM\"",
    "mtime": "2022-06-21T05:22:41.332Z",
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
