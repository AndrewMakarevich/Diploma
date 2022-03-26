import { Router } from "express";
import PictureController from "../controllers/pictureController";
import authMiddleware from "../middlewares/authMiddleware";

const pictureRouter = Router();

pictureRouter.get('/get/:id', PictureController.getPictureById);

pictureRouter.post('/create', authMiddleware, PictureController.createPicture);

pictureRouter.put('/edit/:id', authMiddleware, PictureController.editPicture)

export default pictureRouter;