import sequelize from "sequelize";
import ApiError from "../apiError/apiError";
import models from "../models/models";
import PictureValidator from "../validator/pictureValidator";

class PictureCommentService {
  static async getCommentById(commentId: number) {
    const comment = await models.Comment.findOne({
      where: { id: commentId },
      include: [
        {
          model: models.CommentLike,
          as: "commentLikes",
          attributes: ["userId"]
        },
        {
          model: models.User,
          as: "user",
          attributes: ["avatar", "nickname"]
        },
        {
          model: models.Comment,
          as: "comments",
          attributes: []
        }
      ],
      attributes: { include: [[sequelize.fn("COUNT", sequelize.col("comments")), "childCommentsAmount"]] },
      group: ["comment.id", "commentLikes.id", "user.id"]
    });

    if (!comment) {
      throw ApiError.badRequest("Comment with such id doesn't exists");
    };

    return comment;
  };

  static async getComments(pictureId: number, commentId: number, page: number, limit: number) {
    const picture = await models.Picture.findOne({ where: { id: pictureId } });

    if (!picture) {
      throw ApiError.badRequest("Picture from whom you want to get commentaries from doesn't exists");
    };

    let whereStatement;

    if (!commentId) {
      whereStatement = {
        commentId: null,
        pictureId
      }
    } else {
      whereStatement = {
        commentId,
        pictureId
      }
    };

    const limitValue = limit || 10;
    const offsetValue = ((page - 1) * limitValue) || 0;

    const comments = await models.Comment.findAll({
      where: whereStatement,
      attributes: {
        include:
          [
            [sequelize.fn("COUNT", sequelize.fn("DISTINCT", sequelize.col("comments"))), "childCommentsAmount"],
          ]
      },
      include: [
        {
          model: models.CommentLike,
          as: "commentLikes",
          attributes: ["userId"]
        },
        {
          model: models.User,
          as: "user",
          attributes: ["avatar", "nickname"]
        },
        {
          model: models.Comment,
          as: "comments",
          attributes: []
        }
      ],
      group: ["comment.id", "commentLikes.id", "user.id"],
    });

    return { count: comments.length, rows: comments.slice(offsetValue, offsetValue + limitValue) };
  };

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
      const parentComment = await models.Comment.findOne({ where: { id: commentId, pictureId } });

      if (!parentComment) {
        throw ApiError.badRequest("Parent comment, to whom you want to add comment doesn't exists, or this comment left not on this picture");
      };
    };

    PictureValidator.validatePictureComment(text, true);

    const comment = await models.Comment.create({
      text,
      userId,
      commentId,
      pictureId
    });

    const commentObjToReturn = await models.Comment.findOne({
      where: { id: comment.id },
      include: [{
        model: models.User,
        as: "user",
        attributes: ["avatar", "nickname"]
      }],
    })

    return { message: "Comment created succesfully", comment: commentObjToReturn }
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