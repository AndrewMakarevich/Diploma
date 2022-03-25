import { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import { IPictureInfo } from "../interfaces/pictureInterfaces";
import PictureService from "../services/pictureService";

class PictureController {
  static async createPicture(req: Request, res: Response, next: NextFunction) {
    try {
      const img = req.files?.img as fileUpload.UploadedFile;
      const userId = (req as any).user.id;
      const { description, mainTitle } = req.body;
      const pictureInfos: IPictureInfo[] = req.body.pictureInfos;

      const response = await PictureService.createPicture(userId, img, mainTitle, description, pictureInfos);
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }
}
export default PictureController;