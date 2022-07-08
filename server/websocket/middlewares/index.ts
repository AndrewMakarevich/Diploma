import { Server, WebSocket } from "ws";
import { IOnMessageData, ISocketQueryParams, IUnifiedWebSocket } from "../../interfaces/webSocket/message";

export interface IRejectObj {
  code?: number,
  message: any
}

interface IMiddleware {
  (wss: Server<WebSocket>, ws: IUnifiedWebSocket, data: IOnMessageData, queryParams: ISocketQueryParams): Promise<void | IRejectObj>
}

function resultIsReject(result: any): result is IRejectObj {
  return !!(result?.message)
}

async function socketMiddleware(wss: Server<IUnifiedWebSocket>, ws: IUnifiedWebSocket, data: IOnMessageData, queryParams: ISocketQueryParams, ...middlewares: IMiddleware[]) {
  const currentConnection = ws;
  const currentData = data;
  const currentQueryParams = queryParams;

  for (const middleware of middlewares) {
    const result = await middleware(wss, currentConnection, currentData, currentQueryParams);

    if (resultIsReject(result)) {
      ws.send(JSON.stringify({ code: result.code || 500, error: result.message }))
      ws.close(1011);
      break;
    }
  }

  return;
};

export default socketMiddleware;