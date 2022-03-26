import ApiError from "../apiError/apiError";

class PictureValidator {
  private static validateText(minLength: number, maxLength: number, paramName: string, paramValue: string, throwError: boolean) {
    const regEx = new RegExp(`\^\[a-zA-Z0-9\\s-&!?(){}\/\"'<>,~@\]\{${minLength},${maxLength || ''}\}\$`);
    console.log('REGEXP', regEx);

    if (!regEx.test(paramValue)) {

      if (throwError) {
        throw ApiError.badRequest(`${paramName} doesn't match the specified pattern: a-zA-Z0-9&!?(){}/"'<>,~@ symbols available, with length from ${minLength} to ${maxLength || "infinite"} symbols`)
      }

      return false;
    }

    return true;
  }

  static validatePictureMainTitle(titleValue: string, throwError: boolean) {
    return this.validateText(2, 65, "Main title", titleValue, throwError);
  }

  static validatePictureMainDescription(descriptionValue: string, throwError: boolean) {
    return this.validateText(0, 0, "Picture main description", descriptionValue, throwError);
  }


  static validatePictureTag(tagText: string, throwError: boolean) {
    const regEx = /^[a-zA-Z0-9]{3,20}$/;

    if (!regEx.test(tagText)) {

      if (throwError) {
        throw ApiError.badRequest("Tag text doesn't assign to the required pattern: only latin letters, numbers, with length from 3 to 20");
      }

      return false;
    }

    return true;
  }
}

export default PictureValidator;