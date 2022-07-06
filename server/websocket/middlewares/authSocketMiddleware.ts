import { WebSocket } from "ws";
import ApiError from "../../apiError/apiError";
import { IOnMessageData, ISocketQueryParams } from "../../interfaces/webSocket/message";
import TokenService from "../../services/tokenService";

export default async function authSocketMiddleware(ws: WebSocket, data: IOnMessageData, queryParams: ISocketQueryParams) {
  try {
    const token = queryParams.token;
    if (!token) {
      return ApiError.unauthorized("Can't find token");
    }

    const tokenVerificationResult = await TokenService.validateAccessToken(token);

    if (!tokenVerificationResult) {
      return ApiError.unauthorized("Incorrect token");
    };

    data.user = tokenVerificationResult;
    return;
  } catch (e) {
    return ApiError.unauthorized((e as Error).message);
  }
};