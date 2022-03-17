import { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import UserService from "../services/userService";

class UserController {
  static async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const { nickname, email, password } = req.body;
      const response = await UserService.registrateUser(nickname, email, password);
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }
  static async accountActivation(req: Request, res: Response, next: NextFunction) {
    try {
      const { activationKey } = req.params;
      const response = await UserService.activateUserAccount(activationKey);
      return res.json(response).redirect(process.env.FRONT_LINK!)
    } catch (e) {
      next(e);
    }
  }
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const userIp = req.ip;
      const { email, password } = req.body;
      const response = await UserService.login(userIp, email, password);
      res.cookie('refreshToken', response.refreshToken, { maxAge: 30 * 24 * 68 * 60 * 1000, httpOnly: true })
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }
  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const userIp = req.ip;
      const { refreshToken } = req.cookies;
      const response = await UserService.logout(userIp, refreshToken);
      res.clearCookie('refreshToken');
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }
  static async refreshSession(req: Request, res: Response, next: NextFunction) {
    try {
      const userIp = req.ip;
      const { refreshToken } = req.cookies;
      const response = await UserService.refresh(userIp, refreshToken);
      res.cookie('refreshToken', response.refreshToken, { maxAge: 30 * 24 * 68 * 60 * 1000, httpOnly: true });
      return res.json(response);
    } catch (e) {
      next(e);
    }
  }
  static async getUsers(req: Request, res: Response, next: NextFunction) {
    return res.json({ message: "users" });
  }
  static async editUser(req: Request, res: Response, next: NextFunction) {
    try {

      const { id: userId } = (req as any).user;
      const { nickname, firstName, surname, city, country } = req.body;
      const avatar = req.files?.avatar as fileUpload.UploadedFile;
      const profileBackground = req.files?.profileBackground as fileUpload.UploadedFile;
      const response = await UserService.editUser(userId, firstName, surname, nickname, avatar, profileBackground, country, city);

      return res.json(response);
    } catch (e) {
      console.log('ERROR', e);
      next(e);
    }

  }
  static async getMyself(req: Request, res: Response, next: NextFunction) {
    const { id } = (req as any).user;
    const infoAboutMyself = await UserService.getUser(id);
    return res.json(infoAboutMyself);
  }
}
export default UserController;