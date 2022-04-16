import { validateText } from ".";

class CommentValidator {
  static validateCommentText(commentText: string, throwError: boolean) {
    return validateText(
      "Comment",
      commentText,
      "^[a-zA-Z0-9\\s-&!?(){}\\/\"'<>,~@^_.]{4,450}$",
      4,
      450,
      throwError,
      "Comment doesnt match the specified pattern: spaces and a-zA-Z0-9-&!?(){}/\"'<>,~@^_. symbols allowed")
  }
};

export default CommentValidator;