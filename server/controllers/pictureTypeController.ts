import { NextFunction, Request, Response } from "express";
import PictureTypeService from "../services/pictureTypeService";

class PictureTypeController {
  static async createPictureType(req: Request, res: Response, next: NextFunction) {
    try {
      const { typeName } = req.body;
      const response = await PictureTypeService.createPictureType(typeName);

      return res.json(response);
    } catch (e) {
      next(e);
    }
  };

  static async editPictureType(req: Request, res: Response, next: NextFunction) {
    try {
      const { typeId, typeName } = req.body;
      const response = await PictureTypeService.editPictureType(typeId, typeName);

      return res.json(response);
    } catch (e) {
      next(e);
    }
  };

  static async deletePictureType(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const response = await PictureTypeService.deletePictureType(Number(id));

    return res.json(response);
  };
}

export default PictureTypeController;