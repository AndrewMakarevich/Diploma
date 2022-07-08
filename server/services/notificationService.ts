import sequelize, { OrderItem } from "sequelize";
import { Op } from "sequelize";
import ApiError from "../apiError/apiError";
import { IGetNotificationsCursor } from "../interfaces/services/notificationsServiceInterfaces";
import models from "../models/models";
import { getCursorStatement } from "../utils/services/keysetPaginationHelpers";

class NotificationService {
  static async getRecievedNotifications(recieverId: number, cursor: IGetNotificationsCursor, limit: number = 5) {
    if (!recieverId) {
      throw ApiError.badRequest("Can't find id of reciever");
    }

    const { key, value, id, order } = cursor;

    const orderParams = [
      [sequelize.col(key), order] as OrderItem,
      [sequelize.col("id"), order] as OrderItem
    ]

    const whereParams = {
      ...id && value ? getCursorStatement(key, id, value, order) : {}
    };

    const notifications = await models.Notification.findAll({
      where: whereParams,
      include: {
        model: models.UsersNotifications,
        attributes: [],
        where: { recieverId },
        required: true
      },
      limit,
      order: orderParams
    }).catch(error => {
      throw ApiError.badRequest(error);
    });

    return notifications;
  };

  static async createNotification(message: string, senderId: number, recieverIds: number[]) {
    if (!Array.isArray(recieverIds)) {
      try {
        recieverIds = JSON.parse(recieverIds);
      } catch (e) {
        throw ApiError.badRequest("Reciever ids must be an array")
      }
    }

    const errors: string[] = [];
    let correctRecieverIds: number[] = [...recieverIds];

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
        correctRecieverIds = correctRecieverIds.filter(id => id !== recieverId);

        if (error.name === "SequelizeForeignKeyConstraintError") {
          errors.push(error.parent.detail);
        } else {
          errors.push(error.message);
        }
      });
    });

    await Promise.all(createUsersNotificationsPromises);
    return { notification, errors, correctRecieverIds }
  };
};

export default NotificationService;