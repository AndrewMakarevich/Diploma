import { NextFunction, Request, Response } from "express";
import NotificationTypeService from "../services/notificationTypeService";

class NotificationTypeController {
  static async getNotificationTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const { queryString, cursor, limit } = req.query;
      const notifications = await NotificationTypeService.getNotificationTypes(
        String(queryString),
        String(cursor),
        Number(limit) || undefined
      );

      return res.json(notifications);
    } catch (e) {
      next(e);
    }
  };

  static async createNotificationType(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;
      const notification = await NotificationTypeService.createNotificationType(name)

      return res.json({ notification });
    } catch (e) {
      next(e);
    }
  };

  static async editNotificationType(req: Request, res: Response, next: NextFunction) {
    try {
      const { notificationTypeId, name } = req.body;
      const editResult = await NotificationTypeService.editNotificationType(notificationTypeId, name);

      return res.json(editResult);
    } catch (e) {
      next(e);
    }
  };

  static async deleteNotificationType(req: Request, res: Response, next: NextFunction) {
    try {
      const { notificationTypeId } = req.query;
      const deleteResult = await NotificationTypeService.deleteNotificationType(Number(notificationTypeId));
      return res.json(deleteResult);
    } catch (e) {
      next(e);
    }
  }
};

export default NotificationTypeController;