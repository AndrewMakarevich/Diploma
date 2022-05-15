import fileUpload from "express-fileupload";
import { v4 } from "uuid";

class ImageService {
  static generateImageName(image: fileUpload.UploadedFile) {
    if (!image) {
      return null;
    }

    const fileExtension = image.name.match(/\.(jpg|jpeg|png|webm)$/i);

    if (!fileExtension) {
      return null;
    }
    return `${v4()}${fileExtension[0]}`;
  }
}
export default ImageService;