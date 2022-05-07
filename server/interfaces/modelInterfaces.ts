import { Model } from "sequelize";
import { Optional } from "sequelize/dist";
export interface IUser {
    [key: string]: any,
    id: number,
    nickname: string,
    email: string,
    password: string,
    firstName: string,
    surname: string,
    avatar: string,
    profileBackground: string,
    country: string,
    city: string,
    isActivated: boolean,
    activationKey: string,
    isBanned: boolean,
    roleId: number,
    createdAt: string,
    updatedAt: string
}
export interface IUserInstance extends IUser, Model {
}

export interface IUserToken {
    id: number;
    userIp: string;
    refreshToken: string;
    userId: number
}
export interface IUserTokenInstance extends IUserToken, Model {
}

export interface IResetEmailBundle {
    id: number,
    oldEmailApproveKey: string,
    oldEmailIsApproved: boolean,
    newEmail: string,
    newEmailApproveKey: string,
    newEmailIsApproved: boolean
}
export interface IResetEmailBundleInstance extends IResetEmailBundle, Model { }

export interface IResetPasswordBundleInstance extends Model {
    id: number,
    emailIsApproved: boolean,
    emailApproveKey: string,
    userId: number,
    newPassword: string,
    createdAt: string,
    updatedAt: string
}

export interface IRole {
    id: number;
    name: string;
    readComment: boolean,
    loadPicture: boolean,
    addComment: boolean,
    addLike: boolean,
    moderatePictureType: boolean,
    moderatePictureTag: boolean,
    changeUserRole: boolean,
    deleteOtherComment: boolean,
    deleteOtherPicture: boolean,
    blockPicture: boolean,
    blockAccount: boolean,
    deleteOtherAccount: boolean
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IRoleInstance extends IRole, Model {
};

export interface IPermissionsInstance extends Model {
    id: number,
    readComment: boolean,
    loadPicture: boolean,
    addComment: boolean,
    addLike: boolean,
    deleteOtherComment: boolean,
    deleteOtherPicture: boolean,
    blockPicture: boolean,
    blockAccount: boolean,
    deleteOtherAccount: boolean
}

export interface ICommentInstance extends Model {
    id: number,
    text: string,
    userId: number,
    commentId: number,
    pictureId: number,
    createdAt: string,
    updatedAt: string
}
