import ApiError from "../apiError/apiError";
import models from "../models/models";

class PictureLikeService {
  static async likeInteraction(userId: number, pictureId: number) {
    const user = await models.User.findOne({ where: { id: userId } });

    if (!user) {
      throw ApiError.badRequest("User from whom you try to like a picture, doesn't exists");
    }

    const picture = await models.Picture.findOne({ where: { id: pictureId } });

    if (!picture) {
      throw ApiError.badRequest("Picture you try interact with doesn't exists");
    }

    const pictureLike = await models.PictureLike.findOne(
      {
        where: {
          userId,
          pictureId
        }
      }
    );

    if (pictureLike) {
      await pictureLike.destroy();
      return { liked: false }
    }

    await models.PictureLike.create(
      {
        userId,
        pictureId
      }
    );

    return { liked: true }
  };

  static async getPictureLikes(pictureId: number) {
    const picture = await models.Picture.findOne(
      {
        where: {
          id: pictureId
        }
      });

    if (!picture) {
      throw ApiError.badRequest("Picture with such id doesn't exists");
    };

    const pictureLikes = await models.PictureLike.findAll({
      where: { pictureId },
      attributes: ["userId"]
    });

    return pictureLikes;
  };
};

export default PictureLikeService;