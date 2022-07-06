import { ForeignKeyConstraintError } from "sequelize/dist";
import ApiError from "../apiError/apiError";
import { INotification, INotificationInstance } from "../interfaces/modelInterfaces";
import models from "../models/models";

class NotificationService {
  static async getRecievedNotifications(recieverId: number) {
    const notifications = await models.Notification.findAll({
      where: { recieverId }
    }).catch(error => {
      throw ApiError.badRequest(error);
    });

    return notifications;
  }
  static async createNotification(message: string, senderId: number, recieverIds: number[]) {
    if (!Array.isArray(recieverIds)) {
      try {
        recieverIds = JSON.parse(recieverIds);
      } catch (e) {
        throw ApiError.badRequest("Reciever ids must be an array")
      }
    }

    const errors: string[] = [];

    const notification = await models.Notification.create({
      senderId,
      message,
    }).catch(error => {
      if (error.name === "SequelizeForeignKeyConstraintError") {
        if (/senderId/.test(error.message)) {
          throw ApiError.badRequest(error.message)
        }
        throw ApiError.badRequest(error.message)
      }
      throw ApiError.badRequest(error.message)
    });

    const createUsersNotificationsPromises = recieverIds.map(async (recieverId) => {
      await models.UsersNotifications.create({
        notificationId: notification.id,
        recieverId
      }).catch(error => {
        if (error.name === "SequelizeForeignKeyConstraintError") {
          errors.push(error.parent.detail);
        } else {
          errors.push(error.message);
        }
      });
    });

    await Promise.all(createUsersNotificationsPromises);
    return { notification, errors }
  }
};

export default NotificationService;