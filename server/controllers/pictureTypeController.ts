import { NextFunction, Request, Response } from "express";
import { IGetPicturesCursor } from "../interfaces/services/pictureServicesInterfaces";
import PictureTypeService from "../services/pictureTypeService";

class PictureTypeController {
  static async getPictureTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const { queryString, cursor, limit } = req.query;
      const response = await PictureTypeService.getPictureTypes(
        String(queryString),
        JSON.parse(String(cursor)) as IGetPicturesCursor,
        Number(limit) || undefined);

      return res.json(response);
    } catch (e) {
      next(e);
    }
  };

  static async createPictureType(req: Request, res: Response, next: NextFunction) {
    try {
      const { name: typeName } = req.body;
      const { id: userId } = (req as any).user;
      const response = await PictureTypeService.createPictureType(typeName, userId);

      return res.json(response);
    } catch (e) {
      next(e);
    }
  };

  static async editPictureType(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: typeId, name: typeName } = req.body;
      const { id: userId } = (req as any).user;
      const response = await PictureTypeService.editPictureType(typeId, typeName, userId);

      return res.json(response);
    } catch (e) {
      next(e);
    }
  };

  static async deletePictureType(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const response = await PictureTypeService.deletePictureType(Number(id));

      return res.json(response);
    } catch (e) {
      next(e);
    }
  };
}

export default PictureTypeController;