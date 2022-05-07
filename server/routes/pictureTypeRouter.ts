import { Router } from 'express';
import PictureTypeController from '../controllers/pictureTypeController';
import { rolePermissions } from '../enums/roles';
import authMiddleware from '../middlewares/authMiddleware';
import roleMiddleware from '../middlewares/roleMiddleware';

const pictureTypeRouter = Router();

pictureTypeRouter.get('/get-all', PictureTypeController.getPictureTypes);
pictureTypeRouter.post('/create', authMiddleware, roleMiddleware(rolePermissions.moderatePictureType), PictureTypeController.createPictureType);
pictureTypeRouter.put('/edit', authMiddleware, roleMiddleware(rolePermissions.moderatePictureType), PictureTypeController.editPictureType);
pictureTypeRouter.delete('/delete/:id', authMiddleware, roleMiddleware(rolePermissions.moderatePictureType), PictureTypeController.deletePictureType);

export default pictureTypeRouter;