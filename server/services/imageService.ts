import fileUpload from "express-fileupload";
import { v4 } from "uuid";

class ImageService {
  static generateImageName(image: fileUpload.UploadedFile) {
    if (!image) {
      return undefined;
    }

    const fileExtension = image.name.match(/\.(jpg|jpeg|png|webm)$/);

    if (!fileExtension) {
      return undefined;
    }
    return `${v4()}${fileExtension[0]}`;
  }
}
export default ImageService;