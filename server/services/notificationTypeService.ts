import sequelize, { OrderItem } from "sequelize";
import { Op } from "sequelize";
import ApiError from "../apiError/apiError";
import models from "../models/models";
import { getCursorStatement, objectIsCursor } from "../utils/services/keysetPaginationHelpers";

class NotificationTypeService {
  private static setNotificationTypeErrorHandler(error: any, ...args: unknown[]): never {
    switch (error.name) {
      case "SequelizeUniqueConstraintError":
        throw ApiError.badRequest(`Notification type with name "${args[0]}" already exists`);
      default:
        throw ApiError.badRequest(error.message);
    }
  };

  static async getNotificationTypes(queryString: string, cursor: string, limit?: number) {
    const { id, key, value, order } = objectIsCursor(cursor);

    const orderParam: OrderItem[] = [[sequelize.col(key), order], [sequelize.col("id"), order]];
    const whereParam = getCursorStatement(key, id, value, order);

    const notificationTypes = await models.NotificationType.findAll({
      where: {
        name: { [Op.iRegexp]: queryString },
        ...whereParam
      },
      order: orderParam,
      limit
    });

    return { notificationTypes };
  };

  static async createNotificationType(name: string) {
    const notification = await models.NotificationType.create({
      name
    }).catch(error => {
      this.setNotificationTypeErrorHandler(error, name);
    });

    return notification;
  };

  static async editNotificationType(notificationTypeId: number, name: string) {
    const editResult = await models.NotificationType.update({ name }, {
      where: {
        id: notificationTypeId
      }
    }).catch(error => {
      this.setNotificationTypeErrorHandler(error, name);
    });

    if (!editResult[0]) {
      throw ApiError.badRequest(`Notification type with such id(${notificationTypeId}) doesn't exists`)
    };

    return { message: `Notification type with id ${notificationTypeId} edited successfully` }
  };

  static async deleteNotificationType(notificationTypeId: number) {
    const deleteResult = await models.NotificationType.destroy({
      where: {
        id: notificationTypeId
      }
    }).catch(error => {
      this.setNotificationTypeErrorHandler(error)
    });

    if (!deleteResult) {
      throw ApiError.badRequest("Notification type with such id doesn't exists");
    };

    return { message: `Notification type with id ${notificationTypeId} deleted successfully` };
  };
};

export default NotificationTypeService;