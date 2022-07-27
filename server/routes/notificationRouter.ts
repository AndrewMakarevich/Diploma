import { Router } from "express";
import NotificationController from "../controllers/notificationController";
import authMiddleware from "../middlewares/authMiddleware";

const notificationRouter = Router();

export default notificationRouter;