import ModalStore from "../store/modalStore";
import PictureStore from "../store/pictureStore";
import UserStore from "../store/userStore";

export interface IGlobalContext {
  modalStore: ModalStore,
  userStore: UserStore,
  pictureStore: PictureStore
}
export interface IUserData {
  id: number;
  roleId: number;
  nickname: string;
  email: string;
}