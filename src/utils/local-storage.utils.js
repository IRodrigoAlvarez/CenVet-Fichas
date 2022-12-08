export default class LocalStorageUtils {
  static write = (key, value) => {
    const stringValue = JSON.stringify(value);
    localStorage.setItem(key, stringValue);
  };

  static read = (key) => {
    const itemValue = localStorage.getItem(key);
    if (!itemValue) {
      return null;
    }
    return JSON.parse(itemValue);
  };

  static remove = (key) => {
    localStorage.removeItem(key);
  };
}
