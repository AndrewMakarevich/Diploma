import ApiError from "../apiError/apiError";
import models from "../models/models";
import bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import MailService from "./mailService";
import RoleService from "./roleService";
import TokenService from "./tokenService";
import UserDto, { ExtendedUserDto } from "../dtos/userDto";
import UserValidator from "../validator/userValidator";
import { IUser } from "../interfaces/modelInterfaces";
import fileUpload from "express-fileupload";
import ImageService from "./imageService";

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

    const verificationLink = `${process.env.BACK_LINK}/api/user/activate/${activationKey}`;
    await MailService.sendMail(email, 'Account activation', 'Follow the link below to activate account', verificationLink);

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

    // if (user.isActivated === true) {
    //   throw ApiError.badRequest('Account is already activated');
    // }

    user.update({ isActivated: true });

    // Creating bundle for the future password changing
    const resetPasswordEmailApproveKey = v4();
    const resetPasswordBundle = await models.ResetPasswordBundle.findOne({ where: { userId: user.id } });

    if (resetPasswordBundle) {
      resetPasswordBundle.update({
        emailApproveKey: resetPasswordEmailApproveKey
      });
    } else {
      await models.ResetPasswordBundle.create({
        userId: user.id,
        emailApproveKey: resetPasswordEmailApproveKey
      })
    }


    return { message: 'Account activated successfully' };
  };

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
    const tokens = await TokenService.generateTokens(new UserDto(user));

    await TokenService.saveToken(user.id, userIp, tokens.refreshToken);

    return { ...tokens };
  };

  static async logout(userIp: string, refreshToken: string) {
    await TokenService.deleteToken(userIp, refreshToken);

    return { message: 'logout successfully' };
  };

  static async refresh(userIp: string, refreshToken: string) {
    const validationResult = await TokenService.validateRefreshToken(refreshToken);
    const refreshTokenRecord = await TokenService.findToken(userIp, refreshToken);

    if (!validationResult || !refreshTokenRecord) {
      throw ApiError.unauthorized('Unauthorized user');
    };

    const userData = new UserDto(validationResult as IUser);
    const tokens = TokenService.generateTokens(userData);

    TokenService.saveToken(validationResult.id, userIp, tokens.refreshToken);

    return { ...tokens };
  };

  static async editUser(
    id: number,
    firstName: string,
    surname: string,
    nickname: string,
    avatar: fileUpload.UploadedFile,
    profileBackground: fileUpload.UploadedFile,
    country: string, city: string) {
    if (!id) {
      throw ApiError.badRequest('Id of the user to edit is lost');
    }

    let nothingToChange = true;

    for (let key in arguments) {
      if (key === "0") {
        continue;
      }

      if (arguments[key] !== undefined) {
        nothingToChange = false;
        break;
      }
    }
    if (nothingToChange) {
      throw ApiError.badRequest('Nothing to change');
    }

    // validation of the key params
    UserValidator.validateFirstName(firstName);
    UserValidator.validateSurname(surname);
    UserValidator.validateNickname(nickname);
    UserValidator.validateUsersCountryAndCity(country, city);

    // Creating file name for the avatar and background pictures, if they'r exists
    let avatarFileName = ImageService.generateImageName(avatar);
    console.log('AVATAR', avatarFileName);
    let profileBackgroundFileName = ImageService.generateImageName(profileBackground);

    const userToEdit = await models.User.findOne({ where: { id } });

    if (!userToEdit) {
      throw ApiError.badRequest('User you want to edit doesn\'t exists');
    }

    //Uploading avatar picture to the server if edited user exists
    if (avatarFileName) {
      await avatar.mv(path.resolve(__dirname, '..', 'static', 'img', 'avatar', avatarFileName)).catch(() => {
        throw ApiError.badRequest('Loading avatar photo failed, user editing interrupted')
      });
      // deleting previous avatar if it exists
      if (userToEdit.avatar) {
        fs.unlink(path.resolve(__dirname, '..', 'static', 'img', 'avatar', userToEdit.avatar), () => { })
      }
    }

    //Uploading profile background picture to the server if edited user exists
    if (profileBackgroundFileName) {
      await profileBackground.mv(path.resolve(__dirname, '..', 'static', 'img', 'profile-background', profileBackgroundFileName)).catch(() => {
        throw ApiError.badRequest('Loading profile background photo failed, user editing interrupted');
      })
      // deleting profile background  if it exists
      if (userToEdit.profileBackground) {
        fs.unlink(path.resolve(__dirname, '..', 'static', 'img', 'profile-background', userToEdit.profileBackground), () => { });
      }
    }

    await userToEdit.update({
      firstName,
      surname,
      nickname,
      avatar: avatarFileName,
      profileBackground: profileBackgroundFileName,
      country,
      city
    });

    return { message: 'User updated succesfully' }

  };

  static async resetPassword(newPassword: string, userId: number) {
    UserValidator.validatePassword(newPassword);

    const user = await models.User.findOne({ where: { id: userId } });

    if (!user) {
      throw ApiError.badRequest("Can't find user, to change password");
    }

    const usersResetPasswordBundle = await models.ResetPasswordBundle.findOne({ where: { userId: user.id } });

    if (!usersResetPasswordBundle) {
      throw ApiError.badRequest("Can't find you reset password bundle in database, try to follow your activation account link, that was sent when you registered")
    }

    const passwordComparisonResult = await bcrypt.compare(newPassword, user.password);

    if (!passwordComparisonResult) {

      const hashedNewPassword = await bcrypt.hash(newPassword, 15);

      usersResetPasswordBundle.update({
        newPassword: hashedNewPassword
      });

      const submitPasswordChangingLink = `${process.env.BACK_LINK}/api/user/approvePassReset/${usersResetPasswordBundle.emailApproveKey}`;
      await MailService.sendMail(user.email, "Reset password submition", "To submit password change, follow the link below", submitPasswordChangingLink);
    }

    return { message: "New password added to the bundle, to finish password reset, follow the link, we send to your email" }
  }

  static async approvePasswordReset(emailApproveKey: string) {
    const resetPasswordBundle = await models.ResetPasswordBundle.findOne({ where: { emailApproveKey } });

    if (!resetPasswordBundle) {
      throw ApiError.badRequest("Invalid approve password reset link");
    }

    const userToResetPass = await models.User.findOne({ where: { id: resetPasswordBundle.userId } });

    if (!userToResetPass) {
      throw ApiError.badRequest("Can't find user to reset password");
    }

    if (!resetPasswordBundle.newPassword) {
      throw ApiError.badRequest("Nothing to reset");
    }
    userToResetPass.update({ password: resetPasswordBundle.newPassword });

    const newApproveEmailKey = v4();
    resetPasswordBundle.update({
      newPassword: null,
      emailApproveKey: newApproveEmailKey
    });
    return { message: "Password changed successfully" };
  }

  static async getUser(id: number) {
    if (!id) {
      throw ApiError.badRequest('User\'s id is not defined');
    }

    const user = await models.User.findOne({ where: { id } });

    if (!user) {
      return false;
    }

    return new ExtendedUserDto(user);
  }
}
export default UserService;