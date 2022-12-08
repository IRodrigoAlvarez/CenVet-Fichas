export default class RutUtils {
  static clean(rut) {
    return typeof rut === "string"
      ? rut.replace(/^0+|[^0-9kK]+/g, "").toUpperCase()
      : "";
  }

  static formatRut(rut) {
    if (!rut) return "";
    var value = rut.toString();
    value = RutUtils.clean(value);
    let rutAux = value;
    var result =
      value.length > 1
        ? rutAux.slice(-4, -1) + "-" + rutAux.substr(rutAux.length - 1)
        : value;
    for (var i = 4; i < rutAux.length; i += 3) {
      result = rutAux.slice(-3 - i, -i) + "." + result;
    }
    return result;
  }

  static validateRut(rut) {
    if (!rut) {
      return true;
    }
    if (!/^0*(\d{1,3}(\.?\d{3})*)-?([\dkK])$/.test(rut)) {
      return false;
    }
    rut = RutUtils.clean(rut);
    var sinDv = parseInt(rut.slice(0, -1), 10);
    var m = 0;
    var s = 1;
    while (sinDv > 0) {
      s = (s + (sinDv % 10) * (9 - (m++ % 6))) % 11;
      sinDv = Math.floor(sinDv / 10);
    }
    const dv = s > 0 ? "" + (s - 1) : "K";
    return dv === rut.slice(-1);
  }
}
