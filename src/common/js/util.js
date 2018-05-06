/**
 * Created by Administrator on 2018/5/5.
 * 把URL的参数解析成对象
 * @example ?id=12345&a=b
 * @return Object {id: 12345, a: b}
 *
 */
export function urlParse() {
  let url = window.location.search;
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;  // 如：?id=12345&a=b
  let arr = url.match(reg);
  // ['?id=12345', '&a=b']
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=');  // 相对于 = 分割对象
      let key = decodeURIComponent(tempArr[0]);
      let val = decodeURIComponent(tempArr[1]);
      obj[key] = val;
    });
  }
  return obj;
};
