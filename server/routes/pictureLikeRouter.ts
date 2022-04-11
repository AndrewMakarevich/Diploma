import { Router } from "express";
import PictureLikeController from "../controllers/pictureLikeController";
import authMiddleware from "../middlewares/authMiddleware";

const pictureLikeRouter = Router();

pictureLikeRouter.get("/get/:pictureId", PictureLikeController.getPictureLikes);
pictureLikeRouter.post('/like', authMiddleware, PictureLikeController.likeInteraction);

export default pictureLikeRouter;