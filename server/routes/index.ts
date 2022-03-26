import { Router } from 'express';
import userRouter from './userRouter';
import pictureRouter from './pictureRoutes';
const mainRouter = Router();

mainRouter.use('/user', userRouter);
mainRouter.use('/picture', pictureRouter);

export default mainRouter;