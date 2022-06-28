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
    "mtime": "2022-06-28T03:54:44.874Z",
    "path": "../public/avatar.jpg"
  },
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"1083e-BvV7vE5mRznpgMSqd51r4oQbOr0\"",
    "mtime": "2022-06-28T03:54:44.874Z",
    "path": "../public/favicon.ico"
  },
  "/github-contribution-grid-snake.gif": {
    "type": "image/gif",
    "etag": "\"392dc-+Q1LF0QT9AHSUZBhgqPYivKvRHA\"",
    "mtime": "2022-06-28T03:54:44.866Z",
    "path": "../public/github-contribution-grid-snake.gif"
  },
  "/github-contribution-grid-snake.svg": {
    "type": "image/svg+xml",
    "etag": "\"11e1d-mQdGzXkhFW1TM8oZcqpH4oh7nfU\"",
    "mtime": "2022-06-28T03:54:44.865Z",
    "path": "../public/github-contribution-grid-snake.svg"
  },
  "/loading.gif": {
    "type": "image/gif",
    "etag": "\"13344-NygZOxL5F7FJIMdQYNOAoX+sjRM\"",
    "mtime": "2022-06-28T03:54:44.864Z",
    "path": "../public/loading.gif"
  },
  "/robots.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"26-SG58r6mmzshIr97g7jLG5QJuRow\"",
    "mtime": "2022-06-28T03:54:44.864Z",
    "path": "../public/robots.txt"
  },
  "/_nuxt/1-ee5969e3.mjs": {
    "type": "application/javascript",
    "etag": "\"5a5-kc2Vv4AMoKvPvCHfQdr7Ucupzls\"",
    "mtime": "2022-06-28T03:54:44.862Z",
    "path": "../public/_nuxt/1-ee5969e3.mjs"
  },
  "/_nuxt/BottomAside-176c69ff.mjs": {
    "type": "application/javascript",
    "etag": "\"dc1-DRl3XzR+FqMgO8A1SA5rHgFpdes\"",
    "mtime": "2022-06-28T03:54:44.862Z",
    "path": "../public/_nuxt/BottomAside-176c69ff.mjs"
  },
  "/_nuxt/Editor-4f41ac38.mjs": {
    "type": "application/javascript",
    "etag": "\"1113-dtpt7nslF/iz/6k/iTUujmSoJuQ\"",
    "mtime": "2022-06-28T03:54:44.861Z",
    "path": "../public/_nuxt/Editor-4f41ac38.mjs"
  },
  "/_nuxt/Footer-cc44c301.mjs": {
    "type": "application/javascript",
    "etag": "\"f31-kt4irJNMp8yGcgE8eUmQKOyWmKc\"",
    "mtime": "2022-06-28T03:54:44.861Z",
    "path": "../public/_nuxt/Footer-cc44c301.mjs"
  },
  "/_nuxt/Logo-3c04edf7.mjs": {
    "type": "application/javascript",
    "etag": "\"13ce-AcTqN0187317ewck05EnvP6F00I\"",
    "mtime": "2022-06-28T03:54:44.860Z",
    "path": "../public/_nuxt/Logo-3c04edf7.mjs"
  },
  "/_nuxt/PostList-bc3fe89c.mjs": {
    "type": "application/javascript",
    "etag": "\"21ff-7GtzyF8ML3xHAayzBLMSo41xOdg\"",
    "mtime": "2022-06-28T03:54:44.860Z",
    "path": "../public/_nuxt/PostList-bc3fe89c.mjs"
  },
  "/_nuxt/_id_-38f01051.mjs": {
    "type": "application/javascript",
    "etag": "\"37bc-VS9FsHLJ2pDVtKikOutS7qRc5Co\"",
    "mtime": "2022-06-28T03:54:44.859Z",
    "path": "../public/_nuxt/_id_-38f01051.mjs"
  },
  "/_nuxt/_id_-6ab19d82.mjs": {
    "type": "application/javascript",
    "etag": "\"52b-3hMqF4yR212KJcrhVYGiKqOAeQE\"",
    "mtime": "2022-06-28T03:54:44.859Z",
    "path": "../public/_nuxt/_id_-6ab19d82.mjs"
  },
  "/_nuxt/_id_-fadd2aee.mjs": {
    "type": "application/javascript",
    "etag": "\"1069-XdT01EJxJvnDtdAKaLb06AkAEoU\"",
    "mtime": "2022-06-28T03:54:44.858Z",
    "path": "../public/_nuxt/_id_-fadd2aee.mjs"
  },
  "/_nuxt/_pageIndex_-00dee58b.mjs": {
    "type": "application/javascript",
    "etag": "\"491-HxcNlKd4vnRHRUJQ/QDyaIJahZc\"",
    "mtime": "2022-06-28T03:54:44.858Z",
    "path": "../public/_nuxt/_pageIndex_-00dee58b.mjs"
  },
  "/_nuxt/_pageIndex_-79122446.mjs": {
    "type": "application/javascript",
    "etag": "\"532-TT84yz6fA6YYRkzjsmqXNCj+jBk\"",
    "mtime": "2022-06-28T03:54:44.858Z",
    "path": "../public/_nuxt/_pageIndex_-79122446.mjs"
  },
  "/_nuxt/_pageIndex_-e44a4f61.mjs": {
    "type": "application/javascript",
    "etag": "\"4a6-hzpfbZpgf9XoptC9gQH80KKVAOM\"",
    "mtime": "2022-06-28T03:54:44.857Z",
    "path": "../public/_nuxt/_pageIndex_-e44a4f61.mjs"
  },
  "/_nuxt/dart-281005ea.mjs": {
    "type": "application/javascript",
    "etag": "\"418-FyN6s63xG97FTUd40r/Qusmir2k\"",
    "mtime": "2022-06-28T03:54:44.857Z",
    "path": "../public/_nuxt/dart-281005ea.mjs"
  },
  "/_nuxt/default-f8be60ab.mjs": {
    "type": "application/javascript",
    "etag": "\"34f-zw6YQUHsa2I2UMtdyNC6jGiECEQ\"",
    "mtime": "2022-06-28T03:54:44.856Z",
    "path": "../public/_nuxt/default-f8be60ab.mjs"
  },
  "/_nuxt/default.a53239a6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1f4-MhGZKoHafAPQvzBEETHynP7Mnf8\"",
    "mtime": "2022-06-28T03:54:44.856Z",
    "path": "../public/_nuxt/default.a53239a6.css"
  },
  "/_nuxt/default.client-b4a32b21.mjs": {
    "type": "application/javascript",
    "etag": "\"e05-GV+5CbImV3Am2AfgSUfKlxg+AJQ\"",
    "mtime": "2022-06-28T03:54:44.855Z",
    "path": "../public/_nuxt/default.client-b4a32b21.mjs"
  },
  "/_nuxt/entry-9511408f.mjs": {
    "type": "application/javascript",
    "etag": "\"95dd7-8BmhNsEiLS//8w8w+6IgwYMKYF4\"",
    "mtime": "2022-06-28T03:54:44.855Z",
    "path": "../public/_nuxt/entry-9511408f.mjs"
  },
  "/_nuxt/entry.f150e8ea.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1f7fb-CtmPV5tbhHOYOe8Y6Uf1PvHJD5A\"",
    "mtime": "2022-06-28T03:54:44.853Z",
    "path": "../public/_nuxt/entry.f150e8ea.css"
  },
  "/_nuxt/fetch-a6505860.mjs": {
    "type": "application/javascript",
    "etag": "\"17a0-9s94rnJAj6Iy1XxWmm6MhBNXU6Y\"",
    "mtime": "2022-06-28T03:54:44.853Z",
    "path": "../public/_nuxt/fetch-a6505860.mjs"
  },
  "/_nuxt/index-017d3044.mjs": {
    "type": "application/javascript",
    "etag": "\"a93-iu3N6vccwi/dtfcndlm4h0exi7E\"",
    "mtime": "2022-06-28T03:54:44.851Z",
    "path": "../public/_nuxt/index-017d3044.mjs"
  },
  "/_nuxt/index-13135756.mjs": {
    "type": "application/javascript",
    "etag": "\"c2b-vTDGaLck9BajIOGH685ONLTsgyQ\"",
    "mtime": "2022-06-28T03:54:44.850Z",
    "path": "../public/_nuxt/index-13135756.mjs"
  },
  "/_nuxt/index-1dda49a1.mjs": {
    "type": "application/javascript",
    "etag": "\"407-QTOgE1iT4mS3gkYZ7ligoZe7meM\"",
    "mtime": "2022-06-28T03:54:44.850Z",
    "path": "../public/_nuxt/index-1dda49a1.mjs"
  },
  "/_nuxt/index-2f08dfa7.mjs": {
    "type": "application/javascript",
    "etag": "\"4dc-cL6u9Pdlm2qC2RYAHSWrWso0ee8\"",
    "mtime": "2022-06-28T03:54:44.849Z",
    "path": "../public/_nuxt/index-2f08dfa7.mjs"
  },
  "/_nuxt/index-34cf5d99.mjs": {
    "type": "application/javascript",
    "etag": "\"308-L48pRldtVkGxT/QUiO039Dtg6Ok\"",
    "mtime": "2022-06-28T03:54:44.849Z",
    "path": "../public/_nuxt/index-34cf5d99.mjs"
  },
  "/_nuxt/index-8ff6d620.mjs": {
    "type": "application/javascript",
    "etag": "\"3c7-jhxCmtFTK1IJxFAVpdgOV8vXWkI\"",
    "mtime": "2022-06-28T03:54:44.848Z",
    "path": "../public/_nuxt/index-8ff6d620.mjs"
  },
  "/_nuxt/index-ed8b9815.mjs": {
    "type": "application/javascript",
    "etag": "\"fc4f6-dedMwskqTOaDBLghqvLkVT+2ItA\"",
    "mtime": "2022-06-28T03:54:44.848Z",
    "path": "../public/_nuxt/index-ed8b9815.mjs"
  },
  "/_nuxt/index-f021e376.mjs": {
    "type": "application/javascript",
    "etag": "\"2329-qeRCw6PXYlq0jxY4Tt5QZJWY7nI\"",
    "mtime": "2022-06-28T03:54:44.845Z",
    "path": "../public/_nuxt/index-f021e376.mjs"
  },
  "/_nuxt/json-schema-5ccc79bf.mjs": {
    "type": "application/javascript",
    "etag": "\"3ee-+34WoJ35VmTmR2YT/C8Y7RIQjgM\"",
    "mtime": "2022-06-28T03:54:44.844Z",
    "path": "../public/_nuxt/json-schema-5ccc79bf.mjs"
  },
  "/_nuxt/jsonToMock.client-bf35b3a9.mjs": {
    "type": "application/javascript",
    "etag": "\"1b9-Z0aN1FOx++dr1hyYmzPdNXhlDQM\"",
    "mtime": "2022-06-28T03:54:44.844Z",
    "path": "../public/_nuxt/jsonToMock.client-bf35b3a9.mjs"
  },
  "/_nuxt/manifest.json": {
    "type": "application/json",
    "etag": "\"2368-680GWBOSMprKJ4aAhrS7etAQjP0\"",
    "mtime": "2022-06-28T03:54:44.843Z",
    "path": "../public/_nuxt/manifest.json"
  },
  "/_nuxt/swiper-slide-99aca549.mjs": {
    "type": "application/javascript",
    "etag": "\"53fc-aJboWD663zCGK2IPDTgAOBdWWCM\"",
    "mtime": "2022-06-28T03:54:44.842Z",
    "path": "../public/_nuxt/swiper-slide-99aca549.mjs"
  },
  "/_nuxt/template-382a3a37.mjs": {
    "type": "application/javascript",
    "etag": "\"16d-8AEIrxLPDSi21pyBP1t5dc2Kc/8\"",
    "mtime": "2022-06-28T03:54:44.841Z",
    "path": "../public/_nuxt/template-382a3a37.mjs"
  },
  "/_nuxt/tools-bb7d7dae.mjs": {
    "type": "application/javascript",
    "etag": "\"25d-v3SJR5HFYcNORaZSVd4+KHuW9Tc\"",
    "mtime": "2022-06-28T03:54:44.841Z",
    "path": "../public/_nuxt/tools-bb7d7dae.mjs"
  },
  "/_nuxt/typescript-49915169.mjs": {
    "type": "application/javascript",
    "etag": "\"42a-RedCpglvqRSpA3mGuaCVnc6KQXk\"",
    "mtime": "2022-06-28T03:54:44.840Z",
    "path": "../public/_nuxt/typescript-49915169.mjs"
  },
  "/_nuxt/useStrapi4-d4bf4ec5.mjs": {
    "type": "application/javascript",
    "etag": "\"aab-TMHnoh7JuTR7jYiAtBp8GmnR9NE\"",
    "mtime": "2022-06-28T03:54:44.840Z",
    "path": "../public/_nuxt/useStrapi4-d4bf4ec5.mjs"
  },
  "/_nuxt/xml-5da2fd91.mjs": {
    "type": "application/javascript",
    "etag": "\"1935-KpPJDyfjCzBDry0OmrGocyjQNeM\"",
    "mtime": "2022-06-28T03:54:44.839Z",
    "path": "../public/_nuxt/xml-5da2fd91.mjs"
  },
  "/fragments/card/1.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"48e-yYoGtSKhkBGFqB3hwc0UFj+celE\"",
    "mtime": "2022-06-28T03:54:44.873Z",
    "path": "../public/fragments/card/1.html"
  },
  "/fragments/card/10.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"14eb-CaRMk0epq9PWVm8hf6sGJ5Zu3Zk\"",
    "mtime": "2022-06-28T03:54:44.873Z",
    "path": "../public/fragments/card/10.html"
  },
  "/fragments/card/11.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"315-i71tI50dwlK/NNHZSCt6J+uTUAs\"",
    "mtime": "2022-06-28T03:54:44.872Z",
    "path": "../public/fragments/card/11.html"
  },
  "/fragments/card/12.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"ae1-hMqpXsEiKR+B2pirQaiahBx6KO8\"",
    "mtime": "2022-06-28T03:54:44.872Z",
    "path": "../public/fragments/card/12.html"
  },
  "/fragments/card/13.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"a76-YvY4c8Eof3eFhmFgLbXQ7Xecmvo\"",
    "mtime": "2022-06-28T03:54:44.871Z",
    "path": "../public/fragments/card/13.html"
  },
  "/fragments/card/14.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"1203-qLA3yqbMyeMv18ZhmktrZa9oSQQ\"",
    "mtime": "2022-06-28T03:54:44.871Z",
    "path": "../public/fragments/card/14.html"
  },
  "/fragments/card/2.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"42e-WgWZu5+eDllp+faUgwypWHqqfFI\"",
    "mtime": "2022-06-28T03:54:44.870Z",
    "path": "../public/fragments/card/2.html"
  },
  "/fragments/card/3.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"485-z7dodEe/F45duSTWfLmWgIwXnNw\"",
    "mtime": "2022-06-28T03:54:44.870Z",
    "path": "../public/fragments/card/3.html"
  },
  "/fragments/card/4.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"b0d-8rPaSg9Bb+bUz/XOp73ArYioXb0\"",
    "mtime": "2022-06-28T03:54:44.870Z",
    "path": "../public/fragments/card/4.html"
  },
  "/fragments/card/5.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"2dc-r2ynUJ4PFwRlraBWqesqeDmVZ68\"",
    "mtime": "2022-06-28T03:54:44.869Z",
    "path": "../public/fragments/card/5.html"
  },
  "/fragments/card/6.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"59f-dO/t/sW+Y2SaTbPrkfSmzjnY5Qw\"",
    "mtime": "2022-06-28T03:54:44.869Z",
    "path": "../public/fragments/card/6.html"
  },
  "/fragments/card/7.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"5d1-unrE6LjxSs5C1i0yPKa2MsJevLM\"",
    "mtime": "2022-06-28T03:54:44.868Z",
    "path": "../public/fragments/card/7.html"
  },
  "/fragments/card/8.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"90f-a65Agzp8LjP6VtNMTLW7wynvkGc\"",
    "mtime": "2022-06-28T03:54:44.868Z",
    "path": "../public/fragments/card/8.html"
  },
  "/fragments/card/9.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"11fa-/DSk682nrDgFLRIyR2FMa6VqR58\"",
    "mtime": "2022-06-28T03:54:44.868Z",
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
