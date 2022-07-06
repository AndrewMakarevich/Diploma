import jwt from 'jsonwebtoken';
import ApiError from '../apiError/apiError';
import { IUserDto } from '../dtos/userDto';
import models from '../models/models';
class TokenService {
    static generateTokens(payload: Object) {
        console.log(payload);
        const accessToken = jwt.sign({ ...payload }, process.env.JWT_ATOKEN_KEY!, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ ...payload }, process.env.JWT_RTOKEN_KEY!, { expiresIn: '30d' });
        return { accessToken, refreshToken }
    }
    static async saveToken(userId: number, userIp: string, refreshToken: string) {
        const tokenRecord = await models.UserToken.findOne({
            where: {
                userId, userIp
            }
        });
        if (!tokenRecord) {
            await models.UserToken.create({ userId, userIp, refreshToken });
        } else {
            await tokenRecord.update({ refreshToken });
        }
    }
    static async deleteToken(userIp: string, refreshToken: string) {
        await models.UserToken.destroy({ where: { userIp, refreshToken } });
        return;
    }
    static async validateRefreshToken(refreshToken: string) {
        if (!refreshToken) {
            throw ApiError.badRequest('There is no refresh-token in request, check your cookie');
        }
        return jwt.verify(refreshToken, process.env.JWT_RTOKEN_KEY!) as IUserDto;
    }
    static async validateAccessToken(accessToken: string) {
        if (!accessToken) {
            throw ApiError.badRequest('There is no acces-token in request, check your params');
        }
        return jwt.verify(accessToken, process.env.JWT_ATOKEN_KEY!) as IUserDto;
    }
    static async findToken(userIp: string, refreshToken: string) {
        return await models.UserToken.findOne({ where: { userIp, refreshToken } });

    }
}
export default TokenService;