import { Router } from "express";
import { rolePermissions } from "../enums/roles";
import UserController from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";
import roleMiddleware from "../middlewares/roleMiddleware";
const userRouter = Router();

userRouter.get('/get/:userId', UserController.getUser);
userRouter.get('/myself', authMiddleware, UserController.getMyself);

userRouter.post('/registration', UserController.registration);
userRouter.post('/login', UserController.login);

userRouter.put('/edit', authMiddleware, UserController.editUser);
userRouter.put('/resetPass', authMiddleware, UserController.resetPassword);
userRouter.get('/approvePassReset/:emailApproveKey', UserController.approvePasswordReset);
userRouter.put('/refresh', UserController.refreshSession);

userRouter.get('/activate/:activationKey', UserController.accountActivation);

userRouter.delete('/logout', UserController.logout);
userRouter.delete('/delete');
export default userRouter;