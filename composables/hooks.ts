// strapi 资源地址
export const useCdnUrl = () => useStrapiUrl().replace("/api", "");

export const useIsProducton = () => process.env.NODE_ENV === "production";

export const useBaseUrl = () => {
  return useIsProducton() ? "https://wcao.cc" : "http://localhost:3000";
};

export const useTitle = () => {
  const cao = ["cao", "caō", "caó", "caǒ", "caò"];

  const day = new Date().getDay();

  const week = ["天", "一", "二", "三", "四", "五", "六"][day];

  const result = day ? 7 % day : 0;

  return {
    title: `卧槽(w ${cao[result]})`,
    cao: cao[result],
    week,
    day,
  };
};
