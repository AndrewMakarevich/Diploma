import { Router } from 'express';
import PictureTypeController from '../controllers/pictureTypeController';
import { rolePermissions } from '../enums/roles';
import authMiddleware from '../middlewares/authMiddleware';
import roleMiddleware from '../middlewares/roleMiddleware';

const pictureTypeRouter = Router();

pictureTypeRouter.get('/get-all', PictureTypeController.getPictureTypes);
pictureTypeRouter.post('/create', authMiddleware, roleMiddleware(rolePermissions.createPictureType), PictureTypeController.createPictureType);
pictureTypeRouter.put('/edit', authMiddleware, roleMiddleware(rolePermissions.createPictureType), PictureTypeController.editPictureType);
pictureTypeRouter.delete('/delete/:id', authMiddleware, roleMiddleware(rolePermissions.createPictureType), PictureTypeController.deletePictureType);

export default pictureTypeRouter;