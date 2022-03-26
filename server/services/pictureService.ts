import fileUpload from "express-fileupload";
import path from "path";
import fs from 'fs';
import models from "../models/models";
import ImageService from "./imageService";
import { IPictureInfo } from "../interfaces/pictureInterfaces";
import ApiError from "../apiError/apiError";
import { IPictureTag } from "../interfaces/tagInterfaces";
import PictureTagService from "./pictureTagService";
import PictureInfoService from "./pictureInfoService";
import PictureValidator from "../validator/pictureValidator";



class PictureService {
  static async getPictureById(pictureId: number) {
    const picture = await models.Picture.findOne({
      where:
        { id: pictureId },
      include: [
        {
          model: models.PictureTag,
          as: "tags"
        }]
    });
    return picture;
  }

  static async createPicture(
    userId: number,
    img: fileUpload.UploadedFile,
    mainTitle: string,
    description: string,
    pictureInfos: IPictureInfo[],
    pictureTags: IPictureTag[]) {

    if (!img || !mainTitle) {
      throw ApiError.badRequest("Image and main title are required");
    }

    PictureValidator.validatePictureMainTitle(mainTitle, true);
    PictureValidator.validatePictureMainDescription(description, true);

    const creator = await models.User.findOne({ where: { id: userId } });

    if (!creator) {
      throw ApiError.badRequest("The User from whom you want to publish picture doesn't exists");
    }

    const imgName = ImageService.generateImageName(img);

    if (imgName) {
      img.mv(path.resolve(__dirname, "..", "static", "img", "picture", imgName));
    }

    const createdPicture = await models.Picture.create({
      userId: creator.id,
      img: imgName,
      mainTitle,
      description
    });

    pictureInfos && Array.isArray(pictureInfos) && pictureInfos.forEach(async (pictureInfo) => {
      await PictureInfoService.createPictureInfo(createdPicture.id, pictureInfo);
    });

    pictureTags && Array.isArray(pictureTags) && pictureTags.forEach(async (pictureTag) => {
      await PictureTagService.createPictureTagConnection(createdPicture.id, pictureTag.text);
    });

    return { message: "Picture added successfully" };
  }

  static async editPicture(
    userId: number,
    pictureId: number,
    img: fileUpload.UploadedFile,
    mainTitle: string,
    description: string,
    pictureInfos: IPictureInfo[],
    pictureTags: IPictureTag[]
  ) {
    let nothingToChange = true;

    for (let key in arguments) {
      if (key === "0" || key === "1") {
        continue
      }

      if (arguments[key] !== undefined) {
        nothingToChange = false;
        break;
      }
    }

    if (nothingToChange) {
      throw ApiError.badRequest('Nothing to change');
    }

    const pictureToEdit = await models.Picture.findOne({ where: { id: pictureId, userId } });

    if (!pictureToEdit) {
      throw ApiError.badRequest("Picture you want to edit doesn't exist, or you are not the creator of this picture");
    }

    PictureValidator.validatePictureMainTitle(mainTitle, true);
    PictureValidator.validatePictureMainDescription(description, true);

    const imgName = ImageService.generateImageName(img);

    if (imgName) {
      await img.mv(path.resolve(__dirname, "..", "static", "img", "picture", imgName)).catch(() => {
        throw ApiError.badRequest("Loading image failed, picture editing interrupted");
      });

      if (pictureToEdit.img) {
        fs.unlink(path.resolve(__dirname, "..", "static", "img", "picture", pictureToEdit.img), () => { });
      }

    }

    pictureToEdit.update({
      img: imgName,
      mainTitle,
      description
    });

    pictureInfos && Array.isArray(pictureInfos) && pictureInfos.forEach(async (pictureInfo) => {
      await PictureInfoService.editPictureInfo(pictureToEdit.id, pictureInfo);
    });

    pictureTags && Array.isArray(pictureTags) && pictureTags.forEach(async (pictureTag) => {
      await PictureTagService.createPictureTagConnection(pictureToEdit.id, pictureTag.text);
    });

    return { message: "Picture edited succesfully" };
  }

}
export default PictureService;


// [
//   {
//     "id": 1234,
//     "title":"Author",
//     "description":"Andrew Makarevich"
//   },
//   {
//     "id": 21454,
//     "title":"Year of creation",
//     "description":"2021"
//   },
//   {
//     "id": 124124,
//     "title":"About me",
//     "description":"I'm 20 years old!!"
//   },
// ]
// [
//   {
//     "id": 1234,
//     "text":"barbarian"
//   },
//   {
//     "id": 21454,
//     "text":"furious",
//   },
//   {
//     "id": 124124,
//     "text":"art",
//   },
// ]
// [{"id": 1234,"text":"cat"},{"id": 21454,"text":"furious"},{"id": 124124,"text":"anime"}];
// [{"id": 21454, "title":"About my cat","description":"She's name is Anfisa"}, {"id": 23, "title":"Year of creation:","description":"2022"}]