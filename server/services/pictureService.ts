import fileUpload from "express-fileupload";
import path from "path";
import fs from 'fs';
import models from "../models/models";
import ImageService from "./imageService";
import { IPictureInfo, IPictureInstance } from "../interfaces/pictureInterfaces";
import ApiError from "../apiError/apiError";
import { IPictureTag } from "../interfaces/tagInterfaces";
import PictureTagService from "./pictureTagService";
import PictureInfoService from "./pictureInfoService";
import PictureValidator from "../validator/pictureValidator";
import PictureTypeService from "./pictureTypeService";
import sequelize from "sequelize";
import { Op } from "sequelize";
import { ICreatePictureService } from "../interfaces/services/pictureServicesInterfaces";



class PictureService {
  static async getPictureById(pictureId: number) {
    const picture = await models.Picture.findOne({
      where:
        { id: pictureId },
      attributes: {
        include: [[sequelize.fn("COUNT", sequelize.col("comments")), "rootCommentsAmount"]]
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
    if (!page) {
      page = 1
    }
    if (!limit) {
      limit = 10
    }
    let orderParam;

    try {
      orderParam = Array.isArray(sort) ? sort : JSON.parse(sort);
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

    let pictures = await models.Picture.findAll({
      include: [
        {
          model: models.User,
          as: "user",
          attributes: ["nickname"],
        },
        {
          model: models.PictureTag,
          as: "tags",
          attributes: ["text"],
          through: {
            attributes: [],
          },
        },
        {
          model: models.PictureInfo,
          as: "pictureInfos",
          attributes: [],
        }

      ],
      where: whereStatement,
      order: [[sequelize.col(orderParam[0]), orderParam[1]]],
      attributes: {
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM "pictureLikes" WHERE "pictureLikes"."pictureId"=picture.id)'), 'likesAmount'],
          [sequelize.literal('(SELECT COUNT(*) FROM comments WHERE comments."pictureId"=picture.id)'), 'commentsAmount']
        ]
      },
    });

    const picturesCount = pictures.length;
    console.log(page, limit);
    pictures = pictures.slice((page - 1) * limit, ((page - 1) * limit) + limit);

    return { count: picturesCount, rows: pictures };
  }

  static async createPicture(
    userId: number,
    nickname: string,
    img: fileUpload.UploadedFile,
    mainTitle: string,
    description: string,
    pictureTypeId: number,
    pictureInfos: IPictureInfo[],
    pictureTags: IPictureTag[]): Promise<ICreatePictureService> {
    const imgName = ImageService.generateImageName(img);

    const createdPicture = await models.Picture.create({
      userId: userId,
      img: imgName,
      mainTitle: mainTitle?.trim(),
      description: description?.trim(),
      pictureTypeId
    }).catch(e => {
      if (e.name === "SequelizeForeignKeyConstraintError"
        && e.parent.code === "23503") {
        if (e.parent.constraint.includes("pictureTypeId")) {
          throw ApiError.badRequest("Incorrect pictureType id");
        } else if (e.parent.constraint.includes("userId")) {
          throw ApiError.badRequest("Incorrect user id");
        }
      }
      if (e.name === "SequelizeValidationError") {
        throw ApiError.badRequest(e.message)
      }

      throw ApiError.badRequest(e.message)
    });

    if (imgName) {
      img.mv(path.resolve(__dirname, "..", "static", "img", "picture", imgName));
    }

    let errors: string[] = [];

    pictureInfos && Array.isArray(pictureInfos) && await Promise.all(pictureInfos.map(async (pictureInfo) => {
      const createPictureInfoErrors = await PictureInfoService.createPictureInfo(createdPicture.id, pictureInfo);
      errors = [...errors, ...createPictureInfoErrors]
    }));

    pictureTags && Array.isArray(pictureTags) && await Promise.all(pictureTags.map(async (pictureTag) => {
      const createPictureTagsErrors = await PictureTagService.createPictureTagConnection(createdPicture.id, pictureTag.text);
      errors = [...errors, ...createPictureTagsErrors]
    }));

    return {
      picture: {
        ...(createdPicture as any).dataValues,
        user: { nickname },
        commentsAmount: 0,
        likesAmount: 0
      },
      errors
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

    const pictureToEdit = await models.Picture.findOne({ where: { id: pictureId, userId } });

    if (!pictureToEdit) {
      throw ApiError.badRequest("Picture you want to edit doesn't exist, or you are not the creator of this picture");
    }

    const imgName = ImageService.generateImageName(img);
    const prevImgName = pictureToEdit.img;



    await pictureToEdit.update({
      img: imgName || undefined,
      mainTitle,
      description,
      pictureTypeId
    }).catch(e => {
      if (e.name === "SequelizeForeignKeyConstraintError") {
        throw ApiError.badRequest(e.parent.detail);
      }
      throw ApiError.badRequest(e.message);

    });

    if (imgName) {
      await img.mv(path.resolve(__dirname, "..", "static", "img", "picture", imgName)).catch(() => {
        throw ApiError.badRequest("Loading image failed, picture editing interrupted");
      });

      if (pictureToEdit.img) {
        fs.unlink(path.resolve(__dirname, "..", "static", "img", "picture", prevImgName), () => { });
      }

    }

    let errors: string[] = []

    pictureInfos && Array.isArray(pictureInfos) && await Promise.all(pictureInfos.map(async (pictureInfo) => {
      const pictureInfoErrors = await PictureInfoService.editPictureInfo(pictureToEdit.id, pictureInfo);
      errors = [...errors, ...pictureInfoErrors]
    }));

    pictureTags && Array.isArray(pictureTags) && await Promise.all(pictureTags.map(async (pictureTag) => {
      const processErrors = await PictureTagService.createPictureTagConnection(pictureToEdit.id, pictureTag.text);
      errors = [...errors, ...processErrors]
    }));

    return { picture: await this.getPictureById(pictureId), errors };
  }

  static async deletePicture(pictureToDelete: IPictureInstance | null, errorMessage: string) {
    if (!pictureToDelete) {
      throw ApiError.badRequest(errorMessage);
    }

    fs.unlink(path.resolve(__dirname, "..", "static", "img", "picture", pictureToDelete.img), () => { });

    await pictureToDelete.destroy();

    return { message: "Picture deleted succesfully" };
  }

  static async deleteOwnPicture(userId: number, pictureId: number) {
    const pictureToDelete = await models.Picture.findOne({ where: { id: pictureId, userId } });

    return await this.deletePicture(pictureToDelete, "Picture you want to delete doesnt exists or you are not the owner of it");
  }

  static async deleteElsesPicture(pictureId: number) {
    const pictureToDelete = await models.Picture.findOne({ where: { id: pictureId } });
    return await this.deletePicture(pictureToDelete, "Picture you want to delete doesnt exists or you are not the owner of it");
  }
}
export default PictureService;
