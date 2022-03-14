import { IUserData } from "../../storeInterfaces";

export interface registrationSuccessObj {
  message: string;
};
export interface loginSuccessObj {
  accessToken: string,
  refreshToken: string,
};
export interface logoutSuccessObj {
  message: string;
};
export interface refreshTokensSuccessObj {
  accessToken: string,
  refreshToken: string,
}
