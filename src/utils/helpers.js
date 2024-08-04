export function camelToSnake(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    acc[key.replace(/([A-Z])/g, "_$1").toLowerCase()] = obj[key];
    return acc;
  }, {});
}
