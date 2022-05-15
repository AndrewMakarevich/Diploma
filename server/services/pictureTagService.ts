import sequelize from "sequelize";
import { Op } from "sequelize";
import ApiError from "../apiError/apiError";
import models from "../models/models";
import PictureValidator from "../validator/pictureValidator";

class PictureTagService {
  static async getTagsByText(tagText: string) {
    if (!tagText?.split(' ').join('')) {
      return null;
    }

    const processedTagText = tagText.split(' ').join('').toLowerCase();
    let tags = await models.PictureTag.findAll(
      {
        where: { text: { [Op.regexp]: processedTagText } },
        attributes: {
          include: [
            "id", "text",
            [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM "picturesTags" WHERE "picturesTags"."pictureTagId"="pictureTag".id)'), "attachedPicturesAmount"]
          ]
        },
        limit: 5
      }
    );

    return tags;
  }

  static async addTag(tagText: string) {
    tagText = tagText.split(" ").join("").toLowerCase();

    PictureValidator.validatePictureTag(tagText, true);

    const alreadyExTag = await models.PictureTag.findOne({
      where: {
        text: tagText
      }
    });

    if (alreadyExTag) {
      throw ApiError.badRequest("Such tag is already exists");
    }

    await models.PictureTag.create({
      text: tagText
    }).catch(e => {
      throw ApiError.badRequest(e);
    });

    return { message: "Tag created succesfully" };
  }

  static async deleteTag(tagId: number) {
    await models.PictureTag.destroy({ where: { id: tagId } }).catch(e => {
      throw ApiError.badRequest(e);
    });

    return { message: "Tag deleted successfully" }
  }

  static async createPictureTagConnection(pictureId: number, tagText: string) {
    let errors: string[] = []
    const processedTagText = tagText.split(" ").join("").toLowerCase();

    let tag = await models.PictureTag.findOne({ where: { text: processedTagText } });

    // if tag is already exists, trying to find connection between them and picture
    if (tag) {
      const pictureTagConnection = await models.PicturesTags.findOne({
        where: {
          pictureId: pictureId,
          pictureTagId: tag.id
        }
      });
      // if connection between them doesn't exists, create it
      if (!pictureTagConnection) {
        await models.PicturesTags.create({
          pictureId: pictureId,
          pictureTagId: tag.id
        });
      }

      return errors;
    }

    // If tag with such text doesn't exists, create them and connect with the picture
    await models.PictureTag.create({ text: processedTagText }).then(async (tag) => {
      await models.PicturesTags.create({
        pictureId: pictureId,
        pictureTagId: tag.id
      });
    }).catch(e => {
      errors = [...errors, ...e.errors.map((error: any) => error.message)]
    });

    return errors;
  }

  static async deletePictureTagConnection(userId: number, pictureId: number, tagIdValueOrArray: string) {
    let tagIdValOrArr: number | number[];

    try {
      tagIdValOrArr = JSON.parse(tagIdValueOrArray);
    } catch (e: any) {
      if (Array.isArray(tagIdValueOrArray)) {
        tagIdValOrArr = tagIdValueOrArray;
      } else {
        throw ApiError.badRequest(e.message);
      }
    }

    const picture = await models.Picture.findOne({ where: { id: pictureId } });

    if (!picture) {
      throw ApiError.badRequest("Picture with such id doesn't exists");
    }

    if (+userId !== +picture.userId) {
      throw ApiError.badRequest("You are not the author of these picture");
    }

    let errors: string[] = []

    async function deletePictureTagConnectionByTagId(tagId: number, pictureId: number) {
      await models.PicturesTags.destroy({
        where: {
          pictureId: pictureId,
          pictureTagId: tagId
        }
      }).catch(e => {
        errors = [...errors, ...e.errors.map((error: any) => error.message)]
      });

      return errors;
    }

    if (Array.isArray(tagIdValOrArr)) {

      for (let tagId of tagIdValOrArr) {
        await deletePictureTagConnectionByTagId(tagId, picture.id);
      }

      return { errors };
    }

    const destroyConnectionErrors = await deletePictureTagConnectionByTagId(tagIdValOrArr, picture.id);
    return { errors: destroyConnectionErrors };
  };
};

export default PictureTagService;