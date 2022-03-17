export interface userResObject {
  [key: string]: any;
  id: number
  roleId: number;
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
}
export interface editUserSuccesObj {
  message: string;
}