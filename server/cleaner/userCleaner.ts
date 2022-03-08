import { JsonWebTokenError } from "jsonwebtoken";
import { Op } from "sequelize";
import models from "../models/models";
import TokenService from "../services/tokenService";

export default class UserCleaner {
  static async checkForOutdateUsersAccounts() {
    async function findAndDeleteOutDateAccounts() {
      const accounts = await models.User.findAll(
        {
          where: {
            isActivated: false,
            createdAt: {
              [Op.lte]: Date.now() - 1000 * 60 * 60
            }
          }
        });
      console.log('ACCOUNTS', accounts);
      accounts.forEach(account => {
        account.destroy();
      });
    }
    try {
      findAndDeleteOutDateAccounts();
      setInterval(() => findAndDeleteOutDateAccounts(), 1000 * 60 * 60);
    } catch (e) {
      console.log(e);
    }

  }
  static async checkForOutdateRefreshTokens() {
    async function findAndDeleteOutDatedTokens() {
      const tokens = await models.UserToken.findAll();
      tokens.forEach(async (token) => {
        try {
          const validationResult = await TokenService.validateRefreshToken(token.refreshToken);
          if (!validationResult) {
            token.destroy();
          }
        } catch (e) {
          if (e instanceof JsonWebTokenError) {
            token.destroy();
          }
        }

      });
    }
    await findAndDeleteOutDatedTokens();
    setInterval(() => findAndDeleteOutDatedTokens(), 1000 * 60 * 60 * 24);
  }
}