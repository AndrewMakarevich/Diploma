
import sequelize, { OrderItem } from "sequelize";
import { Op } from "sequelize";
import ApiError from "../apiError/apiError";
import { IGetTagsCursor } from "../interfaces/services/pictureTagsServiceInterfaces";
import models from "../models/models";
import { getCursorStatement } from "../utils/services/keysetPaginationHelpers";

const baseCursorValue: IGetTagsCursor = {
  id: 0,
  key: "createdAt",
  order: "ASC",
  value: 0
}

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

  static async getTags(queryString: string = "", cursor: string = "", limit = 5) {
    let parsedCursor: IGetTagsCursor;
    try {
      parsedCursor = JSON.parse(cursor)
    } catch (e) {
      parsedCursor = baseCursorValue
    }
    const whereStatement = { text: { [Op.iRegexp]: queryString } };
    const orderParams = [[sequelize.col(parsedCursor.key), parsedCursor.order], [sequelize.col("id"), parsedCursor.order]];

    const literals = [
      {
        name: 'attachedPicturesAmount',
        string: '(SELECT COUNT(*) FROM "picturesTags" WHERE "picturesTags"."pictureTagId" = "pictureTag".id)'
      },
    ]

    let cursorStatement = {};

    if (parsedCursor.value && parsedCursor.id) {
      const { id, key, order, value } = parsedCursor;
      if (key === literals[0].name) {
        cursorStatement = getCursorStatement(key, id, value, order, literals[0].string);
      } else {
        cursorStatement = getCursorStatement(key, id, value, order);
      }

    }

    const tags = await models.PictureTag.findAll({
      where: { ...cursorStatement, ...whereStatement },
      attributes: {
        include: [
          [sequelize.literal(literals[0].string), literals[0].name]
        ]
      },
      order: [
        orderParams[0] as OrderItem,
        orderParams[1] as OrderItem
      ],
      limit
    });

    return { rows: tags };
  }

  static async addTag(tagText: string) {
    tagText = tagText.split(" ").join("").toLowerCase();

    const createdTag = await models.PictureTag.create({
      text: tagText
    }).catch(e => {
      if (e.name === "SequelizeUniqueConstraintError") {
        throw ApiError.badRequest(`Tag with text "${tagText}" already exists`);
      }
      throw ApiError.badRequest(e.message);
    });

    return { message: "Tag created successfully", tag: createdTag };
  }

  static async editTag(id: number, tagText: string = "") {
    tagText = tagText.split(" ").join("").toLowerCase();

    const editedTag = await models.PictureTag.update({
      text: tagText
    }, { where: { id } }).catch(error => {
      if (error.name === "SequelizeUniqueConstraintError") {
        throw ApiError.badRequest(`Tag with text "${tagText}" already exists`);
      }

      throw ApiError.badRequest(error.message);
    });

    if (editedTag[0] === 0) {
      throw ApiError.badRequest("Tag with such id doesnt exists");
    }

    return { message: "Tag edited successfully", tag: editedTag }
  }

  static async deleteTag(tagId: number) {
    const deletedTag = await models.PictureTag.destroy({ where: { id: tagId } }).catch(e => {
      throw ApiError.badRequest(e);
    });

    if (deletedTag === 0) {
      throw ApiError.badRequest("Tag you try to delete doesn't exists or have been already deleted")
    }

    return { message: "Tag deleted successfully", tag: deletedTag }
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