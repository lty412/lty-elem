/**
 * Created by Administrator on 2018/5/5.
 * 本地数据的存取
 *
 */

export function saveToLocal(id, key, value) {
  let seller = window.localStorage.__seller__;

  if (!seller) {
    seller = {};   // 设置为空对象
    seller[id] = {};   // 设置为空对象
  } else {
    seller = JSON.parse(seller);

    if (!seller[id]) {
      seller[id] = {};
    }
  }

  seller[id][key] = value;
  window.localStorage.__seller__ = JSON.stringify(seller);
};

export function loadFromLocal(id, key, def) {
  let seller = window.localStorage.__seller__;

  if (!seller) {
    return def;
  }

  seller = JSON.parse(seller)[id];

  if (!seller) {
    return def;
  }

  let ret = seller[key];

  return ret || def;
};
