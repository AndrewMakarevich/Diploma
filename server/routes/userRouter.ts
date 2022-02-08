import { Router } from "express";
import UserController from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";
const userRouter = Router();

userRouter.get('/get', authMiddleware, UserController.getUsers);
userRouter.post('/registration', UserController.registration);
userRouter.post('/login', UserController.login);
userRouter.put('/edit/:id');
userRouter.put('/refresh', UserController.refreshSession);
userRouter.get('/activate/:activationKey', UserController.accountActivation);
userRouter.delete('/logout', UserController.logout);
userRouter.delete('/delete');
export default userRouter;