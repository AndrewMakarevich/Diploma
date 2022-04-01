import { Router } from 'express';
import userRouter from './userRouter';
import pictureRouter from './pictureRoutes';
import pictureTagRouter from './pictureTagRouter';
import pictureTypeRouter from './pictureTypeRouter';
const mainRouter = Router();

mainRouter.use('/user', userRouter);
mainRouter.use('/picture', pictureRouter);
mainRouter.use('/picture-tag', pictureTagRouter);
mainRouter.use('/picture-type', pictureTypeRouter);

export default mainRouter;