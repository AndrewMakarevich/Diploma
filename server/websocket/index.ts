import { Server } from "ws";
import { Server as expressServer } from "http"
import messageRoutes from "./routes";
import { ISocketQueryParams } from "../interfaces/webSocket/message";
import ParseUrl from "./helpers/parseUrl";
const webSocketServer = (expressServer: expressServer) => {
  try {
    const wss = new Server({ noServer: true, path: "/sockets" });

    expressServer.on("upgrade", function upgradeFunction(req, socket, head) {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
        console.log(1);
      });
    });

    wss.on("connection", (ws, req) => {
      const queryParamsObj = ParseUrl.getQueryParams(req.url);

      ws.on("message", ((data: string) => {
        messageRoutes(ws, queryParamsObj, data,);
      }))
    });

    return wss;
  } catch (e) {
    console.log(e);
  }

};

export default webSocketServer;