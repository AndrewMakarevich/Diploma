import { NextFunction, Request, Response } from "express";
import { IGetCommentsCursor } from "../interfaces/services/pictureCommentServiceInterfaces";
import PictureCommentService from "../services/pictureCommentService";

class PictureCommentController {
  static async getCommentById(req: Request, res: Response, next: NextFunction) {
    try {
      const { commentId } = req.params;
      const response = await PictureCommentService.getCommentById(Number(commentId));

      return res.json(response);
    } catch (e) {
      next(e);
    }
  };

  static async getComments(req: Request, res: Response, next: NextFunction) {
    try {
      const { pictureId, commentId, cursor, limit } = req.query;
      const response = await PictureCommentService.getComments(
        Number(pictureId),
        Number(commentId),
        JSON.parse(String(cursor)) as IGetCommentsCursor,
        Number(limit));

      return res.json(response);
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  static async addComment(req: Request, res: Response, next: NextFunction) {
    try {
      const { pictureId, commentId, text } = req.body;
      const userId = (req as any).user.id;
      const response = await PictureCommentService.addComment(pictureId, commentId, userId, text);

      return res.json(response);
    } catch (e) {
      next(e);
    }
  };

  static async editComment(req: Request, res: Response, next: NextFunction) {
    try {
      const { commentId, text } = req.body;
      const userId = (req as any).user.id;

      const response = await PictureCommentService.editComment(userId, commentId, text);

      return res.json(response);
    } catch (e) {
      next(e);
    }
  };

  static async deleteComment(req: Request, res: Response, next: NextFunction) {
    try {
      const { commentId } = req.params;
      console.log(commentId);
      const userId = (req as any).user.id;

      const response = await PictureCommentService.deleteComment(userId, Number(commentId));

      return res.json(response);
    } catch (e) {
      next(e);
    }
  };
};

export default PictureCommentController;