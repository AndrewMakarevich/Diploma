import { Server, WebSocket } from "ws";
import ApiError from "../../apiError/apiError";
import { rolePermissions } from "../../enums/roles";
import { IOnMessageData, ISocketQueryParams, IUnifiedWebSocket } from "../../interfaces/webSocket/message";
import models from "../../models/models";

const roleSocketMiddleware = (permissionToCheck: rolePermissions) =>
  async (wss: Server<IUnifiedWebSocket>, ws: IUnifiedWebSocket, data: IOnMessageData) => {
    try {
      const role = await models.Role.findOne({ where: { id: data.user.roleId } });

      if (!role || !role[permissionToCheck]) {
        return ApiError.forbidden("You have no permission for this operation");
      };

      return;
    } catch (e) {
      throw ApiError.forbidden((e as Error).message);
    }
  };

export default roleSocketMiddleware;