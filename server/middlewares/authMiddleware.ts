import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import ApiError from "../apiError/apiError";
import { IUserToken } from "../interfaces/modelInterfaces";
import TokenService from "../services/tokenService";

interface IUserDataRequestExtended extends Request {
    user: IUserToken
}

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(ApiError.unauthorized('User is not logged'));
        }
        const accessToken = (authHeader as string)!.split(' ')[1];
        if (!accessToken) {
            return next(ApiError.unauthorized('User is not logged'));
        }
        const validationResult = await TokenService.validateAccessToken(accessToken);
        if (!validationResult) {
            return next(ApiError.unauthorized('Access token is invalid'));
        }
        (req as any).user = validationResult;
        next();
    } catch (e) {
        return next(ApiError.unauthorized('Checking of user authorization failed'));
    }

}