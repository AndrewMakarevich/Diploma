import { IPictureInfo } from "../interfaces/pictureInterfaces";
import models from "../models/models";

class PictureInfoService {
  private static async findPicture(pictureId: number) {
    const picture = await models.Picture.findOne({
      where: {
        id: pictureId
      }
    });

    return picture;
  }
  static async createPictureInfo(pictureId: number, pictureInfoObj: IPictureInfo) {
    const picture = await this.findPicture(pictureId);

    if (!picture) {
      return;
    }

    if (pictureInfoObj.title && pictureInfoObj.description) {
      await models.PictureInfo.create({
        title: pictureInfoObj.title,
        description: pictureInfoObj.description
      });
    }
    return;
  }

  static async editPictureInfo(pictureId: number, pictureInfoObj: IPictureInfo) {
    const picture = await this.findPicture(pictureId);

    if (!picture) {
      return;
    }

    const pictureInfo = await models.PictureInfo.findOne({
      where: {
        id: pictureInfoObj.id,
        pictureId: picture.id
      }
    });

    if (pictureInfo) {
      pictureInfo.update({
        title: pictureInfoObj.title,
        description: pictureInfoObj.description
      });
    }

    return;
  }
}

export default PictureInfoService;