import ApiError from "../apiError/apiError";

class PictureValidator {
  private static validateText(regExp: string, minLength: number, maxLength: number, paramName: string, paramValue: string, throwError: boolean) {
    if (paramValue === undefined || paramValue === null) {
      return;
    }

    if (!paramValue.split(" ").join("")) {
      throw ApiError.badRequest("Row, fully consisted from spaces doesn't allowed");
    }

    const regEx = new RegExp(`\^${regExp}\{${minLength},${maxLength}\}\$`);

    if (!regEx.test(paramValue)) {

      if (throwError) {
        throw ApiError.badRequest(`${paramName} doesn't match the specified pattern: ${regExp} symbols available, with length from ${minLength} to ${maxLength || "infinite"} symbols`)
      }

      return false;
    }

    return true;
  }

  static validatePictureMainTitle(titleValue: string, throwError: boolean) {
    return this.validateText("\[a-zA-Z0-9\\s-&!?(){}\/\"'<>,~@\]", 2, 35, "Main title", titleValue, throwError);
  }

  static validatePictureMainDescription(descriptionValue: string, throwError: boolean) {
    return this.validateText("\[a-zA-Z0-9\\s-&!?(){}\/\"'<>,~@:\]", 3, 1000, "Picture main description", descriptionValue, throwError);
  }

  static validatePictureInfoTitle(titleValue: string, throwError: boolean) {
    return this.validateText("\[a-zA-Z0-9\\s-&!?(){}\/\"'<>,~@\]", 2, 65, "Main title", titleValue, throwError);
  }

  static validatePictureInfoDescription(descriptionValue: string, throwError: boolean) {
    return this.validateText("\[a-zA-Z0-9\\s-&!?(){}\/\"'<>,~@\]", 2, 450, "Main title", descriptionValue, throwError);
  }


  static validatePictureTag(tagText: string, throwError: boolean) {
    const regEx = /^[a-zA-Z0-9\s]{3,20}$/;

    if (!regEx.test(tagText)) {

      if (throwError) {
        throw ApiError.badRequest("Tag text doesn't assign to the required pattern: only latin letters, numbers, with length from 3 to 20");
      }

      return false;
    }

    return true;
  }

  static validatePictureType(typeName: string, throwError: boolean) {
    return this.validateText("\[a-zA-Z0-9\\s\]", 3, 25, "Picture type", typeName, throwError);
  }

  static validatePictureComment(commentText: string, throwError: boolean) {
    return this.validateText("\[a-zA-Z0-9\\s-&!?(){}\/\"'<>,~@^_.\]", 4, 450, "Comment text", commentText, throwError);
  }
}

export default PictureValidator;