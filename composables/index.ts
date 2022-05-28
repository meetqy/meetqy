export const useBaseFetch = (url, options?: {}) =>
  $fetch(`http://35.220.250.52:1337${url}`, options);
