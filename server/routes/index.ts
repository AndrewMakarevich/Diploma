import { Router } from 'express';
import userRouter from './userRouter';
import pictureRouter from './pictureRoutes';
import pictureTagRouter from './pictureTagRouter';
import pictureTypeRouter from './pictureTypeRouter';
import pictureLikeRouter from './pictureLikeRouter';
import pictureCommentRouter from './pictureCommentRouter';
const mainRouter = Router();

mainRouter.use('/user', userRouter);
mainRouter.use('/picture', pictureRouter);
mainRouter.use('/picture-tag', pictureTagRouter);
mainRouter.use('/picture-type', pictureTypeRouter);
mainRouter.use('/picture-like', pictureLikeRouter);
mainRouter.use('/picture-comment', pictureCommentRouter);

export default mainRouter;