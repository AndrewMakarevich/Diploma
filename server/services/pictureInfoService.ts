import ApiError from "../apiError/apiError";
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
        pictureId: picture.id,
        title: pictureInfoObj.title.trim(),
        description: pictureInfoObj.description.trim()
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
        title: pictureInfoObj.title?.trim(),
        description: pictureInfoObj.description?.trim()
      });
      return;
    }

    if (pictureInfoObj.title && pictureInfoObj.description) {
      await models.PictureInfo.create({
        pictureId: picture.id,
        title: pictureInfoObj.title.trim(),
        description: pictureInfoObj.description.trim()
      });
    }

    return;
  }

  static async deletePictureInfo(userId: number, pictureId: number, pictureInfoIdValueOrArray: string) {
    if (!pictureId) {
      throw ApiError.badRequest("Picture's id is required");
    }

    let pictureInfoIdArrOrVal: number | number[];

    try {
      pictureInfoIdArrOrVal = JSON.parse(pictureInfoIdValueOrArray);
    } catch (e: any) {
      if (Array.isArray(pictureInfoIdValueOrArray)) {
        pictureInfoIdArrOrVal = pictureInfoIdValueOrArray;
      } else {
        throw ApiError.badRequest(e.message);
      }
    }

    const picture = await models.Picture.findOne({
      where: { id: pictureId }
    });

    if (!picture) {
      throw ApiError.badRequest("Picture with such id doesnt exists");
    };

    if (+picture.userId !== +userId) {
      throw ApiError.badRequest("You are not the author of these picture");
    }

    async function deletePictureInfoById(id: number) {
      const pictureInfo = await models.PictureInfo.findOne({
        where: { id }
      });

      if (!pictureInfo) {
        throw ApiError.badRequest("Picture info with such id doesn't exists");
      };

      await models.PictureInfo.destroy({ where: { id } });

    }

    if (Array.isArray(pictureInfoIdArrOrVal)) {
      for (let pictureInfoId of pictureInfoIdArrOrVal) {
        try {
          await deletePictureInfoById(pictureInfoId)
        } catch (e) {
          continue;
        }
      }
      return { message: "Picture info sections deleted successfully" };
    }


    await deletePictureInfoById(pictureInfoIdArrOrVal);
    return { message: "Picture info section deleted successfully" };
  }
}

export default PictureInfoService;