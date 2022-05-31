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

  static async getTags(req: Request, res: Response, next: NextFunction) {
    try {
      const { queryString, cursor, limit } = req.query;
      const response = await PictureTagService.getTags(
        queryString ? String(queryString) : undefined,
        String(cursor),
        Number(limit) || undefined);

      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  static async createTag(req: Request, res: Response, next: NextFunction) {
    try {
      const { text } = req.body;
      const response = await PictureTagService.addTag(text);

      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  static async editTag(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, text } = req.body;
      const response = await PictureTagService.editTag(id, text);

      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  static async deleteTag(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const response = await PictureTagService.deleteTag(+id);

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