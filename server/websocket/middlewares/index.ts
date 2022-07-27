import { Server, WebSocket } from "ws";
import { IOnMessageData, ISocketQueryParams, IUnifiedWebSocket } from "../../interfaces/webSocket/message";

export interface IRejectObj {
  code?: number,
  message: any
}

interface IMiddleware {
  (wss: Server<WebSocket>, ws: IUnifiedWebSocket, data: IOnMessageData): Promise<void | IRejectObj>
}

function resultIsReject(result: any): result is IRejectObj {
  return !!(result?.message)
}

async function socketMiddleware(wss: Server<IUnifiedWebSocket>, ws: IUnifiedWebSocket, data: IOnMessageData, ...middlewares: IMiddleware[]) {
  const currentConnection = ws;
  const currentData = data;

  for (const middleware of middlewares) {
    const result = await middleware(wss, currentConnection, currentData);

    if (resultIsReject(result)) {
      ws.send(JSON.stringify({ event: "error", code: result.code || 500, error: `${result.message}` }))
      ws.close(1011);
      break;
    }
  }

  return;
};

export default socketMiddleware;