import { AxiosError } from "axios";
import { makeAutoObservable } from "mobx";
import { userResObject } from "../interfaces/http/resposne/userInterfaces";
import { IUserData } from "../interfaces/storeInterfaces"
import AuthService from "../services/auth-service";
import UserService from "../services/user-service";

export default class UserStore {
  userData: userResObject;
  _isAuth: boolean;

  constructor() {
    this.userData = {} as userResObject;
    this._isAuth = false;

    makeAutoObservable(this);
  };

  set isAuth(authValue: boolean) {
    this._isAuth = authValue;
  };

  get isAuth() {
    return this._isAuth;
  };

  async registration(email: string, nickname: string, password: string) {
    try {
      const response = await AuthService.registrate(email, nickname, password);
      alert(response.data.message);
      return;
    } catch (e: AxiosError | any) {
      alert(e.response?.data?.message);
    }
  };

  async login(email: string, password: string) {
    try {
      const response = await AuthService.login(email, password);

      localStorage.setItem('access-token', response.data.accessToken);

      this.isAuth = true;
      await this.getMyself();

      alert('Login success');
    } catch (e: AxiosError | any) {
      alert(e.response?.data?.message);
    }
  };

  async logout() {
    try {
      const response = await AuthService.logout();

      localStorage.removeItem('access-token');

      this.isAuth = false;
      this.userData = {} as userResObject;

      alert(response.data.message);
    } catch (e: AxiosError | any) {
      alert(e.response?.data?.message);
    }
  };

  async autoAuth() {
    try {
      const response = await AuthService.refreshTokens();

      localStorage.setItem('access-token', response.data.accessToken);

      this.isAuth = true;
      await this.getMyself();
    } catch (e: AxiosError | any) {
      localStorage.removeItem('access-token');
      // alert(e.response?.data?.message);
    }
  };

  async getMyself() {
    try {
      const response = await UserService.getInfoAboutMyself();
      this.userData = response.data;
    } catch (e: AxiosError | any) {
      alert(e.response?.data?.message);
    }
  };

  async editMyself(data: FormData) {
    try {
      const response = await UserService.editInfoAboutMyself(data);

      await this.getMyself();

      alert(response.data.message);
    } catch (e: AxiosError | any) {
      console.log(e);
      alert(e.response?.data?.message);
    }
  };
}