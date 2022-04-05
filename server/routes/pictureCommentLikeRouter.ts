import { Router } from "express";
import PictureCommentLikeController from "../controllers/pictureCommentLikeController";
import authMiddleware from "../middlewares/authMiddleware";

const pictureCommentLikeRouter = Router();

pictureCommentLikeRouter.post("/like", authMiddleware, PictureCommentLikeController.likeInteraction);

export default pictureCommentLikeRouter;