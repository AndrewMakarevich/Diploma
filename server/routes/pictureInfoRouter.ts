import { Router } from "express";
import PictureInfoController from "../controllers/pictureInfoController";
import authMiddleware from "../middlewares/authMiddleware";

const pictureInfoRouter = Router();

pictureInfoRouter.delete("/delete", authMiddleware, PictureInfoController.deletePictureInfo);

export default pictureInfoRouter;