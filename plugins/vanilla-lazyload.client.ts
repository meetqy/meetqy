import LazyLoad from "vanilla-lazyload";

const lazyLoadInstance = new LazyLoad({
  // Your custom settings go here
});

export default defineNuxtPlugin(() => {
  return {
    provide: {
      lazyLoadInstance,
    },
  };
});
