import ApiError from "../apiError/apiError";
import { IPictureInfo } from "../interfaces/pictureInterfaces";
import models from "../models/models";

class PictureInfoService {
  private static parseSequelizeErrorArr(errArr: any[]) {
    return errArr.map((error: any) => error.message + (error.value ? `. Incorrect value: ${error.value}` : ""))
  }

  static async createPictureInfo(pictureId: number, pictureInfoObj: IPictureInfo) {
    let errors: string[] = [];

    await models.PictureInfo.create({
      pictureId: pictureId,
      title: pictureInfoObj.title.trim(),
      description: pictureInfoObj.description.trim()
    }).catch((e) => {
      errors = [...errors, ...this.parseSequelizeErrorArr(e.errors)]
    });
    return errors;
  }

  static async editPictureInfo(pictureId: number, pictureInfoObj: IPictureInfo) {
    let errors: string[] = [];

    const pictureInfo = await models.PictureInfo.findOne({
      where: {
        id: pictureInfoObj.id,
        pictureId: pictureId
      }
    });


    if (pictureInfo) {
      await pictureInfo.update({
        title: pictureInfoObj.title?.trim(),
        description: pictureInfoObj.description?.trim()
      }).catch((e) => {
        errors = [...errors, ...this.parseSequelizeErrorArr(e.errors)]
      });
      return errors;
    }
    await models.PictureInfo.create({
      pictureId: pictureId,
      title: pictureInfoObj.title?.trim(),
      description: pictureInfoObj.description?.trim()
    }).catch((e) => {
      errors = [...errors, ...this.parseSequelizeErrorArr(e.errors)]
    });

    return errors;
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

    let errors: string[] = []

    async function deletePictureInfoById(id: number) {
      await models.PictureInfo.destroy({ where: { id } }).catch(e => {
        errors = [...errors, ...PictureInfoService.parseSequelizeErrorArr(e.errors)]
      });
    }

    if (Array.isArray(pictureInfoIdArrOrVal)) {
      for (let pictureInfoId of pictureInfoIdArrOrVal) {
        try {
          await deletePictureInfoById(pictureInfoId)
        } catch (e) {
          continue;
        }
      }
      return { errors };
    }


    await deletePictureInfoById(pictureInfoIdArrOrVal);
    return { message: "Picture info section deleted successfully" };
  }
}

export default PictureInfoService;