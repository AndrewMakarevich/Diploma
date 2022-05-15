import { Router } from "express";
import PictureController from "../controllers/pictureController";
import { rolePermissions } from "../enums/roles";
import authMiddleware from "../middlewares/authMiddleware";
import roleMiddleware from "../middlewares/roleMiddleware";

const pictureRouter = Router();

pictureRouter.get('/get/:id', PictureController.getPictureById);
pictureRouter.get('/get-many', PictureController.getPictures);

pictureRouter.post('/create', authMiddleware, roleMiddleware(rolePermissions.loadPicture), PictureController.createPicture);

pictureRouter.put('/edit/:id', authMiddleware, PictureController.editPicture);

pictureRouter.delete('/delete-own/:id', authMiddleware, PictureController.deleteOwnPicture);
pictureRouter.delete('/delete-elses/:id', authMiddleware, roleMiddleware(rolePermissions.deleteOtherPicture), PictureController.deleteElsesPicture);

export default pictureRouter;