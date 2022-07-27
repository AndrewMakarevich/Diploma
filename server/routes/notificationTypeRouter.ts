import { Router } from "express";
import NotificationTypeController from "../controllers/notificationTypeController";
import authMiddleware from "../middlewares/authMiddleware";

const notificationTypeRouter = Router();
notificationTypeRouter.get("/get", NotificationTypeController.getNotificationTypes);
notificationTypeRouter.post("/create", authMiddleware, NotificationTypeController.createNotificationType);
notificationTypeRouter.put("/edit", authMiddleware, NotificationTypeController.editNotificationType);
notificationTypeRouter.delete("/delete", authMiddleware, NotificationTypeController.deleteNotificationType);
export default notificationTypeRouter;