export default class PictureTypeValidator {
  static validateTypeName(typeName: string, alert = true) {
    if (!typeName.split(" ").join("")) {
      if (!alert) {
        return false;
      }
      throw Error("Picture type which consists of only spaces does not allowed")
    }

    if (!/^[a-zA-Z\s]{3,35}$/.test(typeName)) {
      if (!alert) {
        return false;
      }
      throw Error("Picture type name doesn't match the specified pattern, a-zA-Z symbols and space allowed with length from 3 to 35 symbols")
    }

    return true;
  }
}