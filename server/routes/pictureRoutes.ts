import { Router } from "express";
import PictureController from "../controllers/pictureController";
import authMiddleware from "../middlewares/authMiddleware";

const pictureRouter = Router();

pictureRouter.get('/get/:id', PictureController.getPictureById);
pictureRouter.get('/get-many', PictureController.getPictures);

pictureRouter.post('/create', authMiddleware, PictureController.createPicture);

pictureRouter.put('/edit/:id', authMiddleware, PictureController.editPicture);

pictureRouter.delete('/delete/:id', authMiddleware, PictureController.deletePicture);

export default pictureRouter;