import { Router } from 'express';
import userRouter from './userRouter';
import pictureRouter from './pictureRoutes';
import pictureTagRouter from './pictureTagRouter';
import pictureTypeRouter from './pictureTypeRouter';
import pictureLikeRouter from './pictureLikeRouter';
import pictureCommentRouter from './pictureCommentRouter';
import pictureCommentLikeRouter from './pictureCommentLikeRouter';
import pictureInfoRouter from './pictureInfoRouter';
import notificationRouter from './notificationRouter';
import notificationTypeRouter from './notificationTypeRouter';
const mainRouter = Router();

mainRouter.use('/user', userRouter);
mainRouter.use('/notification', notificationRouter);
mainRouter.use('/picture', pictureRouter);
mainRouter.use('/picture-info', pictureInfoRouter);
mainRouter.use('/picture-tag', pictureTagRouter);
mainRouter.use('/picture-type', pictureTypeRouter);
mainRouter.use('/picture-like', pictureLikeRouter);
mainRouter.use('/picture-comment', pictureCommentRouter);
mainRouter.use('/picture-comment-like', pictureCommentLikeRouter);
mainRouter.use('/notification-type', notificationTypeRouter);

export default mainRouter;