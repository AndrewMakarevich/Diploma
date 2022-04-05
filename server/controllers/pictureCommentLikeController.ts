import { NextFunction, Request, Response } from "express";
import pictureCommentLikeService from "../services/pictureCommentLikeService";

class PictureCommentLikeController {
  static async likeInteraction(req: Request, res: Response, next: NextFunction) {
    try {
      const { commentId } = req.body;
      const userId = (req as any).user.id;
      const response = await pictureCommentLikeService.likeInteraction(commentId, userId);

      return res.json(response);
    } catch (e) {
      next(e);
    }
  }
}

export default PictureCommentLikeController;