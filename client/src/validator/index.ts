export function validateText(
  paramName: string,
  paramValue: string,
  regExpString: string,
  minLength: number,
  maxLength: number,
  throwError: boolean,
  errorMessage: string) {
  const regEx = new RegExp(regExpString, "gi");
  console.log(regEx);

  if (!paramValue.split(" ").join("")) {
    if (throwError) {
      throw Error(`${paramName}, fully consisted from spaces doesn't allowed`);
    };

    return false;
  };

  if (paramValue.length < minLength) {
    if (throwError) {
      throw Error(`${paramName} is too short, minimal length: ${minLength}`);
    };

    return false;
  };

  if (paramValue.length > maxLength) {
    if (throwError) {
      throw Error(`${paramName} is too long, maximum length: ${maxLength}`);
    };

    return false;
  };

  if (!regEx.test(paramValue)) {
    if (throwError) {
      throw Error(errorMessage)
    };

    return false;
  };

  return true;
};