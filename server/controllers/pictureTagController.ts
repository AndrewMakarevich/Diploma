import { NextFunction, Request, Response } from "express";
import PictureTagService from "../services/pictureTagService";

class PictureTagController {
  static async getTagsByTagName(req: Request, res: Response, next: NextFunction) {
    try {
      const tagText = req.query.tagText as string;
      const response = await PictureTagService.getTagsByText(tagText);

      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  static async deletePictureTagConnection(req: Request, res: Response, next: NextFunction) {
    try {
      const { pictureId, tagIdValueOrArray } = req.query;
      const userId = (req as any).user.id;

      const response = await PictureTagService.deletePictureTagConnection(Number(userId), Number(pictureId), tagIdValueOrArray as string);

      return res.json(response);
    } catch (e) {
      next(e);
    }
  }
};

export default PictureTagController;