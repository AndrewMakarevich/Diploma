import { NextFunction, Request, Response } from "express";
import PictureInfoService from "../services/pictureInfoService";

class PictureInfoController {
  static async deletePictureInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { pictureId, pictureInfoIdValueOrArray } = req.query;
      const userId = (req as any).user.id;
      const response = await PictureInfoService.deletePictureInfo(Number(userId), Number(pictureId), pictureInfoIdValueOrArray as string);

      return res.json(response);
    } catch (e) {
      next(e);
    }
  }
};

export default PictureInfoController;