import { Router } from 'express';
import userRouter from './userRouter';
import pictureRouter from './pictureRoutes';
import pictureTagRouter from './pictureTagRouter';
const mainRouter = Router();

mainRouter.use('/user', userRouter);
mainRouter.use('/picture', pictureRouter);
mainRouter.use('/picture-tag', pictureTagRouter);

export default mainRouter;