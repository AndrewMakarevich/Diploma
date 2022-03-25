import fileUpload from "express-fileupload";
import path from "path";
import models from "../models/models";
import ImageService from "./imageService";
import { IPictureInfo } from "../interfaces/pictureInterfaces";
import ApiError from "../apiError/apiError";



class PictureService {
  static async createPicture(
    userId: number,
    img: fileUpload.UploadedFile,
    mainTitle: string,
    description: string,
    pictureInfos: IPictureInfo[]) {
    const creator = await models.User.findOne({ where: { id: userId } });

    if (!creator) {
      throw ApiError.badRequest("The User from whom you want to publish picture doesn't exists");
    }

    const imgName = ImageService.generateImageName(img);

    if (imgName) {
      img.mv(path.resolve(__dirname, "..", "static", "img", "picture", imgName));
    }

    await models.Picture.create({
      userId: creator.id,
      img: imgName,
      mainTitle,
      description
    });

    pictureInfos.forEach(async (pictureInfo) => {
      await models.PictureInfo.create({
        title: pictureInfo.title,
        description: pictureInfo.description
      });
    });

    return { message: "Picture added successfully" };

  }

}
export default PictureService;