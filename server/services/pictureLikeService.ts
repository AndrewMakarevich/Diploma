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
      return { message: "Like from you to this picture removed successfully" }
    }

    await models.PictureLike.create(
      {
        userId,
        pictureId
      }
    );

    return { message: "Like from you to this picture added successfully" }
  }
};

export default PictureLikeService;