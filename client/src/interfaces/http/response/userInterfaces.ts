export interface IRoleResObject {
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

export interface userResObject {
  [key: string]: any;
  id: number
  roleId: number;
  role: IRoleResObject | null;
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
export interface resetPassSuccesObj {
  message: string;
}