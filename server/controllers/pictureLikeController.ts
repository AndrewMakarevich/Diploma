import { NextFunction, Request, Response } from "express";
import PictureLikeService from "../services/pictureLikeService";

class PictureLikeController {
  static async likeInteraction(req: Request, res: Response, next: NextFunction) {
    try {
      const { pictureId } = req.body;
      const userId = (req as any).user.id;
      const response = await PictureLikeService.likeInteraction(userId, pictureId);

      return res.json(response);
    } catch (e) {
      next(e);
    }
  }
};

export default PictureLikeController;