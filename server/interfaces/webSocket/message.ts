import { WebSocket } from "ws"

export interface IOnMessageData {
  [key: string]: any,
  event: string,
  payload: { [key: string]: any }
}

export interface ISocketQueryParams {
  [key: string]: any
}

export interface IUnifiedWebSocket extends WebSocket {
  userId?: number,
  isNotificationBarOpened?: boolean,
}

