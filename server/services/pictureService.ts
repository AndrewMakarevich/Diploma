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
import PictureTypeService from "./pictureTypeService";
import sequelize, { OrderItem, Sequelize } from "sequelize";
import { Op } from "sequelize";
import { ICreatePictureService } from "../interfaces/services/pictureServicesInterfaces";



class PictureService {
  static async getPictureById(pictureId: number) {
    const picture = await models.Picture.findOne({
      where:
        { id: pictureId },
      attributes: {
        include: [[Sequelize.fn("COUNT", sequelize.col("comments")), "rootCommentsAmount"]]
      },
      include: [
        {
          model: models.User,
          as: "user",
          attributes: ["id", "nickname", "firstName", "surname", "avatar"]
        },
        {
          model: models.PictureInfo,
          as: "pictureInfos",
          attributes: { exclude: ["pictureId"] }
        },
        {
          model: models.PictureTag,
          as: "tags",
          attributes: ["id", "text"],
          through: {
            attributes: []
          }
        },
        {
          model: models.Comment,
          as: "comments",
          where: {
            commentId: null
          },
          required: false,
          attributes: []
        }
      ],
      group: ["picture.id", "user.id", "pictureInfos.id", "tags.id"]
    });
    return picture;
  }

  static async getPictures(userId: number, pictureTypeId: number, query: string | undefined, limit: number = 10, page: number = 1, sort: string) {

    if (!limit) {
      limit = 10;
    }

    if (!page) {
      page = 1;
    }

    let orderParam: OrderItem;

    try {
      orderParam = JSON.parse(sort);
      if (Array.isArray(orderParam)) {

        if (orderParam.length !== 2) {
          orderParam = ["createdAt", "DESC"]
        }
      } else {
        orderParam = ["createdAt", "DESC"]
      }
    } catch (e: any) {
      orderParam = ["createdAt", "DESC"]
    }

    let whereStatement: { [key: string]: any } = {};

    if (userId) {
      whereStatement.userId = userId;
    }

    if (pictureTypeId) {
      whereStatement.pictureTypeId = pictureTypeId
    }

    const onlyByAuthorNickname = /^@/;
    const onlyByTags = /^#/

    if (!query || query === "@" || query === "#") {
    } else {

      if (onlyByAuthorNickname.test(query)) {

        whereStatement = {
          ...whereStatement,
          "$user.nickname$": { [Op.iRegexp]: `${query.split("@")[1] || ""}` }
        }
      } else if (onlyByTags.test(query)) {
        whereStatement = {
          ...whereStatement,
          "$tags.text$": { [Op.iRegexp]: `${query.split("#")[1] || ""}` }
        }
      } else {
        whereStatement = {
          ...whereStatement,
          [Op.or]: {
            mainTitle: { [Op.iRegexp]: `${query || ""}` },
            description: { [Op.iRegexp]: `${query || ""}` },
            "$tags.text$": { [Op.iRegexp]: `${query || ""}` },
            "$pictureInfos.title$": { [Op.iRegexp]: `${query || ""}` },
            "$pictureInfos.description$": { [Op.iRegexp]: `${query || ""}` },
          },
        };
      }
    }

    console.log(whereStatement);

    let pictures = await models.Picture.findAll({
      where: whereStatement,

      include: [
        {
          model: models.User,
          as: "user",
          attributes: ["nickname"]
        },
        {
          model: models.PictureTag,
          as: "tags",
          attributes: [],
          through: {
            attributes: [],
          },
        },
        {
          model: models.PictureInfo,
          as: "pictureInfos",
          attributes: [],
        },
        {
          model: models.PictureLike,
          as: "pictureLikes",
          attributes: [],
        },
        {
          model: models.Comment,
          as: "comments",
          attributes: []
        }
      ],
      order: [[sequelize.col((orderParam as Array<string>)[0]), (orderParam as Array<string>)[1]]],
      attributes: {
        include: [
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('pictureLikes'))), 'likesAmount'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('comments'))), 'commentsAmount']
        ]
      },
      group: ["picture.id", "user.id"]
    });

    let picturesAmount = pictures.length;

    pictures = pictures.slice((page - 1) * limit, ((page - 1) * limit) + limit);

    return { count: picturesAmount, rows: pictures };
  }

  static async createPicture(
    userId: number,
    img: fileUpload.UploadedFile,
    mainTitle: string,
    description: string,
    pictureTypeId: number,
    pictureInfos: IPictureInfo[],
    pictureTags: IPictureTag[]): Promise<ICreatePictureService> {

    if (!img || !mainTitle) {
      throw ApiError.badRequest("Image and main title are required");
    }

    mainTitle = mainTitle.trim();
    description = description?.trim();

    PictureValidator.validatePictureMainTitle(mainTitle, true);
    PictureValidator.validatePictureMainDescription(description, true);
    await PictureTypeService.checkPictureTypeExistence(pictureTypeId);

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
      description,
      pictureTypeId
    });
    pictureInfos && Array.isArray(pictureInfos) && pictureInfos.forEach(async (pictureInfo) => {
      await PictureInfoService.createPictureInfo(createdPicture.id, pictureInfo);
    });

    pictureTags && Array.isArray(pictureTags) && pictureTags.forEach(async (pictureTag) => {
      await PictureTagService.createPictureTagConnection(createdPicture.id, pictureTag.text);
    });

    return {
      message: "Picture added successfully",
      picture: {
        ...(createdPicture as any).dataValues,
        user: { nickname: creator.nickname },
        commentsAmount: 0,
        likesAmount: 0
      }
    };
  }

  static async editPicture(
    userId: number,
    pictureId: number,
    img: fileUpload.UploadedFile,
    mainTitle: string,
    description: string,
    pictureTypeId: number,
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
    await PictureTypeService.checkPictureTypeExistence(pictureTypeId);

    const imgName = ImageService.generateImageName(img);

    if (imgName) {
      await img.mv(path.resolve(__dirname, "..", "static", "img", "picture", imgName)).catch(() => {
        throw ApiError.badRequest("Loading image failed, picture editing interrupted");
      });

      if (pictureToEdit.img) {
        fs.unlink(path.resolve(__dirname, "..", "static", "img", "picture", pictureToEdit.img), () => { });
      }

    }

    await pictureToEdit.update({
      img: imgName,
      mainTitle,
      description,
      pictureTypeId
    });

    pictureInfos && Array.isArray(pictureInfos) && pictureInfos.forEach(async (pictureInfo) => {
      await PictureInfoService.editPictureInfo(pictureToEdit.id, pictureInfo);
    });

    pictureTags && Array.isArray(pictureTags) && pictureTags.forEach(async (pictureTag) => {
      await PictureTagService.createPictureTagConnection(pictureToEdit.id, pictureTag.text);
    });

    return { message: "Picture edited succesfully", picture: await this.getPictureById(pictureId) };
  }

  static async deletePicture(userId: number, pictureId: number) {
    const pictureToDelete = await models.Picture.findOne({ where: { id: pictureId, userId } });

    if (!pictureToDelete) {
      throw ApiError.badRequest("Picture you want to delete doesnt exists or you are not the owner of it");
    }

    fs.unlink(path.resolve(__dirname, "..", "static", "img", "picture", pictureToDelete.img), () => { });

    await pictureToDelete.destroy();

    return { message: "Picture deleted succesfully" };
  }

}
export default PictureService;
