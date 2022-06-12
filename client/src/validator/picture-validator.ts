import { validateText } from ".";

export class PictureValidator {
  static checkMainTitle(paramValue: string, throwError: boolean) {
    return validateText(
      "Main title",
      paramValue,
      "^[a-zA-Z0-9\\s-&!?(){}'<>,~@\"]{2,35}$",
      2, 35, throwError,
      `Main title "${paramValue}" doesn't match the specified pattern, symbols a-zA-Z0-9-&!?(){}'<>,~@\" allowed, with length from 2 to 35`);
  }

  static checkMainDescription(paramValue: string, throwError: boolean) {
    return validateText(
      "Main description",
      paramValue,
      "^[a-zA-Z0-9\\s-&!?(){}'<>,~@\":]{2,1000}$",
      2, 1000, throwError,
      `Main description "${paramValue}" doesn't match the specified pattern, symbols a-zA-Z0-9-&!?(){}'<>,~@\": allowed, with length from 2 to 1000`
    )
  }

  static checkAdditionalTitle(paramValue: string, throwError: boolean) {
    return validateText(
      "Additional title",
      paramValue,
      "^[a-zA-Z0-9\\s-&!?(){}'<>,~@\"]{2,25}$",
      2, 25, throwError,
      `Additional title "${paramValue}" doesn't match the specified pattern, symbols a-zA-Z0-9-&!?(){}'<>,~@" allowed, with length from 2 to 25`);
  }

  static checkAdditionalDescription(paramValue: string, throwError: boolean) {
    return validateText(
      "Additional description",
      paramValue,
      "^[a-zA-Z0-9\\s-&!?(){}'<>,~@\":]{2,450}$",
      2, 450, throwError,
      `Additional description "${paramValue}" doesn't match the specified pattern, symbols a-zA-Z0-9-&!?(){}'<>,~@": allowed, with length from 2 to 450`
    )
  }
}