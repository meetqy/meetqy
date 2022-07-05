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

const _runtimeConfig = {"app":{"baseURL":"/","buildAssetsDir":"/_nuxt/","cdnURL":""},"nitro":{"routes":{},"envPrefix":"NUXT_"},"public":{"strapi":{"url":"https://strapi.wcao.cc","prefix":"/api","version":"v4","cookie":{}}}};
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
    "mtime": "2022-07-05T06:54:26.882Z",
    "path": "../public/avatar.jpg"
  },
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"1083e-BvV7vE5mRznpgMSqd51r4oQbOr0\"",
    "mtime": "2022-07-05T06:54:26.881Z",
    "path": "../public/favicon.ico"
  },
  "/github-contribution-grid-snake.gif": {
    "type": "image/gif",
    "etag": "\"394eb-nYC5TzsVy1gw/x4ooWbj/gBPETA\"",
    "mtime": "2022-07-05T06:54:26.873Z",
    "path": "../public/github-contribution-grid-snake.gif"
  },
  "/github-contribution-grid-snake.svg": {
    "type": "image/svg+xml",
    "etag": "\"11982-0SgOwJMmk+0kRsvoQ/oTU6nAw00\"",
    "mtime": "2022-07-05T06:54:26.873Z",
    "path": "../public/github-contribution-grid-snake.svg"
  },
  "/loading.gif": {
    "type": "image/gif",
    "etag": "\"13344-NygZOxL5F7FJIMdQYNOAoX+sjRM\"",
    "mtime": "2022-07-05T06:54:26.872Z",
    "path": "../public/loading.gif"
  },
  "/robots.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"26-SG58r6mmzshIr97g7jLG5QJuRow\"",
    "mtime": "2022-07-05T06:54:26.872Z",
    "path": "../public/robots.txt"
  },
  "/_nuxt/1-0ce3a90f.mjs": {
    "type": "application/javascript",
    "etag": "\"54a-H+fUMI9piqBW1c96FVvP1nwA5z4\"",
    "mtime": "2022-07-05T06:54:26.871Z",
    "path": "../public/_nuxt/1-0ce3a90f.mjs"
  },
  "/_nuxt/Editor-fbfd823a.mjs": {
    "type": "application/javascript",
    "etag": "\"111d-8HVZayJe6R1DWdW2W9EfYDYW5Y8\"",
    "mtime": "2022-07-05T06:54:26.870Z",
    "path": "../public/_nuxt/Editor-fbfd823a.mjs"
  },
  "/_nuxt/Footer-eeffa322.mjs": {
    "type": "application/javascript",
    "etag": "\"c7f-Cy22EGfy9t4dLhxk8+oeDJjvZrM\"",
    "mtime": "2022-07-05T06:54:26.870Z",
    "path": "../public/_nuxt/Footer-eeffa322.mjs"
  },
  "/_nuxt/Logo-1f26fc5a.mjs": {
    "type": "application/javascript",
    "etag": "\"242a-qKblxHHgTc0gYBvdZsHwg2EMySw\"",
    "mtime": "2022-07-05T06:54:26.869Z",
    "path": "../public/_nuxt/Logo-1f26fc5a.mjs"
  },
  "/_nuxt/PostList-87211bcc.mjs": {
    "type": "application/javascript",
    "etag": "\"eb3-t6kgSAmmJhNBvnG+7qdZ/wTtoSM\"",
    "mtime": "2022-07-05T06:54:26.869Z",
    "path": "../public/_nuxt/PostList-87211bcc.mjs"
  },
  "/_nuxt/_id_-f51d9886.mjs": {
    "type": "application/javascript",
    "etag": "\"fd888-8TTJiKcfCiULadYXNnSnPGMEa60\"",
    "mtime": "2022-07-05T06:54:26.867Z",
    "path": "../public/_nuxt/_id_-f51d9886.mjs"
  },
  "/_nuxt/_pageIndex_-897bc6bb.mjs": {
    "type": "application/javascript",
    "etag": "\"111f-z94khT3FVOiuasKiaA5TW2kZOlk\"",
    "mtime": "2022-07-05T06:54:26.864Z",
    "path": "../public/_nuxt/_pageIndex_-897bc6bb.mjs"
  },
  "/_nuxt/_pageIndex_-b0f91867.mjs": {
    "type": "application/javascript",
    "etag": "\"3e2-R7oYGXePilmAUV0KPNtBtZqG+Rs\"",
    "mtime": "2022-07-05T06:54:26.864Z",
    "path": "../public/_nuxt/_pageIndex_-b0f91867.mjs"
  },
  "/_nuxt/dart-1902c543.mjs": {
    "type": "application/javascript",
    "etag": "\"417-Hnexg5PP3Q/8xA7ibjI5ntHtfRQ\"",
    "mtime": "2022-07-05T06:54:26.863Z",
    "path": "../public/_nuxt/dart-1902c543.mjs"
  },
  "/_nuxt/default-8d3ff1b7.mjs": {
    "type": "application/javascript",
    "etag": "\"34e-1htP7Sa4EE4gZ6rGkRFnAjeRwqs\"",
    "mtime": "2022-07-05T06:54:26.862Z",
    "path": "../public/_nuxt/default-8d3ff1b7.mjs"
  },
  "/_nuxt/default.a53239a6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1f4-MhGZKoHafAPQvzBEETHynP7Mnf8\"",
    "mtime": "2022-07-05T06:54:26.862Z",
    "path": "../public/_nuxt/default.a53239a6.css"
  },
  "/_nuxt/default.client-b4a32b21.mjs": {
    "type": "application/javascript",
    "etag": "\"e05-GV+5CbImV3Am2AfgSUfKlxg+AJQ\"",
    "mtime": "2022-07-05T06:54:26.861Z",
    "path": "../public/_nuxt/default.client-b4a32b21.mjs"
  },
  "/_nuxt/entry-d32cfda0.mjs": {
    "type": "application/javascript",
    "etag": "\"68eb6-93j9zP3RnzPRWpPf1JZLiV/v93s\"",
    "mtime": "2022-07-05T06:54:26.860Z",
    "path": "../public/_nuxt/entry-d32cfda0.mjs"
  },
  "/_nuxt/entry.d3d50e75.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1d6ff-N+Rw90x/lGWDc55WRJpoJikxO5Y\"",
    "mtime": "2022-07-05T06:54:26.859Z",
    "path": "../public/_nuxt/entry.d3d50e75.css"
  },
  "/_nuxt/fetch-b1d8c5c8.mjs": {
    "type": "application/javascript",
    "etag": "\"17a0-cIS4uYIWqwF7DMkNFJZUFZXVp80\"",
    "mtime": "2022-07-05T06:54:26.858Z",
    "path": "../public/_nuxt/fetch-b1d8c5c8.mjs"
  },
  "/_nuxt/index-5afb0901.mjs": {
    "type": "application/javascript",
    "etag": "\"3c6-LiJCirfVGuN7Wg4iyO2gtBG6Z+c\"",
    "mtime": "2022-07-05T06:54:26.857Z",
    "path": "../public/_nuxt/index-5afb0901.mjs"
  },
  "/_nuxt/index-6778b176.mjs": {
    "type": "application/javascript",
    "etag": "\"a92-9oEISM6oNHmAgKCBK6NnBRVEMDk\"",
    "mtime": "2022-07-05T06:54:26.856Z",
    "path": "../public/_nuxt/index-6778b176.mjs"
  },
  "/_nuxt/index-89abf516.mjs": {
    "type": "application/javascript",
    "etag": "\"405-K/wC2ZJZDlfeQLAtXhxe9c/nqGY\"",
    "mtime": "2022-07-05T06:54:26.856Z",
    "path": "../public/_nuxt/index-89abf516.mjs"
  },
  "/_nuxt/index-9c9c4d67.mjs": {
    "type": "application/javascript",
    "etag": "\"396-4m8J9D9vXc+X3oLq/vVF1vRnEgU\"",
    "mtime": "2022-07-05T06:54:26.856Z",
    "path": "../public/_nuxt/index-9c9c4d67.mjs"
  },
  "/_nuxt/index-a0a7d072.mjs": {
    "type": "application/javascript",
    "etag": "\"15ef-0HeAGf7vky687y2rwykOMFiZjCM\"",
    "mtime": "2022-07-05T06:54:26.855Z",
    "path": "../public/_nuxt/index-a0a7d072.mjs"
  },
  "/_nuxt/index-b94857b1.mjs": {
    "type": "application/javascript",
    "etag": "\"c34-kEY1Fg5QuD4LzLb/A3LKRef3PbM\"",
    "mtime": "2022-07-05T06:54:26.855Z",
    "path": "../public/_nuxt/index-b94857b1.mjs"
  },
  "/_nuxt/json-schema-1e924b72.mjs": {
    "type": "application/javascript",
    "etag": "\"3ec-vmOzjwOdhl6D/gXCVGizuGs7jek\"",
    "mtime": "2022-07-05T06:54:26.855Z",
    "path": "../public/_nuxt/json-schema-1e924b72.mjs"
  },
  "/_nuxt/jsonToMock.client-bf35b3a9.mjs": {
    "type": "application/javascript",
    "etag": "\"1b9-Z0aN1FOx++dr1hyYmzPdNXhlDQM\"",
    "mtime": "2022-07-05T06:54:26.854Z",
    "path": "../public/_nuxt/jsonToMock.client-bf35b3a9.mjs"
  },
  "/_nuxt/manifest.json": {
    "type": "application/json",
    "etag": "\"1c34-XTsHP0N0EwBecOKankiTepoLRk0\"",
    "mtime": "2022-07-05T06:54:26.854Z",
    "path": "../public/_nuxt/manifest.json"
  },
  "/_nuxt/pro-_id_-4c48bb0b.mjs": {
    "type": "application/javascript",
    "etag": "\"471-oCqiEy8Z2wS5DL/6e/oxDgHda8I\"",
    "mtime": "2022-07-05T06:54:26.853Z",
    "path": "../public/_nuxt/pro-_id_-4c48bb0b.mjs"
  },
  "/_nuxt/tools-969f0d51.mjs": {
    "type": "application/javascript",
    "etag": "\"25c-qy40W1J2xwsrKlxsBxKpBE36NGc\"",
    "mtime": "2022-07-05T06:54:26.853Z",
    "path": "../public/_nuxt/tools-969f0d51.mjs"
  },
  "/_nuxt/typescript-a81a4b18.mjs": {
    "type": "application/javascript",
    "etag": "\"429-iPjjliiDFv+uGw6gxHLOXJ2ctdM\"",
    "mtime": "2022-07-05T06:54:26.853Z",
    "path": "../public/_nuxt/typescript-a81a4b18.mjs"
  },
  "/_nuxt/ultra-45387058.mjs": {
    "type": "application/javascript",
    "etag": "\"2447-AWGFagEs8Y0utnLLfupsx4Dl3LI\"",
    "mtime": "2022-07-05T06:54:26.852Z",
    "path": "../public/_nuxt/ultra-45387058.mjs"
  },
  "/_nuxt/useStrapi4-0e1f3b9b.mjs": {
    "type": "application/javascript",
    "etag": "\"aab-EYc9bV7H2gMXsR83NMoLltlXPmw\"",
    "mtime": "2022-07-05T06:54:26.851Z",
    "path": "../public/_nuxt/useStrapi4-0e1f3b9b.mjs"
  },
  "/_nuxt/xml-c7334f99.mjs": {
    "type": "application/javascript",
    "etag": "\"1934-mattAvr5vc9dr7YkTg4QvjYC1yk\"",
    "mtime": "2022-07-05T06:54:26.851Z",
    "path": "../public/_nuxt/xml-c7334f99.mjs"
  },
  "/fragments/card/1.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"48e-yYoGtSKhkBGFqB3hwc0UFj+celE\"",
    "mtime": "2022-07-05T06:54:26.880Z",
    "path": "../public/fragments/card/1.html"
  },
  "/fragments/card/10.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"14eb-CaRMk0epq9PWVm8hf6sGJ5Zu3Zk\"",
    "mtime": "2022-07-05T06:54:26.880Z",
    "path": "../public/fragments/card/10.html"
  },
  "/fragments/card/11.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"315-i71tI50dwlK/NNHZSCt6J+uTUAs\"",
    "mtime": "2022-07-05T06:54:26.879Z",
    "path": "../public/fragments/card/11.html"
  },
  "/fragments/card/12.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"ae1-hMqpXsEiKR+B2pirQaiahBx6KO8\"",
    "mtime": "2022-07-05T06:54:26.879Z",
    "path": "../public/fragments/card/12.html"
  },
  "/fragments/card/13.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"a76-YvY4c8Eof3eFhmFgLbXQ7Xecmvo\"",
    "mtime": "2022-07-05T06:54:26.879Z",
    "path": "../public/fragments/card/13.html"
  },
  "/fragments/card/14.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"1203-qLA3yqbMyeMv18ZhmktrZa9oSQQ\"",
    "mtime": "2022-07-05T06:54:26.878Z",
    "path": "../public/fragments/card/14.html"
  },
  "/fragments/card/15.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"37b-vk/OismeepzXqfujN7to/yk19T8\"",
    "mtime": "2022-07-05T06:54:26.878Z",
    "path": "../public/fragments/card/15.html"
  },
  "/fragments/card/16.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"a63-LdAOMjLtcVyBmcM6FwhWrMvd0S4\"",
    "mtime": "2022-07-05T06:54:26.877Z",
    "path": "../public/fragments/card/16.html"
  },
  "/fragments/card/2.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"4d1-Ku9fHlTup2zuQYIeOJ+B4g54d0Y\"",
    "mtime": "2022-07-05T06:54:26.877Z",
    "path": "../public/fragments/card/2.html"
  },
  "/fragments/card/3.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"485-z7dodEe/F45duSTWfLmWgIwXnNw\"",
    "mtime": "2022-07-05T06:54:26.877Z",
    "path": "../public/fragments/card/3.html"
  },
  "/fragments/card/4.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"b0d-8rPaSg9Bb+bUz/XOp73ArYioXb0\"",
    "mtime": "2022-07-05T06:54:26.876Z",
    "path": "../public/fragments/card/4.html"
  },
  "/fragments/card/5.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"2dc-r2ynUJ4PFwRlraBWqesqeDmVZ68\"",
    "mtime": "2022-07-05T06:54:26.876Z",
    "path": "../public/fragments/card/5.html"
  },
  "/fragments/card/6.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"59f-dO/t/sW+Y2SaTbPrkfSmzjnY5Qw\"",
    "mtime": "2022-07-05T06:54:26.876Z",
    "path": "../public/fragments/card/6.html"
  },
  "/fragments/card/7.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"5d1-unrE6LjxSs5C1i0yPKa2MsJevLM\"",
    "mtime": "2022-07-05T06:54:26.875Z",
    "path": "../public/fragments/card/7.html"
  },
  "/fragments/card/8.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"90f-a65Agzp8LjP6VtNMTLW7wynvkGc\"",
    "mtime": "2022-07-05T06:54:26.875Z",
    "path": "../public/fragments/card/8.html"
  },
  "/fragments/card/9.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"11fa-/DSk682nrDgFLRIyR2FMa6VqR58\"",
    "mtime": "2022-07-05T06:54:26.874Z",
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
