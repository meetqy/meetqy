globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import 'node-fetch-native/polyfill';
import { Server as Server$1 } from 'http';
import { Server } from 'https';
import destr from 'destr';
import { defineEventHandler, handleCacheHeaders, createEvent, eventHandler, createError, lazyEventHandler, createApp, createRouter } from 'h3';
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
import { fileURLToPath as fileURLToPath$1 } from 'node:url';
import { createIPX, createIPXMiddleware } from 'ipx';

const _runtimeConfig = {"app":{"baseURL":"/","buildAssetsDir":"/_nuxt/","cdnURL":""},"nitro":{"routes":{},"envPrefix":"NUXT_"},"public":{"strapi":{"url":"https://strapi.wcao.cc","prefix":"/api","version":"v4","cookie":{}}},"ipx":{"dir":"","domains":[],"sharp":{},"alias":{}}};
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
    "mtime": "2022-07-12T09:00:23.534Z",
    "path": "../public/avatar.jpg"
  },
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"1083e-BvV7vE5mRznpgMSqd51r4oQbOr0\"",
    "mtime": "2022-07-12T09:00:23.533Z",
    "path": "../public/favicon.ico"
  },
  "/github-contribution-grid-snake.gif": {
    "type": "image/gif",
    "etag": "\"3e6b4-XXGHN/2X9iW3XxXkVJigSBkZeyU\"",
    "mtime": "2022-07-12T09:00:23.533Z",
    "path": "../public/github-contribution-grid-snake.gif"
  },
  "/github-contribution-grid-snake.svg": {
    "type": "image/svg+xml",
    "etag": "\"126e7-VRMYyPlWQ3ZZaTxExvbCqHZ9WsY\"",
    "mtime": "2022-07-12T09:00:23.531Z",
    "path": "../public/github-contribution-grid-snake.svg"
  },
  "/loading.gif": {
    "type": "image/gif",
    "etag": "\"13344-NygZOxL5F7FJIMdQYNOAoX+sjRM\"",
    "mtime": "2022-07-12T09:00:23.530Z",
    "path": "../public/loading.gif"
  },
  "/robots.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"26-SG58r6mmzshIr97g7jLG5QJuRow\"",
    "mtime": "2022-07-12T09:00:23.530Z",
    "path": "../public/robots.txt"
  },
  "/tv_source.json": {
    "type": "application/json",
    "etag": "\"32cc-lDxv+CI+mnz7H3hQ2Oe35DfTURo\"",
    "mtime": "2022-07-12T09:00:23.529Z",
    "path": "../public/tv_source.json"
  },
  "/_nuxt/1-e25fbe79.mjs": {
    "type": "application/javascript",
    "etag": "\"545-DwfVhAYW/LT9xH1ENsqgiqulnYQ\"",
    "mtime": "2022-07-12T09:00:23.528Z",
    "path": "../public/_nuxt/1-e25fbe79.mjs"
  },
  "/_nuxt/Editor-cfafcee2.mjs": {
    "type": "application/javascript",
    "etag": "\"1198-elFNBMbA9U5+A7D4A5k+qUu9ebo\"",
    "mtime": "2022-07-12T09:00:23.527Z",
    "path": "../public/_nuxt/Editor-cfafcee2.mjs"
  },
  "/_nuxt/Footer-aedb8be0.mjs": {
    "type": "application/javascript",
    "etag": "\"221c-mIY2d61USZ+fOp+8v83cvDm/R2o\"",
    "mtime": "2022-07-12T09:00:23.527Z",
    "path": "../public/_nuxt/Footer-aedb8be0.mjs"
  },
  "/_nuxt/Logo-8d475d5f.mjs": {
    "type": "application/javascript",
    "etag": "\"2469-sBQZBqpbD7FGay5k9tVZZ7ZYfRA\"",
    "mtime": "2022-07-12T09:00:23.526Z",
    "path": "../public/_nuxt/Logo-8d475d5f.mjs"
  },
  "/_nuxt/PostList-51a0a015.mjs": {
    "type": "application/javascript",
    "etag": "\"1070-ZF7Atw9XGXHk7X2eMYCJIZRIrlc\"",
    "mtime": "2022-07-12T09:00:23.526Z",
    "path": "../public/_nuxt/PostList-51a0a015.mjs"
  },
  "/_nuxt/_id_-b0e2f529.mjs": {
    "type": "application/javascript",
    "etag": "\"5a3-i5K+ZR04YI8tX81WOhNsD3HlzE8\"",
    "mtime": "2022-07-12T09:00:23.525Z",
    "path": "../public/_nuxt/_id_-b0e2f529.mjs"
  },
  "/_nuxt/_pageIndex_-771d19d2.mjs": {
    "type": "application/javascript",
    "etag": "\"494-Uztmmd0v0jjuXnt6fRK52aaOYyY\"",
    "mtime": "2022-07-12T09:00:23.525Z",
    "path": "../public/_nuxt/_pageIndex_-771d19d2.mjs"
  },
  "/_nuxt/_pageIndex_-b3258696.mjs": {
    "type": "application/javascript",
    "etag": "\"1181-sFvMSqEJMM37t7x79UIfOGUj8eY\"",
    "mtime": "2022-07-12T09:00:23.524Z",
    "path": "../public/_nuxt/_pageIndex_-b3258696.mjs"
  },
  "/_nuxt/_pageIndex_-ccc47404.mjs": {
    "type": "application/javascript",
    "etag": "\"3e6-u1XaOcXohltEhFkgUR5Xj521KN8\"",
    "mtime": "2022-07-12T09:00:23.523Z",
    "path": "../public/_nuxt/_pageIndex_-ccc47404.mjs"
  },
  "/_nuxt/dart-f8d5acba.mjs": {
    "type": "application/javascript",
    "etag": "\"417-xyUTBJ0GS7Kq8ToLM+4ujoiAUGM\"",
    "mtime": "2022-07-12T09:00:23.522Z",
    "path": "../public/_nuxt/dart-f8d5acba.mjs"
  },
  "/_nuxt/default-b787b83f.mjs": {
    "type": "application/javascript",
    "etag": "\"3da-oBZA1Esn+NpHo+I31zzLUNp0TYY\"",
    "mtime": "2022-07-12T09:00:23.522Z",
    "path": "../public/_nuxt/default-b787b83f.mjs"
  },
  "/_nuxt/default.client-b4a32b21.mjs": {
    "type": "application/javascript",
    "etag": "\"e05-GV+5CbImV3Am2AfgSUfKlxg+AJQ\"",
    "mtime": "2022-07-12T09:00:23.521Z",
    "path": "../public/_nuxt/default.client-b4a32b21.mjs"
  },
  "/_nuxt/default.d25d8269.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"721-f8SdZ3o5l9wfp8wLViaG8/Xyg68\"",
    "mtime": "2022-07-12T09:00:23.520Z",
    "path": "../public/_nuxt/default.d25d8269.css"
  },
  "/_nuxt/entry-e1feba81.mjs": {
    "type": "application/javascript",
    "etag": "\"6febb-oiKK8MVF5/u/Z6+yMzu9HU7XKog\"",
    "mtime": "2022-07-12T09:00:23.518Z",
    "path": "../public/_nuxt/entry-e1feba81.mjs"
  },
  "/_nuxt/entry.12e748e9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18143-QbBiCpXZXYZ86Z4zpYxLqdSDLpI\"",
    "mtime": "2022-07-12T09:00:23.517Z",
    "path": "../public/_nuxt/entry.12e748e9.css"
  },
  "/_nuxt/index-0d792369.mjs": {
    "type": "application/javascript",
    "etag": "\"ad6-Pd9op65gYbcHG4398N4XP4KZGuk\"",
    "mtime": "2022-07-12T09:00:23.516Z",
    "path": "../public/_nuxt/index-0d792369.mjs"
  },
  "/_nuxt/index-6391bf1e.mjs": {
    "type": "application/javascript",
    "etag": "\"cb1-M6yiQDIWJs7fDwfQFWd4qfPp/+8\"",
    "mtime": "2022-07-12T09:00:23.515Z",
    "path": "../public/_nuxt/index-6391bf1e.mjs"
  },
  "/_nuxt/index-c32c45a4.mjs": {
    "type": "application/javascript",
    "etag": "\"400-l/aPxn3o2Q/6EYVsYk2beVs6wyk\"",
    "mtime": "2022-07-12T09:00:23.515Z",
    "path": "../public/_nuxt/index-c32c45a4.mjs"
  },
  "/_nuxt/index-c9257c65.mjs": {
    "type": "application/javascript",
    "etag": "\"3bc-ckqzF+VvxRH49Axmc+0lMqpbgy8\"",
    "mtime": "2022-07-12T09:00:23.514Z",
    "path": "../public/_nuxt/index-c9257c65.mjs"
  },
  "/_nuxt/index-dd2fa0b0.mjs": {
    "type": "application/javascript",
    "etag": "\"3c6-2rMCWYzRZUFAUvWm4UAoMbxkXlE\"",
    "mtime": "2022-07-12T09:00:23.513Z",
    "path": "../public/_nuxt/index-dd2fa0b0.mjs"
  },
  "/_nuxt/json-schema-0edcb22f.mjs": {
    "type": "application/javascript",
    "etag": "\"3ec-mWhmpEWUqP/cA0PT7r0mcKzm+mQ\"",
    "mtime": "2022-07-12T09:00:23.513Z",
    "path": "../public/_nuxt/json-schema-0edcb22f.mjs"
  },
  "/_nuxt/jsonToMock.client-bf35b3a9.mjs": {
    "type": "application/javascript",
    "etag": "\"1b9-Z0aN1FOx++dr1hyYmzPdNXhlDQM\"",
    "mtime": "2022-07-12T09:00:23.512Z",
    "path": "../public/_nuxt/jsonToMock.client-bf35b3a9.mjs"
  },
  "/_nuxt/manifest.json": {
    "type": "application/json",
    "etag": "\"1b36-nQmSFmq+7+zBnNj71m5MYu7AV0k\"",
    "mtime": "2022-07-12T09:00:23.511Z",
    "path": "../public/_nuxt/manifest.json"
  },
  "/_nuxt/pro-_id_-0134b23f.mjs": {
    "type": "application/javascript",
    "etag": "\"5a7-BV1hIn80qL7Bexi2v7j29sEtngU\"",
    "mtime": "2022-07-12T09:00:23.511Z",
    "path": "../public/_nuxt/pro-_id_-0134b23f.mjs"
  },
  "/_nuxt/tools-e56ce16b.mjs": {
    "type": "application/javascript",
    "etag": "\"244-7pHTtrOnnHIKmuKbtaSE5eN+k2g\"",
    "mtime": "2022-07-12T09:00:23.510Z",
    "path": "../public/_nuxt/tools-e56ce16b.mjs"
  },
  "/_nuxt/typescript-b8649214.mjs": {
    "type": "application/javascript",
    "etag": "\"429-46b6a/B7mRxUIY0ZA3FvWW0jUVw\"",
    "mtime": "2022-07-12T09:00:23.510Z",
    "path": "../public/_nuxt/typescript-b8649214.mjs"
  },
  "/_nuxt/ultra-45387058.mjs": {
    "type": "application/javascript",
    "etag": "\"2447-AWGFagEs8Y0utnLLfupsx4Dl3LI\"",
    "mtime": "2022-07-12T09:00:23.509Z",
    "path": "../public/_nuxt/ultra-45387058.mjs"
  },
  "/_nuxt/useStrapi4-829cc600.mjs": {
    "type": "application/javascript",
    "etag": "\"aab-6dUjUYHYb+rfsY3AYRo90xzEHT4\"",
    "mtime": "2022-07-12T09:00:23.508Z",
    "path": "../public/_nuxt/useStrapi4-829cc600.mjs"
  },
  "/_nuxt/xml-59c08abc.mjs": {
    "type": "application/javascript",
    "etag": "\"1934-8HSdEMT6ZkV+sVB2Pm/v52YExXE\"",
    "mtime": "2022-07-12T09:00:23.508Z",
    "path": "../public/_nuxt/xml-59c08abc.mjs"
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

const _261058 = lazyEventHandler(() => {
  const ipxOptions = {
    ...useRuntimeConfig().ipx || {},
    dir: fileURLToPath$1(new URL("../public", globalThis._importMeta_.url))
  };
  const ipx = createIPX(ipxOptions);
  const middleware = createIPXMiddleware(ipx);
  return eventHandler(async (event) => {
    event.req.url = withLeadingSlash(event.context.params._);
    await middleware(event.req, event.res);
  });
});

const _lazy_391826 = () => import('../jsonToLanguage.mjs');
const _lazy_380681 = () => import('../handlers/renderer.mjs').then(function (n) { return n.a; });

const handlers = [
  { route: '', handler: _152570, lazy: false, middleware: true, method: undefined },
  { route: '/api/tools/jsonToLanguage', handler: _lazy_391826, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_380681, lazy: true, middleware: false, method: undefined },
  { route: '/_ipx/**', handler: _261058, lazy: false, middleware: false, method: undefined },
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
