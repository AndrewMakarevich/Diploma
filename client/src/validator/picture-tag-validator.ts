class PictureTagValidator {
  static validateTagText(tagText: string, alert = true) {
    tagText = tagText.split(" ").join("");
    if (!tagText.split(" ").join("")) {
      if (!alert) {
        return false;
      }
      throw Error("Tag that consists of only spaces is not allowed");
    }
    if (!/^[a-zA-Z0-9\s]{3,25}$/.test(tagText)) {
      if (!alert) {
        return false;
      }
      throw Error(`Tag text "${tagText}" doesn't match to the specified pattern. A-Za-z0-9 symbols availible, with length from 3 to 25 symbols`);
    }

    return true;
  }
};

export default PictureTagValidator;