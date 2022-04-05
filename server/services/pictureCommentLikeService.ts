import ApiError from "../apiError/apiError";
import models from "../models/models";

class pictureCommentLikeService {
  static async likeInteraction(commentId: number, userId: number) {
    const user = await models.User.findOne({ where: { id: userId } });

    if (!user) {
      throw ApiError.badRequest("User from whom you try to like a commentary, doesn't exists");
    };

    const comment = await models.Comment.findOne({ where: { id: commentId } });

    if (!comment) {
      throw ApiError.badRequest("Commentary you try interact with doesn't exists");
    };

    const commentLike = await models.CommentLike.findOne({ where: { userId, commentId } });

    if (commentLike) {
      await commentLike.destroy();
      return { message: "Like from you to this comment removed successfully" }
    };

    await models.CommentLike.create({
      userId, commentId
    });

    return { message: "Like from you to this comment added successfully" }
  }
}

export default pictureCommentLikeService;