import { NextFunction, Request, Response } from "express";
import { IThroughAuthMiddlewareRequest } from "../middlewares/authMiddleware";
import NotificationService from "../services/notificationService";

class NotificationController {
  static async getNotificationById(req: Request, res: Response, next: NextFunction) {
    try {

    } catch (e) {
      next(e);
    }
  };

  static async getNotificationsByRecieverId(req: Request, res: Response, next: NextFunction) {
    try {

    } catch (e) {
      next(e);
    }
  };

  static async getNotificationsBySenderId(req: Request, res: Response, next: NextFunction) {
    try {

    } catch (e) {
      next(e);
    }
  };

  static async createNotification(req: IThroughAuthMiddlewareRequest, res: Response, next: NextFunction) {
    try {
      const { message, recieverIds } = req.body;
      const { id: senderId } = req.user!;
      const response = await NotificationService.createNotification(message, senderId, recieverIds);

      return res.json(response);
    } catch (e) {
      next(e);
    }
  };
};

export default NotificationController;