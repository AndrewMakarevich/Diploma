import { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import { IPictureInfo } from "../interfaces/pictureInterfaces";
import { IPictureTag } from "../interfaces/tagInterfaces";
import PictureService from "../services/pictureService";

class PictureController {
  static async getPictureById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const response = await PictureService.getPictureById(Number(id));

      return res.json(response);
    } catch (e) {
      next(e);
    }

  }

  static async createPicture(req: Request, res: Response, next: NextFunction) {
    try {
      const img = req.files?.img as fileUpload.UploadedFile;
      const userId = (req as any).user.id;
      const { description, mainTitle } = req.body;
      const pictureInfos: IPictureInfo[] = JSON.parse(req.body.pictureInfos) || undefined;
      const pictureTags: IPictureTag[] = JSON.parse(req.body.pictureTags) || undefined;

      const response = await PictureService.createPicture(userId, img, mainTitle, description, pictureInfos, pictureTags);

      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  static async editPicture(req: Request, res: Response, next: NextFunction) {
    try {
      const pictureId = Number(req.params.id);
      const userId = (req as any).user.id;
      const img = req.files?.img as fileUpload.UploadedFile;
      const { description, mainTitle } = req.body;
      const pictureInfos: IPictureInfo[] = JSON.parse(req.body.pictureInfos) || undefined;
      const pictureTags: IPictureTag[] = JSON.parse(req.body.pictureTags) || undefined;

      const response = await PictureService.editPicture(userId, pictureId, img, mainTitle, description, pictureInfos, pictureTags);

      return res.json(response);
    } catch (e) {
      next(e);
    }
  }
}
export default PictureController;