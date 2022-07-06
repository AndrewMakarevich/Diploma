import { WebSocket } from "ws";
import { IOnMessageData, ISocketQueryParams } from "../../interfaces/webSocket/message";

export interface IRejectObj {
  code: number,
  message: any
}

interface IMiddleware {
  (ws: WebSocket, data: IOnMessageData, queryParams: ISocketQueryParams): Promise<void | IRejectObj>
}

function resultIsReject(result: any): result is IRejectObj {
  return !!(result?.message)
}

async function socketMiddleware(ws: WebSocket, data: IOnMessageData, queryParams: ISocketQueryParams, ...middlewares: IMiddleware[]) {
  const currentConnection = ws;
  const currentData = data;
  const currentQueryParams = queryParams;

  for (const middleware of middlewares) {
    const result = await middleware(currentConnection, currentData, currentQueryParams);
    console.log(result);

    if (resultIsReject(result)) {
      ws.close(1011, JSON.stringify({ code: result.code || 500, message: result.message }));
      break;
    }
  }

  return;
};

export default socketMiddleware;