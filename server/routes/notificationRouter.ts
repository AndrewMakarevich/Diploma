import { Router } from "express";
import NotificationController from "../controllers/notificationController";
import authMiddleware from "../middlewares/authMiddleware";

const notificationRouter = Router();

notificationRouter.get("/get-by-reciever-id/:recieverId", authMiddleware,);
notificationRouter.get("/get-by-sender-id/:senderId", authMiddleware);
notificationRouter.get("/get-by-id", authMiddleware);

notificationRouter.post("/create", authMiddleware, NotificationController.createNotification)

export default notificationRouter;