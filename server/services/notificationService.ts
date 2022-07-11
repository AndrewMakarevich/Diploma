import sequelize, { OrderItem, QueryTypes } from "sequelize";
import Sequelize from "../db";
import ApiError from "../apiError/apiError";
import { INotificationInstance } from "../interfaces/modelInterfaces";
import { IGetNotificationsCursor } from "../interfaces/services/notificationsServiceInterfaces";
import models from "../models/models";
import { getCursorStatement } from "../utils/services/keysetPaginationHelpers";
import { IRejectObj } from "../websocket/middlewares";

interface INotificationInstanceWithUsersIds extends INotificationInstance {
  users?: { id: number }[]
}

class NotificationService {
  static async getRecievedNotificationsAmount(recieverId: number) {
    const notificationsAmount = await models.Notification.count({
      include: {
        model: models.User,
        where: {
          id: recieverId
        },
        required: true,
        attributes: []
      }
    });

    return notificationsAmount;
  };

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
        model: models.User,
        attributes: [],
        where: { id: recieverId },
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

  static async editNotification(notificationId: number, message: string, recieversIdsToDisconnect: number[] = [], recieverIdsToConnect: number[] = []) {
    let idsToDisconnect = recieversIdsToDisconnect.filter(disconnectId => !recieverIdsToConnect.some(connectId => +connectId === +disconnectId));
    let idsToConnect = recieverIdsToConnect.filter(connectId => !recieversIdsToDisconnect.some(disconnectId => +disconnectId === +connectId));

    const errors: Object[] = [];

    const editNotificationResult = await models.Notification.update({
      message,
    }, {
      where: {
        id: notificationId
      }
    }).catch(e => {
      throw ApiError.badRequest(e.message)
    });

    for (const recieverId of idsToConnect) {
      await models.UsersNotifications.create({
        recieverId,
        notificationId
      }).catch(e => {
        if (e.name === "SequelizeUniqueConstraintError" || e.name === "SequelizeForeignKeyConstraintError") {
          errors.push(e.parent.detail);
        } else {
          errors.push(e.message);
        }

        idsToConnect = idsToConnect.filter(id => id !== recieverId);
      });
    };

    for (const recieverId of idsToDisconnect) {
      const deleteResult = await models.UsersNotifications.destroy({
        where: {
          recieverId,
          notificationId
        }
      }).catch(e => {
        errors.push(e.message);

        idsToDisconnect = idsToDisconnect.filter(id => +id !== recieverId);
      });

      if (deleteResult === 0) {
        errors.push(`Connection between User with id=${recieverId} and notification with id=${notificationId} doesn't exists`);
      }
    };

    let notification: INotificationInstanceWithUsersIds | null = null;
    const oldRecieversIdsToNotify: number[] = [];

    if (idsToConnect.length || editNotificationResult[0]) {
      notification = await models.Notification.findOne({
        where: {
          id: notificationId
        }
      });

      if (editNotificationResult[0]) {
        //If at least one field was affected in notification record, get all related to the notification usersIds, to notify them later
        const users = await Sequelize.query(`
        SELECT id FROM users 
          INNER JOIN "usersNotifications" 
            ON "usersNotifications"."recieverId"=users.id 
            AND "usersNotifications"."notificationId"=${notificationId}`, { type: QueryTypes.SELECT, mapToModel: true, model: models.User })

        users.forEach(user => {
          if (!idsToConnect.some(id => +id === +user.id)) {
            oldRecieversIdsToNotify.push(user.id);
          }
        });
      }
    }

    return { notification, newRecieversIdsToNotify: idsToConnect, oldRecieversIdsToNotify, disconnectedRecieversToNotify: idsToDisconnect, errors }
  };

  static async deleteNotification(notificationId: number) {
    const notificationToDelete: INotificationInstanceWithUsersIds | null = await models.Notification.findOne({
      where: {
        id: notificationId
      },
      include: [
        { model: models.User, attributes: ["id"] }
      ]
    }).catch(error => {
      throw ApiError.badRequest(error);
    });

    if (!notificationToDelete) {
      throw ApiError.badRequest("Notification with such id doesnt exists");
    }

    const deletionResult = await models.Notification.destroy({
      where: {
        id: notificationId
      }
    }).catch(error => {
      throw ApiError.badRequest(error);
    });

    return { deletedNotification: notificationToDelete }
  };
};

export default NotificationService;