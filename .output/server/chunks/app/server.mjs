import { v as vue_cjs_prod, s as serverRenderer, r as require$$0 } from '../handlers/renderer.mjs';
import { hasProtocol, joinURL, isEqual, withBase, withQuery } from 'ufo';
import { stringify } from 'qs';
import { Swiper, SwiperSlide } from 'swiper/vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import { useDark, useToggle, useInterval, useScroll } from '@vueuse/core';
import toJsonSchema from 'to-json-schema';
import jsonFormat from 'json-format';
import { u as useRuntimeConfig$1 } from '../nitro/node-server.mjs';
import 'h3';
import 'unenv/runtime/mock/proxy';
import 'stream';
import 'node-fetch-native/polyfill';
import 'http';
import 'https';
import 'destr';
import 'ohmyfetch';
import 'radix3';
import 'unenv/runtime/fetch/index';
import 'hookable';
import 'scule';
import 'ohash';
import 'unstorage';
import 'fs';
import 'pathe';
import 'url';

/**
 * SSR Window 4.0.2
 * Better handling for window object in SSR environment
 * https://github.com/nolimits4web/ssr-window
 *
 * Copyright 2021, Vladimir Kharlampidi
 *
 * Licensed under MIT
 *
 * Released on: December 13, 2021
 */
/* eslint-disable no-param-reassign */
function isObject$3(obj) {
    return (obj !== null &&
        typeof obj === 'object' &&
        'constructor' in obj &&
        obj.constructor === Object);
}
function extend$1(target = {}, src = {}) {
    Object.keys(src).forEach((key) => {
        if (typeof target[key] === 'undefined')
            target[key] = src[key];
        else if (isObject$3(src[key]) &&
            isObject$3(target[key]) &&
            Object.keys(src[key]).length > 0) {
            extend$1(target[key], src[key]);
        }
    });
}

const ssrDocument = {
    body: {},
    addEventListener() { },
    removeEventListener() { },
    activeElement: {
        blur() { },
        nodeName: '',
    },
    querySelector() {
        return null;
    },
    querySelectorAll() {
        return [];
    },
    getElementById() {
        return null;
    },
    createEvent() {
        return {
            initEvent() { },
        };
    },
    createElement() {
        return {
            children: [],
            childNodes: [],
            style: {},
            setAttribute() { },
            getElementsByTagName() {
                return [];
            },
        };
    },
    createElementNS() {
        return {};
    },
    importNode() {
        return null;
    },
    location: {
        hash: '',
        host: '',
        hostname: '',
        href: '',
        origin: '',
        pathname: '',
        protocol: '',
        search: '',
    },
};
function getDocument() {
    const doc = typeof document !== 'undefined' ? document : {};
    extend$1(doc, ssrDocument);
    return doc;
}

const ssrWindow = {
    document: ssrDocument,
    navigator: {
        userAgent: '',
    },
    location: {
        hash: '',
        host: '',
        hostname: '',
        href: '',
        origin: '',
        pathname: '',
        protocol: '',
        search: '',
    },
    history: {
        replaceState() { },
        pushState() { },
        go() { },
        back() { },
    },
    CustomEvent: function CustomEvent() {
        return this;
    },
    addEventListener() { },
    removeEventListener() { },
    getComputedStyle() {
        return {
            getPropertyValue() {
                return '';
            },
        };
    },
    Image() { },
    Date() { },
    screen: {},
    setTimeout() { },
    clearTimeout() { },
    matchMedia() {
        return {};
    },
    requestAnimationFrame(callback) {
        if (typeof setTimeout === 'undefined') {
            callback();
            return null;
        }
        return setTimeout(callback, 0);
    },
    cancelAnimationFrame(id) {
        if (typeof setTimeout === 'undefined') {
            return;
        }
        clearTimeout(id);
    },
};
function getWindow() {
    const win = {};
    extend$1(win, ssrWindow);
    return win;
}

/**
 * Dom7 4.0.4
 * Minimalistic JavaScript library for DOM manipulation, with a jQuery-compatible API
 * https://framework7.io/docs/dom7.html
 *
 * Copyright 2022, Vladimir Kharlampidi
 *
 * Licensed under MIT
 *
 * Released on: January 11, 2022
 */

/* eslint-disable no-proto */
function makeReactive(obj) {
  const proto = obj.__proto__;
  Object.defineProperty(obj, '__proto__', {
    get() {
      return proto;
    },

    set(value) {
      proto.__proto__ = value;
    }

  });
}

class Dom7 extends Array {
  constructor(items) {
    if (typeof items === 'number') {
      super(items);
    } else {
      super(...(items || []));
      makeReactive(this);
    }
  }

}

function arrayFlat(arr = []) {
  const res = [];
  arr.forEach(el => {
    if (Array.isArray(el)) {
      res.push(...arrayFlat(el));
    } else {
      res.push(el);
    }
  });
  return res;
}
function arrayFilter(arr, callback) {
  return Array.prototype.filter.call(arr, callback);
}
function arrayUnique(arr) {
  const uniqueArray = [];

  for (let i = 0; i < arr.length; i += 1) {
    if (uniqueArray.indexOf(arr[i]) === -1) uniqueArray.push(arr[i]);
  }

  return uniqueArray;
}

// eslint-disable-next-line

function qsa(selector, context) {
  if (typeof selector !== 'string') {
    return [selector];
  }

  const a = [];
  const res = context.querySelectorAll(selector);

  for (let i = 0; i < res.length; i += 1) {
    a.push(res[i]);
  }

  return a;
}

function $(selector, context) {
  const window = getWindow();
  const document = getDocument();
  let arr = [];

  if (!context && selector instanceof Dom7) {
    return selector;
  }

  if (!selector) {
    return new Dom7(arr);
  }

  if (typeof selector === 'string') {
    const html = selector.trim();

    if (html.indexOf('<') >= 0 && html.indexOf('>') >= 0) {
      let toCreate = 'div';
      if (html.indexOf('<li') === 0) toCreate = 'ul';
      if (html.indexOf('<tr') === 0) toCreate = 'tbody';
      if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) toCreate = 'tr';
      if (html.indexOf('<tbody') === 0) toCreate = 'table';
      if (html.indexOf('<option') === 0) toCreate = 'select';
      const tempParent = document.createElement(toCreate);
      tempParent.innerHTML = html;

      for (let i = 0; i < tempParent.childNodes.length; i += 1) {
        arr.push(tempParent.childNodes[i]);
      }
    } else {
      arr = qsa(selector.trim(), context || document);
    } // arr = qsa(selector, document);

  } else if (selector.nodeType || selector === window || selector === document) {
    arr.push(selector);
  } else if (Array.isArray(selector)) {
    if (selector instanceof Dom7) return selector;
    arr = selector;
  }

  return new Dom7(arrayUnique(arr));
}

$.fn = Dom7.prototype;

// eslint-disable-next-line

function addClass(...classes) {
  const classNames = arrayFlat(classes.map(c => c.split(' ')));
  this.forEach(el => {
    el.classList.add(...classNames);
  });
  return this;
}

function removeClass(...classes) {
  const classNames = arrayFlat(classes.map(c => c.split(' ')));
  this.forEach(el => {
    el.classList.remove(...classNames);
  });
  return this;
}

function toggleClass(...classes) {
  const classNames = arrayFlat(classes.map(c => c.split(' ')));
  this.forEach(el => {
    classNames.forEach(className => {
      el.classList.toggle(className);
    });
  });
}

function hasClass(...classes) {
  const classNames = arrayFlat(classes.map(c => c.split(' ')));
  return arrayFilter(this, el => {
    return classNames.filter(className => el.classList.contains(className)).length > 0;
  }).length > 0;
}

function attr(attrs, value) {
  if (arguments.length === 1 && typeof attrs === 'string') {
    // Get attr
    if (this[0]) return this[0].getAttribute(attrs);
    return undefined;
  } // Set attrs


  for (let i = 0; i < this.length; i += 1) {
    if (arguments.length === 2) {
      // String
      this[i].setAttribute(attrs, value);
    } else {
      // Object
      for (const attrName in attrs) {
        this[i][attrName] = attrs[attrName];
        this[i].setAttribute(attrName, attrs[attrName]);
      }
    }
  }

  return this;
}

function removeAttr(attr) {
  for (let i = 0; i < this.length; i += 1) {
    this[i].removeAttribute(attr);
  }

  return this;
}

function transform(transform) {
  for (let i = 0; i < this.length; i += 1) {
    this[i].style.transform = transform;
  }

  return this;
}

function transition(duration) {
  for (let i = 0; i < this.length; i += 1) {
    this[i].style.transitionDuration = typeof duration !== 'string' ? `${duration}ms` : duration;
  }

  return this;
}

function on(...args) {
  let [eventType, targetSelector, listener, capture] = args;

  if (typeof args[1] === 'function') {
    [eventType, listener, capture] = args;
    targetSelector = undefined;
  }

  if (!capture) capture = false;

  function handleLiveEvent(e) {
    const target = e.target;
    if (!target) return;
    const eventData = e.target.dom7EventData || [];

    if (eventData.indexOf(e) < 0) {
      eventData.unshift(e);
    }

    if ($(target).is(targetSelector)) listener.apply(target, eventData);else {
      const parents = $(target).parents(); // eslint-disable-line

      for (let k = 0; k < parents.length; k += 1) {
        if ($(parents[k]).is(targetSelector)) listener.apply(parents[k], eventData);
      }
    }
  }

  function handleEvent(e) {
    const eventData = e && e.target ? e.target.dom7EventData || [] : [];

    if (eventData.indexOf(e) < 0) {
      eventData.unshift(e);
    }

    listener.apply(this, eventData);
  }

  const events = eventType.split(' ');
  let j;

  for (let i = 0; i < this.length; i += 1) {
    const el = this[i];

    if (!targetSelector) {
      for (j = 0; j < events.length; j += 1) {
        const event = events[j];
        if (!el.dom7Listeners) el.dom7Listeners = {};
        if (!el.dom7Listeners[event]) el.dom7Listeners[event] = [];
        el.dom7Listeners[event].push({
          listener,
          proxyListener: handleEvent
        });
        el.addEventListener(event, handleEvent, capture);
      }
    } else {
      // Live events
      for (j = 0; j < events.length; j += 1) {
        const event = events[j];
        if (!el.dom7LiveListeners) el.dom7LiveListeners = {};
        if (!el.dom7LiveListeners[event]) el.dom7LiveListeners[event] = [];
        el.dom7LiveListeners[event].push({
          listener,
          proxyListener: handleLiveEvent
        });
        el.addEventListener(event, handleLiveEvent, capture);
      }
    }
  }

  return this;
}

function off(...args) {
  let [eventType, targetSelector, listener, capture] = args;

  if (typeof args[1] === 'function') {
    [eventType, listener, capture] = args;
    targetSelector = undefined;
  }

  if (!capture) capture = false;
  const events = eventType.split(' ');

  for (let i = 0; i < events.length; i += 1) {
    const event = events[i];

    for (let j = 0; j < this.length; j += 1) {
      const el = this[j];
      let handlers;

      if (!targetSelector && el.dom7Listeners) {
        handlers = el.dom7Listeners[event];
      } else if (targetSelector && el.dom7LiveListeners) {
        handlers = el.dom7LiveListeners[event];
      }

      if (handlers && handlers.length) {
        for (let k = handlers.length - 1; k >= 0; k -= 1) {
          const handler = handlers[k];

          if (listener && handler.listener === listener) {
            el.removeEventListener(event, handler.proxyListener, capture);
            handlers.splice(k, 1);
          } else if (listener && handler.listener && handler.listener.dom7proxy && handler.listener.dom7proxy === listener) {
            el.removeEventListener(event, handler.proxyListener, capture);
            handlers.splice(k, 1);
          } else if (!listener) {
            el.removeEventListener(event, handler.proxyListener, capture);
            handlers.splice(k, 1);
          }
        }
      }
    }
  }

  return this;
}

function trigger(...args) {
  const window = getWindow();
  const events = args[0].split(' ');
  const eventData = args[1];

  for (let i = 0; i < events.length; i += 1) {
    const event = events[i];

    for (let j = 0; j < this.length; j += 1) {
      const el = this[j];

      if (window.CustomEvent) {
        const evt = new window.CustomEvent(event, {
          detail: eventData,
          bubbles: true,
          cancelable: true
        });
        el.dom7EventData = args.filter((data, dataIndex) => dataIndex > 0);
        el.dispatchEvent(evt);
        el.dom7EventData = [];
        delete el.dom7EventData;
      }
    }
  }

  return this;
}

function transitionEnd(callback) {
  const dom = this;

  function fireCallBack(e) {
    if (e.target !== this) return;
    callback.call(this, e);
    dom.off('transitionend', fireCallBack);
  }

  if (callback) {
    dom.on('transitionend', fireCallBack);
  }

  return this;
}

function outerWidth(includeMargins) {
  if (this.length > 0) {
    if (includeMargins) {
      const styles = this.styles();
      return this[0].offsetWidth + parseFloat(styles.getPropertyValue('margin-right')) + parseFloat(styles.getPropertyValue('margin-left'));
    }

    return this[0].offsetWidth;
  }

  return null;
}

function outerHeight(includeMargins) {
  if (this.length > 0) {
    if (includeMargins) {
      const styles = this.styles();
      return this[0].offsetHeight + parseFloat(styles.getPropertyValue('margin-top')) + parseFloat(styles.getPropertyValue('margin-bottom'));
    }

    return this[0].offsetHeight;
  }

  return null;
}

function offset() {
  if (this.length > 0) {
    const window = getWindow();
    const document = getDocument();
    const el = this[0];
    const box = el.getBoundingClientRect();
    const body = document.body;
    const clientTop = el.clientTop || body.clientTop || 0;
    const clientLeft = el.clientLeft || body.clientLeft || 0;
    const scrollTop = el === window ? window.scrollY : el.scrollTop;
    const scrollLeft = el === window ? window.scrollX : el.scrollLeft;
    return {
      top: box.top + scrollTop - clientTop,
      left: box.left + scrollLeft - clientLeft
    };
  }

  return null;
}

function styles() {
  const window = getWindow();
  if (this[0]) return window.getComputedStyle(this[0], null);
  return {};
}

function css(props, value) {
  const window = getWindow();
  let i;

  if (arguments.length === 1) {
    if (typeof props === 'string') {
      // .css('width')
      if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(props);
    } else {
      // .css({ width: '100px' })
      for (i = 0; i < this.length; i += 1) {
        for (const prop in props) {
          this[i].style[prop] = props[prop];
        }
      }

      return this;
    }
  }

  if (arguments.length === 2 && typeof props === 'string') {
    // .css('width', '100px')
    for (i = 0; i < this.length; i += 1) {
      this[i].style[props] = value;
    }

    return this;
  }

  return this;
}

function each(callback) {
  if (!callback) return this;
  this.forEach((el, index) => {
    callback.apply(el, [el, index]);
  });
  return this;
}

function filter(callback) {
  const result = arrayFilter(this, callback);
  return $(result);
}

function html(html) {
  if (typeof html === 'undefined') {
    return this[0] ? this[0].innerHTML : null;
  }

  for (let i = 0; i < this.length; i += 1) {
    this[i].innerHTML = html;
  }

  return this;
}

function text(text) {
  if (typeof text === 'undefined') {
    return this[0] ? this[0].textContent.trim() : null;
  }

  for (let i = 0; i < this.length; i += 1) {
    this[i].textContent = text;
  }

  return this;
}

function is(selector) {
  const window = getWindow();
  const document = getDocument();
  const el = this[0];
  let compareWith;
  let i;
  if (!el || typeof selector === 'undefined') return false;

  if (typeof selector === 'string') {
    if (el.matches) return el.matches(selector);
    if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
    if (el.msMatchesSelector) return el.msMatchesSelector(selector);
    compareWith = $(selector);

    for (i = 0; i < compareWith.length; i += 1) {
      if (compareWith[i] === el) return true;
    }

    return false;
  }

  if (selector === document) {
    return el === document;
  }

  if (selector === window) {
    return el === window;
  }

  if (selector.nodeType || selector instanceof Dom7) {
    compareWith = selector.nodeType ? [selector] : selector;

    for (i = 0; i < compareWith.length; i += 1) {
      if (compareWith[i] === el) return true;
    }

    return false;
  }

  return false;
}

function index$9() {
  let child = this[0];
  let i;

  if (child) {
    i = 0; // eslint-disable-next-line

    while ((child = child.previousSibling) !== null) {
      if (child.nodeType === 1) i += 1;
    }

    return i;
  }

  return undefined;
}

function eq(index) {
  if (typeof index === 'undefined') return this;
  const length = this.length;

  if (index > length - 1) {
    return $([]);
  }

  if (index < 0) {
    const returnIndex = length + index;
    if (returnIndex < 0) return $([]);
    return $([this[returnIndex]]);
  }

  return $([this[index]]);
}

function append(...els) {
  let newChild;
  const document = getDocument();

  for (let k = 0; k < els.length; k += 1) {
    newChild = els[k];

    for (let i = 0; i < this.length; i += 1) {
      if (typeof newChild === 'string') {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = newChild;

        while (tempDiv.firstChild) {
          this[i].appendChild(tempDiv.firstChild);
        }
      } else if (newChild instanceof Dom7) {
        for (let j = 0; j < newChild.length; j += 1) {
          this[i].appendChild(newChild[j]);
        }
      } else {
        this[i].appendChild(newChild);
      }
    }
  }

  return this;
}

function prepend(newChild) {
  const document = getDocument();
  let i;
  let j;

  for (i = 0; i < this.length; i += 1) {
    if (typeof newChild === 'string') {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = newChild;

      for (j = tempDiv.childNodes.length - 1; j >= 0; j -= 1) {
        this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
      }
    } else if (newChild instanceof Dom7) {
      for (j = 0; j < newChild.length; j += 1) {
        this[i].insertBefore(newChild[j], this[i].childNodes[0]);
      }
    } else {
      this[i].insertBefore(newChild, this[i].childNodes[0]);
    }
  }

  return this;
}

function next(selector) {
  if (this.length > 0) {
    if (selector) {
      if (this[0].nextElementSibling && $(this[0].nextElementSibling).is(selector)) {
        return $([this[0].nextElementSibling]);
      }

      return $([]);
    }

    if (this[0].nextElementSibling) return $([this[0].nextElementSibling]);
    return $([]);
  }

  return $([]);
}

function nextAll(selector) {
  const nextEls = [];
  let el = this[0];
  if (!el) return $([]);

  while (el.nextElementSibling) {
    const next = el.nextElementSibling; // eslint-disable-line

    if (selector) {
      if ($(next).is(selector)) nextEls.push(next);
    } else nextEls.push(next);

    el = next;
  }

  return $(nextEls);
}

function prev(selector) {
  if (this.length > 0) {
    const el = this[0];

    if (selector) {
      if (el.previousElementSibling && $(el.previousElementSibling).is(selector)) {
        return $([el.previousElementSibling]);
      }

      return $([]);
    }

    if (el.previousElementSibling) return $([el.previousElementSibling]);
    return $([]);
  }

  return $([]);
}

function prevAll(selector) {
  const prevEls = [];
  let el = this[0];
  if (!el) return $([]);

  while (el.previousElementSibling) {
    const prev = el.previousElementSibling; // eslint-disable-line

    if (selector) {
      if ($(prev).is(selector)) prevEls.push(prev);
    } else prevEls.push(prev);

    el = prev;
  }

  return $(prevEls);
}

function parent(selector) {
  const parents = []; // eslint-disable-line

  for (let i = 0; i < this.length; i += 1) {
    if (this[i].parentNode !== null) {
      if (selector) {
        if ($(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
      } else {
        parents.push(this[i].parentNode);
      }
    }
  }

  return $(parents);
}

function parents(selector) {
  const parents = []; // eslint-disable-line

  for (let i = 0; i < this.length; i += 1) {
    let parent = this[i].parentNode; // eslint-disable-line

    while (parent) {
      if (selector) {
        if ($(parent).is(selector)) parents.push(parent);
      } else {
        parents.push(parent);
      }

      parent = parent.parentNode;
    }
  }

  return $(parents);
}

function closest(selector) {
  let closest = this; // eslint-disable-line

  if (typeof selector === 'undefined') {
    return $([]);
  }

  if (!closest.is(selector)) {
    closest = closest.parents(selector).eq(0);
  }

  return closest;
}

function find(selector) {
  const foundElements = [];

  for (let i = 0; i < this.length; i += 1) {
    const found = this[i].querySelectorAll(selector);

    for (let j = 0; j < found.length; j += 1) {
      foundElements.push(found[j]);
    }
  }

  return $(foundElements);
}

function children(selector) {
  const children = []; // eslint-disable-line

  for (let i = 0; i < this.length; i += 1) {
    const childNodes = this[i].children;

    for (let j = 0; j < childNodes.length; j += 1) {
      if (!selector || $(childNodes[j]).is(selector)) {
        children.push(childNodes[j]);
      }
    }
  }

  return $(children);
}

function remove$1() {
  for (let i = 0; i < this.length; i += 1) {
    if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
  }

  return this;
}

const Methods = {
  addClass,
  removeClass,
  hasClass,
  toggleClass,
  attr,
  removeAttr,
  transform,
  transition,
  on,
  off,
  trigger,
  transitionEnd,
  outerWidth,
  outerHeight,
  styles,
  offset,
  css,
  each,
  html,
  text,
  is,
  index: index$9,
  eq,
  append,
  prepend,
  next,
  nextAll,
  prev,
  prevAll,
  parent,
  parents,
  closest,
  find,
  children,
  filter,
  remove: remove$1
};
Object.keys(Methods).forEach(methodName => {
  Object.defineProperty($.fn, methodName, {
    value: Methods[methodName],
    writable: true
  });
});

function createElementIfNotDefined(swiper, originalParams, params, checkProps) {
  const document = getDocument();

  if (swiper.params.createElements) {
    Object.keys(checkProps).forEach(key => {
      if (!params[key] && params.auto === true) {
        let element = swiper.$el.children(`.${checkProps[key]}`)[0];

        if (!element) {
          element = document.createElement('div');
          element.className = checkProps[key];
          swiper.$el.append(element);
        }

        params[key] = element;
        originalParams[key] = element;
      }
    });
  }

  return params;
}

function Navigation(_ref) {
  let {
    swiper,
    extendParams,
    on,
    emit
  } = _ref;
  extendParams({
    navigation: {
      nextEl: null,
      prevEl: null,
      hideOnClick: false,
      disabledClass: 'swiper-button-disabled',
      hiddenClass: 'swiper-button-hidden',
      lockClass: 'swiper-button-lock'
    }
  });
  swiper.navigation = {
    nextEl: null,
    $nextEl: null,
    prevEl: null,
    $prevEl: null
  };

  function getEl(el) {
    let $el;

    if (el) {
      $el = $(el);

      if (swiper.params.uniqueNavElements && typeof el === 'string' && $el.length > 1 && swiper.$el.find(el).length === 1) {
        $el = swiper.$el.find(el);
      }
    }

    return $el;
  }

  function toggleEl($el, disabled) {
    const params = swiper.params.navigation;

    if ($el && $el.length > 0) {
      $el[disabled ? 'addClass' : 'removeClass'](params.disabledClass);
      if ($el[0] && $el[0].tagName === 'BUTTON') $el[0].disabled = disabled;

      if (swiper.params.watchOverflow && swiper.enabled) {
        $el[swiper.isLocked ? 'addClass' : 'removeClass'](params.lockClass);
      }
    }
  }

  function update() {
    // Update Navigation Buttons
    if (swiper.params.loop) return;
    const {
      $nextEl,
      $prevEl
    } = swiper.navigation;
    toggleEl($prevEl, swiper.isBeginning && !swiper.params.rewind);
    toggleEl($nextEl, swiper.isEnd && !swiper.params.rewind);
  }

  function onPrevClick(e) {
    e.preventDefault();
    if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind) return;
    swiper.slidePrev();
  }

  function onNextClick(e) {
    e.preventDefault();
    if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind) return;
    swiper.slideNext();
  }

  function init() {
    const params = swiper.params.navigation;
    swiper.params.navigation = createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
      nextEl: 'swiper-button-next',
      prevEl: 'swiper-button-prev'
    });
    if (!(params.nextEl || params.prevEl)) return;
    const $nextEl = getEl(params.nextEl);
    const $prevEl = getEl(params.prevEl);

    if ($nextEl && $nextEl.length > 0) {
      $nextEl.on('click', onNextClick);
    }

    if ($prevEl && $prevEl.length > 0) {
      $prevEl.on('click', onPrevClick);
    }

    Object.assign(swiper.navigation, {
      $nextEl,
      nextEl: $nextEl && $nextEl[0],
      $prevEl,
      prevEl: $prevEl && $prevEl[0]
    });

    if (!swiper.enabled) {
      if ($nextEl) $nextEl.addClass(params.lockClass);
      if ($prevEl) $prevEl.addClass(params.lockClass);
    }
  }

  function destroy() {
    const {
      $nextEl,
      $prevEl
    } = swiper.navigation;

    if ($nextEl && $nextEl.length) {
      $nextEl.off('click', onNextClick);
      $nextEl.removeClass(swiper.params.navigation.disabledClass);
    }

    if ($prevEl && $prevEl.length) {
      $prevEl.off('click', onPrevClick);
      $prevEl.removeClass(swiper.params.navigation.disabledClass);
    }
  }

  on('init', () => {
    init();
    update();
  });
  on('toEdge fromEdge lock unlock', () => {
    update();
  });
  on('destroy', () => {
    destroy();
  });
  on('enable disable', () => {
    const {
      $nextEl,
      $prevEl
    } = swiper.navigation;

    if ($nextEl) {
      $nextEl[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.navigation.lockClass);
    }

    if ($prevEl) {
      $prevEl[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.navigation.lockClass);
    }
  });
  on('click', (_s, e) => {
    const {
      $nextEl,
      $prevEl
    } = swiper.navigation;
    const targetEl = e.target;

    if (swiper.params.navigation.hideOnClick && !$(targetEl).is($prevEl) && !$(targetEl).is($nextEl)) {
      if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
      let isHidden;

      if ($nextEl) {
        isHidden = $nextEl.hasClass(swiper.params.navigation.hiddenClass);
      } else if ($prevEl) {
        isHidden = $prevEl.hasClass(swiper.params.navigation.hiddenClass);
      }

      if (isHidden === true) {
        emit('navigationShow');
      } else {
        emit('navigationHide');
      }

      if ($nextEl) {
        $nextEl.toggleClass(swiper.params.navigation.hiddenClass);
      }

      if ($prevEl) {
        $prevEl.toggleClass(swiper.params.navigation.hiddenClass);
      }
    }
  });
  Object.assign(swiper.navigation, {
    update,
    init,
    destroy
  });
}

