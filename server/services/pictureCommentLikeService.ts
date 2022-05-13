import ApiError from "../apiError/apiError";
import models from "../models/models";

class pictureCommentLikeService {
  static async likeInteraction(commentId: number, userId: number) {
    const commentLike = await models.CommentLike.findOne({ where: { userId, commentId } });

    if (commentLike) {
      await commentLike.destroy();
      return { message: "Like from you to this comment removed successfully" }
    };

    await models.CommentLike.create({
      userId, commentId
    }).catch(e => {
      if (e.parent.code === "23503" && e.parent.constraint.includes("commentId")) {
        throw ApiError.badRequest("Commentary you try interact with doesn't exists");
      }

      throw ApiError.badRequest(e.parent.detail);
    });;

    return { message: "Like from you to this comment added successfully" }
  }
}

export default pictureCommentLikeService;