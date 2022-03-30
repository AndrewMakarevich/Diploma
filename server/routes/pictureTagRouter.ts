import { Router } from "express";
import PictureTagController from "../controllers/pictureTagController";

const pictureTagRouter = Router();

pictureTagRouter.get('/get-by-text', PictureTagController.getTagsByTagName);

export default pictureTagRouter;