var LifecycleEnum = /* @__PURE__ */ ((LifecycleEnum2) => {
  LifecycleEnum2["LOADING"] = "loading";
  LifecycleEnum2["LOADED"] = "loaded";
  LifecycleEnum2["ERROR"] = "error";
  return LifecycleEnum2;
})(LifecycleEnum || {});
const hasIntersectionObserver = checkIntersectionObserver();
const isEnumerable = Object.prototype.propertyIsEnumerable;
const getSymbols = Object.getOwnPropertySymbols;
function isObject$2(val) {
  return typeof val === "function" || toString.call(val) === "[object Object]";
}
function isPrimitive(val) {
  return typeof val === "object" ? val === null : typeof val !== "function";
}
function isValidKey(key) {
  return key !== "__proto__" && key !== "constructor" && key !== "prototype";
}
function checkIntersectionObserver() {
  return false;
}
function assignSymbols(target, ...args) {
  if (!isObject$2(target))
    throw new TypeError("expected the first argument to be an object");
  if (args.length === 0 || typeof Symbol !== "function" || typeof getSymbols !== "function")
    return target;
  for (const arg of args) {
    const names = getSymbols(arg);
    for (const key of names) {
      if (isEnumerable.call(arg, key))
        target[key] = arg[key];
    }
  }
  return target;
}
function assign(target, ...args) {
  let i = 0;
  if (isPrimitive(target))
    target = args[i++];
  if (!target)
    target = {};
  for (; i < args.length; i++) {
    if (isObject$2(args[i])) {
      for (const key of Object.keys(args[i])) {
        if (isValidKey(key)) {
          if (isObject$2(target[key]) && isObject$2(args[i][key]))
            assign(target[key], args[i][key]);
          else
            target[key] = args[i][key];
        }
      }
      assignSymbols(target, args[i]);
    }
  }
  return target;
}

const DEFAULT_LOADING = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const DEFAULT_ERROR = "";

const DEFAULT_OBSERVER_OPTIONS = {
  rootMargin: "0px",
  threshold: 0
};
const TIMEOUT_ID_DATA_ATTR = "data-lazy-timeout-id";
class Lazy {
  constructor(options) {
    this.options = {
      loading: DEFAULT_LOADING,
      error: DEFAULT_ERROR,
      observerOptions: DEFAULT_OBSERVER_OPTIONS,
      log: true,
      lifecycle: {}
    };
    this._images = /* @__PURE__ */ new WeakMap();
    this.config(options);
  }
  config(options = {}) {
    assign(this.options, options);
  }
  mount(el, binding) {
    if (!el)
      return;
    const { src, loading, error, lifecycle, delay } = this._valueFormatter(typeof binding === "string" ? binding : binding.value);
    this._lifecycle(LifecycleEnum.LOADING, lifecycle, el);
    el.setAttribute("src", loading || DEFAULT_LOADING);
    if (!hasIntersectionObserver) {
      this.loadImages(el, src, error, lifecycle);
      this._log(() => {
        throw new Error("Not support IntersectionObserver!");
      });
    }
    this._initIntersectionObserver(el, src, error, lifecycle, delay);
  }
  update(el, binding) {
    if (!el)
      return;
    this._realObserver(el)?.unobserve(el);
    const { src, error, lifecycle, delay } = this._valueFormatter(typeof binding === "string" ? binding : binding.value);
    this._initIntersectionObserver(el, src, error, lifecycle, delay);
  }
  unmount(el) {
    if (!el)
      return;
    this._realObserver(el)?.unobserve(el);
    this._images.delete(el);
  }
  loadImages(el, src, error, lifecycle) {
    this._setImageSrc(el, src, error, lifecycle);
  }
  _setImageSrc(el, src, error, lifecycle) {
    if (el.tagName.toLowerCase() === "img") {
      if (src) {
        const preSrc = el.getAttribute("src");
        if (preSrc !== src)
          el.setAttribute("src", src);
      }
      this._listenImageStatus(el, () => {
        this._lifecycle(LifecycleEnum.LOADED, lifecycle, el);
      }, () => {
        el.onload = null;
        this._lifecycle(LifecycleEnum.ERROR, lifecycle, el);
        this._realObserver(el)?.disconnect();
        if (error)
          el.setAttribute("src", error);
        this._log(() => {
          throw new Error(`Image failed to load!And failed src was: ${src} `);
        });
      });
    } else {
      el.style.backgroundImage = `url('${src}')`;
    }
  }
  _initIntersectionObserver(el, src, error, lifecycle, delay) {
    const observerOptions = this.options.observerOptions;
    this._images.set(el, new IntersectionObserver((entries) => {
      Array.prototype.forEach.call(entries, (entry) => {
        if (delay && delay > 0)
          this._delayedIntersectionCallback(el, entry, delay, src, error, lifecycle);
        else
          this._intersectionCallback(el, entry, src, error, lifecycle);
      });
    }, observerOptions));
    this._realObserver(el)?.observe(el);
  }
  _intersectionCallback(el, entry, src, error, lifecycle) {
    if (entry.isIntersecting) {
      this._realObserver(el)?.unobserve(entry.target);
      this._setImageSrc(el, src, error, lifecycle);
    }
  }
  _delayedIntersectionCallback(el, entry, delay, src, error, lifecycle) {
    if (entry.isIntersecting) {
      if (entry.target.hasAttribute(TIMEOUT_ID_DATA_ATTR))
        return;
      const timeoutId = setTimeout(() => {
        this._intersectionCallback(el, entry, src, error, lifecycle);
        entry.target.removeAttribute(TIMEOUT_ID_DATA_ATTR);
      }, delay);
      entry.target.setAttribute(TIMEOUT_ID_DATA_ATTR, String(timeoutId));
    } else {
      if (entry.target.hasAttribute(TIMEOUT_ID_DATA_ATTR)) {
        clearTimeout(Number(entry.target.getAttribute(TIMEOUT_ID_DATA_ATTR)));
        entry.target.removeAttribute(TIMEOUT_ID_DATA_ATTR);
      }
    }
  }
  _listenImageStatus(image, success, error) {
    image.onload = success;
    image.onerror = error;
  }
  _valueFormatter(value) {
    let src = value;
    let loading = this.options.loading;
    let error = this.options.error;
    let lifecycle = this.options.lifecycle;
    let delay = this.options.delay;
    if (isObject$2(value)) {
      src = value.src;
      loading = value.loading || this.options.loading;
      error = value.error || this.options.error;
      lifecycle = value.lifecycle || this.options.lifecycle;
      delay = value.delay || this.options.delay;
    }
    return {
      src,
      loading,
      error,
      lifecycle,
      delay
    };
  }
  _log(callback) {
    if (this.options.log)
      callback();
  }
  _lifecycle(life, lifecycle, el) {
    switch (life) {
      case LifecycleEnum.LOADING:
        el?.setAttribute("lazy", LifecycleEnum.LOADING);
        if (lifecycle?.loading)
          lifecycle.loading(el);
        break;
      case LifecycleEnum.LOADED:
        el?.setAttribute("lazy", LifecycleEnum.LOADED);
        if (lifecycle?.loaded)
          lifecycle.loaded(el);
        break;
      case LifecycleEnum.ERROR:
        el?.setAttribute("lazy", LifecycleEnum.ERROR);
        if (lifecycle?.error)
          lifecycle.error(el);
        break;
    }
  }
  _realObserver(el) {
    return this._images.get(el);
  }
}

