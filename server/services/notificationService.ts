import sequelize, { OrderItem, QueryTypes } from "sequelize";
import Sequelize from "../db";
import ApiError from "../apiError/apiError";
import { INotificationInstance } from "../interfaces/modelInterfaces";
import { IGetNotificationsCursor } from "../interfaces/services/notificationsServiceInterfaces";
import models from "../models/models";
import { getCursorStatement, objectIsCursor } from "../utils/services/keysetPaginationHelpers";
import { IRejectObj } from "../websocket/middlewares";
import { Op } from "sequelize";

interface INotificationInstanceExtended extends INotificationInstance {
  users?: { id: number, usersNotifications: { checked: boolean } }[],
  sender?: ISenderInstanceShortObj | null
}

interface ISenderInstanceShortObj {
  id: number,
  nickname: string,
  avatar: string
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

  static async getRecievedNotifications(recieverId: number, senderId: number, cursor: IGetNotificationsCursor, limit: number = 5, queryString: string = "", notificationTypeId: number) {
    if (!recieverId) {
      throw ApiError.badRequest("Can't find id of reciever");
    }

    const { key, value, id, order } = objectIsCursor(cursor);

    const orderParams = [
      [sequelize.col(key), order] as OrderItem,
      [sequelize.col("id"), order] as OrderItem
    ]

    let whereParams: sequelize.WhereOptions<any> = {
      message: { [Op.iRegexp]: queryString },
      ...getCursorStatement(key, id, value, order)
    };

    if (notificationTypeId !== undefined) {
      whereParams.notificationTypeId = notificationTypeId
    };

    if (senderId !== undefined) {
      whereParams.senderId = senderId;
    }

    const includeParams: sequelize.Includeable[] = [];

    if (recieverId !== undefined) {
      includeParams.push({
        model: models.User,
        attributes: [],
        through: {
          attributes: [],
          where: { recieverId },
        },
        required: true
      })
    };

    if (notificationTypeId !== undefined) {
      includeParams.push({
        model: models.NotificationType,
        as: "user",
        attributes: ["name"],
        where: {
          id: notificationTypeId
        },
        required: false
      })
    };

    const notifications = await models.Notification.findAll({
      where: whereParams,
      include: includeParams,
      limit,
      order: orderParams
    }).then(async (notifications) => {
      const senders = new Map<number, { id: number, nickname: string, avatar: string }>();

      for (const notification of notifications) {
        if (!senders.has(notification.senderId)) {
          const sender = await models.User.findOne({ where: { id: notification.senderId } }).catch(e => { return });

          if (sender) {
            senders.set(sender.id, { id: sender.id, nickname: sender.nickname, avatar: sender.avatar })
          }
        }
      }

      return notifications.map(notification => {
        return { ...notification, sender: senders.get(notification.senderId) }
      });
    }).catch(error => {
      throw ApiError.badRequest(error);
    });

    return notifications;
  };

  static async createNotification(message: string, notificationTypeId: number, senderId: number, recieverIds: number[]) {
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
      notificationTypeId
    }).then(async (notification) => {
      const sender = await models.User.findOne({ where: { id: notification.senderId }, attributes: ["id", "nickname", "avatar"] });
      return { ...notification, sender }
    }).catch(error => {
      if (error.name === "SequelizeForeignKeyConstraintError") {
        if (/senderId/.test(error.message)) {
          throw ApiError.badRequest(error.message)
        } else if (/notificationTypeId/.test(error.message)) {
          throw ApiError.badRequest("Notification type with such id doesn't exists")
        } else {
          throw ApiError.badRequest(error.message)
        }
      } else {
        throw ApiError.badRequest(error.message)
      }
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

  static async editNotification(notificationId: number, notificationTypeId: number, message: string, recieversIdsToDisconnect: number[] = [], recieverIdsToConnect: number[] = []) {
    let idsToDisconnect = recieversIdsToDisconnect.filter(disconnectId => !recieverIdsToConnect.some(connectId => +connectId === +disconnectId));
    let idsToConnect = recieverIdsToConnect.filter(connectId => !recieversIdsToDisconnect.some(disconnectId => +disconnectId === +connectId));

    const errors: Object[] = [];

    const editNotificationResult = await models.Notification.update({
      message,
      notificationTypeId
    }, {
      where: {
        id: notificationId
      }
    }).catch(e => {
      switch (e.name) {
        case "SequelizeForeignKeyConstraintError":
          throw ApiError.badRequest("Notification type with such id doesn't exist");
        default:
          throw ApiError.badRequest(e.message);
      }
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

    let disconnectedRecieversToNotify: { id: number, checked: boolean }[] = [];

    if (idsToDisconnect.length) {
      disconnectedRecieversToNotify = await Sequelize.query(`
    SELECT id,"usersNotifications".checked FROM users 
      INNER JOIN "usersNotifications" 
        ON "usersNotifications"."recieverId"=users.id 
        AND "usersNotifications"."notificationId"=${notificationId}
        WHERE users.id IN (${idsToDisconnect.join(", ")})`, { type: QueryTypes.SELECT });
    }

    for (const { id: recieverId } of disconnectedRecieversToNotify) {
      const deleteResult = await models.UsersNotifications.destroy({
        where: {
          recieverId,
          notificationId
        }
      }).catch(e => {
        errors.push(e.message);

        disconnectedRecieversToNotify = disconnectedRecieversToNotify.filter(reciever => reciever.id !== recieverId);
      });

      if (deleteResult === 0) {
        errors.push(`Connection between User with id=${recieverId} and notification with id=${notificationId} doesn't exists`);
      }
    };

    let notification = null;
    const oldRecieversIdsToNotify: number[] = [];

    if (idsToConnect.length || editNotificationResult[0]) {
      notification = await models.Notification.findOne({ where: { id: notificationId } })
        .then(async (notification) => {
          if (!notification) {
            return notification;
          }

          const sender: ISenderInstanceShortObj | null = await models.User.findOne({ where: { id: notification.senderId }, attributes: ["id", "nickname", "avatar"] });

          return { ...notification, sender }
        });

      if (editNotificationResult[0]) {
        //If at least one field was affected in notification record, get all related to the notification usersIds, to notify them later
        const users = await Sequelize.query(`
        SELECT id FROM users 
          INNER JOIN "usersNotifications" 
            ON "usersNotifications"."recieverId"=users.id 
            AND "usersNotifications"."notificationId"=${notificationId}`, { type: QueryTypes.SELECT, mapToModel: true, model: models.User });

        users.forEach(user => {
          if (!idsToConnect.some(id => +id === +user.id)) {
            oldRecieversIdsToNotify.push(user.id);
          }
        });
      }
    }

    return { notification, newRecieversIdsToNotify: idsToConnect, oldRecieversIdsToNotify, disconnectedRecieversToNotify, errors }
  };

  static async deleteNotification(notificationId: number) {
    const notificationToDelete: INotificationInstanceExtended | null = await models.Notification.findOne({
      where: {
        id: notificationId
      },
      include: [
        {
          model: models.User,
          attributes: ["id"],
          through: {
            attributes: ["checked"], where: {
              notificationId
            }
          },
        }
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