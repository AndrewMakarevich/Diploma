import { Router } from "express";
import PictureTagController from "../controllers/pictureTagController";
import authMiddleware from "../middlewares/authMiddleware";

const pictureTagRouter = Router();

pictureTagRouter.get('/get-by-text', PictureTagController.getTagsByTagName);
pictureTagRouter.get("/get-tags", PictureTagController.getTags);

pictureTagRouter.delete("/delete-connection", authMiddleware, PictureTagController.deletePictureTagConnection);

export default pictureTagRouter;