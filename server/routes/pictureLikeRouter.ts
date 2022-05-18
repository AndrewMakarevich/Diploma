import { Router } from "express";
import PictureLikeController from "../controllers/pictureLikeController";
import { rolePermissions } from "../enums/roles";
import authMiddleware from "../middlewares/authMiddleware";
import roleMiddleware from "../middlewares/roleMiddleware";

const pictureLikeRouter = Router();

pictureLikeRouter.get("/get/:pictureId", PictureLikeController.getPictureLikes);
pictureLikeRouter.post('/like', authMiddleware, roleMiddleware(rolePermissions.addLike), PictureLikeController.likeInteraction);

export default pictureLikeRouter;