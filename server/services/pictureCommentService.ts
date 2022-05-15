import sequelize, { Sequelize, SequelizeScopeError } from "sequelize";
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

  static async getComments(pictureId: number, commentId: number, page: number = 1, limit: number = 10) {
    if (!page) {
      page = 1;
    }

    if (!limit) {
      limit = 10
    }

    const offsetValue = ((page - 1) * limit);

    const comments = await models.Comment.findAndCountAll({
      where: { pictureId, commentId: commentId || null },
      attributes: {
        include:
          [
            [sequelize.literal("(SELECT COUNT(*) FROM comments WHERE comments.\"commentId\"=comment.id)"), "childCommentsAmount"]
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
      ],
      distinct: true,
      limit,
      offset: offsetValue
    }).catch((e) => {
      if (e.name === "SequelizeForeignKeyConstraintError" && e.parent.code === "23503" && e.parent.constraint.includes("pictureId")) {
        throw ApiError.badRequest("Picture from whom you want to get commentaries from doesn't exists");
      }

      throw ApiError.badRequest(e.message)
    });

    return comments;
  };

  static async addComment(pictureId: number, commentId: number, userId: number, text: string) {
    if (commentId) {
      const parentComment = await models.Comment.findOne({ where: { id: commentId, pictureId } });

      if (!parentComment) {
        throw ApiError.badRequest("Parent comment, to whom you want to add comment doesn't exists, or this comment left not on this picture");
      };
    };

    const comment = await models.Comment.create({
      text,
      userId,
      commentId,
      pictureId
    }).catch(e => {
      if (e.name === "SequelizeForeignKeyConstraintError" && e.parent.code === "23503") {
        if (e.parent.constraint.includes("pictureId")) {
          throw ApiError.badRequest("Picture you want to comment doesn't exists");
        }
        if (e.parent.constraint.includes("commentId")) {
          throw ApiError.badRequest("Incorrect paren comment id recieved");
        }

        throw ApiError.badRequest(e.parent.detail)
      }

      throw ApiError.badRequest(e.message);
    });

    return { message: "Comment created succesfully", comment }
  };

  static async editComment(userId: number, commentId: number, text: string) {
    const updateRecordsAmount = await models.Comment.update({ text }, { where: { id: commentId, userId } }).catch(e => {
      if (e.name === "SequelizeValidationError") {
        throw ApiError.badRequest(e.message)
      }

      if (e.name === "SequelizeForeignKeyConstraintError") {
        if (e.parent.constraint.includes("userId")) {
          throw ApiError.badRequest("Incorrect user id");
        } else if (e.parent.constraint.includes("id")) {
          throw ApiError.badRequest("Can't find comment with such id");
        }
        throw ApiError.badRequest(e.parent.detail);
      }

      throw ApiError.badRequest(e.message)
    });

    if (updateRecordsAmount[0] === 0) {
      throw ApiError.badRequest("Incorrect comment id recieved")
    }

    return { message: "Comment edited successfully" };
  };

  static async deleteComment(userId: number, commentId: number) {
    // User id takes from jwt access token,when after auth middleware check user authorization 
    //by token verification and puts result into user property user's data

    const comment = await models.Comment.findOne({ where: { id: commentId } });

    if (!comment) {
      throw ApiError.badRequest("Comment you want to delete doesn't exists");
    };

    const picture = await models.Picture.findOne({ where: { id: comment.pictureId } });

    if (!picture) {
      throw ApiError.badRequest("Picture in what you want to delete comment doesn't exists");
    }


    if (picture.userId !== userId && comment.userId !== userId) {
      throw ApiError.badRequest("You can't delete this commentary, because you are nor the author of the picture nor the author of the comment");
    }

    await comment.destroy();

    return { message: "Comment deleted successfully" };
  }
};

export default PictureCommentService;