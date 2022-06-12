const checkAllowToEdit = <T extends { [key: string]: any }>(paramsToEdit: T, initialParams: T): boolean => {
  let allowToEdit = false;

  for (const key of Object.keys(paramsToEdit)) {
    if (paramsToEdit[key] !== initialParams[key]) {
      allowToEdit = true;
      break;
    }
  }
  console.log(allowToEdit)
  return allowToEdit;
}

export default checkAllowToEdit;