import { Router } from "express";
import PictureTagController from "../controllers/pictureTagController";
import { rolePermissions } from "../enums/roles";
import authMiddleware from "../middlewares/authMiddleware";
import roleMiddleware from "../middlewares/roleMiddleware";

const pictureTagRouter = Router();

pictureTagRouter.get('/get-by-text', PictureTagController.getTagsByTagName);
pictureTagRouter.get("/get-tags", PictureTagController.getTags);

pictureTagRouter.post("/create", authMiddleware, PictureTagController.createTag);

pictureTagRouter.put("/edit", authMiddleware, roleMiddleware(rolePermissions.moderatePictureTag), PictureTagController.editTag);

pictureTagRouter.delete("/delete-connection", authMiddleware, PictureTagController.deletePictureTagConnection);
pictureTagRouter.delete("/delete/:id", authMiddleware, roleMiddleware(rolePermissions.moderatePictureTag), PictureTagController.deleteTag);

export default pictureTagRouter;