const index$8 = {
  install(Vue, options) {
    const lazy = new Lazy(options);
    Vue.config.globalProperties.$Lazyload = lazy;
    Vue.provide("Lazyload", lazy);
    Vue.directive("lazy", {
      mounted: lazy.mount.bind(lazy),
      updated: lazy.update.bind(lazy),
      unmounted: lazy.unmount.bind(lazy)
    });
  }
};

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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
function createMock(name, overrides2 = {}) {
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
      if (prop in overrides2) {
        return overrides2[prop];
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
    payload: vue_cjs_prod.reactive(__spreadValues({
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
  const vm = vue_cjs_prod.getCurrentInstance();
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
  * vue-router v4.0.16
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
    let path, query = {}, searchString = "", hash2 = "";
    const searchPos = location2.indexOf("?");
    const hashPos = location2.indexOf("#", searchPos > -1 ? searchPos : 0);
    if (searchPos > -1) {
      path = location2.slice(0, searchPos);
      searchString = location2.slice(searchPos + 1, hashPos > -1 ? hashPos : location2.length);
      query = parseQuery2(searchString);
    }
    if (hashPos > -1) {
      path = path || location2.slice(0, hashPos);
      hash2 = location2.slice(hashPos, location2.length);
    }
    path = resolveRelativePath(path != null ? path : location2, currentLocation);
    return {
      fullPath: path + (searchString && "?") + searchString + hash2,
      path,
      query,
      hash: hash2
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
  function isSameRouteLocation(stringifyQuery2, a, b) {
    const aLastIndex = a.matched.length - 1;
    const bLastIndex = b.matched.length - 1;
    return aLastIndex > -1 && aLastIndex === bLastIndex && isSameRouteRecord(a.matched[aLastIndex], b.matched[bLastIndex]) && isSameRouteLocationParams(a.params, b.params) && stringifyQuery2(a.query) === stringifyQuery2(b.query) && a.hash === b.hash;
  }
  function isSameRouteRecord(a, b) {
    return (a.aliasOf || a) === (b.aliasOf || b);
  }
  function isSameRouteLocationParams(a, b) {
    if (Object.keys(a).length !== Object.keys(b).length)
      return false;
    for (const key in a) {
      if (!isSameRouteLocationParamsValue(a[key], b[key]))
        return false;
    }
    return true;
  }
  function isSameRouteLocationParamsValue(a, b) {
    return Array.isArray(a) ? isEquivalentArray(a, b) : Array.isArray(b) ? isEquivalentArray(b, a) : a === b;
  }
  function isEquivalentArray(a, b) {
    return Array.isArray(b) ? a.length === b.length && a.every((value, i) => value === b[i]) : a.length === 1 && a[0] === b;
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
    const { pathname, search, hash: hash2 } = location2;
    const hashPos = base.indexOf("#");
    if (hashPos > -1) {
      let slicePos = hash2.includes(base.slice(hashPos)) ? base.slice(hashPos).length : 1;
      let pathFromHash = hash2.slice(slicePos);
      if (pathFromHash[0] !== "/")
        pathFromHash = "/" + pathFromHash;
      return stripBase(pathFromHash, "");
    }
    const path = stripBase(pathname, base);
    return path + search + hash2;
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
  function compareScoreArray(a, b) {
    let i = 0;
    while (i < a.length && i < b.length) {
      const diff = b[i] - a[i];
      if (diff)
        return diff;
      i++;
    }
    if (a.length < b.length) {
      return a.length === 1 && a[0] === 40 + 40 ? -1 : 1;
    } else if (a.length > b.length) {
      return b.length === 1 && b[0] === 40 + 40 ? 1 : -1;
    }
    return 0;
  }
  function comparePathParserScore(a, b) {
    let i = 0;
    const aScore = a.score;
    const bScore = b.score;
    while (i < aScore.length && i < bScore.length) {
      const comp = compareScoreArray(aScore[i], bScore[i]);
      if (comp)
        return comp;
      i++;
    }
    if (Math.abs(bScore.length - aScore.length) === 1) {
      if (isLastScoreNegative(aScore))
        return 1;
      if (isLastScoreNegative(bScore))
        return -1;
    }
    return bScore.length - aScore.length;
  }
  function isLastScoreNegative(score) {
    const last = score[score.length - 1];
    return score.length > 0 && last[last.length - 1] < 0;
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
  function mergeOptions(defaults2, partialOptions) {
    const options = {};
    for (const key in defaults2) {
      options[key] = key in partialOptions ? partialOptions[key] : defaults2[key];
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
    compatConfig: { MODE: 3 },
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
      const hash2 = rawLocation.hash || "";
      matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params));
      const fullPath = stringifyURL(stringifyQuery$1, assign({}, rawLocation, {
        hash: encodeHash(hash2),
        path: matchedRoute.path
      }));
      const href = routerHistory.createHref(fullPath);
      return assign({
        fullPath,
        hash: hash2,
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
const wrapInRef = (value) => vue_cjs_prod.isRef(value) ? value : vue_cjs_prod.ref(value);
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
  const instance = vue_cjs_prod.getCurrentInstance();
  if (instance && !instance._nuxtOnBeforeMountCbs) {
    const cbs = instance._nuxtOnBeforeMountCbs = [];
    if (instance && false) {
      vue_cjs_prod.onBeforeMount(() => {
        cbs.forEach((cb) => {
          cb();
        });
        cbs.splice(0, cbs.length);
      });
      vue_cjs_prod.onUnmounted(() => cbs.splice(0, cbs.length));
    }
  }
  const useInitialCache = () => options.initialCache && nuxt.payload.data[key] !== void 0;
  const asyncData = {
    data: wrapInRef((_d = nuxt.payload.data[key]) != null ? _d : options.default()),
    pending: vue_cjs_prod.ref(!useInitialCache()),
    error: vue_cjs_prod.ref((_e = nuxt.payload._errors[key]) != null ? _e : null)
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
      asyncData.data.value = vue_cjs_prod.unref(options.default());
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
    vue_cjs_prod.onServerPrefetch(() => promise);
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
  const state = vue_cjs_prod.toRef(nuxt.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (vue_cjs_prod.isRef(initialValue)) {
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
function murmurHash(key, seed = 0) {
  if (typeof key === "string") {
    key = createBuffer(key);
  }
  let i = 0;
  let h1 = seed;
  let k1;
  let h1b;
  const remainder = key.length & 3;
  const bytes = key.length - remainder;
  const c1 = 3432918353;
  const c2 = 461845907;
  while (i < bytes) {
    k1 = key[i] & 255 | (key[++i] & 255) << 8 | (key[++i] & 255) << 16 | (key[++i] & 255) << 24;
    ++i;
    k1 = (k1 & 65535) * c1 + (((k1 >>> 16) * c1 & 65535) << 16) & 4294967295;
    k1 = k1 << 15 | k1 >>> 17;
    k1 = (k1 & 65535) * c2 + (((k1 >>> 16) * c2 & 65535) << 16) & 4294967295;
    h1 ^= k1;
    h1 = h1 << 13 | h1 >>> 19;
    h1b = (h1 & 65535) * 5 + (((h1 >>> 16) * 5 & 65535) << 16) & 4294967295;
    h1 = (h1b & 65535) + 27492 + (((h1b >>> 16) + 58964 & 65535) << 16);
  }
  k1 = 0;
  switch (remainder) {
    case 3:
      k1 ^= (key[i + 2] & 255) << 16;
      break;
    case 2:
      k1 ^= (key[i + 1] & 255) << 8;
      break;
    case 1:
      k1 ^= key[i] & 255;
      k1 = (k1 & 65535) * c1 + (((k1 >>> 16) * c1 & 65535) << 16) & 4294967295;
      k1 = k1 << 15 | k1 >>> 17;
      k1 = (k1 & 65535) * c2 + (((k1 >>> 16) * c2 & 65535) << 16) & 4294967295;
      h1 ^= k1;
  }
  h1 ^= key.length;
  h1 ^= h1 >>> 16;
  h1 = (h1 & 65535) * 2246822507 + (((h1 >>> 16) * 2246822507 & 65535) << 16) & 4294967295;
  h1 ^= h1 >>> 13;
  h1 = (h1 & 65535) * 3266489909 + (((h1 >>> 16) * 3266489909 & 65535) << 16) & 4294967295;
  h1 ^= h1 >>> 16;
  return h1 >>> 0;
}
function createBuffer(val) {
  return new TextEncoder().encode(val);
}
const defaults = {
  ignoreUnknown: false,
  respectType: false,
  respectFunctionNames: false,
  respectFunctionProperties: false,
  unorderedObjects: true,
  unorderedArrays: false,
  unorderedSets: false
};
function objectHash(object, options = {}) {
  options = __spreadValues(__spreadValues({}, defaults), options);
  const hasher = createHasher(options);
  hasher.dispatch(object);
  return hasher.toString();
}
function createHasher(options) {
  const buff = [];
  let context = [];
  const write = (str) => {
    buff.push(str);
  };
  return {
    toString() {
      return buff.join("");
    },
    getContext() {
      return context;
    },
    dispatch(value) {
      if (options.replacer) {
        value = options.replacer(value);
      }
      const type = value === null ? "null" : typeof value;
      return this["_" + type](value);
    },
    _object(object) {
      const pattern = /\[object (.*)\]/i;
      const objString = Object.prototype.toString.call(object);
      const _objType = pattern.exec(objString);
      const objType = _objType ? _objType[1].toLowerCase() : "unknown:[" + objString.toLowerCase() + "]";
      let objectNumber = null;
      if ((objectNumber = context.indexOf(object)) >= 0) {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      } else {
        context.push(object);
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        write("buffer:");
        return write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this["_" + objType]) {
          this["_" + objType](object);
        } else if (options.ignoreUnknown) {
          return write("[" + objType + "]");
        } else {
          throw new Error('Unknown object type "' + objType + '"');
        }
      } else {
        let keys = Object.keys(object);
        if (options.unorderedObjects) {
          keys = keys.sort();
        }
        if (options.respectType !== false && !isNativeFunction(object)) {
          keys.splice(0, 0, "prototype", "__proto__", "letructor");
        }
        if (options.excludeKeys) {
          keys = keys.filter(function(key) {
            return !options.excludeKeys(key);
          });
        }
        write("object:" + keys.length + ":");
        return keys.forEach((key) => {
          this.dispatch(key);
          write(":");
          if (!options.excludeValues) {
            this.dispatch(object[key]);
          }
          write(",");
        });
      }
    },
    _array(arr, unordered) {
      unordered = typeof unordered !== "undefined" ? unordered : options.unorderedArrays !== false;
      write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        return arr.forEach((entry2) => {
          return this.dispatch(entry2);
        });
      }
      const contextAdditions = [];
      const entries = arr.map((entry2) => {
        const hasher = createHasher(options);
        hasher.dispatch(entry2);
        contextAdditions.push(hasher.getContext());
        return hasher.toString();
      });
      context = context.concat(contextAdditions);
      entries.sort();
      return this._array(entries, false);
    },
    _date(date) {
      return write("date:" + date.toJSON());
    },
    _symbol(sym) {
      return write("symbol:" + sym.toString());
    },
    _error(err) {
      return write("error:" + err.toString());
    },
    _boolean(bool) {
      return write("bool:" + bool.toString());
    },
    _string(string) {
      write("string:" + string.length + ":");
      write(string.toString());
    },
    _function(fn) {
      write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
      if (options.respectFunctionNames !== false) {
        this.dispatch("function-name:" + String(fn.name));
      }
      if (options.respectFunctionProperties) {
        this._object(fn);
      }
    },
    _number(number) {
      return write("number:" + number.toString());
    },
    _xml(xml) {
      return write("xml:" + xml.toString());
    },
    _null() {
      return write("Null");
    },
    _undefined() {
      return write("Undefined");
    },
    _regexp(regex) {
      return write("regex:" + regex.toString());
    },
    _uint8array(arr) {
      write("uint8array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    _uint8clampedarray(arr) {
      write("uint8clampedarray:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    _int8array(arr) {
      write("int8array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    _uint16array(arr) {
      write("uint16array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    _int16array(arr) {
      write("int16array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    _uint32array(arr) {
      write("uint32array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    _int32array(arr) {
      write("int32array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    _float32array(arr) {
      write("float32array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    _float64array(arr) {
      write("float64array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    _arraybuffer(arr) {
      write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    },
    _url(url) {
      return write("url:" + url.toString());
    },
    _map(map) {
      write("map:");
      const arr = Array.from(map);
      return this._array(arr, options.unorderedSets !== false);
    },
    _set(set) {
      write("set:");
      const arr = Array.from(set);
      return this._array(arr, options.unorderedSets !== false);
    },
    _file(file) {
      write("file:");
      return this.dispatch([file.name, file.size, file.type, file.lastModfied]);
    },
    _blob() {
      if (options.ignoreUnknown) {
        return write("[blob]");
      }
      throw new Error('Hashing Blob objects is currently not supported\nUse "options.replacer" or "options.ignoreUnknown"\n');
    },
    _domwindow() {
      return write("domwindow");
    },
    _bigint(number) {
      return write("bigint:" + number.toString());
    },
    _process() {
      return write("process");
    },
    _timer() {
      return write("timer");
    },
    _pipe() {
      return write("pipe");
    },
    _tcp() {
      return write("tcp");
    },
    _udp() {
      return write("udp");
    },
    _tty() {
      return write("tty");
    },
    _statwatcher() {
      return write("statwatcher");
    },
    _securecontext() {
      return write("securecontext");
    },
    _connection() {
      return write("connection");
    },
    _zlib() {
      return write("zlib");
    },
    _context() {
      return write("context");
    },
    _nodescript() {
      return write("nodescript");
    },
    _httpparser() {
      return write("httpparser");
    },
    _dataview() {
      return write("dataview");
    },
    _signal() {
      return write("signal");
    },
    _fsevent() {
      return write("fsevent");
    },
    _tlswrap() {
      return write("tlswrap");
    }
  };
}
function isNativeFunction(f) {
  if (typeof f !== "function") {
    return false;
  }
  const exp = /^function\s+\w*\s*\(\s*\)\s*{\s+\[native code\]\s+}$/i;
  return exp.exec(Function.prototype.toString.call(f)) != null;
}
function hash(object, options = {}) {
  const hashed = typeof object === "string" ? object : objectHash(object, options);
  return String(murmurHash(hashed));
}
function useFetch(request, opts = {}) {
  const key = "$f_" + (opts.key || hash([request, __spreadProps(__spreadValues({}, opts), { transform: null })]));
  const _request = vue_cjs_prod.computed(() => {
    let r = request;
    if (typeof r === "function") {
      r = r();
    }
    return vue_cjs_prod.isRef(r) ? r.value : r;
  });
  const _fetchOptions = __spreadProps(__spreadValues({}, opts), {
    cache: typeof opts.cache === "boolean" ? void 0 : opts.cache
  });
  const _asyncDataOptions = __spreadProps(__spreadValues({}, opts), {
    watch: [
      _request,
      ...opts.watch || []
    ]
  });
  const asyncData = useAsyncData(key, () => {
    return $fetch(_request.value, _fetchOptions);
  }, _asyncDataOptions);
  return asyncData;
}
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
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (input instanceof H3Error) {
    return input;
  }
  const err = new H3Error((_a = input.message) != null ? _a : input.statusMessage, input.cause ? { cause: input.cause } : void 0);
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
const navigateTo = (to, options = {}) => {
  if (!to) {
    to = "/";
  }
  const router = useRouter();
  {
    const nuxtApp = useNuxtApp();
    if (nuxtApp.ssrContext && nuxtApp.ssrContext.event) {
      const redirectLocation = joinURL(useRuntimeConfig().app.baseURL, router.resolve(to).fullPath || "/");
      return nuxtApp.callHook("app:redirected").then(() => sendRedirect(nuxtApp.ssrContext.event, redirectLocation, options.redirectCode || 302));
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
  return vue_cjs_prod.defineComponent({
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
      const to = vue_cjs_prod.computed(() => {
        checkPropConflicts();
        return props.to || props.href || "";
      });
      const isExternal = vue_cjs_prod.computed(() => {
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
          return vue_cjs_prod.h(vue_cjs_prod.resolveComponent("RouterLink"), {
            to: to.value,
            activeClass: props.activeClass || options.activeClass,
            exactActiveClass: props.exactActiveClass || options.exactActiveClass,
            replace: props.replace,
            ariaCurrentValue: props.ariaCurrentValue
          }, slots.default);
        }
        const href = typeof to.value === "object" ? (_b = (_a = router.resolve(to.value)) == null ? void 0 : _a.href) != null ? _b : null : to.value || null;
        const target = props.target || null;
        checkPropConflicts();
        const rel = props.noRel ? null : firstNonUndefined(props.rel, options.externalRelAttribute, href ? DEFAULT_EXTERNAL_REL_ATTRIBUTE : "") || null;
        return vue_cjs_prod.h("a", { href, rel, target }, (_c = slots.default) == null ? void 0 : _c.call(slots));
      };
    }
  });
}
const __nuxt_component_2$1 = defineNuxtLink({ componentName: "NuxtLink" });
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
function looseCompareArrays(a, b) {
  if (a.length !== b.length)
    return false;
  let equal = true;
  for (let i = 0; equal && i < a.length; i++) {
    equal = looseEqual(a[i], b[i]);
  }
  return equal;
}
function looseEqual(a, b) {
  if (a === b)
    return true;
  let aValidType = isDate(a);
  let bValidType = isDate(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? a.getTime() === b.getTime() : false;
  }
  aValidType = isSymbol(a);
  bValidType = isSymbol(b);
  if (aValidType || bValidType) {
    return a === b;
  }
  aValidType = isArray(a);
  bValidType = isArray(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? looseCompareArrays(a, b) : false;
  }
  aValidType = isObject$1(a);
  bValidType = isObject$1(b);
  if (aValidType || bValidType) {
    if (!aValidType || !bValidType) {
      return false;
    }
    const aKeysCount = Object.keys(a).length;
    const bKeysCount = Object.keys(b).length;
    if (aKeysCount !== bKeysCount) {
      return false;
    }
    for (const key in a) {
      const aHasKey = a.hasOwnProperty(key);
      const bHasKey = b.hasOwnProperty(key);
      if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
        return false;
      }
    }
  }
  return String(a) === String(b);
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
  const resolvedMeta = isFunction_1(meta2) ? vue_cjs_prod.computed(meta2) : meta2;
  useNuxtApp()._useHead(resolvedMeta);
}
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
function _47Users_47meetqy_47Desktop_47my_45template_47nuxt_45wcao_46cc_47_46nuxt_47components_46plugin_46mjs(nuxtApp) {
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
var __spreadValues2 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp2.call(b, prop))
      __defNormalProp2(a, prop, b[prop]);
  if (__getOwnPropSymbols2)
    for (var prop of __getOwnPropSymbols2(b)) {
      if (__propIsEnum2.call(b, prop))
        __defNormalProp2(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps2 = (a, b) => __defProps2(a, __getOwnPropDescs2(b));
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
function _defu(baseObj, defaults2, namespace = ".", merger) {
  if (!isObject(defaults2)) {
    return _defu(baseObj, {}, namespace, merger);
  }
  const obj = Object.assign({}, defaults2);
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
const _47Users_47meetqy_47Desktop_47my_45template_47nuxt_45wcao_46cc_47node_modules_47nuxt_47dist_47head_47runtime_47lib_47vueuse_45head_46plugin = defineNuxtPlugin((nuxtApp) => {
  const head = createHead();
  nuxtApp.vueApp.use(head);
  nuxtApp.hooks.hookOnce("app:mounted", () => {
    vue_cjs_prod.watchEffect(() => {
      head.updateDOM();
    });
  });
  const titleTemplate = vue_cjs_prod.ref();
  nuxtApp._useHead = (_meta) => {
    const meta2 = vue_cjs_prod.ref(_meta);
    if ("titleTemplate" in meta2.value) {
      titleTemplate.value = meta2.value.titleTemplate;
    }
    const headObj = vue_cjs_prod.computed(() => {
      const overrides2 = { meta: [] };
      if (titleTemplate.value && "title" in meta2.value) {
        overrides2.title = typeof titleTemplate.value === "function" ? titleTemplate.value(meta2.value.title) : titleTemplate.value.replace(/%s/g, meta2.value.title);
      }
      if (meta2.value.charset) {
        overrides2.meta.push({ key: "charset", charset: meta2.value.charset });
      }
      if (meta2.value.viewport) {
        overrides2.meta.push({ name: "viewport", content: meta2.value.viewport });
      }
      return defu(overrides2, meta2.value);
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
const Script = vue_cjs_prod.defineComponent({
  name: "Script",
  inheritAttrs: false,
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
const Link = vue_cjs_prod.defineComponent({
  name: "Link",
  inheritAttrs: false,
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
const Base = vue_cjs_prod.defineComponent({
  name: "Base",
  inheritAttrs: false,
  props: __spreadProps(__spreadValues({}, globalProps), {
    href: String,
    target: String
  }),
  setup: setupForUseMeta((base) => ({
    base
  }))
});
const Title = vue_cjs_prod.defineComponent({
  name: "Title",
  inheritAttrs: false,
  setup: setupForUseMeta((_, { slots }) => {
    var _a, _b, _c;
    const title = ((_c = (_b = (_a = slots.default) == null ? void 0 : _a.call(slots)) == null ? void 0 : _b[0]) == null ? void 0 : _c.children) || null;
    return {
      title
    };
  })
});
const Meta = vue_cjs_prod.defineComponent({
  name: "Meta",
  inheritAttrs: false,
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
const Style = vue_cjs_prod.defineComponent({
  name: "Style",
  inheritAttrs: false,
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
const Head = vue_cjs_prod.defineComponent({
  name: "Head",
  inheritAttrs: false,
  setup: (_props, ctx) => () => {
    var _a, _b;
    return (_b = (_a = ctx.slots).default) == null ? void 0 : _b.call(_a);
  }
});
const Html = vue_cjs_prod.defineComponent({
  name: "Html",
  inheritAttrs: false,
  props: __spreadProps(__spreadValues({}, globalProps), {
    manifest: String,
    version: String,
    xmlns: String
  }),
  setup: setupForUseMeta((htmlAttrs) => ({ htmlAttrs }), true)
});
const Body = vue_cjs_prod.defineComponent({
  name: "Body",
  inheritAttrs: false,
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
const metaConfig = { "globalMeta": { "charset": "utf-8", "viewport": "width=device-width, initial-scale=1", "meta": [{ "name": "keywords", "content": "web\u524D\u7AEF,flutter,uniapp,\u6A21\u677F,template,flutter,\u524D\u7AEF\u5DE5\u5177,blog" }, { "name": "description", "content": "\u6536\u96C6\u7684\u591A\u4E3B\u9898\u6A21\u677F\uFF0C\u6A21\u677F\u3001\u524D\u7AEF\u76F8\u5173\u5728\u7EBF\u5DE5\u5177 - \u5367\u69FD(wo ca\xF2)" }, { "name": "viewport", "content": "width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0" }], "link": [], "style": [], "script": [] } };
const metaMixin = {
  created() {
    const instance = vue_cjs_prod.getCurrentInstance();
    if (!instance) {
      return;
    }
    const options = instance.type;
    if (!options || !("head" in options)) {
      return;
    }
    const nuxtApp = useNuxtApp();
    const source = typeof options.head === "function" ? vue_cjs_prod.computed(() => options.head(nuxtApp)) : options.head;
    useHead(source);
  }
};
const _47Users_47meetqy_47Desktop_47my_45template_47nuxt_45wcao_46cc_47node_modules_47nuxt_47dist_47head_47runtime_47plugin = defineNuxtPlugin((nuxtApp) => {
  useHead(vue_cjs_prod.markRaw(__spreadValues({ title: "" }, metaConfig.globalMeta)));
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
  return { default: () => props ? vue_cjs_prod.h(component, props === true ? {} : props, slots) : vue_cjs_prod.h(Fragment, {}, slots) };
};
const isNestedKey = Symbol("isNested");
const NuxtPage = vue_cjs_prod.defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs }) {
    const nuxtApp = useNuxtApp();
    const isNested = vue_cjs_prod.inject(isNestedKey, false);
    vue_cjs_prod.provide(isNestedKey, true);
    return () => {
      return vue_cjs_prod.h(vueRouter_cjs_prod.RouterView, __spreadValues({ name: props.name, route: props.route }, attrs), {
        default: (routeProps) => {
          var _a;
          return routeProps.Component && _wrapIf(vue_cjs_prod.Transition, (_a = routeProps.route.meta.pageTransition) != null ? _a : defaultPageTransition, wrapInKeepAlive(routeProps.route.meta.keepalive, isNested && nuxtApp.isHydrating ? vue_cjs_prod.h(routeProps.Component, { key: generateRouteKey(props.pageKey, routeProps) }) : vue_cjs_prod.h(vue_cjs_prod.Suspense, {
            onPending: () => nuxtApp.callHook("page:start", routeProps.Component),
            onResolve: () => nuxtApp.callHook("page:finish", routeProps.Component)
          }, { default: () => vue_cjs_prod.h(routeProps.Component, { key: generateRouteKey(props.pageKey, routeProps) }) }))).default();
        }
      });
    };
  }
});
const defaultPageTransition = { name: "page", mode: "out-in" };
const layouts = {
  default: vue_cjs_prod.defineAsyncComponent(() => Promise.resolve().then(function() {
    return _default;
  })),
  tools: vue_cjs_prod.defineAsyncComponent(() => Promise.resolve().then(function() {
    return tools$1;
  }))
};
const defaultLayoutTransition = { name: "layout", mode: "out-in" };
const __nuxt_component_0$2 = vue_cjs_prod.defineComponent({
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
      const layout = (_b = (_a = vue_cjs_prod.isRef(props.name) ? props.name.value : props.name) != null ? _a : route.meta.layout) != null ? _b : "default";
      const hasLayout = layout && layout in layouts;
      return _wrapIf(vue_cjs_prod.Transition, hasLayout && ((_c = route.meta.layoutTransition) != null ? _c : defaultLayoutTransition), _wrapIf(layouts[layout], hasLayout, context.slots)).default();
    };
  }
});
const useStrapiUrl = () => {
  const config = useRuntimeConfig().public;
  const version2 = config.strapi.version;
  return version2 === "v3" ? config.strapi.url : `${config.strapi.url}${config.strapi.prefix}`;
};
const useCdnUrl = () => useStrapiUrl().replace("/api", "");
const useBaseUrl = () => {
  return "https://wcao.cc" ;
};
const useTitle = () => {
  const cao = ["cao", "ca\u014D", "ca\xF3", "ca\u01D2", "ca\xF2"];
  const day = new Date().getDay();
  const week = ["\u5929", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D"][day];
  const result = day ? 7 % day : 0;
  return {
    title: `\u5367\u69FD(w ${cao[result]})`,
    cao: cao[result],
    week,
    day
  };
};
const startTime = new Date("2022/5/25 22:11:23").getTime();
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$z = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "GridItemA",
  __ssrInlineRender: true,
  props: {
    title: null,
    desciption: null,
    time: null,
    category: null,
    headerImages: null,
    to: null
  },
  setup(__props) {
    const $cdn = useCdnUrl();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_link = __nuxt_component_2$1;
      _push(`<article${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
        class: "article-a",
        style: `background-image:url(${vue_cjs_prod.unref($cdn)}${__props.headerImages[0]})`
      }, _attrs))} data-v-15767cb2><div class="bg-base-100 pt-10 rounded-2xl bg-opacity-80" data-v-15767cb2><div class="tags" data-v-15767cb2><a href="javascript:;" style="${serverRenderer.exports.ssrRenderStyle(`color: ${__props.category.color};${__props.category.bgColor}`)}" data-v-15767cb2>${serverRenderer.exports.ssrInterpolate(__props.category.name)}</a></div><header class="relative flex justify-center items-center flex-col px-4" data-v-15767cb2><time class="flex items-center text-base-content capitalize" data-v-15767cb2><i class="text-2xl iconfont" data-v-15767cb2>\uE8B4</i><span class="ml-2 text-sm" data-v-15767cb2>${serverRenderer.exports.ssrInterpolate(__props.time)}</span></time></header><main class="text-base-content text-center px-4" data-v-15767cb2><h1 class="title py-2" data-v-15767cb2>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_nuxt_link, {
        to: "/tools" + __props.to
      }, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${serverRenderer.exports.ssrInterpolate(__props.title)}`);
          } else {
            return [
              vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(__props.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</h1><p class="text-opacity-60" data-v-15767cb2>${serverRenderer.exports.ssrInterpolate(__props.desciption)}</p></main><footer class="flex justify-between items-center mt-10" data-v-15767cb2><a href="javascript:;" class="flex items-center" data-v-15767cb2><span class="author-image" style="${serverRenderer.exports.ssrRenderStyle({ "background-image": "url('/avatar.jpg')" })}" data-v-15767cb2></span><span class="author-name" data-v-15767cb2>meetqy</span></a><div class="text-base-content text-sm" data-v-15767cb2><a href="javascript:;" data-v-15767cb2><span class="mr-1" data-v-15767cb2>23719</span><i class="iconfont" data-v-15767cb2>\uE8F4</i></a><a href="javascript:;" class="ml-4" data-v-15767cb2><span class="mr-1" data-v-15767cb2>23719</span><i class="iconfont" data-v-15767cb2>\uE8B5</i></a></div></footer></div></article>`);
    };
  }
});
const _sfc_setup$z = _sfc_main$z.setup;
_sfc_main$z.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/GridItemA.vue");
  return _sfc_setup$z ? _sfc_setup$z(props, ctx) : void 0;
};
const __nuxt_component_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$z, [["__scopeId", "data-v-15767cb2"]]);
const _sfc_main$y = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "GridItemC",
  __ssrInlineRender: true,
  props: {
    title: null,
    id: null,
    category: null
  },
  async setup(__props) {
    let __temp, __restore;
    const props = __props;
    const html = vue_cjs_prod.ref("");
    if (props.category.name === "\u6A21\u677F") {
      const file = props.title.split(" Part ");
      const { data } = ([__temp, __restore] = vue_cjs_prod.withAsyncContext(() => useFetch(`/fragments/${file[0].toLowerCase()}/${file[1]}.html`, {
        baseURL: useBaseUrl()
      })), __temp = await __temp, __restore(), __temp);
      html.value = data.value;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_link = __nuxt_component_2$1;
      _push(`<article${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "relative flex flex-col justify-center bg-base-200 pt-4 rounded-lg shadow-md" }, _attrs))} data-v-3626934e><div class="flex justify-center px-4 relative" data-v-3626934e>${html.value}</div>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_nuxt_link, {
        to: `/template/${__props.id}`,
        class: "opacity-0 absolute"
      }, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` go to ${serverRenderer.exports.ssrInterpolate(__props.title)}`);
          } else {
            return [
              vue_cjs_prod.createTextVNode(" go to " + vue_cjs_prod.toDisplayString(__props.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="absolute pt-10 rounded-lg left-0 top-0 z-10 w-full h-full cursor-pointer" data-v-3626934e><div class="tags" data-v-3626934e><a href="javascript:;" style="${serverRenderer.exports.ssrRenderStyle(`color: ${__props.category.color};${__props.category.bgColor}`)}" data-v-3626934e>${serverRenderer.exports.ssrInterpolate(__props.category.name)}</a></div></div><footer class="flex justify-between items-center" data-v-3626934e><a href="javascript:;" class="flex items-center" data-v-3626934e><span class="author-image" style="${serverRenderer.exports.ssrRenderStyle({ "background-image": "url('/avatar.jpg')" })}" data-v-3626934e></span><span class="author-name" data-v-3626934e>meetqy</span></a><div class="text-base-content text-sm" data-v-3626934e><a href="javascript:;" data-v-3626934e><span class="mr-1" data-v-3626934e>23719</span><i class="iconfont" data-v-3626934e>\uE8F4</i></a><a href="javascript:;" class="ml-4" data-v-3626934e><span class="mr-1" data-v-3626934e>23719</span><i class="iconfont" data-v-3626934e>\uE8B5</i></a></div></footer></article>`);
    };
  }
});
const _sfc_setup$y = _sfc_main$y.setup;
_sfc_main$y.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/GridItemC.vue");
  return _sfc_setup$y ? _sfc_setup$y(props, ctx) : void 0;
};
const __nuxt_component_1$2 = /* @__PURE__ */ _export_sfc(_sfc_main$y, [["__scopeId", "data-v-3626934e"]]);
const _sfc_main$x = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "GridItemB",
  __ssrInlineRender: true,
  props: {
    id: null,
    title: null,
    desciption: null,
    time: null,
    visit: { default: 0 },
    comment: { default: 0 },
    category: null,
    headerImages: null,
    to: null
  },
  setup(__props) {
    const props = __props;
    const toLink = vue_cjs_prod.computed(() => props.to ? props.to + props.id : `/posts/${props.id}`);
    const $cdn = useCdnUrl();
    const modules = [Navigation];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_link = __nuxt_component_2$1;
      _push(`<article${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "article-b" }, _attrs))} data-v-5bd887ee><div class="tags relative z-20" data-v-5bd887ee><a href="javascript:;" style="${serverRenderer.exports.ssrRenderStyle(`color: ${__props.category.color};${__props.category.bgColor}`)}" data-v-5bd887ee>${serverRenderer.exports.ssrInterpolate(__props.category.name)}</a></div><header data-v-5bd887ee>`);
      _push(serverRenderer.exports.ssrRenderComponent(vue_cjs_prod.unref(Swiper), {
        class: "rounded-t-2xl",
        modules,
        navigation: ""
      }, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            serverRenderer.exports.ssrRenderList(__props.headerImages, (item) => {
              _push2(serverRenderer.exports.ssrRenderComponent(vue_cjs_prod.unref(SwiperSlide), { key: item }, {
                default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="bg-cover hover:bg-right-bottom transition-all duration-500 ease-linear delay-200 relative" style="${serverRenderer.exports.ssrRenderStyle(`background-image:url(${vue_cjs_prod.unref($cdn) + item});height: 225px`)}" data-v-5bd887ee${_scopeId2}><div class="swiper-mask" data-v-5bd887ee${_scopeId2}></div></div>`);
                  } else {
                    return [
                      vue_cjs_prod.createVNode("div", {
                        class: "bg-cover hover:bg-right-bottom transition-all duration-500 ease-linear delay-200 relative",
                        style: `background-image:url(${vue_cjs_prod.unref($cdn) + item});height: 225px`
                      }, [
                        vue_cjs_prod.createVNode("div", { class: "swiper-mask" })
                      ], 4)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (vue_cjs_prod.openBlock(true), vue_cjs_prod.createBlock(vue_cjs_prod.Fragment, null, vue_cjs_prod.renderList(__props.headerImages, (item) => {
                return vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(vue_cjs_prod.unref(SwiperSlide), { key: item }, {
                  default: vue_cjs_prod.withCtx(() => [
                    vue_cjs_prod.createVNode("div", {
                      class: "bg-cover hover:bg-right-bottom transition-all duration-500 ease-linear delay-200 relative",
                      style: `background-image:url(${vue_cjs_prod.unref($cdn) + item});height: 225px`
                    }, [
                      vue_cjs_prod.createVNode("div", { class: "swiper-mask" })
                    ], 4)
                  ]),
                  _: 2
                }, 1024);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex justify-center mt-5 flex-col items-center" data-v-5bd887ee><time class="flex items-center capitalize" data-v-5bd887ee><i class="text-2xl iconfont" style="${serverRenderer.exports.ssrRenderStyle({ "color": "#e84e89" })}" data-v-5bd887ee>\uE8B4</i><span class="ml-2 text-sm" data-v-5bd887ee>${serverRenderer.exports.ssrInterpolate(__props.time)}</span></time></div></header><main class="text-center px-4" data-v-5bd887ee><h1 class="title py-2 text-center" data-v-5bd887ee>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_nuxt_link, { to: vue_cjs_prod.unref(toLink) }, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${serverRenderer.exports.ssrInterpolate(__props.title)}`);
          } else {
            return [
              vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(__props.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</h1><p class="text-opacity-60 text-base-content font-light text-center" data-v-5bd887ee>${serverRenderer.exports.ssrInterpolate(__props.desciption)}</p></main><footer class="flex justify-between items-center mt-10" data-v-5bd887ee><a href="javascript:;" class="flex items-center" data-v-5bd887ee><span class="author-image" style="${serverRenderer.exports.ssrRenderStyle({ "background-image": "url('/avatar.jpg')" })}" data-v-5bd887ee></span><span class="author-name" data-v-5bd887ee>meetqy</span></a><div class="text-sm text-base-content text-opacity-60" data-v-5bd887ee><a href="javascript:;" data-v-5bd887ee><span class="mr-1" data-v-5bd887ee>${serverRenderer.exports.ssrInterpolate(__props.visit || 0)}</span><i class="iconfont" style="${serverRenderer.exports.ssrRenderStyle({ "color": "#e84e89" })}" data-v-5bd887ee>\uE8F4</i></a><a href="javascript:;" class="ml-4" data-v-5bd887ee><span class="mr-1" data-v-5bd887ee>${serverRenderer.exports.ssrInterpolate(__props.comment || 0)}</span><i class="iconfont" style="${serverRenderer.exports.ssrRenderStyle({ "color": "#e84e89" })}" data-v-5bd887ee>\uE8B5</i></a></div></footer></article>`);
    };
  }
});
const _sfc_setup$x = _sfc_main$x.setup;
_sfc_main$x.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/GridItemB.vue");
  return _sfc_setup$x ? _sfc_setup$x(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$x, [["__scopeId", "data-v-5bd887ee"]]);
const _sfc_main$w = {
  __name: "PostList",
  __ssrInlineRender: true,
  props: {
    posts: Array,
    pagination: Object
  },
  setup(__props) {
    const props = __props;
    const getCategory = (post) => {
      return post.attributes.category.data.attributes;
    };
    const getHeaderImages = (post) => {
      if (post.attributes.headerImages.data) {
        return post.attributes.headerImages.data.map((item) => item.attributes.url);
      } else {
        return [];
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_grid_item_a = __nuxt_component_0$1;
      const _component_grid_item_c = __nuxt_component_1$2;
      const _component_grid_item_b = __nuxt_component_2;
      const _component_nuxt_link = __nuxt_component_2$1;
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)} data-v-e696deae>`);
      if (props.posts) {
        _push(`<div class="multi-columns pt-5 md:pt-10 md:columns-2 columns-1 xl:columns-3" data-v-e696deae><!--[-->`);
        serverRenderer.exports.ssrRenderList(props.posts, (post) => {
          _push(`<div class="block" data-v-e696deae>`);
          if (post.attributes.useTemplate === "a") {
            _push(serverRenderer.exports.ssrRenderComponent(_component_grid_item_a, {
              title: post.attributes.title,
              desciption: post.attributes.desciption,
              time: post.attributes.updatedAt.split("T")[0],
              category: getCategory(post),
              "header-images": getHeaderImages(post),
              to: post.attributes.to
            }, null, _parent));
          } else if (post.attributes.useTemplate === "c") {
            _push(serverRenderer.exports.ssrRenderComponent(_component_grid_item_c, {
              title: post.attributes.title,
              category: getCategory(post),
              id: post.id + "",
              to: post.attributes.to
            }, null, _parent));
          } else {
            _push(serverRenderer.exports.ssrRenderComponent(_component_grid_item_b, {
              title: post.attributes.title,
              desciption: post.attributes.desciption,
              time: post.attributes.updatedAt.split("T")[0],
              visit: post.attributes.visit,
              comment: post.attributes.comment,
              category: getCategory(post),
              "header-images": getHeaderImages(post),
              id: post.id + "",
              to: post.attributes.to
            }, null, _parent));
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="paging md:py-10 py-5" data-v-e696deae>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_nuxt_link, {
        to: "/" + (__props.pagination.page - 1),
        class: ["btn rounded-full btn-sm btn-info capitalize", { "btn-disabled": __props.pagination.page <= 1 }]
      }, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Prev `);
          } else {
            return [
              vue_cjs_prod.createTextVNode(" Prev ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span class="px-5 text-neutral-content" data-v-e696deae>${serverRenderer.exports.ssrInterpolate(__props.pagination.page)} / ${serverRenderer.exports.ssrInterpolate(__props.pagination.pageCount)}</span>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_nuxt_link, {
        to: "/" + (__props.pagination.page + 1),
        class: ["btn rounded-full btn-sm btn-info capitalize", { "btn-disabled": __props.pagination.page >= __props.pagination.pageCount }]
      }, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Next `);
          } else {
            return [
              vue_cjs_prod.createTextVNode(" Next ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$w = _sfc_main$w.setup;
_sfc_main$w.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PostList.vue");
  return _sfc_setup$w ? _sfc_setup$w(props, ctx) : void 0;
};
const __nuxt_component_1$1 = /* @__PURE__ */ _export_sfc(_sfc_main$w, [["__scopeId", "data-v-e696deae"]]);
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
  const version2 = useStrapiVersion();
  const token = useStrapiToken();
  return async (url, fetchOptions = {}) => {
    const headers = {};
    if (token && token.value) {
      headers.Authorization = `Bearer ${token.value}`;
    }
    if (version2 === "v4" && fetchOptions.params) {
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
      const e = err.data || defaultErrors(err)[version2];
      nuxt.hooks.callHook("strapi:error", e);
      throw e;
    }
  };
};
const useStrapi4 = () => {
  const client = useStrapiClient();
  const version2 = useStrapiVersion();
  if (version2 !== "v4") {
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
const meta$e = void 0;
const meta$d = void 0;
const _sfc_main$v = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "W",
  __ssrInlineRender: true,
  props: {
    size: { default: 16 },
    class: null
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<svg${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
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
const _sfc_setup$v = _sfc_main$v.setup;
_sfc_main$v.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/W.vue");
  return _sfc_setup$v ? _sfc_setup$v(props, ctx) : void 0;
};
const version = "0.0.11";
const scripts = {
  build: "nuxt build",
  dev: " nuxt dev",
  generate: "nuxt generate",
  preview: "nuxi preview",
  start: "nuxt start"
};
const devDependencies = {
  "@nuxtjs/tailwindcss": "^5.1.2",
  nuxt: "^3.0.0-rc.4",
  "postcss-color-gray": "^5.0.0"
};
const dependencies = {
  "@nuxtjs/strapi": "^1.3.2",
  "@tailwindcss/typography": "^0.5.2",
  "@vueuse/core": "^8.7.4",
  codemirror: "^5.65.5",
  daisyui: "^2.15.3",
  "highlight.js": "^11.5.1",
  "json-beautify": "^1.1.1",
  "json-format": "^1.0.1",
  "json-ts": "^1.6.4",
  json_typegen_wasm: "^0.7.0",
  "markdown-it": "^13.0.1",
  "quicktype-core": "^6.0.71",
  swiper: "^8.1.6",
  "to-json-schema": "^0.2.5",
  "vue3-highlightjs": "^1.0.5",
  "vue3-lazyload": "^0.3.4"
};
const overrides = {
  nitropack: "0.4.4"
};
const pkg = {
  version,
  "private": true,
  scripts,
  devDependencies,
  dependencies,
  overrides
};
const _sfc_main$u = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "Logo",
  __ssrInlineRender: true,
  props: {
    showWeek: { type: Boolean, default: true }
  },
  setup(__props) {
    const props = __props;
    const websiteInfo = vue_cjs_prod.ref([
      { name: "\u7248\u672C", val: pkg.version, badge: true },
      { name: "\u524D\u7AEF\u6846\u67B6", val: "Nuxt3 + Vite", badge: false },
      { name: "UI", val: "TailwindCSS + DaisyUI", badge: false },
      { name: "\u540E\u7AEFAPI", val: "Strapi", badge: false },
      { name: "\u670D\u52A1\u5668", val: "Google Cloud", badge: false },
      { name: "CDN", val: "cloudflare", badge: false },
      { name: "\u57DF\u540D", val: "godaddy", badge: false }
    ]);
    const { cao, week } = useTitle();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_link = __nuxt_component_2$1;
      const _component_W = _sfc_main$v;
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "flex items-end" }, _attrs))} data-v-87db058c><div class="flex items-center cursor-pointer logo" data-v-87db058c>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_nuxt_link, {
        to: "/",
        class: "flex"
      }, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-12 h-12 rounded-full transition-all flex items-center justify-center" data-v-87db058c${_scopeId}>`);
            _push2(serverRenderer.exports.ssrRenderComponent(_component_W, {
              size: 30,
              class: "fill-base-100"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="h-12 text-2xl uppercase inline-flex items-center px-2 rounded-full" data-v-87db058c${_scopeId}><span class="font-serif font-semibold text-neutral-content" data-v-87db058c${_scopeId}>${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(cao))} `);
            if (props.showWeek) {
              _push2(`<i data-v-87db058c${_scopeId}>\uFF0C</i>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</span></div>`);
          } else {
            return [
              vue_cjs_prod.createVNode("div", { class: "w-12 h-12 rounded-full transition-all flex items-center justify-center" }, [
                vue_cjs_prod.createVNode(_component_W, {
                  size: 30,
                  class: "fill-base-100"
                })
              ]),
              vue_cjs_prod.createVNode("div", { class: "h-12 text-2xl uppercase inline-flex items-center px-2 rounded-full" }, [
                vue_cjs_prod.createVNode("span", { class: "font-serif font-semibold text-neutral-content" }, [
                  vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(vue_cjs_prod.unref(cao)) + " ", 1),
                  props.showWeek ? (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock("i", { key: 0 }, "\uFF0C")) : vue_cjs_prod.createCommentVNode("", true)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (props.showWeek) {
        _push(`<div class="inline-flex h-12 items-center text-xl" data-v-87db058c><span class="text-info" data-v-87db058c>\u4ECA\u5929\u661F\u671F${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(week))}</span><div class="dropdown dropdown-end relative -top-4" data-v-87db058c><label tabindex="0" class="btn btn-circle btn-ghost text-neutral-content btn-xs" data-v-87db058c><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 xl:w-4 xl:h-4 stroke-current" data-v-87db058c><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-v-87db058c></path></svg></label><div tabindex="0" class="card z-50 compact dropdown-content shadow bg-base-100 rounded-box w-72" data-v-87db058c><div class="card-body" data-v-87db058c><h6 class="card-title mb-2" data-v-87db058c>\u7F51\u7AD9\u57FA\u672C\u4FE1\u606F</h6><!--[-->`);
        serverRenderer.exports.ssrRenderList(websiteInfo.value, (item, index2) => {
          _push(`<p class="${serverRenderer.exports.ssrRenderClass([{ "border-b": index2 < websiteInfo.value.length - 1 }, "flex justify-between items-center border-base-200 pb-2"])}" data-v-87db058c><span class="capitalize" data-v-87db058c>${serverRenderer.exports.ssrInterpolate(item.name)}</span><span class="${serverRenderer.exports.ssrRenderClass([{ badge: item.badge }, "capitalize"])}" data-v-87db058c>${serverRenderer.exports.ssrInterpolate(item.val)}</span></p>`);
        });
        _push(`<!--]--></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$u = _sfc_main$u.setup;
_sfc_main$u.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Logo.vue");
  return _sfc_setup$u ? _sfc_setup$u(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["__scopeId", "data-v-87db058c"]]);
const meta$c = void 0;
const meta$b = void 0;
const ultra = [
  ["\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3 / \u521D\u4EE3\u30DE\u30F3", "Ultraman"],
  ["\u4F50\u83F2", "\u30BE\u30D5\u30A3\u30FC", "Zoffy"],
  ["\u8D5B\u6587\xB7\u5965\u7279\u66FC", "Ultraseven/\u30A6\u30EB\u30C8\u30E9\u30BB\u30D6\u30F3", "Ultraseven"],
  ["\u8D5B\u6587\u4E0A\u53F8", "\u30BB\u30D6\u30F3\u4E0A\u53F8", "Seven's Superior"],
  ["\u8D5B\u6587X\xB7\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30BB\u30D6\u30F3X", "Ultraseven X"],
  [
    "\u6770\u514B\xB7\u5965\u7279\u66FC",
    "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30B8\u30E3\u30C3\u30AF / \u5E30\u3063\u3066\u304D\u305F\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3",
    "Ultraman Jack"
  ],
  ["\u827E\u65AF\xB7\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30A8\u30FC\u30B9 ", "Ultraman Ace"],
  ["\u5965\u7279\u4E4B\u7236", "\u30A6\u30EB\u30C8\u30E9\u306E\u7236", "Father of Ultra"],
  ["\u6CF0\u7F57\xB7\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30BF\u30ED\u30A6", "Ultraman Taro"],
  ["\u5965\u7279\u4E4B\u6BCD", "\u30A6\u30EB\u30C8\u30E9\u306E\u6BCD", "Mother of Ultra"],
  ["\u96F7\u6B27\xB7\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30EC\u30AA", "Ultraman Leo"],
  ["\u963F\u65AF\u7279\u62C9", "\u30A2\u30B9\u30C8\u30E9", "Astra"],
  ["\u5965\u7279\u4E4B\u738B", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30AD\u30F3\u30B0", "Ultraman King"],
  ["\u7231\u8FEA\xB7\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u7231\u8FEA", "Ultraman \u7231\u8FEA"],
  ["\u5C24\u8389\u5B89", "\u30E6\u30EA\u30A2\u30F3", "Yullian"],
  ["\u68A6\u6BD4\u4F18\u65AF\xB7\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30E1\u30D3\u30A6\u30B9", "Ultraman Mebius"],
  ["\u5E0C\u5361\u5229\xB7\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30D2\u30AB\u30EA", "UItraman Hikari"],
  ["\u96F7\u6B27\xB7\u5965\u7279\u66FC\u65AF", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30CD\u30AA\u30B9", "Ultraman Neos"],
  ["\u8D5B\u658721\xB7\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30BB\u30D6\u30F321", "Ultraseven 21"],
  ["\u9EA6\u514B\u65AF\xB7\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30DE\u30C3\u30AF\u30B9", "Ultraman Max"],
  ["\u5965\u7279\u66FC\u6770\u8BFA", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30BC\u30CE\u30F3", "Ultraman Xenon"],
  ["\u535A\u4F0A\xB7\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30DC\u30FC\u30A4", "Ultraman Boy"],
  ["\u5965\u7279\u66FC\u5229\u5E03\u7279", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30EA\u30D6\u30C3\u30C8", "Ultraman Ribut"],
  ["\u7D22\u62C9", "\u30BD\u30E9(\u30A6\u30EB\u30C8\u30E9\u30A6\u30FC\u30DE\u30F3) ", "Sora"],
  ["\u845B\u96F7\xB7\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30B0\u30EC\u30FC\u30C8", "Ultraman Great"],
  ["\u5E15\u74E6\u7279\xB7\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30D1\u30EF\u30FC\u30C9", "Ultraman Powered"],
  ["\u53F2\u8003\u7279\xB7\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30B9\u30B3\u30C3\u30C8", "Ultraman Scott"],
  ["\u5965\u7279\u66FC\u67E5\u514B", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30C1\u30E3\u30C3\u30AF", "Ultraman Chuck"],
  ["\u5965\u7279\u66FC\u8D1D\u65AF", "\u30A6\u30EB\u30C8\u30E9\u30A6\u30FC\u30DE\u30F3\u30D9\u30B9", "Ultrawoman Beth"],
  ["\u5965\u7279\u66FC\u4E54\u5C3C\u4E9A\u65AF", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30B8\u30E7\u30FC\u30CB\u30A2\u30B9", "Ultraman Joneus"],
  ["\u57C3\u7C73\u4E9A", "\u30ED\u30C8", "Amia"],
  ["\u827E\u96F7\u514B", "\u30A8\u30EC\u30AF", "Elek"],
  ["\u6D1B\u7279", "\u30A2\u30DF\u30A2", "Loto"],
  ["\u8FEA\u8FE6\xB7\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30C6\u30A3\u30AC", "Ultraman Tiga"],
  ["\u8FEA\u8FE6\u4E4B\u5730\u7684\u77F3\u50CFA\u3001B", "\u30C6\u30A3\u30AC\u306E\u30D4\u30E9\u30DF\u30C3\u30C9\u306E\u5DE8\u4EBA", "Tiga's companions"],
  ["\u90AA\u6076\u8FEA\u8FE6", "\u30A4\u30FC\u30F4\u30A3\u30EB\u30C6\u30A3\u30AC", "Evil Tiga[15]"],
  ["\u7231\u618E\u6226\u58EB\u5361\u871C\u62C9", "\u30AB\u30DF\u30FC\u30E9", "Camearra"],
  ["\u521A\u529B\u6226\u58EB\u8FBE\u62C9\u59C6", "\u30C0\u30FC\u30E9\u30E0", "Darramb"],
  ["\u4FCA\u654F\u6226\u58EB\u5E0C\u7279\u62C9", "\u30D2\u30E5\u30C9\u30E9", "Hudra"],
  ["\u6234\u62FF\xB7\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30C0\u30A4\u30CA", "Ultraman Dyna"],
  ["\u4EBA\u9020\u6234\u62FF", "\u30C6\u30E9\u30CE\u30A4\u30C9", "Terranoid"],
  ["\u76D6\u4E9A\xB7\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30AC\u30A4\u30A2", "Ultraman Gaia"],
  ["\u963F\u53E4\u8339\xB7\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30A2\u30B0\u30EB", "Ultraman Agul"],
  ["\u9AD8\u65AF\xB7\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30B3\u30B9\u30E2\u30B9", "Ultraman Cosmos"],
  ["\u6770\u65AF\u63D0\u65AF\xB7\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30B8\u30E3\u30B9\u30C6\u30A3\u30B9", "Ultraman Justice"],
  ["\u96F7\u6770\u591A\xB7\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30EC\u30B8\u30A7\u30F3\u30C9", "Ultraman Legend"],
  ["\u5948\u514B\u65AF\u7279\xB7\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30FB\u30B6\u30FB\u30CD\u30AF\u30B9\u30C8", "Ultraman The Next"],
  ["\u5948\u514B\u745F\u65AF\xB7\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30CD\u30AF\u30B5\u30B9", "Ultraman Nexus"],
  ["\u8BFA\u4E9A\xB7\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30CE\u30A2", "Ultraman Noa"],
  ["\u9ED1\u6697\u6D6E\u58EB\u5FB7", "\u30C0\u30FC\u30AF\u30D5\u30A1\u30A6\u30B9\u30C8", "Dark Faust"],
  ["\u9ED1\u6697\u6885\u83F2\u65AF\u7279", "\u30C0\u30FC\u30AF\u30E1\u30D5\u30A3\u30B9\u30C8", "Dark Mephisto"],
  ["\u9ED1\u6697\u6885\u83F2\u65AF\u7279II", "\u30C0\u30FC\u30AF\u30E1\u30D5\u30A3\u30B9\u30C8 II", "Dark Mephisto II"],
  ["\u9ED1\u6697\u624E\u57FA", "\u30C0\u30FC\u30AF\u30B6\u30AE", "Dark Zagi"],
  ["\u8D5B\u7F57\xB7\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30BC\u30ED", "Ultraman Zero"],
  ["\u5965\u7279\u66FC\u8D1D\u5229\u4E9A", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30D9\u30EA\u30A2\u30EB", "Ultraman Belial"],
  ["\u8D5B\u8FE6\xB7\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30B5\u30FC\u30AC", "Ultraman Saga"],
  ["\u94F6\u6CB3\xB7\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30AE\u30F3\u30AC", "Ultraman Ginga"],
  ["\u7EF4\u514B\u7279\u5229\xB7\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30D3\u30AF\u30C8\u30EA\u30FC", "Ultraman Victory"],
  [
    "\u94F6\u6CB3\u7DAD\u514B\u7279\u5229\xB7\u5965\u7279\u66FC",
    "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30AE\u30F3\u30AC\u30D3\u30AF\u30C8\u30EA\u30FC",
    "Ultraman Ginga Victory"
  ],
  ["\u827E\u514B\u65AF\xB7\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30A8\u30C3\u30AF\u30B9", "Ultraman X"],
  ["\u5965\u7279\u66FC\u6B27\u5E03", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30AA\u30FC\u30D6", "Ultraman Orb"],
  ["\u5965\u7279\u66FC\u6377\u5FB7", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30B8\u30FC\u30C9", "Ultraman \u6377\u5FB7"],
  ["\u5965\u7279\u66FC\u7F57\u7D22", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30ED\u30C3\u30BD", "Ultraman Rosso"],
  ["\u5965\u7279\u66FC\u5E03\u9C81", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30D6\u30EB", "Ultraman Blu"],
  ["\u7F57\u5E03\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30EB\u30FC\u30D6", "Ultraman R / B"],
  ["\u5973\u5965\u7279\u66FC\u683C\u4E3D\u4E54", "\u30A6\u30EB\u30C8\u30E9\u30A6\u30FC\u30DE\u30F3\u30B0\u30EA\u30FC\u30B8\u30E7", "Ultrawoman Grigio"],
  ["\u5965\u7279\u66FC\u683C\u7F57\u5E03", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30B0\u30EB\u30FC\u30D6", "Ultraman Gruebe"],
  ["\u6CF0\u8FE6\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30BF\u30A4\u30AC", "Ultraman Taiga"],
  ["\u5965\u7279\u66FC\u6CF0\u5854\u65AF", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30BF\u30A4\u30BF\u30B9", "Ultraman Titas"],
  ["\u5965\u7279\u66FC\u98CE\u9A6C", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30D5\u30FC\u30DE", "Ultraman Fuma"],
  ["\u5965\u7279\u66FC\u6258\u96F7\u57FA\u4E9A", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30C8\u30EC\u30AE\u30A2", "Ultraman Tregear"],
  ["\u5965\u7279\u66FC\u4EE4\u6CB3", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30EC\u30A4\u30AC", "Ultraman Reiga"],
  ["\u5965\u7279\u66FC\u6770\u7279", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30BC\u30C3\u30C8", "Ultraman Zett"],
  ["\u5965\u7279\u66FC\u7279\u5229\u8FE6", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30C8\u30EA\u30AC\u30FC", "Ultraman \u7279\u5229\u8FE6"],
  ["\u6697\u9ED1\u52C7\u58EB\u9ED1\u6697\u7279\u5229\u8FE6", "\u30C8\u30EA\u30AC\u30FC\u30C0\u30FC\u30AF", "\u7279\u5229\u8FE6 dark"],
  ["\u5996\u4E3D\u6218\u58EB\u5361\u5C14\u871C\u62C9", "\u5996\u4E3D\u6226\u58EB\u30AB\u30EB\u30DF\u30E9", ""],
  ["\u521A\u529B\u6597\u58EB\u8FBE\u8D21", "\u521A\u529B\u95D8\u58EB\u30C0\u30FC\u30B4\u30F3", ""],
  ["\u4FCA\u654F\u7B56\u58EB\u5E0C\u7279\u62C9\u59C6", "\u4FCA\u654F\u7B56\u58EB\u30D2\u30E5\u30C9\u30E9\u30E0", ""],
  ["\u90AA\u6076\u7279\u5229\u8FE6", "\u30A4\u30FC\u30F4\u30A3\u30EB\u30C8\u30EA\u30AC\u30FC", "\u7279\u5229\u8FE6 Evil"],
  ["\u5965\u7279\u66FCDecker", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30C7\u30C3\u30AB\u30FC", "Ultraman Decker"],
  ["\u54C9\u963F\u65AF\xB7\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30BC\u30A2\u30B9", "Ultraman Zearth"],
  ["\u5F71\u5B50\xB7\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30B7\u30E3\u30C9\u30FC", "Ultraman Shadow"],
  ["\u7EB3\u4F0A\u65AF\xB7\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30CA\u30A4\u30B9", "Ultraman Nice"],
  ["\u96F7\u53E4\u6D1B\u601D\u5965\u7279\u66FC", "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30EC\u30B0\u30ED\u30B9", "Ultraman Regulos"]
];
const meta$a = void 0;
const meta$9 = void 0;
const meta$8 = void 0;
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
    name: "\u5F20\u4E09",
    age: 23,
    posts: [
      { name: "\u751C\u5FC3\u6559\u4E3B - \u738B\u5FC3\u51CC", desc: "\u8FD9\u662F\u6211\u7684\u7B2C\u4E00\u7BC7\u6587\u7AE0\uFF01" },
      { name: "\u5C11\u5973\u6740\u624B - \u5218\u754A\u5B8F", desc: "\u8FD9\u662F\u6211\u7684\u7B2C\u4E8C\u7BC7\u6587\u7AE0\uFF01" },
      { name: "\u5C0F\u5B66\u513F\u6B4C - \u5B64\u52C7\u8005", desc: "\u8FD9\u662F\u6211\u7684\u7B2C\u4E09\u7BC7\u6587\u7AE0\uFF01" }
    ],
    tag: ["github", "gitee"]
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
const _sfc_main$t = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "Editor",
  __ssrInlineRender: true,
  props: {
    jsonValue: null,
    codeOption: null
  },
  emits: ["change"],
  setup(__props, { emit }) {
    const props = __props;
    vue_cjs_prod.watch(() => props.jsonValue, (val) => setJsonMirror(val));
    vue_cjs_prod.watch(props.codeOption, (val) => setCodeMirror(val));
    const { $codemirror } = useNuxtApp();
    const language = allLanguage;
    const curLanguageIndex = vue_cjs_prod.computed(() => {
      let lang = useRoute().path.replace("/tools/json-to-language/", "");
      if (lang === "/tools/json-to-language")
        lang = "dart";
      return language.findIndex((item) => item.language === lang);
    });
    const jsonEditorElement = vue_cjs_prod.ref();
    const langEditorElement = vue_cjs_prod.ref();
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
    vue_cjs_prod.onMounted(async () => {
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
      const _component_NuxtLayout = __nuxt_component_0$2;
      const _component_nuxt_link = __nuxt_component_2$1;
      _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLayout, vue_cjs_prod.mergeProps({ name: "tools" }, _attrs), {
        title: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` to ${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(curLanguageIndex) > -1 && vue_cjs_prod.unref(language)[vue_cjs_prod.unref(curLanguageIndex)].language)}`);
          } else {
            return [
              vue_cjs_prod.createTextVNode(" to " + vue_cjs_prod.toDisplayString(vue_cjs_prod.unref(curLanguageIndex) > -1 && vue_cjs_prod.unref(language)[vue_cjs_prod.unref(curLanguageIndex)].language), 1)
            ];
          }
        }),
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="hidden lg:block" data-v-40230bd6${_scopeId}><main class="json-to-language flex" data-v-40230bd6${_scopeId}><div class="w-2/5" data-v-40230bd6${_scopeId}></div><div class="w-16 flex-shrink-0 bg-white bg-opacity-50 border-r-8 border-r-white border-y-8 border-y-orange-600 flex flex-col items-center" data-v-40230bd6${_scopeId}><!--[-->`);
            serverRenderer.exports.ssrRenderList(vue_cjs_prod.unref(language), (item, index2) => {
              _push2(serverRenderer.exports.ssrRenderComponent(_component_nuxt_link, {
                key: item.name,
                to: "/tools/json-to-language/" + item.language
              }, {
                default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="${serverRenderer.exports.ssrRenderClass([item.className, { active: vue_cjs_prod.unref(curLanguageIndex) === index2 }])}" data-v-40230bd6${_scopeId2}>${serverRenderer.exports.ssrInterpolate(item.name)}</div>`);
                  } else {
                    return [
                      vue_cjs_prod.createVNode("div", {
                        class: [item.className, { active: vue_cjs_prod.unref(curLanguageIndex) === index2 }]
                      }, vue_cjs_prod.toDisplayString(item.name), 3)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div><div class="flex-1 lang-editor" data-v-40230bd6${_scopeId}></div></main></div><div class="prose flex justify-center items-center h-full lg:hidden" data-v-40230bd6${_scopeId}><h2 class="text-white" data-v-40230bd6${_scopeId}>\u5DE5\u5177\u7C7B\u4E0D\u9002\u5408\u5728\u624B\u673A\u7AEF\u4E0A\u663E\u793A</h2></div>`);
          } else {
            return [
              vue_cjs_prod.createVNode("div", { class: "hidden lg:block" }, [
                vue_cjs_prod.createVNode("main", { class: "json-to-language flex" }, [
                  vue_cjs_prod.createVNode("div", {
                    ref_key: "jsonEditorElement",
                    ref: jsonEditorElement,
                    class: "w-2/5"
                  }, null, 512),
                  vue_cjs_prod.createVNode("div", { class: "w-16 flex-shrink-0 bg-white bg-opacity-50 border-r-8 border-r-white border-y-8 border-y-orange-600 flex flex-col items-center" }, [
                    (vue_cjs_prod.openBlock(true), vue_cjs_prod.createBlock(vue_cjs_prod.Fragment, null, vue_cjs_prod.renderList(vue_cjs_prod.unref(language), (item, index2) => {
                      return vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(_component_nuxt_link, {
                        key: item.name,
                        to: "/tools/json-to-language/" + item.language
                      }, {
                        default: vue_cjs_prod.withCtx(() => [
                          vue_cjs_prod.createVNode("div", {
                            class: [item.className, { active: vue_cjs_prod.unref(curLanguageIndex) === index2 }]
                          }, vue_cjs_prod.toDisplayString(item.name), 3)
                        ]),
                        _: 2
                      }, 1032, ["to"]);
                    }), 128))
                  ]),
                  vue_cjs_prod.createVNode("div", {
                    class: "flex-1 lang-editor",
                    ref_key: "langEditorElement",
                    ref: langEditorElement
                  }, null, 512)
                ])
              ]),
              vue_cjs_prod.createVNode("div", { class: "prose flex justify-center items-center h-full lg:hidden" }, [
                vue_cjs_prod.createVNode("h2", { class: "text-white" }, "\u5DE5\u5177\u7C7B\u4E0D\u9002\u5408\u5728\u624B\u673A\u7AEF\u4E0A\u663E\u793A")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$t = _sfc_main$t.setup;
_sfc_main$t.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Editor.vue");
  return _sfc_setup$t ? _sfc_setup$t(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["__scopeId", "data-v-40230bd6"]]);
const _sfc_main$s = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "dart",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      titleTemplate: `JSON\u5728\u7EBF\u8F6C\u6362\u5DE5\u5177(to dart)`,
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
    const jsonValue = vue_cjs_prod.ref(useJsonDefaultValue());
    vue_cjs_prod.watch(() => useRoute(), (e) => {
      jsonValue.value = useJsonDefaultValue();
    });
    const codeOption = vue_cjs_prod.reactive({
      code: "",
      codeMirrorMode: "dart"
    });
    vue_cjs_prod.onMounted(async () => {
      const code = await useJsonToLanguage(useRoute().path.replace("/tools/json-to-language/", ""), jsonValue.value);
      codeOption.code = code;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Editor = __nuxt_component_0;
      _push(serverRenderer.exports.ssrRenderComponent(_component_Editor, vue_cjs_prod.mergeProps({
        onChange: change,
        "json-value": jsonValue.value,
        "code-option": codeOption
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$s = _sfc_main$s.setup;
_sfc_main$s.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/json-to-language/dart.vue");
  return _sfc_setup$s ? _sfc_setup$s(props, ctx) : void 0;
};
const meta$7 = void 0;
const _sfc_main$r = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      titleTemplate: `JSON\u5728\u7EBF\u8F6C\u6362\u5DE5\u5177(to dart)`,
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
    const jsonValue = vue_cjs_prod.ref(useJsonDefaultValue());
    vue_cjs_prod.watch(() => useRoute(), (e) => {
      jsonValue.value = useJsonDefaultValue();
    });
    const codeOption = vue_cjs_prod.reactive({
      code: "",
      codeMirrorMode: "dart"
    });
    vue_cjs_prod.onMounted(async () => {
      const code = await useJsonToLanguage("dart", jsonValue.value);
      codeOption.code = code;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Editor = __nuxt_component_0;
      _push(serverRenderer.exports.ssrRenderComponent(_component_Editor, vue_cjs_prod.mergeProps({
        onChange: change,
        "json-value": jsonValue.value,
        "code-option": codeOption
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$r = _sfc_main$r.setup;
_sfc_main$r.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/json-to-language/index.vue");
  return _sfc_setup$r ? _sfc_setup$r(props, ctx) : void 0;
};
const meta$6 = void 0;
const _sfc_main$q = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "json-schema",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      titleTemplate: `JSON\u5728\u7EBF\u8F6C\u6362\u5DE5\u5177(to json-schema)`,
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
    const jsonValue = vue_cjs_prod.ref(useJsonDefaultValue());
    vue_cjs_prod.watch(() => useRoute(), (e) => {
      jsonValue.value = useJsonDefaultValue();
    });
    const codeOption = vue_cjs_prod.reactive({
      code: "",
      codeMirrorMode: "dart"
    });
    vue_cjs_prod.onMounted(async () => {
      codeOption.code = formatJson(jsonValue.value);
    });
    const formatJson = (value) => {
      const res = toJsonSchema(JSON.parse(value));
      return jsonFormat(res);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Editor = __nuxt_component_0;
      _push(serverRenderer.exports.ssrRenderComponent(_component_Editor, vue_cjs_prod.mergeProps({
        onChange: change,
        "json-value": jsonValue.value,
        "code-option": codeOption
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$q = _sfc_main$q.setup;
_sfc_main$q.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/json-to-language/json-schema.vue");
  return _sfc_setup$q ? _sfc_setup$q(props, ctx) : void 0;
};
const meta$5 = void 0;
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
const jsonToMock_client = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  useJsontoMock
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$p = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      titleTemplate: `JSON\u5728\u7EBF\u8F6C\u6362\u5DE5\u5177(to mockjs)`,
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
    const jsonValue = vue_cjs_prod.ref(useJsonDefaultValue());
    vue_cjs_prod.watch(() => useRoute(), (e) => {
      jsonValue.value = useJsonDefaultValue();
    });
    const codeOption = vue_cjs_prod.reactive({
      code: "",
      codeMirrorMode: "mockjs"
    });
    vue_cjs_prod.onMounted(async () => {
      codeOption.code = toMockjs(jsonValue.value);
    });
    const toMockjs = (value) => {
      const res = toJsonSchema(JSON.parse(value));
      const str = useJsontoMock(res.properties);
      return jsonFormat(JSON.parse(str));
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Editor = __nuxt_component_0;
      _push(serverRenderer.exports.ssrRenderComponent(_component_Editor, vue_cjs_prod.mergeProps({
        onChange: change,
        "json-value": jsonValue.value,
        "code-option": codeOption
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$p = _sfc_main$p.setup;
_sfc_main$p.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/json-to-language/mockjs/index.vue");
  return _sfc_setup$p ? _sfc_setup$p(props, ctx) : void 0;
};
const meta$4 = void 0;
const meta$3 = void 0;
const _sfc_main$o = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "typescript",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      titleTemplate: `JSON\u5728\u7EBF\u8F6C\u6362\u5DE5\u5177(to typescript)`,
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
    const jsonValue = vue_cjs_prod.ref(useJsonDefaultValue());
    vue_cjs_prod.watch(() => useRoute(), (e) => {
      jsonValue.value = useJsonDefaultValue();
    });
    const codeOption = vue_cjs_prod.reactive({
      code: "",
      codeMirrorMode: "dart"
    });
    vue_cjs_prod.onMounted(async () => {
      const code = await useJsonToLanguage(useRoute().path.replace("/tools/json-to-language/", ""), jsonValue.value);
      codeOption.code = code;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Editor = __nuxt_component_0;
      _push(serverRenderer.exports.ssrRenderComponent(_component_Editor, vue_cjs_prod.mergeProps({
        onChange: change,
        "json-value": jsonValue.value,
        "code-option": codeOption
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/json-to-language/typescript.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const meta$2 = void 0;
const meta$1 = void 0;
const defaultCode = `<div class="max-w-sm bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
    <a href="#">
        <img class="p-8 rounded-t-lg" src="/docs/images/products/product-1.png" alt="product image" />
    </a>
    <div class="px-5 pb-5">
        <a href="#">
            <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">Apple Watch Series 7 GPS, Aluminium Case, Starlight Sport</h5>
        </a>
        <div class="flex items-center mt-2.5 mb-5">
            <svg class="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            <svg class="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            <svg class="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            <svg class="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            <svg class="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            <span class="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">5.0</span>
        </div>
        <div class="flex justify-between items-center">
            <span class="text-3xl font-bold text-gray-900 dark:text-white">$599</span>
            <a href="#" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add to cart</a>
        </div>
    </div>
</div>
`;
const default_client = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": defaultCode
}, Symbol.toStringTag, { value: "Module" }));
const meta = void 0;
const routes = [
  {
    name: "index-pageIndex",
    path: "//:pageIndex",
    file: "/Users/meetqy/Desktop/my-template/nuxt-wcao.cc/pages/index/[pageIndex].vue",
    children: [],
    meta: meta$e,
    alias: [],
    component: () => Promise.resolve().then(function() {
      return _pageIndex_$1;
    })
  },
  {
    name: "index",
    path: "/",
    file: "/Users/meetqy/Desktop/my-template/nuxt-wcao.cc/pages/index/index.vue",
    children: [],
    meta: meta$d,
    alias: [],
    component: () => Promise.resolve().then(function() {
      return index$7;
    })
  },
  {
    name: "posts-id",
    path: "/posts/:id",
    file: "/Users/meetqy/Desktop/my-template/nuxt-wcao.cc/pages/posts/[id].vue",
    children: [],
    meta: meta$c,
    alias: [],
    component: () => Promise.resolve().then(function() {
      return _id_$3;
    })
  },
  {
    name: "tag-id",
    path: "/tag/:id",
    file: "/Users/meetqy/Desktop/my-template/nuxt-wcao.cc/pages/tag/[id].vue",
    children: [],
    meta: meta$b,
    alias: [],
    component: () => Promise.resolve().then(function() {
      return _id_$1;
    })
  },
  {
    name: "template-id",
    path: "/template/:id",
    file: "/Users/meetqy/Desktop/my-template/nuxt-wcao.cc/pages/template/[id].vue",
    children: [],
    meta: meta$a,
    alias: [],
    component: () => Promise.resolve().then(function() {
      return _id_;
    })
  },
  {
    name: "tools-image-space",
    path: "/tools/image-space",
    file: "/Users/meetqy/Desktop/my-template/nuxt-wcao.cc/pages/tools/image-space/index.vue",
    children: [],
    meta: meta$9,
    alias: [],
    component: () => Promise.resolve().then(function() {
      return index$5;
    })
  },
  {
    name: "tools-index",
    path: "/tools",
    file: "/Users/meetqy/Desktop/my-template/nuxt-wcao.cc/pages/tools/index/index.vue",
    children: [],
    meta: meta$8,
    alias: [],
    component: () => Promise.resolve().then(function() {
      return index$4;
    })
  },
  {
    name: "tools-json-to-language-dart",
    path: "/tools/json-to-language/dart",
    file: "/Users/meetqy/Desktop/my-template/nuxt-wcao.cc/pages/tools/json-to-language/dart.vue",
    children: [],
    meta: meta$7,
    alias: [],
    component: () => Promise.resolve().then(function() {
      return dart;
    })
  },
  {
    name: "tools-json-to-language",
    path: "/tools/json-to-language",
    file: "/Users/meetqy/Desktop/my-template/nuxt-wcao.cc/pages/tools/json-to-language/index.vue",
    children: [],
    meta: meta$6,
    alias: [],
    component: () => Promise.resolve().then(function() {
      return index$2;
    })
  },
  {
    name: "tools-json-to-language-json-schema",
    path: "/tools/json-to-language/json-schema",
    file: "/Users/meetqy/Desktop/my-template/nuxt-wcao.cc/pages/tools/json-to-language/json-schema.vue",
    children: [],
    meta: meta$5,
    alias: [],
    component: () => Promise.resolve().then(function() {
      return jsonSchema;
    })
  },
  {
    name: "tools-json-to-language-mockjs",
    path: "/tools/json-to-language/mockjs",
    file: "/Users/meetqy/Desktop/my-template/nuxt-wcao.cc/pages/tools/json-to-language/mockjs/index.vue",
    children: [],
    meta: meta$4,
    alias: [],
    component: () => Promise.resolve().then(function() {
      return index$1;
    })
  },
  {
    name: "tools-json-to-language-mockjs-jsonToMock.client",
    path: "/tools/json-to-language/mockjs/jsonToMock.client",
    file: "/Users/meetqy/Desktop/my-template/nuxt-wcao.cc/pages/tools/json-to-language/mockjs/jsonToMock.client.js",
    children: [],
    meta: meta$3,
    alias: [],
    component: () => Promise.resolve().then(function() {
      return jsonToMock_client;
    })
  },
  {
    name: "tools-json-to-language-typescript",
    path: "/tools/json-to-language/typescript",
    file: "/Users/meetqy/Desktop/my-template/nuxt-wcao.cc/pages/tools/json-to-language/typescript.vue",
    children: [],
    meta: meta$2,
    alias: [],
    component: () => Promise.resolve().then(function() {
      return typescript;
    })
  },
  {
    name: "tools-tailwind-to-daisyui-default.client",
    path: "/tools/tailwind-to-daisyui/default.client",
    file: "/Users/meetqy/Desktop/my-template/nuxt-wcao.cc/pages/tools/tailwind-to-daisyui/default.client.js",
    children: [],
    meta: meta$1,
    alias: [],
    component: () => Promise.resolve().then(function() {
      return default_client;
    })
  },
  {
    name: "tools-tailwind-to-daisyui",
    path: "/tools/tailwind-to-daisyui",
    file: "/Users/meetqy/Desktop/my-template/nuxt-wcao.cc/pages/tools/tailwind-to-daisyui/index.vue",
    children: [],
    meta,
    alias: [],
    component: () => Promise.resolve().then(function() {
      return index;
    })
  }
];
const configRouterOptions = {};
const routerOptions = __spreadValues({}, configRouterOptions);
const globalMiddleware = [];
const namedMiddleware = {};
const _47Users_47meetqy_47Desktop_47my_45template_47nuxt_45wcao_46cc_47node_modules_47nuxt_47dist_47pages_47runtime_47router = defineNuxtPlugin(async (nuxtApp) => {
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
  const previousRoute = vue_cjs_prod.shallowRef(router.currentRoute.value);
  router.afterEach((_to, from) => {
    previousRoute.value = from;
  });
  Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
    get: () => previousRoute.value
  });
  const route = {};
  for (const key in router.currentRoute.value) {
    route[key] = vue_cjs_prod.computed(() => router.currentRoute.value[key]);
  }
  const _activeRoute = vue_cjs_prod.shallowRef(router.resolve(initialURL));
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
    activeRoute[key] = vue_cjs_prod.computed(() => _activeRoute.value[key]);
  }
  nuxtApp._route = vue_cjs_prod.reactive(route);
  nuxtApp._activeRoute = vue_cjs_prod.reactive(activeRoute);
  nuxtApp._middleware = nuxtApp._middleware || {
    global: [],
    named: {}
  };
  useError();
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
    to.meta = vue_cjs_prod.reactive(to.meta);
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
      if (!middleware) {
        throw new Error(`Unknown route middleware: '${entry2}'.`);
      }
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
    if (to.matched.length === 0) {
      callWithNuxt(nuxtApp, throwError, [createError({
        statusCode: 404,
        statusMessage: `Page not found: ${to.fullPath}`
      })]);
    } else if (to.matched[0].name === "404" && nuxtApp.ssrContext) {
      nuxtApp.ssrContext.res.statusCode = 404;
    } else {
      const currentURL = to.fullPath || "/";
      if (!isEqual(currentURL, initialURL)) {
        await callWithNuxt(nuxtApp, navigateTo, [currentURL]);
      }
    }
  });
  nuxtApp.hooks.hookOnce("app:created", async () => {
    try {
      await router.replace(__spreadProps(__spreadValues({}, router.resolve(initialURL)), {
        name: void 0,
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
const _47Users_47meetqy_47Desktop_47my_45template_47nuxt_45wcao_46cc_47node_modules_47_64nuxtjs_47strapi_47dist_47runtime_47strapi_46plugin = defineNuxtPlugin(async () => {
  const { fetchUser } = useStrapiAuth();
  await fetchUser();
});
const _47Users_47meetqy_47Desktop_47my_45template_47nuxt_45wcao_46cc_47plugins_47lazy_45img_46ts = defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(index$8);
});
const _plugins = [
  preload,
  _47Users_47meetqy_47Desktop_47my_45template_47nuxt_45wcao_46cc_47_46nuxt_47components_46plugin_46mjs,
  _47Users_47meetqy_47Desktop_47my_45template_47nuxt_45wcao_46cc_47node_modules_47nuxt_47dist_47head_47runtime_47lib_47vueuse_45head_46plugin,
  _47Users_47meetqy_47Desktop_47my_45template_47nuxt_45wcao_46cc_47node_modules_47nuxt_47dist_47head_47runtime_47plugin,
  _47Users_47meetqy_47Desktop_47my_45template_47nuxt_45wcao_46cc_47node_modules_47nuxt_47dist_47pages_47runtime_47router,
  _47Users_47meetqy_47Desktop_47my_45template_47nuxt_45wcao_46cc_47node_modules_47_64nuxtjs_47strapi_47dist_47runtime_47strapi_46plugin,
  _47Users_47meetqy_47Desktop_47my_45template_47nuxt_45wcao_46cc_47plugins_47lazy_45img_46ts
];
const _sfc_main$n = {
  __name: "error-404",
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
      const _component_NuxtLink = __nuxt_component_2$1;
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "font-sans antialiased bg-white dark:bg-black text-black dark:text-white grid min-h-screen place-content-center overflow-hidden" }, _attrs))} data-v-011aae6d><div class="fixed left-0 right-0 spotlight z-10" data-v-011aae6d></div><div class="max-w-520px text-center z-20" data-v-011aae6d><h1 class="text-8xl sm:text-10xl font-medium mb-8" data-v-011aae6d>${serverRenderer.exports.ssrInterpolate(__props.statusCode)}</h1><p class="text-xl px-8 sm:px-0 sm:text-4xl font-light mb-16 leading-tight" data-v-011aae6d>${serverRenderer.exports.ssrInterpolate(__props.description)}</p><div class="w-full flex items-center justify-center" data-v-011aae6d>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "gradient-border text-md sm:text-xl py-2 px-4 sm:py-3 sm:px-6 cursor-pointer"
      }, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${serverRenderer.exports.ssrInterpolate(__props.backHome)}`);
          } else {
            return [
              vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(__props.backHome), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui-templates/dist/templates/error-404.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const Error404 = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["__scopeId", "data-v-011aae6d"]]);
const _sfc_main$m = {
  __name: "error-500",
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
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "font-sans antialiased bg-white dark:bg-black text-black dark:text-white grid min-h-screen place-content-center overflow-hidden" }, _attrs))} data-v-6aee6495><div class="fixed -bottom-1/2 left-0 right-0 h-1/2 spotlight" data-v-6aee6495></div><div class="max-w-520px text-center" data-v-6aee6495><h1 class="text-8xl sm:text-10xl font-medium mb-8" data-v-6aee6495>${serverRenderer.exports.ssrInterpolate(__props.statusCode)}</h1><p class="text-xl px-8 sm:px-0 sm:text-4xl font-light mb-16 leading-tight" data-v-6aee6495>${serverRenderer.exports.ssrInterpolate(__props.description)}</p></div></div>`);
    };
  }
};
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui-templates/dist/templates/error-500.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const Error500 = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["__scopeId", "data-v-6aee6495"]]);
const _sfc_main$k = {
  __name: "nuxt-error-page",
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
      _push(serverRenderer.exports.ssrRenderComponent(vue_cjs_prod.unref(ErrorTemplate), vue_cjs_prod.mergeProps({ statusCode: vue_cjs_prod.unref(statusCode), statusMessage: vue_cjs_prod.unref(statusMessage), description: vue_cjs_prod.unref(description), stack: vue_cjs_prod.unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const _sfc_main$j = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const nuxtApp = useNuxtApp();
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    vue_cjs_prod.onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        callWithNuxt(nuxtApp, throwError, [err]);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_App = vue_cjs_prod.resolveComponent("App");
      serverRenderer.exports.ssrRenderSuspense(_push, {
        default: () => {
          if (vue_cjs_prod.unref(error)) {
            _push(serverRenderer.exports.ssrRenderComponent(vue_cjs_prod.unref(_sfc_main$k), { error: vue_cjs_prod.unref(error) }, null, _parent));
          } else {
            _push(serverRenderer.exports.ssrRenderComponent(_component_App, null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const _sfc_main$i = {
  __name: "NuxtLoadingBar",
  __ssrInlineRender: true,
  props: {
    throttle: {
      type: Number,
      default: 200
    },
    duration: {
      type: Number,
      default: 2e3
    },
    height: {
      type: Number,
      default: 3
    }
  },
  setup(__props) {
    const props = __props;
    const data = vue_cjs_prod.reactive({
      percent: 0,
      show: false,
      canSucceed: true
    });
    let _timer = null;
    let _throttle = null;
    let _cut;
    const clear = () => {
      _timer && clearInterval(_timer);
      _throttle && clearTimeout(_throttle);
      _timer = null;
    };
    const start = () => {
      clear();
      data.percent = 0;
      data.canSucceed = true;
      if (props.throttle) {
        _throttle = setTimeout(startTimer, props.throttle);
      } else {
        startTimer();
      }
    };
    const increase = (num) => {
      data.percent = Math.min(100, Math.floor(data.percent + num));
    };
    const finish = () => {
      data.percent = 100;
      hide();
    };
    const hide = () => {
      clear();
      setTimeout(() => {
        data.show = false;
        setTimeout(() => {
          data.percent = 0;
        }, 400);
      }, 500);
    };
    const startTimer = () => {
      data.show = true;
      _cut = 1e4 / Math.floor(props.duration);
      _timer = setInterval(() => {
        increase(_cut);
      }, 100);
    };
    const nuxtApp = useNuxtApp();
    nuxtApp.hook("page:start", start);
    nuxtApp.hook("page:finish", finish);
    vue_cjs_prod.onBeforeUnmount(() => clear);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
        class: ["nuxt-progress", {
          "nuxt-progress-failed": !data.canSucceed
        }],
        style: {
          width: data.percent + "%",
          left: data.left,
          height: props.height + "px",
          opacity: data.show ? 1 : 0,
          backgroundSize: 100 / data.percent * 100 + "% auto"
        }
      }, _attrs))}></div>`);
    };
  }
};
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/NuxtLoadingBar.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const _sfc_main$h = {
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    vue_cjs_prod.onMounted(() => {
      const appHeight = () => {
        const doc = document.documentElement;
        doc.style.setProperty("--app-height", `${document.documentElement.clientHeight}px`);
      };
      window.addEventListener("resize", appHeight);
      appHeight();
      window.addEventListener("orientationchange", () => {
        window.location.reload();
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLoadingBar = _sfc_main$i;
      const _component_NuxtPage = vue_cjs_prod.resolveComponent("NuxtPage");
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLoadingBar, { duration: 1e3 }, null, _parent));
      _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtPage, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch$1.create({
    baseURL: baseURL()
  });
}
let entry;
const plugins = normalizePlugins(_plugins);
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = vue_cjs_prod.createApp(_sfc_main$j);
    vueApp.component("App", _sfc_main$h);
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
const _sfc_main$g = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "Header",
  __ssrInlineRender: true,
  props: {
    height: null,
    class: null
  },
  setup(__props) {
    const isDark = useDark({
      selector: "html",
      attribute: "data-theme",
      valueDark: "dark",
      valueLight: "light"
    });
    useToggle(isDark);
    const navs = [
      {
        name: "\u9996\u9875",
        url: "/",
        children: []
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Logo = __nuxt_component_1;
      const _component_nuxt_link = __nuxt_component_2$1;
      _push(`<header${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
        class: ["flex justify-between items-center", __props.class]
      }, _attrs))}>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_Logo, null, null, _parent));
      _push(`<span class="text-base-100 underline">`);
      serverRenderer.exports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</span><ul class="menu text-neutral-content menu-horizontal rounded-box md:flex hidden"><!--[-->`);
      serverRenderer.exports.ssrRenderList(navs, (item) => {
        _push(`<li>`);
        _push(serverRenderer.exports.ssrRenderComponent(_component_nuxt_link, {
          to: item.url
        }, {
          default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${serverRenderer.exports.ssrInterpolate(item.name)}`);
            } else {
              return [
                vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(item.name), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--><li><label class="swap swap-rotate"><input type="checkbox"${serverRenderer.exports.ssrIncludeBooleanAttr(Array.isArray(vue_cjs_prod.unref(isDark)) ? serverRenderer.exports.ssrLooseContain(vue_cjs_prod.unref(isDark), null) : vue_cjs_prod.unref(isDark)) ? " checked" : ""}><svg class="swap-off fill-warning w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"></path></svg><svg class="swap-on fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"></path></svg></label></li></ul></header>`);
    };
  }
});
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Header.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const _sfc_main$f = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "Footer",
  __ssrInlineRender: true,
  props: {
    class: null,
    showLogo: { type: Boolean, default: true }
  },
  setup(__props) {
    const counter = useInterval(1e3);
    const time = vue_cjs_prod.ref();
    vue_cjs_prod.watch(counter, (val) => {
      const t = (Date.now() - startTime) / 1e3;
      time.value = getDuration(t);
    });
    const getDuration = (second) => {
      var duration;
      var days = Math.floor(second / 86400);
      var hours = Math.floor(second % 86400 / 3600);
      var minutes = Math.floor(second % 86400 % 3600 / 60);
      var seconds = Math.floor(second % 86400 % 3600 % 60);
      if (days > 0)
        duration = days + "\u5929" + hours + "\u65F6" + minutes + "\u5206" + seconds + "\u79D2";
      else if (hours > 0)
        duration = hours + "\u65F6" + minutes + "\u5206" + seconds + "\u79D2";
      else if (minutes > 0)
        duration = minutes + "\u5206" + seconds + "\u79D2";
      else if (seconds > 0)
        duration = seconds + "\u79D2";
      return duration;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Logo = __nuxt_component_1;
      _push(`<footer${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
        class: [__props.class, "py-8"]
      }, _attrs))}>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_Logo, {
        style: __props.showLogo ? null : { display: "none" },
        "show-week": false
      }, null, _parent));
      _push(`<p class="${serverRenderer.exports.ssrRenderClass([{ "mt-4": __props.showLogo }, "text-neutral-content text-sm flex flex-col-reverse xl:flex-row justify-center items-center"])}"><span>Copyright \xA9 2022 wcao.cc</span><span class="mx-2 text-neutral-content text-opacity-20 hidden xl:inline-block">|</span><span>\u8FD0\u884C: ${serverRenderer.exports.ssrInterpolate(time.value)}</span></p></footer>`);
    };
  }
});
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Footer.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const _sfc_main$e = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  emits: ["change"],
  setup(__props, { emit }) {
    const el = vue_cjs_prod.ref(null);
    const { y } = useScroll(el);
    vue_cjs_prod.watch(y, (val) => emit("change", val));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Header = _sfc_main$g;
      const _component_Footer = _sfc_main$f;
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
        id: "container",
        ref_key: "el",
        ref: el
      }, _attrs))}><div class="container lg:max-w-full xl:container mx-auto px-3">`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_Header, { class: "border-b-2 border-base-100 border-opacity-25 py-8" }, null, _parent));
      _push(`<main class="w-full">`);
      serverRenderer.exports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_Footer, { class: "flex flex-col items-center justify-center mt-20" }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main$e
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$d = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  const _component_Header = _sfc_main$g;
  const _component_Footer = _sfc_main$f;
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "m-auto h-screen overflow-hidden flex-col flex" }, _attrs))}>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_Header, { class: "container m-auto flex-shrink-0 h-20 xl:px-32 px-4" }, {
    default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        serverRenderer.exports.ssrRenderSlot(_ctx.$slots, "title", {}, null, _push2, _parent2, _scopeId);
      } else {
        return [
          vue_cjs_prod.renderSlot(_ctx.$slots, "title")
        ];
      }
    }),
    _: 3
  }, _parent));
  _push(`<div class="flex-1">`);
  serverRenderer.exports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_Footer, {
    class: "flex justify-center items-center flex-shrink-0 h-20",
    "show-logo": false
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/tools.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const tools = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["ssrRender", _sfc_ssrRender$1]]);
const tools$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": tools
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$c = {
  __name: "[pageIndex]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const { pageIndex } = route.params;
    useHead({
      titleTemplate: `${useTitle().title} - \u4ECA\u5929\u661F\u671F${useTitle().week}`
    });
    const { data: postsRes } = ([__temp, __restore] = vue_cjs_prod.withAsyncContext(() => useAsyncData(`index/${pageIndex}`, () => useStrapi4().find("posts", {
      publicationState: "live" ,
      populate: ["category", "headerImages", "tags"],
      sort: ["updatedAt:desc"],
      pagination: {
        page: pageIndex,
        pageSize: 15
      }
    }))), __temp = await __temp, __restore(), __temp);
    const posts = vue_cjs_prod.computed(() => postsRes.value.data);
    const { data: tagsRes } = ([__temp, __restore] = vue_cjs_prod.withAsyncContext(() => useAsyncData("tags", () => useStrapi4().find("tags", {
      publicationState: "live" ,
      populate: ["posts"]
    }))), __temp = await __temp, __restore(), __temp);
    const tags = vue_cjs_prod.computed(() => tagsRes.value.data);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0$2;
      const _component_PostList = __nuxt_component_1$1;
      const _component_nuxt_link = __nuxt_component_2$1;
      _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLayout, _attrs, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer.exports.ssrRenderComponent(_component_PostList, {
              posts: vue_cjs_prod.unref(posts),
              pagination: vue_cjs_prod.unref(postsRes).meta.pagination
            }, null, _parent2, _scopeId));
            _push2(`<div class="bottom-aside lg:grid-cols-3 md:grid-cols-2" data-v-fe2ee1ec${_scopeId}><div data-v-fe2ee1ec${_scopeId}><p class="bottom-title" data-v-fe2ee1ec${_scopeId}>Recent posts</p><ul data-v-fe2ee1ec${_scopeId}><!--[-->`);
            serverRenderer.exports.ssrRenderList(3, (item) => {
              _push2(`<li class="flex mt-5" data-v-fe2ee1ec${_scopeId}><img${serverRenderer.exports.ssrRenderAttr("src", "https://wcao.cc/r/a/avatar?" + item)} alt="" data-v-fe2ee1ec${_scopeId}><div class="flex flex-col justify-center ml-5" data-v-fe2ee1ec${_scopeId}><span class="text-md text-base-content" data-v-fe2ee1ec${_scopeId}> June 5, 2019 </span><p class="text-xl text-base-300" data-v-fe2ee1ec${_scopeId}> Mars is the fourth planet from the Sun </p></div></li>`);
            });
            _push2(`<!--]--></ul></div><div data-v-fe2ee1ec${_scopeId}><p class="bottom-title" data-v-fe2ee1ec${_scopeId}>\u6807\u7B7E</p><div class="flex mt-5 flex-wrap" data-v-fe2ee1ec${_scopeId}><!--[-->`);
            serverRenderer.exports.ssrRenderList(vue_cjs_prod.unref(tags), (item) => {
              _push2(`<!--[-->`);
              if (item.attributes.posts.data.length > 0) {
                _push2(serverRenderer.exports.ssrRenderComponent(_component_nuxt_link, {
                  to: `/tag/${item.id}`,
                  class: "btn btn-sm border-0 shadow-md capitalize mr-2 mb-4",
                  style: {
                    color: item.attributes.color,
                    backgroundColor: item.attributes.bgColor
                  },
                  key: item.id
                }, {
                  default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${serverRenderer.exports.ssrInterpolate(item.attributes.name)} <span class="ml-1" data-v-fe2ee1ec${_scopeId2}> (${serverRenderer.exports.ssrInterpolate(item.attributes.posts.data.length)}) </span>`);
                    } else {
                      return [
                        vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(item.attributes.name) + " ", 1),
                        vue_cjs_prod.createVNode("span", { class: "ml-1" }, " (" + vue_cjs_prod.toDisplayString(item.attributes.posts.data.length) + ") ", 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--]-->`);
            });
            _push2(`<!--]--></div></div><div data-v-fe2ee1ec${_scopeId}><p class="bottom-title" data-v-fe2ee1ec${_scopeId}>\u5173\u4E8E\u6211</p><div class="mt-5" data-v-fe2ee1ec${_scopeId}><div class="flex" data-v-fe2ee1ec${_scopeId}><img class="w-24 h-24 rounded-full border-4 border-info"${serverRenderer.exports.ssrRenderAttr("src", _imports_0)} alt="meetqy" data-v-fe2ee1ec${_scopeId}><div class="ml-5 flex flex-col justify-center" data-v-fe2ee1ec${_scopeId}><p class="text-neutral-content" data-v-fe2ee1ec${_scopeId}><span class="text-xl font-semibold" data-v-fe2ee1ec${_scopeId}>meetqy</span><sup class="inline-block line-through decoration-error decoration-2 relative -top-3" data-v-fe2ee1ec${_scopeId}> \u90FD${serverRenderer.exports.ssrInterpolate(new Date().getFullYear() - 1996)}\u4E86 </sup></p><p class="text-neutral-content text-opacity-80 text-sm my-1" data-v-fe2ee1ec${_scopeId}> \u524D\u7AEFCV\u5DE5\u7A0B\u5E08 - \u64C5\u957FCV\u5927\u6CD5 </p></div></div><p class="text-neutral-content mt-5" data-v-fe2ee1ec${_scopeId}> \u6478\u9C7C\u3001\u517B\u72D7\u3001\u5E72\u996D\u3001\u627E\u6A21\u677F\u3001\u5199\u6A21\u677F\uFF0C\u751F\u6D3B\u5C31\u662F\u5982\u6B64\u7684\u6734\u5B9E\u65E0\u534E\uFF01 </p><p class="mt-4 about" data-v-fe2ee1ec${_scopeId}><span class="badge badge-lg border-0 uppercase shadow text-black" style="${serverRenderer.exports.ssrRenderStyle({ "background-color": "#e5d836" })}" data-v-fe2ee1ec${_scopeId}> js </span><span class="badge badge-lg border-0 uppercase" style="${serverRenderer.exports.ssrRenderStyle({ "background-color": "#4266bb" })}" data-v-fe2ee1ec${_scopeId}> ts </span><span class="badge badge-lg border-0 capitalize" style="${serverRenderer.exports.ssrRenderStyle({ "background": "linear-gradient(to bottom right, #69bcf0, #28468a)" })}" data-v-fe2ee1ec${_scopeId}> flutter </span><span class="badge badge-lg border-0 capitalize" style="${serverRenderer.exports.ssrRenderStyle({ "background": "linear-gradient(to bottom right, #8bb840, #35362d)" })}" data-v-fe2ee1ec${_scopeId}>node </span><span class="badge badge-lg border-0 shadow text-black" style="${serverRenderer.exports.ssrRenderStyle({ "background": "linear-gradient(to bottom right, #4ea1c5, #55b3a8)" })}" data-v-fe2ee1ec${_scopeId}> Tailwind CSS </span><span class="badge badge-lg border-0 shadow" style="${serverRenderer.exports.ssrRenderStyle({ "background": "linear-gradient(to bottom right, #c15029, #cf642d)" })}" data-v-fe2ee1ec${_scopeId}> HTML </span><span class="badge badge-lg border-0 shadow" style="${serverRenderer.exports.ssrRenderStyle({ "background": "linear-gradient(to bottom right, #335ca4, #5697de)" })}" data-v-fe2ee1ec${_scopeId}> CSS </span></p></div></div></div>`);
          } else {
            return [
              vue_cjs_prod.createVNode(_component_PostList, {
                posts: vue_cjs_prod.unref(posts),
                pagination: vue_cjs_prod.unref(postsRes).meta.pagination
              }, null, 8, ["posts", "pagination"]),
              vue_cjs_prod.createVNode("div", { class: "bottom-aside lg:grid-cols-3 md:grid-cols-2" }, [
                vue_cjs_prod.createVNode("div", null, [
                  vue_cjs_prod.createVNode("p", { class: "bottom-title" }, "Recent posts"),
                  vue_cjs_prod.createVNode("ul", null, [
                    (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(vue_cjs_prod.Fragment, null, vue_cjs_prod.renderList(3, (item) => {
                      return vue_cjs_prod.createVNode("li", { class: "flex mt-5" }, [
                        vue_cjs_prod.createVNode("img", {
                          src: "https://wcao.cc/r/a/avatar?" + item,
                          alt: ""
                        }, null, 8, ["src"]),
                        vue_cjs_prod.createVNode("div", { class: "flex flex-col justify-center ml-5" }, [
                          vue_cjs_prod.createVNode("span", { class: "text-md text-base-content" }, " June 5, 2019 "),
                          vue_cjs_prod.createVNode("p", { class: "text-xl text-base-300" }, " Mars is the fourth planet from the Sun ")
                        ])
                      ]);
                    }), 64))
                  ])
                ]),
                vue_cjs_prod.createVNode("div", null, [
                  vue_cjs_prod.createVNode("p", { class: "bottom-title" }, "\u6807\u7B7E"),
                  vue_cjs_prod.createVNode("div", { class: "flex mt-5 flex-wrap" }, [
                    (vue_cjs_prod.openBlock(true), vue_cjs_prod.createBlock(vue_cjs_prod.Fragment, null, vue_cjs_prod.renderList(vue_cjs_prod.unref(tags), (item) => {
                      return vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(vue_cjs_prod.Fragment, null, [
                        item.attributes.posts.data.length > 0 ? (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(_component_nuxt_link, {
                          to: `/tag/${item.id}`,
                          class: "btn btn-sm border-0 shadow-md capitalize mr-2 mb-4",
                          style: {
                            color: item.attributes.color,
                            backgroundColor: item.attributes.bgColor
                          },
                          key: item.id
                        }, {
                          default: vue_cjs_prod.withCtx(() => [
                            vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(item.attributes.name) + " ", 1),
                            vue_cjs_prod.createVNode("span", { class: "ml-1" }, " (" + vue_cjs_prod.toDisplayString(item.attributes.posts.data.length) + ") ", 1)
                          ]),
                          _: 2
                        }, 1032, ["to", "style"])) : vue_cjs_prod.createCommentVNode("", true)
                      ], 64);
                    }), 256))
                  ])
                ]),
                vue_cjs_prod.createVNode("div", null, [
                  vue_cjs_prod.createVNode("p", { class: "bottom-title" }, "\u5173\u4E8E\u6211"),
                  vue_cjs_prod.createVNode("div", { class: "mt-5" }, [
                    vue_cjs_prod.createVNode("div", { class: "flex" }, [
                      vue_cjs_prod.createVNode("img", {
                        class: "w-24 h-24 rounded-full border-4 border-info",
                        src: _imports_0,
                        alt: "meetqy"
                      }),
                      vue_cjs_prod.createVNode("div", { class: "ml-5 flex flex-col justify-center" }, [
                        vue_cjs_prod.createVNode("p", { class: "text-neutral-content" }, [
                          vue_cjs_prod.createVNode("span", { class: "text-xl font-semibold" }, "meetqy"),
                          vue_cjs_prod.createVNode("sup", { class: "inline-block line-through decoration-error decoration-2 relative -top-3" }, " \u90FD" + vue_cjs_prod.toDisplayString(new Date().getFullYear() - 1996) + "\u4E86 ", 1)
                        ]),
                        vue_cjs_prod.createVNode("p", { class: "text-neutral-content text-opacity-80 text-sm my-1" }, " \u524D\u7AEFCV\u5DE5\u7A0B\u5E08 - \u64C5\u957FCV\u5927\u6CD5 ")
                      ])
                    ]),
                    vue_cjs_prod.createVNode("p", { class: "text-neutral-content mt-5" }, " \u6478\u9C7C\u3001\u517B\u72D7\u3001\u5E72\u996D\u3001\u627E\u6A21\u677F\u3001\u5199\u6A21\u677F\uFF0C\u751F\u6D3B\u5C31\u662F\u5982\u6B64\u7684\u6734\u5B9E\u65E0\u534E\uFF01 "),
                    vue_cjs_prod.createVNode("p", { class: "mt-4 about" }, [
                      vue_cjs_prod.createVNode("span", {
                        class: "badge badge-lg border-0 uppercase shadow text-black",
                        style: { "background-color": "#e5d836" }
                      }, " js "),
                      vue_cjs_prod.createVNode("span", {
                        class: "badge badge-lg border-0 uppercase",
                        style: { "background-color": "#4266bb" }
                      }, " ts "),
                      vue_cjs_prod.createVNode("span", {
                        class: "badge badge-lg border-0 capitalize",
                        style: { "background": "linear-gradient(to bottom right, #69bcf0, #28468a)" }
                      }, " flutter "),
                      vue_cjs_prod.createVNode("span", {
                        class: "badge badge-lg border-0 capitalize",
                        style: { "background": "linear-gradient(to bottom right, #8bb840, #35362d)" }
                      }, "node "),
                      vue_cjs_prod.createVNode("span", {
                        class: "badge badge-lg border-0 shadow text-black",
                        style: { "background": "linear-gradient(to bottom right, #4ea1c5, #55b3a8)" }
                      }, " Tailwind CSS "),
                      vue_cjs_prod.createVNode("span", {
                        class: "badge badge-lg border-0 shadow",
                        style: { "background": "linear-gradient(to bottom right, #c15029, #cf642d)" }
                      }, " HTML "),
                      vue_cjs_prod.createVNode("span", {
                        class: "badge badge-lg border-0 shadow",
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
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index/[pageIndex].vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const _pageIndex_ = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-fe2ee1ec"]]);
const _pageIndex_$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _pageIndex_
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$b = {
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useHead({
      titleTemplate: `${useTitle().title} - \u4ECA\u5929\u661F\u671F${useTitle().week}`
    });
    const { data: postsRes } = ([__temp, __restore] = vue_cjs_prod.withAsyncContext(() => useAsyncData("index/1", () => useStrapi4().find("posts", {
      publicationState: "live" ,
      populate: ["category", "headerImages", "tags"],
      sort: ["updatedAt:desc"],
      pagination: {
        page: 1,
        pageSize: 15
      }
    }))), __temp = await __temp, __restore(), __temp);
    const posts = vue_cjs_prod.computed(() => postsRes.value.data);
    const { data: tagsRes } = ([__temp, __restore] = vue_cjs_prod.withAsyncContext(() => useAsyncData("tags", () => useStrapi4().find("tags", {
      publicationState: "live" ,
      populate: ["posts"]
    }))), __temp = await __temp, __restore(), __temp);
    const tags = vue_cjs_prod.computed(() => tagsRes.value.data);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0$2;
      const _component_PostList = __nuxt_component_1$1;
      const _component_nuxt_link = __nuxt_component_2$1;
      _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLayout, _attrs, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer.exports.ssrRenderComponent(_component_PostList, {
              posts: vue_cjs_prod.unref(posts),
              pagination: vue_cjs_prod.unref(postsRes).meta.pagination
            }, null, _parent2, _scopeId));
            _push2(`<div class="bottom-aside lg:grid-cols-3 md:grid-cols-2" data-v-e7fab59a${_scopeId}><div data-v-e7fab59a${_scopeId}><p class="bottom-title" data-v-e7fab59a${_scopeId}>Recent posts</p><ul data-v-e7fab59a${_scopeId}><!--[-->`);
            serverRenderer.exports.ssrRenderList(3, (item) => {
              _push2(`<li class="flex mt-5" data-v-e7fab59a${_scopeId}><img${serverRenderer.exports.ssrRenderAttr("src", "https://wcao.cc/r/a/avatar?" + item)} alt="" data-v-e7fab59a${_scopeId}><div class="flex flex-col justify-center ml-5" data-v-e7fab59a${_scopeId}><span class="text-md text-base-content" data-v-e7fab59a${_scopeId}> June 5, 2019 </span><p class="text-xl text-base-300" data-v-e7fab59a${_scopeId}> Mars is the fourth planet from the Sun </p></div></li>`);
            });
            _push2(`<!--]--></ul></div><div data-v-e7fab59a${_scopeId}><p class="bottom-title" data-v-e7fab59a${_scopeId}>\u6807\u7B7E</p><div class="flex mt-5 flex-wrap" data-v-e7fab59a${_scopeId}><!--[-->`);
            serverRenderer.exports.ssrRenderList(vue_cjs_prod.unref(tags), (item) => {
              _push2(`<!--[-->`);
              if (item.attributes.posts.data.length > 0) {
                _push2(serverRenderer.exports.ssrRenderComponent(_component_nuxt_link, {
                  to: `/tag/${item.id}`,
                  class: "btn btn-sm border-0 shadow-md capitalize mr-2 mb-4",
                  style: {
                    color: item.attributes.color,
                    backgroundColor: item.attributes.bgColor
                  },
                  key: item.id
                }, {
                  default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${serverRenderer.exports.ssrInterpolate(item.attributes.name)} <span class="ml-1" data-v-e7fab59a${_scopeId2}> (${serverRenderer.exports.ssrInterpolate(item.attributes.posts.data.length)}) </span>`);
                    } else {
                      return [
                        vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(item.attributes.name) + " ", 1),
                        vue_cjs_prod.createVNode("span", { class: "ml-1" }, " (" + vue_cjs_prod.toDisplayString(item.attributes.posts.data.length) + ") ", 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--]-->`);
            });
            _push2(`<!--]--></div></div><div data-v-e7fab59a${_scopeId}><p class="bottom-title" data-v-e7fab59a${_scopeId}>\u5173\u4E8E\u6211</p><div class="mt-5" data-v-e7fab59a${_scopeId}><div class="flex" data-v-e7fab59a${_scopeId}><img class="w-24 h-24 rounded-full border-4 border-info"${serverRenderer.exports.ssrRenderAttr("src", _imports_0)} alt="meetqy" data-v-e7fab59a${_scopeId}><div class="ml-5 flex flex-col justify-center" data-v-e7fab59a${_scopeId}><p class="text-neutral-content" data-v-e7fab59a${_scopeId}><span class="text-xl font-semibold" data-v-e7fab59a${_scopeId}>meetqy</span><sup class="inline-block line-through decoration-error decoration-2 relative -top-3" data-v-e7fab59a${_scopeId}> \u90FD${serverRenderer.exports.ssrInterpolate(new Date().getFullYear() - 1996)}\u4E86 </sup></p><p class="text-neutral-content text-opacity-80 text-sm my-1" data-v-e7fab59a${_scopeId}> \u524D\u7AEFCV\u5DE5\u7A0B\u5E08 - \u64C5\u957FCV\u5927\u6CD5 </p></div></div><p class="text-neutral-content mt-5" data-v-e7fab59a${_scopeId}> \u6478\u9C7C\u3001\u517B\u72D7\u3001\u5E72\u996D\u3001\u627E\u6A21\u677F\u3001\u5199\u6A21\u677F\uFF0C\u751F\u6D3B\u5C31\u662F\u5982\u6B64\u7684\u6734\u5B9E\u65E0\u534E\uFF01 </p><p class="mt-4 about" data-v-e7fab59a${_scopeId}><span class="badge badge-lg border-0 uppercase shadow text-black" style="${serverRenderer.exports.ssrRenderStyle({ "background-color": "#e5d836" })}" data-v-e7fab59a${_scopeId}> js </span><span class="badge badge-lg border-0 uppercase" style="${serverRenderer.exports.ssrRenderStyle({ "background-color": "#4266bb" })}" data-v-e7fab59a${_scopeId}> ts </span><span class="badge badge-lg border-0 capitalize" style="${serverRenderer.exports.ssrRenderStyle({ "background": "linear-gradient(to bottom right, #69bcf0, #28468a)" })}" data-v-e7fab59a${_scopeId}> flutter </span><span class="badge badge-lg border-0 capitalize" style="${serverRenderer.exports.ssrRenderStyle({ "background": "linear-gradient(to bottom right, #8bb840, #35362d)" })}" data-v-e7fab59a${_scopeId}>node </span><span class="badge badge-lg border-0 shadow text-black" style="${serverRenderer.exports.ssrRenderStyle({ "background": "linear-gradient(to bottom right, #4ea1c5, #55b3a8)" })}" data-v-e7fab59a${_scopeId}> Tailwind CSS </span><span class="badge badge-lg border-0 shadow" style="${serverRenderer.exports.ssrRenderStyle({ "background": "linear-gradient(to bottom right, #c15029, #cf642d)" })}" data-v-e7fab59a${_scopeId}> HTML </span><span class="badge badge-lg border-0 shadow" style="${serverRenderer.exports.ssrRenderStyle({ "background": "linear-gradient(to bottom right, #335ca4, #5697de)" })}" data-v-e7fab59a${_scopeId}> CSS </span></p></div></div></div>`);
          } else {
            return [
              vue_cjs_prod.createVNode(_component_PostList, {
                posts: vue_cjs_prod.unref(posts),
                pagination: vue_cjs_prod.unref(postsRes).meta.pagination
              }, null, 8, ["posts", "pagination"]),
              vue_cjs_prod.createVNode("div", { class: "bottom-aside lg:grid-cols-3 md:grid-cols-2" }, [
                vue_cjs_prod.createVNode("div", null, [
                  vue_cjs_prod.createVNode("p", { class: "bottom-title" }, "Recent posts"),
                  vue_cjs_prod.createVNode("ul", null, [
                    (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(vue_cjs_prod.Fragment, null, vue_cjs_prod.renderList(3, (item) => {
                      return vue_cjs_prod.createVNode("li", { class: "flex mt-5" }, [
                        vue_cjs_prod.createVNode("img", {
                          src: "https://wcao.cc/r/a/avatar?" + item,
                          alt: ""
                        }, null, 8, ["src"]),
                        vue_cjs_prod.createVNode("div", { class: "flex flex-col justify-center ml-5" }, [
                          vue_cjs_prod.createVNode("span", { class: "text-md text-base-content" }, " June 5, 2019 "),
                          vue_cjs_prod.createVNode("p", { class: "text-xl text-base-300" }, " Mars is the fourth planet from the Sun ")
                        ])
                      ]);
                    }), 64))
                  ])
                ]),
                vue_cjs_prod.createVNode("div", null, [
                  vue_cjs_prod.createVNode("p", { class: "bottom-title" }, "\u6807\u7B7E"),
                  vue_cjs_prod.createVNode("div", { class: "flex mt-5 flex-wrap" }, [
                    (vue_cjs_prod.openBlock(true), vue_cjs_prod.createBlock(vue_cjs_prod.Fragment, null, vue_cjs_prod.renderList(vue_cjs_prod.unref(tags), (item) => {
                      return vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(vue_cjs_prod.Fragment, null, [
                        item.attributes.posts.data.length > 0 ? (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(_component_nuxt_link, {
                          to: `/tag/${item.id}`,
                          class: "btn btn-sm border-0 shadow-md capitalize mr-2 mb-4",
                          style: {
                            color: item.attributes.color,
                            backgroundColor: item.attributes.bgColor
                          },
                          key: item.id
                        }, {
                          default: vue_cjs_prod.withCtx(() => [
                            vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(item.attributes.name) + " ", 1),
                            vue_cjs_prod.createVNode("span", { class: "ml-1" }, " (" + vue_cjs_prod.toDisplayString(item.attributes.posts.data.length) + ") ", 1)
                          ]),
                          _: 2
                        }, 1032, ["to", "style"])) : vue_cjs_prod.createCommentVNode("", true)
                      ], 64);
                    }), 256))
                  ])
                ]),
                vue_cjs_prod.createVNode("div", null, [
                  vue_cjs_prod.createVNode("p", { class: "bottom-title" }, "\u5173\u4E8E\u6211"),
                  vue_cjs_prod.createVNode("div", { class: "mt-5" }, [
                    vue_cjs_prod.createVNode("div", { class: "flex" }, [
                      vue_cjs_prod.createVNode("img", {
                        class: "w-24 h-24 rounded-full border-4 border-info",
                        src: _imports_0,
                        alt: "meetqy"
                      }),
                      vue_cjs_prod.createVNode("div", { class: "ml-5 flex flex-col justify-center" }, [
                        vue_cjs_prod.createVNode("p", { class: "text-neutral-content" }, [
                          vue_cjs_prod.createVNode("span", { class: "text-xl font-semibold" }, "meetqy"),
                          vue_cjs_prod.createVNode("sup", { class: "inline-block line-through decoration-error decoration-2 relative -top-3" }, " \u90FD" + vue_cjs_prod.toDisplayString(new Date().getFullYear() - 1996) + "\u4E86 ", 1)
                        ]),
                        vue_cjs_prod.createVNode("p", { class: "text-neutral-content text-opacity-80 text-sm my-1" }, " \u524D\u7AEFCV\u5DE5\u7A0B\u5E08 - \u64C5\u957FCV\u5927\u6CD5 ")
                      ])
                    ]),
                    vue_cjs_prod.createVNode("p", { class: "text-neutral-content mt-5" }, " \u6478\u9C7C\u3001\u517B\u72D7\u3001\u5E72\u996D\u3001\u627E\u6A21\u677F\u3001\u5199\u6A21\u677F\uFF0C\u751F\u6D3B\u5C31\u662F\u5982\u6B64\u7684\u6734\u5B9E\u65E0\u534E\uFF01 "),
                    vue_cjs_prod.createVNode("p", { class: "mt-4 about" }, [
                      vue_cjs_prod.createVNode("span", {
                        class: "badge badge-lg border-0 uppercase shadow text-black",
                        style: { "background-color": "#e5d836" }
                      }, " js "),
                      vue_cjs_prod.createVNode("span", {
                        class: "badge badge-lg border-0 uppercase",
                        style: { "background-color": "#4266bb" }
                      }, " ts "),
                      vue_cjs_prod.createVNode("span", {
                        class: "badge badge-lg border-0 capitalize",
                        style: { "background": "linear-gradient(to bottom right, #69bcf0, #28468a)" }
                      }, " flutter "),
                      vue_cjs_prod.createVNode("span", {
                        class: "badge badge-lg border-0 capitalize",
                        style: { "background": "linear-gradient(to bottom right, #8bb840, #35362d)" }
                      }, "node "),
                      vue_cjs_prod.createVNode("span", {
                        class: "badge badge-lg border-0 shadow text-black",
                        style: { "background": "linear-gradient(to bottom right, #4ea1c5, #55b3a8)" }
                      }, " Tailwind CSS "),
                      vue_cjs_prod.createVNode("span", {
                        class: "badge badge-lg border-0 shadow",
                        style: { "background": "linear-gradient(to bottom right, #c15029, #cf642d)" }
                      }, " HTML "),
                      vue_cjs_prod.createVNode("span", {
                        class: "badge badge-lg border-0 shadow",
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
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index/index.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const index$6 = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__scopeId", "data-v-e7fab59a"]]);
const index$7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": index$6
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$a = {
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const onChange = (y) => {
      asideFixed.value = y > 150;
    };
    const asideFixed = vue_cjs_prod.ref(false);
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
    const { data } = ([__temp, __restore] = vue_cjs_prod.withAsyncContext(() => useAsyncData(`posts/${id}`, () => useStrapi4().find(`posts/${id}`, {
      publicationState: "live" ,
      populate: ["category", "tags", "previewImages"]
    }))), __temp = await __temp, __restore(), __temp);
    const post = vue_cjs_prod.computed(() => {
      return data.value.data.attributes;
    });
    const previewImages = vue_cjs_prod.computed(() => post.value.previewImages.data);
    const content = vue_cjs_prod.computed(() => md.render(post.value.content));
    const modules = [Navigation];
    const $cdn = useCdnUrl();
    vue_cjs_prod.onMounted(() => {
      useHead({
        titleTemplate: `${post.value.title} - ${post.value.desciption}`,
        meta: [
          {
            name: "description",
            content: `${post.value.desciption}`
          }
        ]
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0$2;
      const _component_Logo = __nuxt_component_1;
      _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLayout, vue_cjs_prod.mergeProps({ onChange }, _attrs), {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<main class="main-content flex" data-v-9706bfc2${_scopeId}><aside class="${serverRenderer.exports.ssrRenderClass([
              { fixed: asideFixed.value },
              "top-0 w-96 max-h-screen hidden lg:flex flex-col z-10 flex-shrink-0"
            ])}" data-v-9706bfc2${_scopeId}><section class="${serverRenderer.exports.ssrRenderClass([{ hidden: !asideFixed.value }, "w-full lg:pr-10 my-5"])}" data-v-9706bfc2${_scopeId}><div class="p-2 h-min rounded-box" data-v-9706bfc2${_scopeId}>`);
            _push2(serverRenderer.exports.ssrRenderComponent(_component_Logo, null, null, _parent2, _scopeId));
            _push2(`</div></section><section class="w-full lg:pr-10" data-v-9706bfc2${_scopeId}><ul class="menu bg-base-100 p-2 w-full h-min rounded-box" data-v-9706bfc2${_scopeId}><li class="menu-title py-2" data-v-9706bfc2${_scopeId}><span data-v-9706bfc2${_scopeId}>Type</span></li><!--[-->`);
            serverRenderer.exports.ssrRenderList(_ctx.types, (item, index2) => {
              _push2(`<li class="text-xl" data-v-9706bfc2${_scopeId}><a${serverRenderer.exports.ssrRenderAttr("href", "#" + item.name)} class="${serverRenderer.exports.ssrRenderClass({
                active: _ctx.curTypes === index2,
                capitalize: _ctx.curTypes === index2
              })}" data-v-9706bfc2${_scopeId}>${serverRenderer.exports.ssrInterpolate(item.name)}</a></li>`);
            });
            _push2(`<!--]--></ul></section></aside><aside class="w-96 opacity-0 hidden lg:flex" style="${serverRenderer.exports.ssrRenderStyle(asideFixed.value ? null : { display: "none" })}" data-v-9706bfc2${_scopeId}></aside><div class="flex-1 relative overflow-hidden p-5 bg-base-100 rounded-md" data-v-9706bfc2${_scopeId}>`);
            _push2(serverRenderer.exports.ssrRenderComponent(vue_cjs_prod.unref(Swiper), {
              class: "swiper w-full rounded-2xl",
              modules,
              navigation: true
            }, {
              default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  serverRenderer.exports.ssrRenderList(vue_cjs_prod.unref(previewImages), (item) => {
                    _push3(serverRenderer.exports.ssrRenderComponent(vue_cjs_prod.unref(SwiperSlide), {
                      class: "flex justify-center items-center",
                      key: item.id
                    }, {
                      default: vue_cjs_prod.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<img class="rounded-2xl xl:w-1/5 md:w-1/3 w-1/2"${serverRenderer.exports.ssrRenderAttr("src", vue_cjs_prod.unref($cdn) + item.attributes.url)} data-v-9706bfc2${_scopeId3}>`);
                        } else {
                          return [
                            vue_cjs_prod.createVNode("img", {
                              class: "rounded-2xl xl:w-1/5 md:w-1/3 w-1/2",
                              src: vue_cjs_prod.unref($cdn) + item.attributes.url
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
                    (vue_cjs_prod.openBlock(true), vue_cjs_prod.createBlock(vue_cjs_prod.Fragment, null, vue_cjs_prod.renderList(vue_cjs_prod.unref(previewImages), (item) => {
                      return vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(vue_cjs_prod.unref(SwiperSlide), {
                        class: "flex justify-center items-center",
                        key: item.id
                      }, {
                        default: vue_cjs_prod.withCtx(() => [
                          vue_cjs_prod.createVNode("img", {
                            class: "rounded-2xl xl:w-1/5 md:w-1/3 w-1/2",
                            src: vue_cjs_prod.unref($cdn) + item.attributes.url
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
            _push2(`<div class="flex items-center mt-6 flex-wrap mb-10" data-v-9706bfc2${_scopeId}><a href="javascript:;" class="flex items-center justify-center" data-v-9706bfc2${_scopeId}><img class="w-8 h-8 rounded-full relative -top-0.5" style="${serverRenderer.exports.ssrRenderStyle({ "box-shadow": "2px 2px 5px 1px rgb(0 0 0 / 20%)" })}"${serverRenderer.exports.ssrRenderAttr("src", _imports_0)} data-v-9706bfc2${_scopeId}><span class="ml-3" data-v-9706bfc2${_scopeId}> meetqy </span></a><a href="javascript:;" class="ml-6" data-v-9706bfc2${_scopeId}><i class="iconfont" style="${serverRenderer.exports.ssrRenderStyle({ "color": "#e84e89" })}" data-v-9706bfc2${_scopeId}>\uE8B4</i><span class="ml-2" data-v-9706bfc2${_scopeId}>${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(post).updatedAt.split("T")[0])}</span></a><a href="javascript:;" class="ml-6" data-v-9706bfc2${_scopeId}><i class="iconfont" style="${serverRenderer.exports.ssrRenderStyle({ "color": "#e84e89" })}" data-v-9706bfc2${_scopeId}>\uE8F4</i><span class="ml-2" data-v-9706bfc2${_scopeId}>${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(post).visit)}</span></a><a href="javascript:;" class="ml-6" data-v-9706bfc2${_scopeId}><i class="iconfont" style="${serverRenderer.exports.ssrRenderStyle({ "color": "#e84e89" })}" data-v-9706bfc2${_scopeId}>\uE8B5</i><span class="ml-2" data-v-9706bfc2${_scopeId}>${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(post).comment)}</span></a></div><article class="prose prose-neutral prose-a:text-blue-500 break-words mb-20" data-v-9706bfc2${_scopeId}>${vue_cjs_prod.unref(content)}</article><div class="divider" data-v-9706bfc2${_scopeId}>End</div><div class="py-12 flex justify-center items-center flex-wrap" data-v-9706bfc2${_scopeId}><span class="text-lg font-semibold mr-4" data-v-9706bfc2${_scopeId}>Link:</span><a${serverRenderer.exports.ssrRenderAttr("href", vue_cjs_prod.unref(post).link)} class="underline text-blue-500 break-words inline-block w-full text-center md:w-auto" data-v-9706bfc2${_scopeId}>${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(post).link)}</a></div></div></main>`);
          } else {
            return [
              vue_cjs_prod.createVNode("main", { class: "main-content flex" }, [
                vue_cjs_prod.createVNode("aside", {
                  class: [
                    { fixed: asideFixed.value },
                    "top-0 w-96 max-h-screen hidden lg:flex flex-col z-10 flex-shrink-0"
                  ]
                }, [
                  vue_cjs_prod.createVNode("section", {
                    class: ["w-full lg:pr-10 my-5", { hidden: !asideFixed.value }]
                  }, [
                    vue_cjs_prod.createVNode("div", { class: "p-2 h-min rounded-box" }, [
                      vue_cjs_prod.createVNode(_component_Logo)
                    ])
                  ], 2),
                  vue_cjs_prod.createVNode("section", { class: "w-full lg:pr-10" }, [
                    vue_cjs_prod.createVNode("ul", { class: "menu bg-base-100 p-2 w-full h-min rounded-box" }, [
                      vue_cjs_prod.createVNode("li", { class: "menu-title py-2" }, [
                        vue_cjs_prod.createVNode("span", null, "Type")
                      ]),
                      (vue_cjs_prod.openBlock(true), vue_cjs_prod.createBlock(vue_cjs_prod.Fragment, null, vue_cjs_prod.renderList(_ctx.types, (item, index2) => {
                        return vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock("li", {
                          class: "text-xl",
                          key: item,
                          onClick: ($event) => _ctx.curTypes = index2
                        }, [
                          vue_cjs_prod.createVNode("a", {
                            href: "#" + item.name,
                            class: {
                              active: _ctx.curTypes === index2,
                              capitalize: _ctx.curTypes === index2
                            }
                          }, vue_cjs_prod.toDisplayString(item.name), 11, ["href"])
                        ], 8, ["onClick"]);
                      }), 128))
                    ])
                  ])
                ], 2),
                vue_cjs_prod.withDirectives(vue_cjs_prod.createVNode("aside", { class: "w-96 opacity-0 hidden lg:flex" }, null, 512), [
                  [vue_cjs_prod.vShow, asideFixed.value]
                ]),
                vue_cjs_prod.createVNode("div", { class: "flex-1 relative overflow-hidden p-5 bg-base-100 rounded-md" }, [
                  vue_cjs_prod.createVNode(vue_cjs_prod.unref(Swiper), {
                    class: "swiper w-full rounded-2xl",
                    modules,
                    navigation: true
                  }, {
                    default: vue_cjs_prod.withCtx(() => [
                      (vue_cjs_prod.openBlock(true), vue_cjs_prod.createBlock(vue_cjs_prod.Fragment, null, vue_cjs_prod.renderList(vue_cjs_prod.unref(previewImages), (item) => {
                        return vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(vue_cjs_prod.unref(SwiperSlide), {
                          class: "flex justify-center items-center",
                          key: item.id
                        }, {
                          default: vue_cjs_prod.withCtx(() => [
                            vue_cjs_prod.createVNode("img", {
                              class: "rounded-2xl xl:w-1/5 md:w-1/3 w-1/2",
                              src: vue_cjs_prod.unref($cdn) + item.attributes.url
                            }, null, 8, ["src"])
                          ]),
                          _: 2
                        }, 1024);
                      }), 128))
                    ]),
                    _: 1
                  }),
                  vue_cjs_prod.createVNode("div", { class: "flex items-center mt-6 flex-wrap mb-10" }, [
                    vue_cjs_prod.createVNode("a", {
                      href: "javascript:;",
                      class: "flex items-center justify-center"
                    }, [
                      vue_cjs_prod.createVNode("img", {
                        class: "w-8 h-8 rounded-full relative -top-0.5",
                        style: { "box-shadow": "2px 2px 5px 1px rgb(0 0 0 / 20%)" },
                        src: _imports_0
                      }),
                      vue_cjs_prod.createVNode("span", { class: "ml-3" }, " meetqy ")
                    ]),
                    vue_cjs_prod.createVNode("a", {
                      href: "javascript:;",
                      class: "ml-6"
                    }, [
                      vue_cjs_prod.createVNode("i", {
                        class: "iconfont",
                        style: { "color": "#e84e89" }
                      }, "\uE8B4"),
                      vue_cjs_prod.createVNode("span", { class: "ml-2" }, vue_cjs_prod.toDisplayString(vue_cjs_prod.unref(post).updatedAt.split("T")[0]), 1)
                    ]),
                    vue_cjs_prod.createVNode("a", {
                      href: "javascript:;",
                      class: "ml-6"
                    }, [
                      vue_cjs_prod.createVNode("i", {
                        class: "iconfont",
                        style: { "color": "#e84e89" }
                      }, "\uE8F4"),
                      vue_cjs_prod.createVNode("span", { class: "ml-2" }, vue_cjs_prod.toDisplayString(vue_cjs_prod.unref(post).visit), 1)
                    ]),
                    vue_cjs_prod.createVNode("a", {
                      href: "javascript:;",
                      class: "ml-6"
                    }, [
                      vue_cjs_prod.createVNode("i", {
                        class: "iconfont",
                        style: { "color": "#e84e89" }
                      }, "\uE8B5"),
                      vue_cjs_prod.createVNode("span", { class: "ml-2" }, vue_cjs_prod.toDisplayString(vue_cjs_prod.unref(post).comment), 1)
                    ])
                  ]),
                  vue_cjs_prod.createVNode("article", {
                    class: "prose prose-neutral prose-a:text-blue-500 break-words mb-20",
                    innerHTML: vue_cjs_prod.unref(content)
                  }, null, 8, ["innerHTML"]),
                  vue_cjs_prod.createVNode("div", { class: "divider" }, "End"),
                  vue_cjs_prod.createVNode("div", { class: "py-12 flex justify-center items-center flex-wrap" }, [
                    vue_cjs_prod.createVNode("span", { class: "text-lg font-semibold mr-4" }, "Link:"),
                    vue_cjs_prod.createVNode("a", {
                      href: vue_cjs_prod.unref(post).link,
                      class: "underline text-blue-500 break-words inline-block w-full text-center md:w-auto"
                    }, vue_cjs_prod.toDisplayString(vue_cjs_prod.unref(post).link), 9, ["href"])
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
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/posts/[id].vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const _id_$2 = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-9706bfc2"]]);
const _id_$3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _id_$2
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$9 = {
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { params } = useRoute();
    const { id } = params;
    const { data: postsRes } = ([__temp, __restore] = vue_cjs_prod.withAsyncContext(() => useAsyncData("posts-tag-" + id, () => useStrapi4().find("posts", {
      publicationState: "live" ,
      populate: ["category", "headerImages", "tags"],
      filters: {
        tags: {
          id: {
            $in: [id]
          }
        }
      },
      pagination: {
        page: 1,
        pageSize: 15
      }
    }))), __temp = await __temp, __restore(), __temp);
    const posts = vue_cjs_prod.computed(() => postsRes.value.data);
    const tag = vue_cjs_prod.computed(() => posts.value[0].attributes.tags.data.filter((item) => item.id === +id)[0].attributes);
    vue_cjs_prod.onMounted(() => {
      useHead({
        titleTemplate: `\u6807\u7B7E-${tag.value.name}`
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0$2;
      const _component_PostList = __nuxt_component_1$1;
      _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLayout, _attrs, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><div class="mt-12 flex justify-center px-32"${_scopeId}><div class="navbar bg-base-100 rounded-box bg-opacity-20 h-24"${_scopeId}><a class="btn btn-ghost normal-case text-2xl m-auto"${_scopeId}>${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(tag).name)}</a></div></div>`);
            _push2(serverRenderer.exports.ssrRenderComponent(_component_PostList, {
              posts: vue_cjs_prod.unref(posts),
              pagination: vue_cjs_prod.unref(postsRes).meta.pagination
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vue_cjs_prod.createVNode("div", null, [
                vue_cjs_prod.createVNode("div", { class: "mt-12 flex justify-center px-32" }, [
                  vue_cjs_prod.createVNode("div", { class: "navbar bg-base-100 rounded-box bg-opacity-20 h-24" }, [
                    vue_cjs_prod.createVNode("a", { class: "btn btn-ghost normal-case text-2xl m-auto" }, vue_cjs_prod.toDisplayString(vue_cjs_prod.unref(tag).name), 1)
                  ])
                ]),
                vue_cjs_prod.createVNode(_component_PostList, {
                  posts: vue_cjs_prod.unref(posts),
                  pagination: vue_cjs_prod.unref(postsRes).meta.pagination
                }, null, 8, ["posts", "pagination"])
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
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tag/[id].vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _id_$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main$9
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$8 = {
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const themes = [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter"
    ];
    const activeCode = vue_cjs_prod.ref(false);
    const { id } = route.params;
    const { data } = ([__temp, __restore] = vue_cjs_prod.withAsyncContext(() => useAsyncData(`posts/${id}`, () => useStrapi4().find(`posts/${id}`, {
      publicationState: "live" ,
      populate: ["tags"]
    }))), __temp = await __temp, __restore(), __temp);
    const post = vue_cjs_prod.computed(() => {
      return data.value.data.attributes;
    });
    const tags = vue_cjs_prod.computed(() => post.value.tags.data);
    const file = post.value.title.split(" Part ");
    const { data: html } = ([__temp, __restore] = vue_cjs_prod.withAsyncContext(() => useFetch(`/fragments/${file[0].toLowerCase()}/${file[1]}.html`, {
      baseURL: useBaseUrl()
    })), __temp = await __temp, __restore(), __temp);
    const name = vue_cjs_prod.computed(() => ultra[post.value.title.split(" Part ")[1]]);
    const curTheme = vue_cjs_prod.ref("dark");
    const showCode = () => {
      activeCode.value = !activeCode.value;
      if (activeCode.value) {
        hljs.highlightBlock(document.querySelector("#pre-" + id));
      }
    };
    const isDark = useDark({
      selector: "html",
      attribute: "data-theme",
      valueDark: "dark",
      valueLight: "light"
    });
    vue_cjs_prod.onMounted(() => {
      curTheme.value = isDark.value ? "dark" : "light";
    });
    const onChange = (y) => {
      asideFixed.value = y > 150;
    };
    const asideFixed = vue_cjs_prod.ref(false);
    vue_cjs_prod.onMounted(() => {
      useHead({
        titleTemplate: `${post.value.title}:${post.value.desciption} - ${tags.value.map((item) => item.attributes.name).join(",")}\u6A21\u677F`
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0$2;
      const _component_Logo = __nuxt_component_1;
      _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLayout, vue_cjs_prod.mergeProps({ onChange }, _attrs), {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<main class="main-content flex"${_scopeId}><aside class="${serverRenderer.exports.ssrRenderClass([
              { fixed: asideFixed.value },
              "top-0 w-96 flex-shrink-0 max-h-screen hidden lg:flex flex-col z-10 "
            ])}"${_scopeId}><section class="${serverRenderer.exports.ssrRenderClass([{ hidden: !asideFixed.value }, "w-full xl:pr-10 pr-4 my-5"])}"${_scopeId}><div class="p-2 h-min rounded-box"${_scopeId}>`);
            _push2(serverRenderer.exports.ssrRenderComponent(_component_Logo, null, null, _parent2, _scopeId));
            _push2(`</div></section><section class="w-full xl:pr-10 pr-4 xl:mt-5"${_scopeId}><ul class="menu bg-base-100 p-2 w-full h-96 overflow-y-scroll rounded-box scrollbar"${_scopeId}><li class="menu-title py-2"${_scopeId}><span class="flex justify-between items-center"${_scopeId}> Change Theme <span${_scopeId}> use: <a class="btn btn-link btn-xs" href="https://daisyui.com/" target="_blank"${_scopeId}> DaisyUI </a></span></span></li><!--[-->`);
            serverRenderer.exports.ssrRenderList(themes, (item) => {
              _push2(`<li${serverRenderer.exports.ssrRenderAttr("data-theme", item)} class="${serverRenderer.exports.ssrRenderClass([{ "outline-dashed": curTheme.value === item }, "my-2 shadow rounded-box"])}"${_scopeId}><a href="javascript:;" class="flex justify-between hover:bg-transparent active:bg-transparent focus:bg-transparent"${_scopeId}><span${_scopeId}>${serverRenderer.exports.ssrInterpolate(item)}</span><div class="flex gap-1 h-4"${_scopeId}><div class="bg-primary w-2 rounded"${_scopeId}></div><div class="bg-secondary w-2 rounded"${_scopeId}></div><div class="bg-accent w-2 rounded"${_scopeId}></div><div class="bg-neutral w-2 rounded"${_scopeId}></div></div></a></li>`);
            });
            _push2(`<!--]--></ul></section></aside><aside class="w-96 flex-shrink-0 opacity-0 hidden lg:flex" style="${serverRenderer.exports.ssrRenderStyle(asideFixed.value ? null : { display: "none" })}"${_scopeId}></aside><div class="flex-1 relative overflow-hidden px-5 bg-base-100 py-10 rounded-box"${_scopeId}><div class="prose mb-8"${_scopeId}><h2 class="flex justify-between capitalize"${_scopeId}>${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(post).title)} <span${_scopeId}><small class="text-info"${_scopeId}>${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(name)[0])}</small><small class="font-light ml-2 text-base-content text-opacity-50"${_scopeId}> (${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(name)[1])}) </small></span></h2></div><div class="mockup-window border bg-base-300 w-full mb-8"${serverRenderer.exports.ssrRenderAttr("data-theme", curTheme.value)}${_scopeId}><div class="${serverRenderer.exports.ssrRenderClass([{ "btn-link": !activeCode.value }, "btn btn-sm btn-square btn-primary absolute right-8 top-2 gap-2"])}"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"${_scopeId}></path></svg></div><div class="flex justify-center px-4 lg:pt-16 lg:pb-10 pt-8 pb-5 bg-base-200"${_scopeId}>${vue_cjs_prod.unref(html)}</div><pre class="bg-base-200 px-4" style="${serverRenderer.exports.ssrRenderStyle(activeCode.value ? null : { display: "none" })}"${_scopeId}>                <code${serverRenderer.exports.ssrRenderAttr("id", "pre-" + vue_cjs_prod.unref(id))} class="rounded-box"${_scopeId}>${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(html))}</code>
            </pre></div></div></main>`);
          } else {
            return [
              vue_cjs_prod.createVNode("main", { class: "main-content flex" }, [
                vue_cjs_prod.createVNode("aside", {
                  class: [
                    { fixed: asideFixed.value },
                    "top-0 w-96 flex-shrink-0 max-h-screen hidden lg:flex flex-col z-10 "
                  ]
                }, [
                  vue_cjs_prod.createVNode("section", {
                    class: ["w-full xl:pr-10 pr-4 my-5", { hidden: !asideFixed.value }]
                  }, [
                    vue_cjs_prod.createVNode("div", { class: "p-2 h-min rounded-box" }, [
                      vue_cjs_prod.createVNode(_component_Logo)
                    ])
                  ], 2),
                  vue_cjs_prod.createVNode("section", { class: "w-full xl:pr-10 pr-4 xl:mt-5" }, [
                    vue_cjs_prod.createVNode("ul", { class: "menu bg-base-100 p-2 w-full h-96 overflow-y-scroll rounded-box scrollbar" }, [
                      vue_cjs_prod.createVNode("li", { class: "menu-title py-2" }, [
                        vue_cjs_prod.createVNode("span", { class: "flex justify-between items-center" }, [
                          vue_cjs_prod.createTextVNode(" Change Theme "),
                          vue_cjs_prod.createVNode("span", null, [
                            vue_cjs_prod.createTextVNode(" use: "),
                            vue_cjs_prod.createVNode("a", {
                              class: "btn btn-link btn-xs",
                              href: "https://daisyui.com/",
                              target: "_blank"
                            }, " DaisyUI ")
                          ])
                        ])
                      ]),
                      (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(vue_cjs_prod.Fragment, null, vue_cjs_prod.renderList(themes, (item) => {
                        return vue_cjs_prod.createVNode("li", {
                          key: item,
                          "data-theme": item,
                          class: ["my-2 shadow rounded-box", { "outline-dashed": curTheme.value === item }]
                        }, [
                          vue_cjs_prod.createVNode("a", {
                            href: "javascript:;",
                            class: "flex justify-between hover:bg-transparent active:bg-transparent focus:bg-transparent",
                            onClick: ($event) => curTheme.value = item
                          }, [
                            vue_cjs_prod.createVNode("span", null, vue_cjs_prod.toDisplayString(item), 1),
                            vue_cjs_prod.createVNode("div", { class: "flex gap-1 h-4" }, [
                              vue_cjs_prod.createVNode("div", { class: "bg-primary w-2 rounded" }),
                              vue_cjs_prod.createVNode("div", { class: "bg-secondary w-2 rounded" }),
                              vue_cjs_prod.createVNode("div", { class: "bg-accent w-2 rounded" }),
                              vue_cjs_prod.createVNode("div", { class: "bg-neutral w-2 rounded" })
                            ])
                          ], 8, ["onClick"])
                        ], 10, ["data-theme"]);
                      }), 64))
                    ])
                  ])
                ], 2),
                vue_cjs_prod.withDirectives(vue_cjs_prod.createVNode("aside", { class: "w-96 flex-shrink-0 opacity-0 hidden lg:flex" }, null, 512), [
                  [vue_cjs_prod.vShow, asideFixed.value]
                ]),
                vue_cjs_prod.createVNode("div", { class: "flex-1 relative overflow-hidden px-5 bg-base-100 py-10 rounded-box" }, [
                  vue_cjs_prod.createVNode("div", { class: "prose mb-8" }, [
                    vue_cjs_prod.createVNode("h2", { class: "flex justify-between capitalize" }, [
                      vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(vue_cjs_prod.unref(post).title) + " ", 1),
                      vue_cjs_prod.createVNode("span", null, [
                        vue_cjs_prod.createVNode("small", { class: "text-info" }, vue_cjs_prod.toDisplayString(vue_cjs_prod.unref(name)[0]), 1),
                        vue_cjs_prod.createVNode("small", { class: "font-light ml-2 text-base-content text-opacity-50" }, " (" + vue_cjs_prod.toDisplayString(vue_cjs_prod.unref(name)[1]) + ") ", 1)
                      ])
                    ])
                  ]),
                  vue_cjs_prod.createVNode("div", {
                    class: "mockup-window border bg-base-300 w-full mb-8",
                    "data-theme": curTheme.value
                  }, [
                    vue_cjs_prod.createVNode("div", {
                      class: ["btn btn-sm btn-square btn-primary absolute right-8 top-2 gap-2", { "btn-link": !activeCode.value }],
                      onClick: showCode
                    }, [
                      (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        class: "h-6 w-6",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        "stroke-width": "2"
                      }, [
                        vue_cjs_prod.createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          d: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        })
                      ]))
                    ], 2),
                    vue_cjs_prod.createVNode("div", {
                      class: "flex justify-center px-4 lg:pt-16 lg:pb-10 pt-8 pb-5 bg-base-200",
                      innerHTML: vue_cjs_prod.unref(html)
                    }, null, 8, ["innerHTML"]),
                    vue_cjs_prod.withDirectives(vue_cjs_prod.createVNode("pre", { class: "bg-base-200 px-4" }, [
                      vue_cjs_prod.createTextVNode("                "),
                      vue_cjs_prod.createVNode("code", {
                        id: "pre-" + vue_cjs_prod.unref(id),
                        class: "rounded-box"
                      }, vue_cjs_prod.toDisplayString(vue_cjs_prod.unref(html)), 9, ["id"]),
                      vue_cjs_prod.createTextVNode("\n            ")
                    ], 512), [
                      [vue_cjs_prod.vShow, activeCode.value]
                    ])
                  ], 8, ["data-theme"])
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
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/template/[id].vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main$8
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$7 = {
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const curTypes = vue_cjs_prod.ref(0);
    const { data } = ([__temp, __restore] = vue_cjs_prod.withAsyncContext(() => useAsyncData("image-space", () => useStrapi4().find(`posts/4`))), __temp = await __temp, __restore(), __temp);
    const post = vue_cjs_prod.computed(() => {
      return data.value.data.attributes;
    });
    vue_cjs_prod.onMounted(() => {
      useHead({
        titleTemplate: `${post.value.title} - ${post.value.desciption}`,
        meta: [
          {
            name: "description",
            content: `${post.value.desciption}`
          }
        ]
      });
    });
    const types = vue_cjs_prod.computed(() => {
      return post.value.imageSpace;
    });
    const onChange = (y) => {
      asideFixed.value = y > 150;
    };
    const asideFixed = vue_cjs_prod.ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0$2;
      const _component_Logo = __nuxt_component_1;
      const _directive_lazy = vue_cjs_prod.resolveDirective("lazy");
      _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLayout, vue_cjs_prod.mergeProps({ onChange }, _attrs), {
        title: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Random Image`);
          } else {
            return [
              vue_cjs_prod.createTextVNode("Random Image")
            ];
          }
        }),
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<main class="main-content flex"${_scopeId}><aside class="${serverRenderer.exports.ssrRenderClass([
              { fixed: asideFixed.value },
              "top-0 w-96 max-h-screen hidden lg:flex flex-col z-10 "
            ])}"${_scopeId}><section class="${serverRenderer.exports.ssrRenderClass([{ hidden: !asideFixed.value }, "w-full xl:pr-10 pr-5 my-5"])}"${_scopeId}><div class="p-2 h-min rounded-box"${_scopeId}>`);
            _push2(serverRenderer.exports.ssrRenderComponent(_component_Logo, null, null, _parent2, _scopeId));
            _push2(`</div></section><section class="w-full xl:pr-10 pr-4"${_scopeId}><ul class="menu bg-base-100 p-2 w-full rounded-box overflow-y-scroll h-96 scrollbar"${_scopeId}><li class="menu-title py-2"${_scopeId}><span${_scopeId}>Type</span></li><!--[-->`);
            serverRenderer.exports.ssrRenderList(vue_cjs_prod.unref(types), (item, index2) => {
              _push2(`<li class="text-xl"${_scopeId}><a${serverRenderer.exports.ssrRenderAttr("href", "#" + item.name)} class="${serverRenderer.exports.ssrRenderClass({
                active: curTypes.value === index2,
                capitalize: curTypes.value === index2
              })}"${_scopeId}>${serverRenderer.exports.ssrInterpolate(item.name)}</a></li>`);
            });
            _push2(`<!--]--></ul></section></aside><aside class="w-96 opacity-0 hidden lg:flex" style="${serverRenderer.exports.ssrRenderStyle(asideFixed.value ? null : { display: "none" })}"${_scopeId}></aside><div class="flex-1 px-5 py-10 bg-base-100 rounded-md prose prose-neutral prose-a:text-blue-500"${_scopeId}><h1${_scopeId}>Random Image</h1><p${_scopeId}>\u6839\u636E\u7C7B\u578B\u968F\u673A\u751F\u6210\u4E00\u5F20\u56FE\u7247</p><ul${_scopeId}><li${_scopeId}>\u89C4\u5219: https://wcao.cc/image-space/api/{\u7C7B\u578B}</li><li${_scopeId}>\u4E00\u4E2A\u9875\u9762\u4F7F\u7528\u591A\u5F20: \u89C4\u5219\u540E\u9762\u52A0\u4E0A\u53C2\u6570\uFF0C\u4FDD\u8BC1\u94FE\u63A5\u4E0D\u540C\uFF01\uFF01\uFF01</li></ul><!--[-->`);
            serverRenderer.exports.ssrRenderList(vue_cjs_prod.unref(types), (item) => {
              _push2(`<article${_scopeId}><h2${serverRenderer.exports.ssrRenderAttr("id", item.name)} class="capitalize flex justify-between"${_scopeId}><span${_scopeId}><small class="text-base-300"${_scopeId}># </small>${serverRenderer.exports.ssrInterpolate(item.name)}</span>`);
              if (item.link) {
                _push2(`<a${serverRenderer.exports.ssrRenderAttr("href", item.link)} target="_blank" class="font-normal text-base"${_scopeId}> \u6570\u636E\u6765\u6E90 \u{1F449}\u{1F3FB} </a>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</h2><div class="grid grid-cols-4 gap-4"${_scopeId}><!--[-->`);
              serverRenderer.exports.ssrRenderList(4, (num) => {
                _push2(`<img${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "w-48 rounded-md my-0" }, serverRenderer.exports.ssrGetDirectiveProps(_ctx, _directive_lazy, {
                  src: `https://wcao.cc/image-space/api/${item.name}?${num}`,
                  loading: "/loading.gif"
                })))}${_scopeId}>`);
              });
              _push2(`<!--]--></div><p${_scopeId}>Try</p><pre${_scopeId}> https://wcao.cc/image-space/api/${serverRenderer.exports.ssrInterpolate(item.name)}?xxx </pre></article>`);
            });
            _push2(`<!--]--></div></main>`);
          } else {
            return [
              vue_cjs_prod.createVNode("main", { class: "main-content flex" }, [
                vue_cjs_prod.createVNode("aside", {
                  class: [
                    { fixed: asideFixed.value },
                    "top-0 w-96 max-h-screen hidden lg:flex flex-col z-10 "
                  ]
                }, [
                  vue_cjs_prod.createVNode("section", {
                    class: ["w-full xl:pr-10 pr-5 my-5", { hidden: !asideFixed.value }]
                  }, [
                    vue_cjs_prod.createVNode("div", { class: "p-2 h-min rounded-box" }, [
                      vue_cjs_prod.createVNode(_component_Logo)
                    ])
                  ], 2),
                  vue_cjs_prod.createVNode("section", { class: "w-full xl:pr-10 pr-4" }, [
                    vue_cjs_prod.createVNode("ul", { class: "menu bg-base-100 p-2 w-full rounded-box overflow-y-scroll h-96 scrollbar" }, [
                      vue_cjs_prod.createVNode("li", { class: "menu-title py-2" }, [
                        vue_cjs_prod.createVNode("span", null, "Type")
                      ]),
                      (vue_cjs_prod.openBlock(true), vue_cjs_prod.createBlock(vue_cjs_prod.Fragment, null, vue_cjs_prod.renderList(vue_cjs_prod.unref(types), (item, index2) => {
                        return vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock("li", {
                          class: "text-xl",
                          key: item,
                          onClick: ($event) => curTypes.value = index2
                        }, [
                          vue_cjs_prod.createVNode("a", {
                            href: "#" + item.name,
                            class: {
                              active: curTypes.value === index2,
                              capitalize: curTypes.value === index2
                            }
                          }, vue_cjs_prod.toDisplayString(item.name), 11, ["href"])
                        ], 8, ["onClick"]);
                      }), 128))
                    ])
                  ])
                ], 2),
                vue_cjs_prod.withDirectives(vue_cjs_prod.createVNode("aside", { class: "w-96 opacity-0 hidden lg:flex" }, null, 512), [
                  [vue_cjs_prod.vShow, asideFixed.value]
                ]),
                vue_cjs_prod.createVNode("div", { class: "flex-1 px-5 py-10 bg-base-100 rounded-md prose prose-neutral prose-a:text-blue-500" }, [
                  vue_cjs_prod.createVNode("h1", null, "Random Image"),
                  vue_cjs_prod.createVNode("p", null, "\u6839\u636E\u7C7B\u578B\u968F\u673A\u751F\u6210\u4E00\u5F20\u56FE\u7247"),
                  vue_cjs_prod.createVNode("ul", null, [
                    vue_cjs_prod.createVNode("li", null, "\u89C4\u5219: https://wcao.cc/image-space/api/{\u7C7B\u578B}"),
                    vue_cjs_prod.createVNode("li", null, "\u4E00\u4E2A\u9875\u9762\u4F7F\u7528\u591A\u5F20: \u89C4\u5219\u540E\u9762\u52A0\u4E0A\u53C2\u6570\uFF0C\u4FDD\u8BC1\u94FE\u63A5\u4E0D\u540C\uFF01\uFF01\uFF01")
                  ]),
                  (vue_cjs_prod.openBlock(true), vue_cjs_prod.createBlock(vue_cjs_prod.Fragment, null, vue_cjs_prod.renderList(vue_cjs_prod.unref(types), (item) => {
                    return vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock("article", null, [
                      vue_cjs_prod.createVNode("h2", {
                        id: item.name,
                        class: "capitalize flex justify-between"
                      }, [
                        vue_cjs_prod.createVNode("span", null, [
                          vue_cjs_prod.createVNode("small", { class: "text-base-300" }, "# "),
                          vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(item.name), 1)
                        ]),
                        item.link ? (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock("a", {
                          key: 0,
                          href: item.link,
                          target: "_blank",
                          class: "font-normal text-base"
                        }, " \u6570\u636E\u6765\u6E90 \u{1F449}\u{1F3FB} ", 8, ["href"])) : vue_cjs_prod.createCommentVNode("", true)
                      ], 8, ["id"]),
                      vue_cjs_prod.createVNode("div", { class: "grid grid-cols-4 gap-4" }, [
                        (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(vue_cjs_prod.Fragment, null, vue_cjs_prod.renderList(4, (num) => {
                          return vue_cjs_prod.withDirectives(vue_cjs_prod.createVNode("img", { class: "w-48 rounded-md my-0" }, null, 512), [
                            [_directive_lazy, {
                              src: `https://wcao.cc/image-space/api/${item.name}?${num}`,
                              loading: "/loading.gif"
                            }]
                          ]);
                        }), 64))
                      ]),
                      vue_cjs_prod.createVNode("p", null, "Try"),
                      vue_cjs_prod.createVNode("pre", null, " https://wcao.cc/image-space/api/" + vue_cjs_prod.toDisplayString(item.name) + "?xxx ", 1)
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
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/image-space/index.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const index$5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main$7
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$6 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLayout = __nuxt_component_0$2;
  _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLayout, vue_cjs_prod.mergeProps({ name: "default" }, _attrs), {
    default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` 123132 `);
      } else {
        return [
          vue_cjs_prod.createTextVNode(" 123132 ")
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/index/index.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const index$3 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender]]);
const index$4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": index$3
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$5 = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "dart",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      titleTemplate: `JSON\u5728\u7EBF\u8F6C\u6362\u5DE5\u5177(to dart)`,
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
    const jsonValue = vue_cjs_prod.ref(useJsonDefaultValue());
    vue_cjs_prod.watch(() => useRoute(), (e) => {
      jsonValue.value = useJsonDefaultValue();
    });
    const codeOption = vue_cjs_prod.reactive({
      code: "",
      codeMirrorMode: "dart"
    });
    vue_cjs_prod.onMounted(async () => {
      const code = await useJsonToLanguage(useRoute().path.replace("/tools/json-to-language/", ""), jsonValue.value);
      codeOption.code = code;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Editor = __nuxt_component_0;
      _push(serverRenderer.exports.ssrRenderComponent(_component_Editor, vue_cjs_prod.mergeProps({
        onChange: change,
        "json-value": jsonValue.value,
        "code-option": codeOption
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/json-to-language/dart.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const dart = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main$5
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$4 = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      titleTemplate: `JSON\u5728\u7EBF\u8F6C\u6362\u5DE5\u5177(to dart)`,
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
    const jsonValue = vue_cjs_prod.ref(useJsonDefaultValue());
    vue_cjs_prod.watch(() => useRoute(), (e) => {
      jsonValue.value = useJsonDefaultValue();
    });
    const codeOption = vue_cjs_prod.reactive({
      code: "",
      codeMirrorMode: "dart"
    });
    vue_cjs_prod.onMounted(async () => {
      const code = await useJsonToLanguage("dart", jsonValue.value);
      codeOption.code = code;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Editor = __nuxt_component_0;
      _push(serverRenderer.exports.ssrRenderComponent(_component_Editor, vue_cjs_prod.mergeProps({
        onChange: change,
        "json-value": jsonValue.value,
        "code-option": codeOption
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/json-to-language/index.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const index$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main$4
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$3 = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "json-schema",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      titleTemplate: `JSON\u5728\u7EBF\u8F6C\u6362\u5DE5\u5177(to json-schema)`,
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
    const jsonValue = vue_cjs_prod.ref(useJsonDefaultValue());
    vue_cjs_prod.watch(() => useRoute(), (e) => {
      jsonValue.value = useJsonDefaultValue();
    });
    const codeOption = vue_cjs_prod.reactive({
      code: "",
      codeMirrorMode: "dart"
    });
    vue_cjs_prod.onMounted(async () => {
      codeOption.code = formatJson(jsonValue.value);
    });
    const formatJson = (value) => {
      const res = toJsonSchema(JSON.parse(value));
      return jsonFormat(res);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Editor = __nuxt_component_0;
      _push(serverRenderer.exports.ssrRenderComponent(_component_Editor, vue_cjs_prod.mergeProps({
        onChange: change,
        "json-value": jsonValue.value,
        "code-option": codeOption
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/json-to-language/json-schema.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const jsonSchema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main$3
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$2 = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      titleTemplate: `JSON\u5728\u7EBF\u8F6C\u6362\u5DE5\u5177(to mockjs)`,
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
    const jsonValue = vue_cjs_prod.ref(useJsonDefaultValue());
    vue_cjs_prod.watch(() => useRoute(), (e) => {
      jsonValue.value = useJsonDefaultValue();
    });
    const codeOption = vue_cjs_prod.reactive({
      code: "",
      codeMirrorMode: "mockjs"
    });
    vue_cjs_prod.onMounted(async () => {
      codeOption.code = toMockjs(jsonValue.value);
    });
    const toMockjs = (value) => {
      const res = toJsonSchema(JSON.parse(value));
      const str = useJsontoMock(res.properties);
      return jsonFormat(JSON.parse(str));
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Editor = __nuxt_component_0;
      _push(serverRenderer.exports.ssrRenderComponent(_component_Editor, vue_cjs_prod.mergeProps({
        onChange: change,
        "json-value": jsonValue.value,
        "code-option": codeOption
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/json-to-language/mockjs/index.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const index$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main$2
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1 = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "typescript",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      titleTemplate: `JSON\u5728\u7EBF\u8F6C\u6362\u5DE5\u5177(to typescript)`,
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
    const jsonValue = vue_cjs_prod.ref(useJsonDefaultValue());
    vue_cjs_prod.watch(() => useRoute(), (e) => {
      jsonValue.value = useJsonDefaultValue();
    });
    const codeOption = vue_cjs_prod.reactive({
      code: "",
      codeMirrorMode: "dart"
    });
    vue_cjs_prod.onMounted(async () => {
      const code = await useJsonToLanguage(useRoute().path.replace("/tools/json-to-language/", ""), jsonValue.value);
      codeOption.code = code;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Editor = __nuxt_component_0;
      _push(serverRenderer.exports.ssrRenderComponent(_component_Editor, vue_cjs_prod.mergeProps({
        onChange: change,
        "json-value": jsonValue.value,
        "code-option": codeOption
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/json-to-language/typescript.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const typescript = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main$1
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      titleTemplate: `\u5FEB\u901F\u628A Tailwind \u8F6C\u6362\u4E3A DaisyUI \u4E3B\u9898`,
      meta: [
        {
          name: "description",
          content: "\u5FEB\u901F\u628A Tailwind \u8F6C\u6362\u4E3A DaisyUI \u4E3B\u9898"
        }
      ]
    });
    const leftEditorElement = vue_cjs_prod.ref();
    const rightEditorElement = vue_cjs_prod.ref();
    const { $codemirror } = useNuxtApp();
    let _leftCodeMirror = null;
    let _rightCodeMirror = null;
    const setLeftMirror = (code) => {
      if (!code)
        return;
      _leftCodeMirror.setValue(code);
      setTimeout(() => {
        _leftCodeMirror.refresh();
      }, 50);
    };
    const setRightMirror = async (code) => {
      _rightCodeMirror.setValue(code);
      setTimeout(() => {
        _rightCodeMirror.refresh();
      }, 50);
    };
    const toDaisyUI = (str) => {
      return str.replace(/class=('|").*?("|')/g, (e) => {
        let classname = e.split("class=")[1].replace(/'|"/g, "").split(" ");
        const btn = classname.filter((item) => /hover|focus/.test(item));
        if (btn.length > 1) {
          classname = ["btn", "capitalize", "btn-primary"];
        }
        classname = classname.filter((item) => !/dark:/.test(item));
        classname = classname.map((item) => item.replace(/bg-white/, "bg-base-100"));
        classname = classname.map((item) => item.replace(/blue-(\d)+/, "primary"));
        classname = classname.map((item) => item.replace(/green-(\d)+/, "success"));
        classname = classname.map((item) => {
          return item.replace(/[a-z]+-gray-[0-9]+/, (e2) => {
            const n = e2.match(/[0-9]+/)[0];
            const prefix = e2.split("-gray")[0];
            return `${prefix}-base-content ${prefix}-opacity-${+n / 10}`;
          });
        });
        classname = classname.map((item) => {
          return item.replace(/[a-z]+-slate-[0-9]+/, (e2) => {
            const n = e2.match(/[0-9]+/)[0];
            const prefix = e2.split("-slate")[0];
            return `${prefix}-accent-focus ${prefix}-opacity-${+n / 10}`;
          });
        });
        return `class="${classname.join(" ")}"`;
      }).replace(/src=('|").*?("|')/g, `src='https://wcao.cc/r/a/xxx'`);
    };
    vue_cjs_prod.onMounted(async () => {
      await import('codemirror/mode/xml/xml.js');
      _leftCodeMirror = $codemirror(leftEditorElement.value, {
        mode: "text/html",
        scrollbarStyle: "overlay",
        lineNumbers: true,
        htmlMode: true
      });
      _rightCodeMirror = $codemirror(rightEditorElement.value, {
        mode: "text/html",
        lineNumbers: true,
        scrollbarStyle: "overlay",
        innerHeight: "auto"
      });
      let t;
      setLeftMirror(defaultCode);
      setRightMirror(toDaisyUI(defaultCode));
      _leftCodeMirror.on("change", async (e) => {
        if (t) {
          clearTimeout(t);
        }
        t = setTimeout(() => {
          const res = toDaisyUI(e.getValue());
          setRightMirror(res);
        }, 500);
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_layout = __nuxt_component_0$2;
      _push(serverRenderer.exports.ssrRenderComponent(_component_nuxt_layout, vue_cjs_prod.mergeProps({ name: "tools" }, _attrs), {
        title: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u5FEB\u901F\u628A Tailwind \u8F6C\u6362\u4E3A DaisyUI \u4E3B\u9898 `);
          } else {
            return [
              vue_cjs_prod.createTextVNode("\u5FEB\u901F\u628A Tailwind \u8F6C\u6362\u4E3A DaisyUI \u4E3B\u9898 ")
            ];
          }
        }),
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="hidden lg:block"${_scopeId}><main class="tailwind-to-daisyui flex"${_scopeId}><div class="w-1/2"${_scopeId}></div><div class="w-1/2 lang-editor"${_scopeId}></div></main></div><div class="prose flex justify-center items-center h-full lg:hidden"${_scopeId}><h2 class="text-white"${_scopeId}>\u5DE5\u5177\u7C7B\u4E0D\u9002\u5408\u5728\u624B\u673A\u7AEF\u4E0A\u663E\u793A</h2></div>`);
          } else {
            return [
              vue_cjs_prod.createVNode("div", { class: "hidden lg:block" }, [
                vue_cjs_prod.createVNode("main", { class: "tailwind-to-daisyui flex" }, [
                  vue_cjs_prod.createVNode("div", {
                    ref_key: "leftEditorElement",
                    ref: leftEditorElement,
                    class: "w-1/2"
                  }, null, 512),
                  vue_cjs_prod.createVNode("div", {
                    class: "w-1/2 lang-editor",
                    ref_key: "rightEditorElement",
                    ref: rightEditorElement
                  }, null, 512)
                ])
              ]),
              vue_cjs_prod.createVNode("div", { class: "prose flex justify-center items-center h-full lg:hidden" }, [
                vue_cjs_prod.createVNode("h2", { class: "text-white" }, "\u5DE5\u5177\u7C7B\u4E0D\u9002\u5408\u5728\u624B\u673A\u7AEF\u4E0A\u663E\u793A")
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
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tools/tailwind-to-daisyui/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main
}, Symbol.toStringTag, { value: "Module" }));

export { entry$1 as default };
//# sourceMappingURL=server.mjs.map
