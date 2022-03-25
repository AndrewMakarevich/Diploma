import fileUpload from "express-fileupload";
import { v4 } from "uuid";
import ApiError from "../apiError/apiError";

class ImageService {
  static generateImageName(image: fileUpload.UploadedFile) {
    if (!image) {
      return undefined;
    }
    console.log(String(image.name));
    const fileExtension = image.name.match(/\.(jpg|jpeg|png|webm)$/);
    console.log(fileExtension);

    if (!fileExtension) {
      return undefined;
    }
    return `${v4()}${fileExtension[0]}`;
  }
}
export default ImageService;