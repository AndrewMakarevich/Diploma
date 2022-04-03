import { Router } from "express";
import PictureCommentController from "../controllers/pictureCommentController";
import authMiddleware from "../middlewares/authMiddleware";

const pictureCommentRouter = Router();

pictureCommentRouter.post('/add', authMiddleware, PictureCommentController.addComment);
pictureCommentRouter.put('/edit', authMiddleware, PictureCommentController.editComment);
pictureCommentRouter.delete('/delete/:commentId', authMiddleware, PictureCommentController.deleteComment);

export default pictureCommentRouter;