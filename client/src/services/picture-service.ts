import { $authHost } from "../http";

class PictureService {
  static async createPicture(pictureInfo: FormData) {
    const response = await $authHost.post('api/picture/create', pictureInfo);
    return response;
  }
}

export default PictureService;