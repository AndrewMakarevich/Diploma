import { Server } from "ws";
import { Server as expressServer } from "http"
import messageRoutes from "./routes/routes";
import ParseUrl from "./helpers/parseUrl";

const webSocketServer = (expressServer: expressServer) => {
  try {
    const wss = new Server({ noServer: true, path: "/sockets" });

    expressServer.on("upgrade", function upgradeFunction(req, socket, head) {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
      });
    });

    wss.on("connection", (ws, req) => {
      ws.on("message", ((data: string) => {
        messageRoutes(wss, ws, data,);
      }))
    });

    return wss;
  } catch (e) {
    console.log(e);
  }

};

export default webSocketServer;