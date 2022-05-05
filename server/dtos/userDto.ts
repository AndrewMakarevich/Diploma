import { IRole, IUser } from "../interfaces/modelInterfaces";

export interface IUserDto {
  id: number;
  roleId: number;
  nickname: string;
  email: string;
}

class UserDto implements IUserDto {
  id: number;
  roleId: number;
  nickname: string;
  email: string;
  constructor(user: IUser) {
    this.id = user.id;
    this.roleId = user.roleId!;
    this.nickname = user.nickname;
    this.email = user.email;
  }
}
export class ExtendedUserDto {
  id: number
  roleId: number;
  role: IRole;
  nickname: string;
  email: string;
  firstName: string;
  surname: string;
  avatar: string;
  profileBackground: string;
  country: string;
  city: string;
  isActivated: boolean;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
  constructor(user: IUser) {
    this.id = user.id;
    this.roleId = user.roleId!;
    this.role = user.role;
    this.nickname = user.nickname;
    this.email = user.email;
    this.firstName = user.firstName;
    this.surname = user.surname;
    this.avatar = user.avatar;
    this.profileBackground = user.profileBackground;
    this.country = user.country;
    this.city = user.city;
    this.isActivated = user.isActivated;
    this.isBanned = user.isBanned;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
export default UserDto;