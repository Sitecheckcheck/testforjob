import CryptoJS from "crypto-js";

export const getFilterProducts = async (params, count, setAllProducts) => {
  const format = (digit) => {
    return digit.toString().padStart(2, "0");
  };

  function password() {
    const date = new Date();
    const password =
      "Valantis_" +
      date.getFullYear() +
      format(date.getMonth() + 1) +
      format(date.getDate());
    const token = CryptoJS.MD5(password).toString();
    return token;
  }

  let res1 = await fetch("https://api.valantis.store:41000/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Auth": password(),
    },
    body: JSON.stringify({
      action: "filter",
      params: params,
    }),
  });

  if (!res1.ok) {
    console.error(res1.statusText);
    res1 = await fetch("https://api.valantis.store:41000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth": password(),
      },
      body: JSON.stringify({
        action: "filter",
        params: params,
      }),
    });
  }
  const data1 = await res1.json();
  setAllProducts(data1.result.length);
  data1.result.splice(count);
  data1.result.splice(0, count - 50);

  let res2 = await fetch("https://api.valantis.store:41000/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Auth": password(),
    },
    body: JSON.stringify({
      action: "get_items",
      params: { ids: data1.result },
    }),
  });

  if (!res2.ok) {
    console.error(res2.statusText);
    res2 = await fetch("https://api.valantis.store:41000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth": password(),
      },
      body: JSON.stringify({
        action: "get_items",
        params: { ids: data1.result },
      }),
    });
  }

  const data2 = await res2.json();

  const data3 = data2.result?.filter(
    (obj, idx, arr) => idx === arr.findIndex((t) => t.id === obj.id)
  );

  return data3;
};
