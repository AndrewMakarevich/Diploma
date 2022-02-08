import { NextFunction, Request, Response } from "express";
import ApiError from "../apiError/apiError";
import TokenService from "../services/tokenService";

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(ApiError.unauthorized('User is not logged1'));
        }
        const accessToken = (authHeader as string)!.split(' ')[1];
        if (!accessToken) {
            return next(ApiError.unauthorized('User is not logged2'));
        }
        const validationResult = await TokenService.validateAccessToken(accessToken);
        next();
    } catch (e) {
        return next(ApiError.badRequest('Checking of user authorization failed'));
    }

}