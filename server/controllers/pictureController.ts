import { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import { IPictureInfo } from "../interfaces/pictureInterfaces";
import { IPictureTag } from "../interfaces/tagInterfaces";
import PictureService from "../services/pictureService";

class PictureController {
  static async getPictureById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log(id);
      const response = await PictureService.getPictureById(Number(id));

      return res.json(response);
    } catch (e) {
      next(e);
    }

  };

  static async getPictures(req: Request, res: Response, next: NextFunction) {
    try {
      const queryString = req.query.queryString as string;
      const { userId, pictureTypeId, limit, page, sort } = req.query;
      const response = await PictureService.getPictures(Number(userId), Number(pictureTypeId), queryString, Number(limit), Number(page), String(sort));

      return res.json(response);
    } catch (e) {
      next(e);
    }
  };

  static async createPicture(req: Request, res: Response, next: NextFunction) {
    try {
      const img = req.files?.img as fileUpload.UploadedFile;
      const userId = (req as any).user.id;
      const userNickname = (req as any).user.nickname;
      const { description, mainTitle, pictureTypeId } = req.body;
      let pictureInfos: IPictureInfo[] = req.body.pictureInfos;
      let pictureTags: IPictureTag[] = req.body.pictureTags;

      try {
        pictureInfos = JSON.parse(req.body.pictureInfos);
      } catch (e) {

      }

      try {
        pictureTags = JSON.parse(req.body.pictureTags);
      } catch (e) {

      }

      const response = await PictureService.createPicture(userId, userNickname, img, mainTitle, description, pictureTypeId, pictureInfos, pictureTags);

      return res.json(response);
    } catch (e) {
      next(e);
    }
  };

  static async editPicture(req: Request, res: Response, next: NextFunction) {
    try {
      const pictureId = Number(req.params.id);
      const userId = (req as any).user.id;
      const img = req.files?.img as fileUpload.UploadedFile;
      const { description, mainTitle, pictureTypeId } = req.body;
      let pictureInfos: IPictureInfo[] = req.body.pictureInfos;
      let pictureTags: IPictureTag[] = req.body.pictureTags;

      try {
        pictureInfos = JSON.parse(req.body.pictureInfos);
      } catch (e) {

      }

      try {
        pictureTags = JSON.parse(req.body.pictureTags);
      } catch (e) {

      }

      const response = await PictureService.editPicture(userId, pictureId, img, mainTitle, description, pictureTypeId, pictureInfos, pictureTags);

      return res.json(response);
    } catch (e) {
      next(e);
    }
  };

  static async deleteOwnPicture(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: pictureId } = req.params;
      const userId = (req as any).user.id;

      const response = await PictureService.deleteOwnPicture(userId, Number(pictureId));

      return res.json(response);
    } catch (e) {
      next(e);
    }
  };

  static async deleteElsesPicture(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: pictureId } = req.params;

      const response = await PictureService.deleteElsesPicture(Number(pictureId));

      return res.json(response);
    } catch (e) {
      next(e);
    }
  }
}
export default PictureController;