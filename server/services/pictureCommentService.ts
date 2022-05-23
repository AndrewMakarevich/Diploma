import sequelize, { LogicType, OrderItem, Sequelize, SequelizeScopeError } from "sequelize";
import { Op } from "sequelize";
import ApiError from "../apiError/apiError";
import { IGetCommentsCursor } from "../interfaces/services/pictureCommentServiceInterfaces";
import models from "../models/models";
import { getCursorStatement } from "../utils/services/keysetPaginationHelpers";

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

  static async getComments(pictureId: number, commentId: number, cursor: IGetCommentsCursor, limit: number = 10) {
    if (!limit) {
      limit = 10
    }

    const literals = [
      {
        name: "childCommentsAmount",
        string: '(SELECT COUNT(*) FROM comments WHERE comments."commentId"=comment.id)'
      },
      {
        name: "commentLikesAmount",
        string: '(SELECT COUNT(*) FROM "commentLikes" WHERE "commentLikes"."commentId"=comment.id)'
      },
    ]

    let cursorStatement = {};

    if (cursor.value && cursor.id) {
      const { id, key, order, value } = cursor;
      if (key === literals[0].name) {
        cursorStatement = getCursorStatement(key, id, value, order, {}, literals[0].string);
      } else if (key === literals[1].name) {
        cursorStatement = getCursorStatement(key, id, value, order, {}, literals[1].string);
      } else {
        cursorStatement = getCursorStatement(key, id, value, order, {});
      }
    }
    const orderParams = [[sequelize.col(cursor.key), cursor.order], [sequelize.col("id"), cursor.order]];

    const comments = await models.Comment.findAll({
      where: { ...cursorStatement, pictureId, commentId: commentId || null },
      attributes: {
        include:
          [
            [sequelize.literal(literals[0].string), literals[0].name],
            [sequelize.literal(literals[1].string), literals[1].name]
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
      order: [
        orderParams[0] as OrderItem,
        orderParams[1] as OrderItem
      ],
      limit
    }).catch((e) => {
      if (e.name === "SequelizeForeignKeyConstraintError" && e.parent.code === "23503" && e.parent.constraint.includes("pictureId")) {
        throw ApiError.badRequest("Picture from whom you want to get commentaries from doesn't exists");
      }

      throw ApiError.badRequest(e.message)
    });

    const commentsCount = await models.Comment.count({ where: { pictureId, commentId: commentId || null } })

    return { count: commentsCount, rows: comments };
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