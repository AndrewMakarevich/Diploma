import { Router } from "express";
import PictureCommentController from "../controllers/pictureCommentController";
import { rolePermissions } from "../enums/roles";
import authMiddleware from "../middlewares/authMiddleware";
import roleMiddleware from "../middlewares/roleMiddleware";

const pictureCommentRouter = Router();

pictureCommentRouter.get('/get/:commentId', PictureCommentController.getCommentById);
pictureCommentRouter.get('/get-many', PictureCommentController.getComments);
pictureCommentRouter.post('/add', authMiddleware, roleMiddleware(rolePermissions.addComment), PictureCommentController.addComment);
pictureCommentRouter.put('/edit', authMiddleware, PictureCommentController.editComment);
pictureCommentRouter.delete('/delete/:commentId', authMiddleware, PictureCommentController.deleteComment);

export default pictureCommentRouter;