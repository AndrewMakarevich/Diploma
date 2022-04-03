import { NextFunction, Request, Response } from "express";
import PictureCommentService from "../services/pictureCommentService";

class PictureCommentController {
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
      const { commentId } = req.query;
      const userId = (req as any).user.id;

      const response = await PictureCommentService.deleteComment(userId, Number(commentId));

      return res.json(response);
    } catch (e) {
      next(e);
    }
  };
};

export default PictureCommentController;