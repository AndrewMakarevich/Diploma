import sequelize from "sequelize";
import ApiError from "../apiError/apiError";
import models from "../models/models";
import PictureValidator from "../validator/pictureValidator";

class PictureCommentService {
  static async getComments(pictureId: number) {
    const picture = await models.Picture.findOne({ where: { id: pictureId } });

    if (!picture) {
      throw ApiError.badRequest("Picture from whom you want to get commentaries from doesn't exists");
    };

    const comments = await models.Comment.findAll({
      where: {
        pictureId
      },
      attributes: { include: [[sequelize.fn('COUNT', sequelize.col("commentLikes")), "likesAmount"]] },
      include: [
        {
          model: models.CommentLike,
          as: "commentLikes",
          attributes: []
        }
      ],
      group: ["comment.id"]
    });

    return comments;
  }
  static async addComment(pictureId: number, commentId: number, userId: number, text: string) {
    const picture = await models.Picture.findOne({ where: { id: pictureId } });

    if (!picture) {
      throw ApiError.badRequest("Picture you want to comment doesn't exists");
    };

    const user = await models.User.findOne({ where: { id: userId } });

    if (!user) {
      throw ApiError.badRequest("User from whom you want to comment picture doesn't exists");
    }

    if (commentId) {
      const parentComment = await models.Comment.findOne({ where: { id: commentId } });

      if (!parentComment) {
        throw ApiError.badRequest("Parent comment, to whom you want to add comment doesn't exists");
      };
    };

    PictureValidator.validatePictureComment(text, true);

    await models.Comment.create({
      text,
      userId,
      commentId,
      pictureId
    });

    return { message: "Comment created succesfully" }
  };

  static async editComment(userId: number, commentId: number, text: string) {
    const user = await models.User.findOne({ where: { id: userId } });

    if (!user) {
      throw ApiError.badRequest("User you indicate as comment owner doesn't exists");
    };

    const comment = await models.Comment.findOne({ where: { id: commentId, userId } });

    if (!comment) {
      throw ApiError.badRequest("Comment you want to edit doesn't exists, or you are not the author of it");
    };

    PictureValidator.validatePictureComment(text, true);

    await comment.update({ text });

    return { message: "Commentary edited successfully" };
  };

  static async deleteComment(userId: number, commentId: number) {
    // User id takes from jwt access token,when after auth middleware check user authorization 
    //by token verification and puts result into user property user's data
    const user = await models.User.findOne({ where: { id: userId } });

    if (!user) {
      throw ApiError.badRequest("User from whom you want to delete commentary doesn't exists");
    };

    const comment = await models.Comment.findOne({ where: { id: commentId } });

    if (!comment) {
      throw ApiError.badRequest("Comment you want to delete doesn't exists");
    };

    const picture = await models.Picture.findOne({ where: { id: comment.pictureId } });

    if (!picture) {
      throw ApiError.badRequest("Picture in what you want to delete comment doesn't exists");
    }


    if (picture.userId !== user.id && comment.userId !== user.id) {
      throw ApiError.badRequest("You can't delete this commentary, because you are nor the author of the picture nor the author of the comment");
    }

    await comment.destroy();

    return { message: "Comment deleted successfully" };
  }
};

export default PictureCommentService;