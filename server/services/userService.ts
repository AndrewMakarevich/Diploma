import ApiError from "../apiError/apiError";
import models from "../models/models";
import bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import MailService from "./mailService";
import RoleService from "./roleService";
import TokenService from "./tokenService";
import UserDto from "../dtos/userDto";
import UserValidator from "../validator/userValidator";
import { IUser } from "../interfaces/modelInterfaces";
import { JwtPayload } from "jsonwebtoken";

class UserService {

  static async registrateUser(nickname: string, email: string, password: string) {
    if (!nickname || !email || !password) {
      throw ApiError.badRequest('Not enough data');
    }
    UserValidator.validateNickname(nickname);
    UserValidator.validateEmail(email);
    UserValidator.validatePassword(password);

    if (await models.User.findOne({ where: { nickname } })) {
      throw ApiError.badRequest('User with such nickname is already exists');
    }
    if (await models.User.findOne({ where: { email } })) {
      throw ApiError.badRequest('User with such email is already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 15);
    const activationKey = v4();
    let role = await models.Role.findOne({ where: { name: "USER" } });
    if (!role) {
      RoleService.checkBaseRoles();
      role = await models.Role.findOne({ where: { name: "USER" } });
    }
    await models.User.create(
      {
        nickname,
        email,
        password: hashedPassword,
        activationKey: activationKey,
        roleId: role!.id
      }
    );
    await MailService.sendMail(email, activationKey);
    return { message: 'User created successfully' }
  };
  static async activateUserAccount(activationKey: string) {
    if (!activationKey) {
      throw ApiError.badRequest('No activation key');
    }
    const user = await models.User.findOne({ where: { activationKey } });
    if (!user) {
      throw ApiError.badRequest('Activation key is not valid');
    }
    if (user.isActivated === true) {
      throw ApiError.badRequest('Account is already activated');
    }
    user.update({ isActivated: true });
    return { message: 'Account activated successfully' };
  }

  static async login(userIp: string, email: string, password: string) {
    if (!email || !password) {
      throw ApiError.badRequest('Not enough data');
    }
    UserValidator.validatePassword(password);
    UserValidator.validateEmail(email);
    const user = await models.User.findOne({ where: { email } });
    if (!user) {
      throw ApiError.badRequest('Incorrect email');
    }
    if (!user.isActivated) {
      throw ApiError.badRequest('Account is not activated');
    }
    if (!await bcrypt.compare(password, user.password)) {
      throw ApiError.badRequest('Incorrect password');
    }
    const userData = new UserDto(user);
    const tokens = await TokenService.generateTokens(new UserDto(user));
    await TokenService.saveToken(user.id, userIp, tokens.refreshToken);
    return { ...tokens, userData };
  }

  static async logout(userIp: string, refreshToken: string) {
    await TokenService.deleteToken(userIp, refreshToken);
    return { message: 'logout successfully' };
  }
  static async refresh(userIp: string, refreshToken: string) {
    const validationResult = await TokenService.validateRefreshToken(refreshToken);
    const refreshTokenRecord = await TokenService.findToken(userIp, refreshToken);
    if (!validationResult || !refreshTokenRecord) {
      throw ApiError.unauthorized('Unauthorized user');
    };
    const userData = new UserDto(validationResult as IUser);
    const tokens = TokenService.generateTokens(userData);
    TokenService.saveToken(validationResult.id, userIp, tokens.refreshToken);
    return { ...tokens, userData };
  }
}
export default UserService;