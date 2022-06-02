export const useCdnUrl = () => useStrapiUrl().replace("/api", "");

export const useTitle = () => {
  const cao = ["cao", "caō", "caó", "caǒ", "caò"];

  const day = new Date().getDay();

  const week = ["天", "一", "二", "三", "四", "五", "六"][day];

  return {
    title: `卧槽(w ${cao[7 % day]})，今天星期${week}`,
    cao: cao[7 % day],
    week,
    day,
  };
};
