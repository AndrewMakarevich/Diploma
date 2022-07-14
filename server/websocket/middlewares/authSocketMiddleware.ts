import { Server, WebSocket } from "ws";
import ApiError from "../../apiError/apiError";
import { IOnMessageData, ISocketQueryParams, IUnifiedWebSocket } from "../../interfaces/webSocket/message";
import TokenService from "../../services/tokenService";

export default async function authSocketMiddleware(wss: Server<IUnifiedWebSocket>, ws: IUnifiedWebSocket, data: IOnMessageData) {
  try {
    const token = data.payload?.token;
    if (!token) {
      return ApiError.unauthorized("Can't find token");
    }

    const tokenVerificationResult = await TokenService.validateAccessToken(token);

    if (!tokenVerificationResult) {
      return ApiError.unauthorized("Incorrect token");
    };

    data.user = tokenVerificationResult;
    ws.userId = data.user.id;
    return;
  } catch (e) {
    return ApiError.unauthorized((e as Error).message);
  }
};