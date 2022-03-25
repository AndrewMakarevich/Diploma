import ApiError from "../apiError/apiError";
import models from "../models/models";
import PictureValidator from "../validator/pictureValidator";

class PictureTagService {
  static async addTag(tagText: string) {
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
    const picture = await models.Picture.findOne({ where: { id: pictureId } });

    if (!picture) {
      return;
    }

    if (!PictureValidator.validatePictureTag(tagText, false)) {
      return;
    }

    let tag = await models.PictureTag.findOne({ where: { text: tagText } });

    // if tag is already exists, trying to find connection between them and picture
    if (tag) {
      const pictureTagConnection = await models.PicturesTags.findOne({
        where: {
          pictureId: picture.id,
          pictureTagId: tag.id
        }
      });
      // if connection between them doesn't exists, create it
      if (!pictureTagConnection) {
        await models.PicturesTags.create({
          pictureId: picture.id,
          pictureTagId: tag.id
        });
      }

      return;
    }

    // If tag with such text doesn't exists, create them and connect with the picture
    tag = await models.PictureTag.create({ text: tagText });

    await models.PicturesTags.create({
      pictureId: picture.id,
      pictureTagId: tag.id
    });

    return;
  }
};

export default PictureTagService;