import fileUpload from "express-fileupload";
import { v4 } from "uuid";
import ApiError from "../apiError/apiError";

class ImageService {
  static generateImageName(image: fileUpload.UploadedFile) {
    const fileExtension = `${image.name.match(/\.(jpg|jpeg|png|webm)$/)}`;

    if (!fileExtension) {
      return undefined;
    }
    return `${v4()}${fileExtension}`;
  }
}
export default ImageService;