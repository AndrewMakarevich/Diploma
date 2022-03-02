import { AxiosError } from "axios";
import { makeAutoObservable } from "mobx";
import { IUserData } from "../interfaces/storeInterfaces"
import AuthService from "../services/auth-service";

export default class UserStore {
  userData: {};
  _isAuth: boolean;
  constructor() {
    this.userData = {} as IUserData;
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
      console.log('reeg');
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
      this.userData = response.data.userData;
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
      this.userData = {};
      alert(response.data.message);
    } catch (e: AxiosError | any) {
      alert(e.response?.data?.message);
    }
  }
}