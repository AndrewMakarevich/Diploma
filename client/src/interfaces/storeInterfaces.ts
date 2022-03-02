import ModalStore from "../store/modalStore";
import UserStore from "../store/userStore";

export interface IGlobalContext {
  modalStore: ModalStore,
  userStore: UserStore
}
export interface IUserData {
  id: number;
  roleId: number;
  nickname: string;
  email: string;
}