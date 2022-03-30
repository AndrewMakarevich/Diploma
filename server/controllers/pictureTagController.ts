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
};

export default PictureTagController;