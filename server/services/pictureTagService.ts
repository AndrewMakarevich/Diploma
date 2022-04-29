import { Op } from "sequelize";
import ApiError from "../apiError/apiError";
import models from "../models/models";
import PictureValidator from "../validator/pictureValidator";

class PictureTagService {
  static async getTagsByText(tagText: string) {
    if (!tagText) {
      return null;
    }

    if (!tagText.split(' ').join('')) {
      return null;
    }

    const processedTagText = tagText.split(' ').join('').toLowerCase();
    let tags = await models.PictureTag.findAll(
      {
        where: { text: { [Op.regexp]: processedTagText } },
        include: [{
          model: models.Picture,
          as: "pictures",
        }],
        attributes: ["id", "text"],
        limit: 5
      }
    );

    //process each tag in result array
    tags = await Promise.all(tags.map((tag) => {
      const tagToEdit = tag.get();
      tagToEdit.pictures = tagToEdit.pictures.length;

      return tagToEdit;
    }));

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
    });

    return { message: "Tag created succesfully" };
  }

  static async deleteTag(tagId: number) {
    const tagToDelete = await models.PictureTag.findOne({ where: { id: tagId } });

    if (!tagToDelete) {
      throw ApiError.badRequest("Tag you try to delete doesn't exists");
    }

    await tagToDelete.destroy();

    return { message: "Tag deleted successfully" }
  }

  static async createPictureTagConnection(pictureId: number, tagText: string) {
    const processedTagText = tagText.split(" ").join("").toLowerCase();

    if (!PictureValidator.validatePictureTag(processedTagText, false)) {
      return;
    }

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

      return;
    }

    // If tag with such text doesn't exists, create them and connect with the picture
    tag = await models.PictureTag.create({ text: processedTagText });

    await models.PicturesTags.create({
      pictureId: pictureId,
      pictureTagId: tag.id
    });

    return;
  }

  static async deletePictureTagConnection(userId: number, pictureId: number, tagIdValueOrArray: string) {
    if (!pictureId) {
      throw ApiError.badRequest("Picture's id is required");
    }

    let tagIdValOrArr: number | number[];

    try {
      tagIdValOrArr = JSON.parse(tagIdValueOrArray);
    } catch (e: any) {
      throw ApiError.badRequest(e.message);
    }

    const picture = await models.Picture.findOne({ where: { id: pictureId } });

    if (!picture) {
      throw ApiError.badRequest("Picture with such id doesn't exists");
    }

    if (+userId !== +picture.userId) {
      throw ApiError.badRequest("You are not the author of these picture");
    }

    async function deletePictureTagConnectionByTagId(tagId: number, pictureId: number) {
      const tag = await models.PictureTag.findOne({ where: { id: tagId } });

      if (!tag) {
        throw ApiError.badRequest("Tag with such id doesn't exists");
      }

      const pictureTagConnection = await models.PicturesTags.findOne({
        where: {
          pictureId: pictureId,
          pictureTagId: tag.id
        }
      });

      if (!pictureTagConnection) {
        throw ApiError.badRequest("Picture doesn't connected with this tag");
      }

      await pictureTagConnection.destroy();
      return { message: `Connection between tag "${tag.text}" and your picture deleted successfully` };
    }

    if (Array.isArray(tagIdValOrArr)) {
      for (let tagId of tagIdValOrArr) {
        try {
          await deletePictureTagConnectionByTagId(tagId, picture.id);
        } catch (e) {
          continue;
        }
      }

      return { message: "Tags from this picture deleted successfully" };
    }

    const destroyConnectionMessage = await deletePictureTagConnectionByTagId(tagIdValOrArr, picture.id);
    return destroyConnectionMessage;
  };
};

export default PictureTagService;