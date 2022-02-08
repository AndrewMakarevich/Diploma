import { IUser } from "../interfaces/modelInterfaces";

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
export default UserDto;